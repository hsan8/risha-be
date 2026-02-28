import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, Get, HttpStatus, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserId } from '../decorators';
import { UpdateProfileRequestDto } from '../dto/requests/update-profile.request.dto';
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

  @Put('profile')
  @ApiOperation({ summary: 'Update connected user profile' })
  @ApiDataResponse(UserProfileResponseDto, HttpStatus.OK)
  async updateProfile(
    @UserId() userId: string,
    @Body() body: UpdateProfileRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<UserProfileResponseDto>> {
    const user = await this.userService.updateProfile(userId, body, locale);
    return ResponseFactory.data(new UserProfileResponseDto(user));
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Partially update connected user profile' })
  @ApiDataResponse(UserProfileResponseDto, HttpStatus.OK)
  async patchProfile(
    @UserId() userId: string,
    @Body() body: UpdateProfileRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<UserProfileResponseDto>> {
    const user = await this.userService.updateProfile(userId, body, locale);
    return ResponseFactory.data(new UserProfileResponseDto(user));
  }
}
