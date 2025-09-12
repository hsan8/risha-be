import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '../decorators';
import { UserService } from '../services';
import { UserProfileResponseDto } from '../dto/responses';
import { ApiDataResponse } from '@/core/decorators';
import { ResponseFactory } from '@/core/utils';
import { DataResponseDto } from '@/core/dtos';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get connected user profile' })
  @ApiDataResponse(UserProfileResponseDto, HttpStatus.OK)
  async getMe(@UserId() userId: string): Promise<DataResponseDto<UserProfileResponseDto>> {
    const user = await this.userService.getConnectedUser(userId);

    return ResponseFactory.data(new UserProfileResponseDto(user));
  }
}
