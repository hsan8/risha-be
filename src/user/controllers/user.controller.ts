import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { UserId } from '../decorators';
import { UserService } from '../services';
import { ResponseFactory } from '@/core/utils';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get connected user' })
  async getMe(@UserId() userId: string) {
    const user = await this.userService.getConnectedUser(userId);

    return ResponseFactory.data(user);
  }
}
