import { GoogleAuthRequestDto } from '@/auth/dto/requests';
import { AuthResponseDto } from '@/auth/dto/responses';
import { AuthService } from '@/auth/services';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Google Authentication')
@Controller('google-auth')
export class GoogleAuthController {
  logger = new Logger(GoogleAuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Google auth callback (POST)' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async callback(
    @Body() body: GoogleAuthRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    this.logger.log(`----> Google auth callback POST`);
    this.logger.log(body);

    const result = await this.authService.googleAuth(body, locale);
    return ResponseFactory.data(result);
  }
}
