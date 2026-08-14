import { UserRole } from '@/auth/enums';
import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataResponse, Language } from '@/core/decorators';
import { DataResponseDto, MessageResponseDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserId } from '../decorators';
import { ChangePasswordRequestDto } from '../dto/requests/change-password.request.dto';
import { UpdateProfileRequestDto } from '../dto/requests/update-profile.request.dto';
import { UserProfileResponseDto } from '../dto/responses';
import { IRequestUser } from '../interfaces';
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

  @Post('change-password')
  @ApiOperation({ summary: 'Change connected user password' })
  async changePassword(
    @UserId() userId: string,
    @Body() body: ChangePasswordRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<null>> {
    await this.userService.changePassword(userId, body.oldPassword, body.newPassword, locale);
    return ResponseFactory.data(null);
  }

  @Delete()
  @ApiOperation({
    summary: 'Permanently delete the connected user account and associated personal data',
  })
  @ApiDataResponse(MessageResponseDto, HttpStatus.OK)
  async deleteAccount(
    @User() user: IRequestUser,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<MessageResponseDto>> {
    if (user.role === UserRole.ADMIN) {
      return;
    }

    await this.userService.deleteUser(user.id, locale);
    return ResponseFactory.data(new MessageResponseDto('Account deleted successfully'));
  }
}
