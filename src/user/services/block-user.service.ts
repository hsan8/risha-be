import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockedUser } from '../entities/blocked-user.entity';
import { BlockedUserRepository } from '../repositories/blocked-user.repository';

@Injectable()
export class BlockUserService {
  constructor(private readonly blockedUserRepository: BlockedUserRepository) {}

  async blockUser(blockingUserId: string, targetUserId: string): Promise<BlockedUser> {
    if (blockingUserId === targetUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    return this.blockedUserRepository.block(blockingUserId, targetUserId);
  }

  async unblockUser(blockingUserId: string, targetUserId: string): Promise<void> {
    await this.blockedUserRepository.unblock(blockingUserId, targetUserId);
  }

  async getBlockedUserIds(blockingUserId: string): Promise<string[]> {
    return this.blockedUserRepository.findBlockedUserIds(blockingUserId);
  }
}
