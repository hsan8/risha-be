import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export function buildJestConfig(rootDir: string, isE2E = false): Config.InitialOptions {
  return {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir,
    testRegex: isE2E ? '.*\\.e2e-spec\\.ts$' : '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  };
}
