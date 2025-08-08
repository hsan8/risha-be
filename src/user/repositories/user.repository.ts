import { Injectable, Logger } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import { FirebaseService } from '@/core/services';
import { AUTH_CONSTANTS } from '@/auth/constants';
import { User } from '@/user/entities';
import { AuthProvider, UserStatus, UserRole } from '@/auth/enums';

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passwordHash?: string;
  provider: AuthProvider;
  providerId?: string;
  status: UserStatus;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(AUTH_CONSTANTS.USERS_COLLECTION);
  }

  async create(data: CreateUserData): Promise<User> {
    const userRef = this.collectionRef.push();
    const id = userRef.key;

    const now = new Date();
    const user: User = {
      id,
      name: data.name,
      email: data.email,
      provider: data.provider,
      status: data.status,
      role: data.role,
      emailVerified: data.emailVerified,
      twoFactorEnabled: data.twoFactorEnabled,
      createdAt: now,
      updatedAt: now,
    };

    if (data.phone) user.phone = data.phone;
    if (data.country) user.country = data.country;
    else user.country = 'Kuwait';
    if (data.avatar) user.avatar = data.avatar;
    if (data.passwordHash) user.passwordHash = data.passwordHash;
    if (data.providerId) user.providerId = data.providerId;

    await userRef.set(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return null;
    }

    const users = snapshot.val();
    const userId = Object.keys(users)[0];
    return users[userId] as User;
  }

  async findByEmailOrProviderId(email: string, providerId: string): Promise<User | null> {
    const emailSnapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (emailSnapshot.exists()) {
      const users = emailSnapshot.val();
      const userId = Object.keys(users)[0];
      return users[userId] as User;
    }

    const providerSnapshot = await this.collectionRef.orderByChild('providerId').equalTo(providerId).once('value');

    if (providerSnapshot.exists()) {
      const users = providerSnapshot.val();
      const userId = Object.keys(users)[0];
      return users[userId] as User;
    }

    return null;
  }

  async findById(id: string): Promise<User | null> {
    const snapshot = await this.collectionRef.child(id).once('value');
    const user = snapshot.val() as User;

    if (!user) {
      return null;
    }

    return user;
  }

  async updateLastLogin(id: string): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      passwordHash,
      updatedAt: new Date(),
    });
  }

  async updateEmailVerification(id: string, emailVerified: boolean): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      emailVerified,
      status: emailVerified ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      updatedAt: new Date(),
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      status,
      updatedAt: new Date(),
    });
  }

  async updateProfile(id: string, data: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>): Promise<User> {
    const userRef = this.collectionRef.child(id);
    const snapshot = await userRef.once('value');
    const existingUser = snapshot.val() as User;

    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser: User = {
      ...existingUser,
      ...data,
      updatedAt: new Date(),
    };

    await userRef.update(updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const userRef = this.collectionRef.child(id);
    const snapshot = await userRef.once('value');
    const user = snapshot.val() as User;

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    await userRef.update({
      status: UserStatus.INACTIVE,
      deletedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll(): Promise<User[]> {
    const snapshot = await this.collectionRef.once('value');
    const users: User[] = [];

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val() as User;
      if (user && !user.deletedAt) {
        users.push(user);
      }
    });

    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async countByStatus(status: UserStatus): Promise<number> {
    const snapshot = await this.collectionRef.orderByChild('status').equalTo(status).once('value');

    let count = 0;
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val() as User;
      if (user && !user.deletedAt) {
        count++;
      }
    });

    return count;
  }

  async search(query: string): Promise<User[]> {
    const snapshot = await this.collectionRef.once('value');
    const users: User[] = [];

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val() as User;
      if (user && !user.deletedAt) {
        const searchFields = [user.name, user.email, user.phone].filter(Boolean).join(' ').toLowerCase();

        if (searchFields.includes(query.toLowerCase())) {
          users.push(user);
        }
      }
    });

    return users;
  }
}
