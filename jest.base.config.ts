import type { Config as JestConfig } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions as tsConfigCompilerOptions } from './tsconfig.json';

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
type JestProjectConfig = Exclude<ArrayElement<JestConfig['projects']>, string>;

const baseJestConfig: JestConfig = {
  // ...
};
const baseJestProjectConfig: JestProjectConfig = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfigCompilerOptions.paths, { prefix: '<rootDir>' }),
  globalSetup: '<rootDir>/test/global-setup.ts',
};
const projects: { name?: string; rootDir: string }[] = [{ rootDir: '.' }];

export function buildJestConfig(config?: {
  jestConfigs?: JestConfig;
  jestProjectConfigs?: JestProjectConfig;
}): JestConfig {
  return {
    ...baseJestConfig,
    ...config?.jestConfigs,
    projects: projects.map(({ name, rootDir }) => ({
      ...baseJestProjectConfig,
      ...config?.jestProjectConfigs,
      ...(name && { displayName: name }),
      rootDir,
    })),
  };
}
