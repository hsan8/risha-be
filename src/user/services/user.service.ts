import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from '@/user/entities';
import { ICreateUserParams, IUpdateForRegistrationData } from '@/user/interfaces';
import { UserRole, UserStatus } from '@/auth/enums';
import { AUTH_MESSAGES_I18N } from '@/auth/constants';
import { DEFAULT_LOCALE, UserLocale } from '@/core/enums';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getConnectedUser(userId: string, userLocale: UserLocale): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }

    return user;
  }

  async findById(userId: string, userLocale: UserLocale): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }

    return user;
  }

  async findByEmail(email: string, userLocale: UserLocale): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }

    return user;
  }

  async findByEmailOrProviderId(email: string, providerId: string, userLocale: UserLocale): Promise<User> {
    const user = await this.userRepository.findByEmailOrProviderId(email, providerId);

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }

    return user;
  }

  create(params: ICreateUserParams): Promise<User> {
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

  updateForRegistration(userId: string, data: IUpdateForRegistrationData): Promise<User> {
    return this.userRepository.updateForRegistration(userId, data);
  }

  async markEmailAsVerified(userId: string, userLocale: UserLocale): Promise<User> {
    await this.updateEmailVerification(userId, true);

    const user = await this.findById(userId, userLocale);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }
    return user;
  }

  async markEmailAsVerifiedAndActivate(userId: string, userLocale: UserLocale): Promise<User> {
    await this.updateEmailVerification(userId, true);
    await this.updateStatus(userId, UserStatus.ACTIVE);
    const user = await this.findById(userId, userLocale);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }
    return user;
  }
}
