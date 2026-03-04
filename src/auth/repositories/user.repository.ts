import { AUTH_CONSTANTS } from '@/auth/constants';
import { AuthProvider, UserRole, UserStatus } from '@/auth/enums';
import { FirebaseService } from '@/core/services';
import { User } from '@/user/entities';
import { Injectable } from '@nestjs/common';
import { Database, Reference } from 'firebase-admin/database';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export interface ICreateUserData {
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
  private readonly db: Database;
  private readonly collectionRef: Reference;

  constructor(private readonly firebaseService: FirebaseService) {
    this.db = this.firebaseService.getDatabase();
    this.collectionRef = this.db.ref(AUTH_CONSTANTS.USERS_COLLECTION);
  }

  async create(data: ICreateUserData): Promise<User> {
    const id = uuidv4();
    const userRef = this.collectionRef.child(id);

    const user = this.dataToEntity(data, id);
    await userRef.set(user);
    return user;
  }

  private dataToEntity(data: ICreateUserData, id: string): User {
    const now = moment().toDate();
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
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (!snapshot.exists()) {
      return null;
    }

    const users = snapshot.val();
    const userId = _.first(Object.keys(users));
    return users[userId] as User;
  }

  async findByEmailOrProviderId(email: string, providerId: string): Promise<User | null> {
    // First try to find by email
    const emailSnapshot = await this.collectionRef.orderByChild('email').equalTo(email.toLowerCase()).once('value');

    if (emailSnapshot.exists()) {
      const users = emailSnapshot.val();
      const userId = Object.keys(users)[0];
      return users[userId] as User;
    }

    // Then try to find by providerId
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
      lastLoginAt: moment().toDate(),
      updatedAt: moment().toDate(),
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      passwordHash,
      updatedAt: moment().toDate(),
    });
  }

  async updateEmailVerification(id: string, emailVerified: boolean): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      emailVerified,
      status: emailVerified ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      updatedAt: moment().toDate(),
    });
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    const userRef = this.collectionRef.child(id);
    await userRef.update({
      status,
      updatedAt: moment().toDate(),
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
      updatedAt: moment().toDate(),
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

    // Soft delete
    await userRef.update({
      status: UserStatus.INACTIVE,
      deletedAt: moment().toDate(),
      updatedAt: moment().toDate(),
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
