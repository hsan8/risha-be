import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      const emailUser = this.configService.get<string>('EMAIL_USER');
      const emailPass = this.configService.get<string>('EMAIL_PASS');

      this.logger.log(
        `Email configuration check - User: ${emailUser}, Pass: ${emailPass ? 'PROVIDED' : 'NOT_PROVIDED'}`,
      );

      if (!emailUser || !emailPass) {
        this.logger.warn('Email credentials not configured. Using mock email service.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email transporter:', error);
    }
  }

  async sendPasswordResetOTP(email: string, otp: string): Promise<void> {
    try {
      const subject = 'Password Reset OTP - Risha';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p>Your password reset OTP is:</p>
          <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; color: #333;">${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `;

      await this.sendEmail(email, subject, html);
      this.logger.log(`Password Reset OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP to ${email}:`, error);
      throw error;
    }
  }

  async sendEmailVerificationOTP(email: string, otp: string): Promise<void> {
    try {
      const subject = 'Email Verification OTP - Risha';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Welcome to Risha! Please verify your email address.</p>
          <p>Your verification OTP is:</p>
          <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; color: #333;">${otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Thank you for joining Risha!</p>
        </div>
      `;

      await this.sendEmail(email, subject, html);
      this.logger.log(`Email Verification OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email verification OTP to ${email}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const subject = 'Welcome to Risha!';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Risha, ${name}!</h2>
          <p>Thank you for joining Risha. We're excited to have you on board!</p>
          <p>Your account has been successfully created and verified.</p>
          <p>You can now start using all the features of Risha.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The Risha Team</p>
        </div>
      `;

      await this.sendEmail(email, subject, html);
      this.logger.log(`Welcome email sent to ${email} for ${name}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw error;
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`Email not configured. Would send to ${to}: ${subject}`);
      return;
    }

    const mailOptions = {
      from: `"${AUTH_CONSTANTS.EMAIL_SENDER_NAME}" <${this.configService.get<string>('EMAIL_USER')}>`,
      to,
      subject,
      html,
    };

    try {
      this.logger.log(`Attempting to send email to ${to} with subject: ${subject}`);
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to} - Message ID: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      this.logger.error('Email error details:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
      throw error;
    }
  }
}
