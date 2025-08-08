import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { UserResponseDto } from '@/auth/dto/responses';
import { User } from '@/user/entities';
import { AuthProvider, UserRole, UserStatus } from '@/auth/enums';
import { AUTH_MESSAGES } from '@/auth/constants';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getConnectedUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return new UserResponseDto(user);
  }

  findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByEmailOrProviderId(email: string, providerId: string): Promise<User> {
    const user = await this.userRepository.findByEmailOrProviderId(email, providerId);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  create(params: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    avatar?: string;
    passwordHash?: string;
    provider: AuthProvider;
    providerId?: string;
  }): Promise<User> {
    return this.userRepository.create({
      name: params.name,
      email: params.email,
      phone: params.phone,
      country: params.country,
      avatar: params.avatar,
      passwordHash: params.passwordHash,
      provider: params.provider,
      providerId: params.providerId,
      status: UserStatus.PENDING_VERIFICATION,
      role: UserRole.USER,
      emailVerified: false,
      twoFactorEnabled: false,
    });
  }

  updateLastLogin(userId: string): Promise<void> {
    return this.userRepository.updateLastLogin(userId);
  }

  updatePassword(userId: string, passwordHash: string): Promise<void> {
    return this.userRepository.updatePassword(userId, passwordHash);
  }

  updateEmailVerification(userId: string, emailVerified: boolean): Promise<void> {
    return this.userRepository.updateEmailVerification(userId, emailVerified);
  }

  updateStatus(userId: string, status: UserStatus): Promise<void> {
    return this.userRepository.updateStatus(userId, status);
  }
}
