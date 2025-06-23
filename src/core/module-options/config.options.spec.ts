import path from 'path';
import { Environment } from '~/core/enums';
import { buildConfigOptions } from './config.options';

describe('ConfigOptions', () => {
  const NODE_ENV = 'xyz';
  let env: NodeJS.ProcessEnv;

  beforeAll(() => {
    env = process.env;
  });

  afterAll(() => {
    process.env = env;
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { NODE_ENV };
  });

  it('should return the correct options', () => {
    const options = buildConfigOptions();

    expect(options).toEqual({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: [
        '.env',
        path.join(__dirname, '..', '..', 'config', `${NODE_ENV}.env`),
        path.join(__dirname, '..', '..', 'config', 'app.env'),
      ],
    });
  });

  it('should return the correct options with ignored env file for testing env', () => {
    const env = Environment.TEST;
    process.env = { NODE_ENV: env };

    const options = buildConfigOptions();

    expect(options).toEqual({
      isGlobal: true,
      ignoreEnvFile: true,
      envFilePath: [
        '.env',
        path.join(__dirname, '..', '..', 'config', `${env}.env`),
        path.join(__dirname, '..', '..', 'config', 'app.env'),
      ],
    });
  });
});
