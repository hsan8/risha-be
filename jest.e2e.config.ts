import type { Config } from 'jest';
import { buildJestConfig } from './jest.base.config';

const config: Config = buildJestConfig('.', true);

export default config;
