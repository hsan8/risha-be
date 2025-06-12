import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtModuleOption = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  const options: JwtModuleOptions = {
    secret: configService.getOrThrow('JWT_SECRET_KEY'),
    signOptions: { expiresIn: configService.get('JWT_SECRET_EXPIRATION') || 1000 },
  };
  return options;
};
