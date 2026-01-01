import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '@/auth/services';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  AppleAuthRequestDto,
  GoogleAuthRequestDto,
  VerifyOTPRequestDto,
  ResetPasswordRequestDto,
  ResendOTPRequestDto,
} from '@/auth/dto/requests';
import { AuthResponseDto, MessageResponseDto } from '@/auth/dto/responses';
import { ApiDataResponse } from '@/core/decorators';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email and password' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.CREATED)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterRequestDto): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);
    return ResponseFactory.data(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginRequestDto): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ResponseFactory.data(result);
  }

  @Post('google')
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() googleAuthDto: GoogleAuthRequestDto): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.googleAuth(googleAuthDto);
    return ResponseFactory.data(result);
  }

  @Post('apple')
  @ApiOperation({ summary: 'Authenticate with Apple' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async appleAuth(@Body() appleAuthDto: AppleAuthRequestDto): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.appleAuth(appleAuthDto);
    return ResponseFactory.data(result);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset OTP to email' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return ResponseFactory.data(result);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPRequestDto): Promise<DataResponseDto<AuthResponseDto>> {
    const result = await this.authService.verifyOTP(verifyOTPDto);
    return ResponseFactory.data(result);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP for password reset' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() resendOTPDto: ResendOTPRequestDto): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.resendOTP(resendOTPDto);
    return ResponseFactory.data(result);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with OTP verification' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return ResponseFactory.data(result);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.logout();
    return ResponseFactory.data(result);
  }
}
