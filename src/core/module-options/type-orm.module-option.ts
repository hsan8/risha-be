import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmModuleOption = (configService: ConfigService): TypeOrmModuleOptions => {
  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configService.getOrThrow('DB_HOST'),
    port: Number(configService.getOrThrow('DB_PORT')),
    username: configService.getOrThrow('DB_USERNAME'),
    database: configService.getOrThrow('DB_NAME'),
    password: configService.getOrThrow('DB_PASSWORD'),
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    ssl: configService.get('NODE_ENV') === 'local' ? false : { rejectUnauthorized: false },
    logging: Boolean(configService.get('DB_LOGGING')) || false,
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    synchronize: configService.get('NODE_ENV') !== 'production',
    autoLoadEntities: true,
    retryAttempts: 5,
    retryDelay: 3000,
  };
  return options;
};
