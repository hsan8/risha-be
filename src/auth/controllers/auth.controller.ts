import {
  ForgotPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResendOTPRequestDto,
  ResetPasswordRequestDto,
  VerifyOTPRequestDto,
} from '@/auth/dto/requests';
import { AuthResponseDto, MessageResponseDto } from '@/auth/dto/responses';
import { AuthService } from '@/auth/services';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email and password' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.CREATED)
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto, locale);
    return ResponseFactory.data(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto, locale);
    const response = new AuthResponseDto(result);
    return ResponseFactory.data(response);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.logout();
    return ResponseFactory.data(result);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset OTP to email' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.forgotPassword(forgotPasswordDto, locale);
    return ResponseFactory.data(result);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP verification' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.resetPassword(resetPasswordDto, locale);
    return ResponseFactory.data(result);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async verifyOTP(
    @Body() verifyOTPDto: VerifyOTPRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.verifyOTP(verifyOTPDto, locale);
    return ResponseFactory.data(result);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP for password reset' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async resendOTP(
    @Body() resendOTPDto: ResendOTPRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.resendOTP(resendOTPDto, locale);
    return ResponseFactory.data(result);
  }
}
