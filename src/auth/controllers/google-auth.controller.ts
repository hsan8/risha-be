import { GoogleAuthRequestDto } from '@/auth/dto/requests';
import { AuthResponseDto } from '@/auth/dto/responses';
import { GoogleAuthService } from '@/auth/services/google-auth.service';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Google Authentication')
@Controller('google-auth')
export class GoogleAuthController {
  private readonly logger = new Logger(GoogleAuthController.name);

  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Google auth callback (POST)' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async callback(
    @Body() body: GoogleAuthRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    this.logger.log('Google auth callback POST');
    const result = await this.googleAuthService.authenticate(body, locale);
    return ResponseFactory.data(result);
  }
}
