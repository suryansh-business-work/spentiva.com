import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import fs from 'fs';
import path from 'path';
import config from '../config/config';
import { logger } from '../utils/logger';

// SMTP readiness flag
let smtpReady = false;

const smtpHost = config.SMTP.HOST;
const smtpPort = config.SMTP.PORT;
const smtpUser = config.SMTP.USER;
const smtpPass = config.SMTP.PASS;

const smtpConfigured = Boolean(smtpHost && smtpUser && smtpPass);

// Lazy transporter — only created when credentials are present
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (transporter) return transporter;

  if (!smtpConfigured) {
    throw new Error(
      'SMTP is not configured. Set NODEMAILER_HOST, NODEMAILER_USER, and NODEMAILER_PASS.'
    );
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    tls: { rejectUnauthorized: config.SMTP.HOST !== 'localhost' },
  });

  return transporter;
};

// Verify SMTP connection on startup (non-blocking, retries once)
const verifySMTP = async (retries = 2): Promise<void> => {
  if (!smtpConfigured) {
    logger.warn('SMTP not configured — email features disabled', {
      host: smtpHost,
      user: smtpUser,
    });
    return;
  }

  logger.info('Email service initializing', { host: smtpHost, port: smtpPort, user: smtpUser });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await getTransporter().verify();
      smtpReady = true;
      logger.info('SMTP connection verified successfully');
      return;
    } catch (error: any) {
      logger.error(`SMTP verification attempt ${attempt}/${retries} failed`, {
        error: error.message,
      });
      if (attempt < retries) await new Promise(r => setTimeout(r, 3000));
    }
  }

  logger.warn('SMTP verification failed after retries — emails may fail at send time');
};

// Fire-and-forget so it never blocks server startup
verifySMTP().catch(() => {});

/**
 * Check if email service is ready to send emails
 */
export const isEmailServiceReady = (): boolean => smtpConfigured && smtpReady;

/**
 * Check if SMTP is configured (even if not verified)
 */
export const isSmtpConfigured = (): boolean => smtpConfigured;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  critical?: boolean; // If true, throw error when SMTP not configured
}

/**
 * Send email using Nodemailer
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!smtpConfigured) {
    const errMsg = 'SMTP not configured — email service unavailable';
    logger.warn(errMsg, { to: options.to, subject: options.subject });
    if (options.critical) {
      throw new Error(errMsg);
    }
    return;
  }

  try {
    const transport = getTransporter();
    const mailOptions = {
      from: options.from || `"Spentiva" <${smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await new Promise<void>((resolve, reject) => {
      transport.sendMail(mailOptions, (error, _success: any) => {
        if (error) {
          logger.error('Failed to send email', { error: error.message, to: options.to });
          return reject(new Error(`Failed to send email: ${error.message}`));
        }
        logger.info('Email sent successfully', { messageId: _success.messageId, to: options.to });
        resolve();
      });
    });
  } catch (error: any) {
    logger.error('Email send failed', { error: error.message });
    throw error; // Re-throw the error caught from the promise
  }
};

/**
 * Compile MJML template file to HTML
 * Common function for all email templates
 */
const compileMjmlTemplate = (templatePath: string, variables: Record<string, any>): string => {
  try {
    let mjmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace variables in template
    Object.keys(variables).forEach(key => {
      // Match both {{ key }} (with spaces) and {{key}} (without spaces)
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      mjmlContent = mjmlContent.replace(regex, variables[key]);
    });

    const result = mjml2html(mjmlContent);
    return result.html;
  } catch (error: any) {
    logger.error('MJML template compilation failed', { templatePath, error: error.message });
    throw error;
  }
};

/**
 * Compile MJML template by name (without path)
 * @param templateName - Name of the template file (without .mjml extension)
 * @param variables - Variables to replace in template
 * @returns Compiled HTML string
 */
export const compileMjml = (templateName: string, variables: Record<string, any>): string => {
  const templatePath = path.join(__dirname, `../templates/emails/${templateName}.mjml`);
  return compileMjmlTemplate(templatePath, variables);
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/signup.mjml');
  const html = compileMjmlTemplate(templatePath, { name });

  await sendEmail({
    to,
    subject: 'Welcome to Spentiva! 🎉',
    html,
  });
};

/**
 * Send OTP for email verification or password reset
 */
export const sendOtpEmail = async (
  to: string,
  name: string,
  otp: string,
  type: 'verification' | 'reset'
): Promise<void> => {
  const subject =
    type === 'verification' ? 'Verify Your Email - Spentiva' : 'Reset Your Password - Spentiva';

  const templateFile = type === 'verification' ? 'signup-otp.mjml' : 'forgot-password.mjml';
  const templatePath = path.join(__dirname, `../templates/emails/${templateFile}`);
  const html = compileMjmlTemplate(templatePath, { name, otp });

  await sendEmail({ to, subject, html });
};

/**
 * Send password reset link email
 */
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/forgot-password.mjml');
  const resetUrl = `https://app.spentiva.com/reset-password?token=${resetToken}&email=${encodeURIComponent(to)}`;
  const html = compileMjmlTemplate(templatePath, { name, resetUrl, otp: resetToken });

  await sendEmail({
    to,
    subject: 'Reset Your Password - Spentiva',
    html,
  });
};

/**
 * Send login notification email
 */
export const sendLoginNotificationEmail = async (
  to: string,
  name: string,
  loginInfo: {
    timestamp: Date;
    device?: string;
    location?: string;
  }
): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/login.mjml');
  const html = compileMjmlTemplate(templatePath, {
    name,
    timestamp: loginInfo.timestamp.toLocaleString(),
    device: loginInfo.device || 'Unknown Device',
  });

  await sendEmail({
    to,
    subject: 'New Login to Your Spentiva Account',
    html,
  });
};

/**
 * Send password reset success confirmation
 */
export const sendPasswordResetSuccessEmail = async (to: string, name: string): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/reset-password-success.mjml');
  const html = compileMjmlTemplate(templatePath, {
    name,
    email: to,
    timestamp: new Date().toLocaleString(),
  });

  await sendEmail({
    to,
    subject: 'Password Reset Successful - Spentiva',
    html,
  });
};

/**
 * Send signup OTP email
 */
export const sendSignupOtpEmail = async (to: string, otp: string): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/signup-otp.mjml');
  const html = compileMjmlTemplate(templatePath, { otp });

  await sendEmail({
    to,
    subject: 'Verify Your Email - Spentiva',
    html,
  });
};

/**
 * Send support ticket confirmation email to user
 */
export const sendSupportTicketUserEmail = async (
  to: string,
  ticketDetails: {
    ticketId: string;
    userName: string;
    type: string;
    subject: string;
  }
): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/support-ticket-user.mjml');
  const html = compileMjmlTemplate(templatePath, {
    userName: ticketDetails.userName,
    ticketId: ticketDetails.ticketId,
    ticketType: ticketDetails.type,
    subject: ticketDetails.subject,
  });

  await sendEmail({
    to,
    subject: `Support Ticket Created - ${ticketDetails.ticketId}`,
    html,
  });
};

/**
 * Send support ticket notification email to agent/support team
 */
export const sendSupportTicketAgentEmail = async (ticketDetails: {
  ticketId: string;
  userName: string;
  userEmail: string;
  type: string;
  subject: string;
  description: string;
  createdAt: string;
}): Promise<void> => {
  const templatePath = path.join(__dirname, '../templates/emails/support-ticket-agent.mjml');
  const html = compileMjmlTemplate(templatePath, {
    ticketId: ticketDetails.ticketId,
    userName: ticketDetails.userName,
    userEmail: ticketDetails.userEmail,
    ticketType: ticketDetails.type,
    subject: ticketDetails.subject,
    description: ticketDetails.description,
    createdAt: ticketDetails.createdAt,
  });

  await sendEmail({
    to: 'suryansh.personal1@gmail.com', // Support email
    subject: `New Support Ticket - ${ticketDetails.ticketId}`,
    html,
  });
};

/**
 * Currency symbol helper
 */
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[currency] || currency;
};

/**
 * Send transaction notification email to tracker members
 */
export const sendTransactionNotificationEmail = async (
  recipients: string[],
  transaction: {
    type: string;
    amount: number;
    currency: string;
    category: string;
    subcategory: string;
    paymentMethod: string;
    description?: string;
    createdByName: string;
    timestamp: Date | string;
  },
  trackerInfo: { id: string; name: string }
): Promise<void> => {
  if (!recipients.length) return;

  const templatePath = path.join(__dirname, '../templates/emails/transaction-notification.mjml');
  const isExpense = transaction.type === 'expense';
  const date = new Date(transaction.timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = compileMjmlTemplate(templatePath, {
    transactionType: isExpense ? 'Expense' : 'Income',
    trackerName: trackerInfo.name,
    amount: transaction.amount.toLocaleString(),
    currencySymbol: getCurrencySymbol(transaction.currency),
    amountColor: isExpense ? '#ef4444' : '#10b981',
    category: transaction.category,
    subcategory: transaction.subcategory,
    paymentMethod: transaction.paymentMethod || 'N/A',
    createdByName: transaction.createdByName,
    date,
    description: transaction.description || '',
    trackerUrl: `${config.APP_URL}/tracker/${trackerInfo.id}`,
  });

  const subject = `${isExpense ? '💸' : '💰'} ${getCurrencySymbol(transaction.currency)}${transaction.amount} ${isExpense ? 'spent' : 'received'} — ${trackerInfo.name}`;

  // Send to all recipients in parallel
  await Promise.allSettled(
    recipients.map(email =>
      sendEmail({ to: email, subject, html }).catch(err =>
        logger.error('Failed to send transaction notification', { email, error: err.message })
      )
    )
  );
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendOtpEmail,
  sendSignupOtpEmail,
  sendPasswordResetEmail,
  sendLoginNotificationEmail,
  sendPasswordResetSuccessEmail,
  sendSupportTicketUserEmail,
  sendSupportTicketAgentEmail,
  sendTransactionNotificationEmail,
};
