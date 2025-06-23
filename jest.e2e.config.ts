import type { Config } from 'jest';
import { buildJestConfig } from './jest.base.config';

const config: Config = buildJestConfig({
  jestProjectConfigs: {
    testRegex: '.*\\.e2e-spec\\.ts$',
  },
});

export default config;
