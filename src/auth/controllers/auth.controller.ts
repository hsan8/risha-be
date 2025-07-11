import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDto } from '../dto/requests/register.request.dto';
import { LoginRequestDto } from '../dto/requests/login.request.dto';
import {
  ForgotPasswordRequestDto,
  VerifyOTPRequestDto,
  ResetPasswordRequestDto,
} from '../dto/requests/forgot-password.request.dto';
import { GoogleAuthRequestDto, AppleAuthRequestDto } from '../dto/requests/social-auth.request.dto';
import { AuthResponseDto, MessageResponseDto } from '../dto/responses/auth.response.dto';
import { ApiDataResponse } from '@/core/decorators/api';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() verifyOTPDto: VerifyOTPRequestDto): Promise<DataResponseDto<MessageResponseDto>> {
    const result = await this.authService.verifyOTP(verifyOTPDto);
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
}
