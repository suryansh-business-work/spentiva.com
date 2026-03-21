import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User, { IUser } from './auth.models';
import config from '../../config/config';
import { logger } from '../../utils/logger';

const SALT_ROUNDS = 12;

export class AuthService {
  static generateToken(user: IUser): string {
    const payload = {
      userId: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      role: user.role,
    };
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  static async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      isVerified: true, // Auto-verify for now
    });

    // Remove password from returned user
    const userObj = user.toObject();
    delete (userObj as any).password;

    const token = AuthService.generateToken(user);

    logger.info('User registered', { userId: user._id, email: user.email });

    return { user: userObj as IUser, token };
  }

  static async login(
    email: string,
    password: string,
    ip?: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login info
    user.lastLoginAt = new Date();
    if (ip) {
      user.lastLoginIp = ip;
    }
    await user.save();

    // Remove password from returned user
    const userObj = user.toObject();
    delete (userObj as any).password;

    const token = AuthService.generateToken(user);

    logger.info('User logged in', { userId: user._id, email: user.email });

    return { user: userObj as IUser, token };
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; profilePicture?: string }
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { $set: data }, { new: true });
  }

  static async generateResetToken(email: string): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return null;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    logger.info('Password reset token generated', { userId: user._id });

    return resetToken;
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    logger.info('Password reset successful', { userId: user._id });

    return true;
  }

  static async getAllUsers(page = 1, limit = 20): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return { users, total };
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }
}
