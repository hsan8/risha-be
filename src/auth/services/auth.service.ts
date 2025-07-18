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
import { User } from '../entities/user.entity';
import { OTP } from '../entities/otp.entity';
import { RegisterRequestDto } from '../dto/requests/register.request.dto';
import { LoginRequestDto } from '../dto/requests/login.request.dto';
import {
  ForgotPasswordRequestDto,
  VerifyOTPRequestDto,
  ResetPasswordRequestDto,
} from '../dto/requests/forgot-password.request.dto';
import { GoogleAuthRequestDto, AppleAuthRequestDto } from '../dto/requests/social-auth.request.dto';
import { AuthResponseDto, UserResponseDto, MessageResponseDto } from '../dto/responses/auth.response.dto';
import { AuthProvider, UserStatus, UserRole, OTPType } from '../enums/auth.enum';
import { AUTH_CONSTANTS, AUTH_MESSAGES } from '../constants/auth.constants';
import { UserRepository } from '../repositories/user.repository';
import { OTPRepository } from '../repositories/otp.repository';
import { EmailService } from './email.service';
import { GoogleAuthService } from './google-auth.service';
import { AppleAuthService } from './apple-auth.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OTPRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly appleAuthService: AppleAuthService,
  ) {}

  async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.SALT_ROUNDS);

    // Create user
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      provider: AuthProvider.EMAIL,
      status: UserStatus.PENDING_VERIFICATION,
      role: UserRole.USER,
      emailVerified: false,
      twoFactorEnabled: false,
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

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is using email authentication
    if (user.provider !== AuthProvider.EMAIL || !user.passwordHash) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check user status
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_INACTIVE);
    }

    // Update last login
    await this.userRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in successfully: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async googleAuth(dto: GoogleAuthRequestDto): Promise<AuthResponseDto> {
    // Verify Google ID token
    const googleUser = await this.googleAuthService.verifyIdToken(dto.idToken);

    // Find or create user
    let user = await this.userRepository.findByEmailOrProviderId(googleUser.email, googleUser.sub);

    if (!user) {
      user = await this.userRepository.create({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        provider: AuthProvider.GOOGLE,
        providerId: googleUser.sub,
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        emailVerified: googleUser.email_verified,
        twoFactorEnabled: false,
      });
    } else {
      // Update last login
      await this.userRepository.updateLastLogin(user.id);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Google auth successful: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async appleAuth(dto: AppleAuthRequestDto): Promise<AuthResponseDto> {
    // Verify Apple ID token
    await this.appleAuthService.verifyIdToken(dto.idToken);

    // Find or create user
    let user = await this.userRepository.findByEmailOrProviderId(dto.email, dto.userId);

    if (!user) {
      if (!dto.email) {
        throw new BadRequestException(AUTH_MESSAGES.SOCIAL_AUTH_EMAIL_REQUIRED);
      }

      user = await this.userRepository.create({
        name: dto.name || 'Apple User',
        email: dto.email,
        provider: AuthProvider.APPLE,
        providerId: dto.userId,
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        emailVerified: true, // Apple emails are verified
        twoFactorEnabled: false,
      });
    } else {
      // Update last login
      await this.userRepository.updateLastLogin(user.id);
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`Apple auth successful: ${user.email}`);

    return new AuthResponseDto({
      ...tokens,
      user: new UserResponseDto(user),
    });
  }

  async forgotPassword(dto: ForgotPasswordRequestDto): Promise<MessageResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    // Generate and save OTP
    const otp = await this.generateOTP(dto.email, OTPType.PASSWORD_RESET);

    // Send OTP email
    await this.emailService.sendPasswordResetOTP(dto.email, otp.code);

    this.logger.log(`Password reset OTP sent: ${dto.email}`);

    return new MessageResponseDto(AUTH_MESSAGES.OTP_SENT);
  }

  async verifyOTP(dto: VerifyOTPRequestDto): Promise<MessageResponseDto> {
    // Find and validate OTP
    const otp = await this.otpRepository.findValidOTP(dto.email, dto.otp, OTPType.PASSWORD_RESET);
    if (!otp) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_OTP);
    }

    // Mark OTP as used
    await this.otpRepository.markAsUsed(otp.id);

    this.logger.log(`OTP verified successfully: ${dto.email}`);

    return new MessageResponseDto(AUTH_MESSAGES.OTP_VERIFIED);
  }

  async resetPassword(dto: ResetPasswordRequestDto): Promise<MessageResponseDto> {
    // Validate passwords match
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(AUTH_MESSAGES.PASSWORDS_DO_NOT_MATCH);
    }

    // Find user
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    // Verify OTP again for security
    const otp = await this.otpRepository.findValidOTP(dto.email, dto.otp, OTPType.PASSWORD_RESET);
    if (!otp) {
      throw new BadRequestException(AUTH_MESSAGES.INVALID_OTP);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.SALT_ROUNDS);

    // Update user password
    await this.userRepository.updatePassword(user.id, passwordHash);

    // Mark OTP as used
    await this.otpRepository.markAsUsed(otp.id);

    this.logger.log(`Password reset successful: ${dto.email}`);

    return new MessageResponseDto(AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
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
      expiresIn: AUTH_CONSTANTS.TOKEN_EXPIRY_MINUTES * AUTH_CONSTANTS.MINUTES_TO_SECONDS, // 15 minutes in seconds
    };
  }

  private async generateOTP(email: string, type: OTPType): Promise<OTP> {
    // Generate 5-digit OTP
    const code = Math.floor(AUTH_CONSTANTS.OTP_MIN_VALUE + Math.random() * AUTH_CONSTANTS.OTP_MAX_VALUE).toString();

    // Set expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES);

    // Save OTP
    return await this.otpRepository.create({
      email,
      code,
      type,
      expiresAt,
      used: false,
      attempts: 0,
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
}
