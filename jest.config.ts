import type { Config } from '@jest/types';
import { buildJestConfig } from './jest.base.config';

const config: Config.InitialOptions = {
  ...buildJestConfig('<rootDir>/src'),
  // Add any additional configuration specific to unit tests
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/bootstrap.ts',
  ],
};

export default config;
