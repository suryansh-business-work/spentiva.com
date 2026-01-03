import * as Yup from 'yup';

// Email validation schema
export const emailSchema = Yup.string()
  .email('Invalid email address')
  .required('Email is required');

// Password validation schema
export const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .required('Password is required');

// Login validation schema
export const loginValidationSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string().required('Password is required'),
});

// Signup validation schema
export const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Forgot password validation schema
export const forgotPasswordValidationSchema = Yup.object().shape({
  email: emailSchema,
});

// Reset password validation schema
export const resetPasswordValidationSchema = Yup.object().shape({
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Tracker validation schema
export const trackerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  description: Yup.string().max(200, 'Description must be at most 200 characters'),
  currency: Yup.string().required('Currency is required'),
  budget: Yup.number().min(0, 'Budget must be positive').nullable(),
});

// Category validation schema
export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters')
    .required('Name is required'),
  type: Yup.string().oneOf(['income', 'expense'], 'Invalid type').required('Type is required'),
  color: Yup.string().nullable(),
  icon: Yup.string().nullable(),
});

// Transaction validation schema
export const transactionValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0.01, 'Amount must be greater than 0')
    .required('Amount is required'),
  description: Yup.string()
    .min(2, 'Description must be at least 2 characters')
    .max(200, 'Description must be at most 200 characters')
    .required('Description is required'),
  categoryId: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  paymentMethod: Yup.string().nullable(),
});

// Profile validation schema
export const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: emailSchema,
});

// Support ticket validation schema
export const supportTicketValidationSchema = Yup.object().shape({
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be at most 100 characters')
    .required('Subject is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be at most 1000 characters')
    .required('Description is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
});
