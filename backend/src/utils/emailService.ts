import nodemailer from 'nodemailer';
import { createError } from '../middleware/errorHandler';

// Email service configuration
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"SkillCircle" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email Address - SkillCircle',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0;">SkillCircle</h1>
              <p style="color: #6B7280; margin: 5px 0;">Learn. Teach. Grow.</p>
            </div>

            <div style="background: #F9FAFB; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1F2937; margin-top: 0;">Verify Your Email Address</h2>
              <p style="color: #4B5563; line-height: 1.6;">
                Welcome to SkillCircle! To complete your registration and start your learning journey,
                please verify your email address using the code below:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <div style="background: #3B82F6; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
                  ${verificationCode}
                </div>
              </div>

              <p style="color: #4B5563; line-height: 1.6;">
                This verification code will expire in 10 minutes for security reasons.
                If you didn't request this verification, please ignore this email.
              </p>
            </div>

            <div style="text-align: center; color: #6B7280; font-size: 14px;">
              <p>Need help? Contact us at support@skillcircle.com</p>
              <p>&copy; 2025 SkillCircle. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `
          SkillCircle - Verify Your Email Address

          Welcome to SkillCircle! Please verify your email address using this code: ${verificationCode}

          This code will expire in 10 minutes.

          If you didn't request this verification, please ignore this email.

          Need help? Contact us at support@skillcircle.com
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw createError(500, 'Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `"SkillCircle" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset Your Password - SkillCircle',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0;">SkillCircle</h1>
              <p style="color: #6B7280; margin: 5px 0;">Learn. Teach. Grow.</p>
            </div>

            <div style="background: #F9FAFB; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1F2937; margin-top: 0;">Reset Your Password</h2>
              <p style="color: #4B5563; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold;">
                  Reset Password
                </a>
              </div>

              <p style="color: #4B5563; line-height: 1.6;">
                This link will expire in 1 hour for security reasons.
                If you didn't request this reset, please ignore this email.
              </p>

              <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
                If the button doesn't work, copy and paste this link: ${resetUrl}
              </p>
            </div>

            <div style="text-align: center; color: #6B7280; font-size: 14px;">
              <p>Need help? Contact us at support@skillcircle.com</p>
              <p>&copy; 2025 SkillCircle. All rights reserved.</p>
            </div>
          </div>
        `,
        text: `
          SkillCircle - Reset Your Password

          We received a request to reset your password. Visit this link to create a new password:
          ${resetUrl}

          This link will expire in 1 hour.

          If you didn't request this reset, please ignore this email.

          Need help? Contact us at support@skillcircle.com
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw createError(500, 'Failed to send password reset email');
    }
  }
}

export const emailService = new EmailService();

// Utility functions for verification codes
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateResetToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};