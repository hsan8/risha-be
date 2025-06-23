import type { Config } from 'jest';
import { buildJestConfig } from './jest.base.config';

const config: Config = buildJestConfig({
  jestProjectConfigs: {
    testRegex: '.*\\.spec\\.ts$',
    coveragePathIgnorePatterns: ['__testing__', 'entities', '<rootDir>/src/db', 'index.ts'],
  },
  jestConfigs: {
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    coverageReporters: ['clover', 'json', 'lcov', 'text', 'text-summary', 'cobertura'],
  },
});

export default config;
