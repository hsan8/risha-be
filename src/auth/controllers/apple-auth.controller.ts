import { AppleAuthRequestDto } from '@/auth/dto/requests';
import { AuthResponseDto } from '@/auth/dto/responses';
import { AuthService } from '@/auth/services';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Apple Authentication')
@Controller('apple-auth')
export class AppleAuthController {
  private readonly logger = new Logger(AppleAuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('callback')
  @ApiOperation({ summary: 'Apple Sign In callback' })
  @ApiDataResponse(AuthResponseDto, HttpStatus.OK)
  @HttpCode(HttpStatus.OK)
  async callback(
    @Body() body: AppleAuthRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<AuthResponseDto>> {
    this.logger.log('Apple auth callback POST');
    const result = await this.authService.appleAuth(body, locale);
    return ResponseFactory.data(result);
  }
}
