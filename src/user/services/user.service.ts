import { AUTH_CONSTANTS, AUTH_MESSAGES_I18N } from '@/auth/constants';
import { AuthProvider, UserRole, UserStatus } from '@/auth/enums';
import { PageOptionsRequestDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { User } from '@/user/entities';
import { ICreateUserParams, IUpdateForRegistrationData } from '@/user/interfaces';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories';

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

  async findByProviderId(providerId: string, userLocale: UserLocale): Promise<User> {
    const user = await this.userRepository.findByProviderId(providerId);

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
      status: params.status ?? UserStatus.PENDING_VERIFICATION,
      role: UserRole.USER,
      emailVerified: params.emailVerified ?? false,
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

  async updateProfile(
    userId: string,
    data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar' | 'country' | 'address'>>,
    userLocale: UserLocale,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }
    return this.userRepository.updateProfile(userId, data);
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

  async listUsersForAdmin(
    pageOptions: PageOptionsRequestDto,
    searchQuery?: string,
  ): Promise<{ items: User[]; total: number }> {
    const all = searchQuery?.trim()
      ? await this.userRepository.search(searchQuery.trim())
      : await this.userRepository.findAll();
    const total = all.length;
    const start = (pageOptions.page - 1) * pageOptions.size;
    const items = all.slice(start, start + pageOptions.size);
    return { items, total };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    userLocale: UserLocale,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES_I18N.USER_NOT_FOUND[userLocale]);
    }

    if (user.provider !== AuthProvider.EMAIL || !user.passwordHash) {
      throw new BadRequestException(AUTH_MESSAGES_I18N.INVALID_CREDENTIALS[userLocale]);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES_I18N.INVALID_CREDENTIALS[userLocale]);
    }

    const passwordHash = await bcrypt.hash(newPassword, AUTH_CONSTANTS.SALT_ROUNDS);
    await this.userRepository.updatePassword(userId, passwordHash);
  }

  async updateUserAsAdmin(
    userId: string,
    data: { role?: UserRole; status?: UserStatus },
    userLocale: UserLocale,
  ): Promise<User> {
    await this.findById(userId, userLocale);
    return this.userRepository.updateRoleAndStatus(userId, data);
  }

  async deleteUser(userId: string, userLocale: UserLocale): Promise<void> {
    const user = await this.findById(userId, userLocale);
    if (user.role === UserRole.ADMIN) {
      return;
    }
    await this.userRepository.deleteAccount(userId);
  }
}
