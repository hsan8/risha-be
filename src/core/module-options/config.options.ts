import { ConfigModuleOptions } from '@nestjs/config';
import * as path from 'path';
import { Environment } from '../enums';

export function buildConfigOptions(): ConfigModuleOptions {
  return {
    isGlobal: true,
    ignoreEnvFile: process.env.NODE_ENV === Environment.TEST,
    envFilePath: [
      // Dev (sensitive + overridden default env vars)
      '.env',

      // Dev/Non-Dev (non-sensitive default env vars)
      path.join('src', 'config', `${process.env.NODE_ENV || 'dev'}.env`),
      path.join('src', 'config', 'app.env'),
    ],
  };
}
