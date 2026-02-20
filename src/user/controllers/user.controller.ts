import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../decorators';
import { UserProfileResponseDto } from '../dto/responses';
import { UserService } from '../services';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get connected user profile' })
  @ApiDataResponse(UserProfileResponseDto, HttpStatus.OK)
  async getMe(
    @UserId() userId: string,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<UserProfileResponseDto>> {
    const user = await this.userService.getConnectedUser(userId, locale);

    return ResponseFactory.data(new UserProfileResponseDto(user));
  }
}
