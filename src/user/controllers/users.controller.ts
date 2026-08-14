import { JwtAuthGuard } from '@/auth/guards';
import { ApiDataArrayResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataArrayResponseDto, DataResponseDto } from '@/core/dtos';
import { ResponseFactory } from '@/core/utils';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserId } from '../decorators';
import { BlockUserService } from '../services/block-user.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly blockUserService: BlockUserService) {}

  @Post(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Block a user — their posts will be hidden from your feed' })
  @ApiParam({ name: 'id', description: 'ID of the user to block', type: String })
  async blockUser(
    @Param('id') targetUserId: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<null>> {
    await this.blockUserService.blockUser(userId, targetUserId);
    return ResponseFactory.data(null);
  }

  @Delete(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblock a previously blocked user' })
  @ApiParam({ name: 'id', description: 'ID of the user to unblock', type: String })
  async unblockUser(
    @Param('id') targetUserId: string,
    @UserId() userId: string,
  ): Promise<DataResponseDto<null>> {
    await this.blockUserService.unblockUser(userId, targetUserId);
    return ResponseFactory.data(null);
  }

  @Get('blocked')
  @ApiOperation({ summary: 'Get the list of blocked user IDs for the authenticated user' })
  @ApiDataArrayResponse(String)
  async getBlockedUsers(@UserId() userId: string): Promise<DataArrayResponseDto<string>> {
    const ids = await this.blockUserService.getBlockedUserIds(userId);
    return ResponseFactory.dataArray(ids);
  }
}
