import {
  Injectable,
  Logger,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@/user/entities';
import { OTP } from '@/auth/entities';
import { RegisterRequestDto, LoginRequestDto } from '@/auth/dto/requests';
import {
  ForgotPasswordRequestDto,
  VerifyOTPRequestDto,
  ResetPasswordRequestDto,
  ResendOTPRequestDto,
} from '@/auth/dto/requests';
import { GoogleAuthRequestDto, AppleAuthRequestDto } from '@/auth/dto/requests';
import { AuthResponseDto, MessageResponseDto } from '@/auth/dto/responses';
import { UserResponseDto } from '@/user/dto/responses';
import { AuthProvider, UserStatus, OTPType } from '@/auth/enums';
import { AUTH_CONSTANTS, AUTH_MESSAGES_I18N, TOKEN_EXPIRY_SECONDS } from '@/auth/constants';
import { UserService } from '@/user/services';
import { OTPRepository } from '@/auth/repositories';
import { EmailService } from './email.service';
import { GoogleAuthService } from './google-auth.service';
import { AppleAuthService } from './apple-auth.service';
import { DEFAULT_LOCALE, UserLocale } from '@/core/enums';
import _ from 'lodash';
import moment from 'moment';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly otpRepository: OTPRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly appleAuthService: AppleAuthService,
  ) {}

  async getAllOTPs(email: string): Promise<OTP[]> {
    return this.otpRepository.findByEmail(email);
  }

  async register(dto: RegisterRequestDto, locale: UserLocale): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(dto.email, locale);
    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new ConflictException(AUTH_MESSAGES_I18N.EMAIL_ALREADY_EXISTS[locale]);
      }

      // Replace unverified account data
      const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.SALT_ROUNDS);
      const updated = await this.userService.updateForRegistration(existingUser.id, {
        name: dto.name,
        phone: dto.phone,
        country: dto.country || 'Kuwait',
        passwordHash,
        provider: AuthProvider.EMAIL,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
        twoFactorEnabled: false,
      });

      await this.sendEmailVerification(updated.email);
      const tokens = await this.generateTokens(updated);
      this.logger.log(`User registration replaced unverified account: ${updated.email}`);
      return new AuthResponseDto({ ...tokens, user: new UserResponseDto(updated) });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.SALT_ROUNDS);

    // Create new user
    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      country: dto.country || 'Kuwait',
      passwordHash,
      provider: AuthProvider.EMAIL,
    });

    // Send email verification
    await this.sendEmailVerification(user.email);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User registered successfully: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async login(dto: LoginRequestDto, locale: UserLocale): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userService.findByEmail(dto.email, locale);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.INVALID_CREDENTIALS[locale]);
    }

    // Check if user is using email authentication
    if (user.provider !== AuthProvider.EMAIL || !user.passwordHash) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.INVALID_CREDENTIALS[locale]);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.INVALID_CREDENTIALS[locale]);
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.ACCOUNT_SUSPENDED[locale]);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.ACCOUNT_INACTIVE[locale]);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in successfully: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async googleAuth(dto: GoogleAuthRequestDto, locale: UserLocale): Promise<AuthResponseDto> {
    // Verify Google ID token
    const googleUser = await this.googleAuthService.verifyIdToken(dto.idToken);

    // Find or create user
    let user = await this.userService.findByEmailOrProviderId(googleUser.email, googleUser.sub, locale);

    if (!user) {
      user = await this.userService.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: AuthProvider.GOOGLE,
        providerId: googleUser.sub,
      });
    } else {
      // Update last login
      await this.userService.updateLastLogin(user.id);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Google auth successful: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async appleAuth(dto: AppleAuthRequestDto, locale: UserLocale): Promise<AuthResponseDto> {
    // Verify Apple ID token
    await this.appleAuthService.verifyIdToken(dto.idToken, locale);

    // Find or create user
    let user = await this.userService.findByEmailOrProviderId(dto.email, dto.userId, locale);

    if (!user) {
      if (!dto.email) {
        throw new BadRequestException(AUTH_MESSAGES_I18N.SOCIAL_AUTH_EMAIL_REQUIRED[DEFAULT_LOCALE]);
      }

      user = await this.userService.create({
        name: dto.name || 'Apple User',
        email: dto.email,
        provider: AuthProvider.APPLE,
        providerId: dto.userId,
      });
    } else {
      // Update last login
      await this.userService.updateLastLogin(user.id);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Apple auth successful: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async forgotPassword(dto: ForgotPasswordRequestDto, locale: UserLocale): Promise<MessageResponseDto> {
    // Find user by email
    const user = await this.userService.findByEmail(dto.email, locale);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.EMAIL_NOT_FOUND[DEFAULT_LOCALE]);
    }

    // Check if OTP can be sent (rate limiting)
    const otps = await this.getAllOTPs(dto.email);
    const canSend = this.canSendOTP(otps);
    if (!canSend) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.OTP_DAILY_LIMIT[DEFAULT_LOCALE]);
    }

    // Generate and save OTP
    const otp = await this.generateOTP(dto.email, OTPType.PASSWORD_RESET);

    // Send OTP email
    await this.emailService.sendPasswordResetOTP(dto.email, otp.code);
    this.logger.log(`Password reset OTP sent: ${dto.email}`);

    return new MessageResponseDto(AUTH_MESSAGES_I18N.OTP_SENT[DEFAULT_LOCALE]);
  }

  async resendOTP(dto: ResendOTPRequestDto, locale: UserLocale): Promise<MessageResponseDto> {
    // Find user by ID
    const user = await this.userService.findById(dto.userId, locale);

    // Check if OTP can be sent (rate limiting)
    const otps = await this.getAllOTPs(user.email);
    const canSend = this.canSendOTP(otps);

    if (!canSend) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.OTP_DAILY_LIMIT[DEFAULT_LOCALE]);
    }

    // Generate and save new OTP
    const otp = await this.generateOTP(user.email, OTPType.PASSWORD_RESET);

    // Send OTP email
    await this.emailService.sendPasswordResetOTP(user.email, otp.code);

    this.logger.log(`OTP resent: ${user.email}`);

    return new MessageResponseDto(AUTH_MESSAGES_I18N.OTP_SENT[DEFAULT_LOCALE]);
  }

  async verifyOTP(dto: VerifyOTPRequestDto, locale: UserLocale): Promise<AuthResponseDto> {
    // Find user by ID
    const user = await this.userService.findById(dto.userId, locale);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[DEFAULT_LOCALE]);
    }

    const otps = await this.getAllOTPs(user.email);
    const otp = this.findByEmailAndType(dto.otp, otps, OTPType.EMAIL_VERIFICATION);

    if (!otp) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.INVALID_OTP[DEFAULT_LOCALE]);
    }

    // Mark OTP as used
    await this.otpRepository.deleteUsedOTPs(otps);

    // Mark user's email as verified and update status to ACTIVE
    const updatedUser = await this.userService.markEmailAsVerifiedAndActivate(user.id, locale);

    // Generate tokens
    const tokens = await this.generateTokens(updatedUser);

    this.logger.log(`OTP verified successfully: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(updatedUser),
    });
  }

  async resetPassword(dto: ResetPasswordRequestDto, locale: UserLocale): Promise<MessageResponseDto> {
    const user = await this.userService.findByEmail(dto.email, locale);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[DEFAULT_LOCALE]);
    }

    const otps = await this.getAllOTPs(user.email);
    const canSend = this.canSendOTP(otps);
    if (!canSend) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.OTP_DAILY_LIMIT[DEFAULT_LOCALE]);
    }

    const otp = await this.findValidOTPByEmail(user.email, dto.otp);
    if (!otp) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.INVALID_OTP[DEFAULT_LOCALE]);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.SALT_ROUNDS);

    // Update user password
    await this.userService.updatePassword(user.id, passwordHash);

    // Mark OTP as used
    await this.otpRepository.markAsUsed(otp.id);

    this.logger.log(`Password reset successful: ${user.email}`);

    return new MessageResponseDto(AUTH_MESSAGES_I18N.PASSWORD_RESET_SUCCESS[DEFAULT_LOCALE]);
  }

  async logout(): Promise<MessageResponseDto> {
    this.logger.log('User logged out');
    return new MessageResponseDto(AUTH_MESSAGES_I18N.LOGOUT_SUCCESS[DEFAULT_LOCALE]);
  }

  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string; tokenType: string; expiresIn: number }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: AUTH_CONSTANTS.JWT_ACCESS_TOKEN_EXPIRY }),
      this.jwtService.signAsync(payload, { expiresIn: AUTH_CONSTANTS.JWT_REFRESH_TOKEN_EXPIRY }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: TOKEN_EXPIRY_SECONDS,
    };
  }

  private async generateOTP(email: string, type: OTPType): Promise<OTP> {
    // Generate 5-digit OTP
    const code = Math.floor(AUTH_CONSTANTS.OTP_MIN_VALUE + Math.random() * AUTH_CONSTANTS.OTP_MAX_VALUE).toString();

    // Set expiry
    const expiresAt = moment().add(AUTH_CONSTANTS.OTP_EXPIRY_MINUTES, 'minutes').toDate();

    // Save OTP
    return await this.otpRepository.create({
      email,
      code,
      type,
      expiresAt,
      used: false,
    });
  }

  private async sendEmailVerification(email: string): Promise<void> {
    try {
      const otp = await this.generateOTP(email, OTPType.EMAIL_VERIFICATION);

      await this.emailService.sendEmailVerificationOTP(email, otp.code);
    } catch (error) {
      this.logger.error(`Failed to send email verification: ${error.message}`);
      // Don't throw error - user can still register without email verification
    }
  }

  private async findValidOTPByEmail(email: string, code: string): Promise<OTP | null> {
    const otps = await this.getAllOTPs(email);

    const now = moment();

    const validOTP = _.find(otps, (otp) => otp.code === code && !otp.used && moment(otp.expiresAt).isAfter(now));

    return validOTP;
  }

  private findByEmailAndType(otp: string, otps: OTP[], type: OTPType): OTP | null {
    const list = _.values(otps);

    // Filter by type
    const filteredOtpByType = _.find(list, { type, code: otp });

    if (!filteredOtpByType) {
      return null;
    }

    return filteredOtpByType;
  }

  private canSendOTP(otps: OTP[]): boolean {
    // get otps in 24 hours
    const today = moment().startOf('day');

    const filteredOtpByType = _.filter(otps, (otp) => moment(otp.createdAt).isAfter(today));

    if (filteredOtpByType.length >= AUTH_CONSTANTS.MAX_OTP_PER_DAY) {
      return false;
    }

    return true;
  }
}
