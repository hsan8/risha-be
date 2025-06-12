import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Aes128CbcEncryptionStrategy } from './strategies';
import { Aes256CbcEncryptionStrategy } from './strategies/aes-256-encryption.strategy';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'ENCRYPTION_KEY',
      useFactory: (config: ConfigService) => config.getOrThrow<string>('ENCRYPTION_KEY'),
      inject: [ConfigService],
    },
    {
      provide: Aes256CbcEncryptionStrategy.name,
      useClass: Aes256CbcEncryptionStrategy,
    },
    {
      provide: Aes128CbcEncryptionStrategy.name,
      useClass: Aes128CbcEncryptionStrategy,
    },
  ],

  exports: [Aes256CbcEncryptionStrategy.name, Aes128CbcEncryptionStrategy.name],
})
export class EncryptionModule {}
