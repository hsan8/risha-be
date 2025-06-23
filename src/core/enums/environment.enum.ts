import { ObjectValues } from '../types';

export const Environment = {
  DEV: 'dev',
  UAT: 'uat',
  PROD: 'prod',
  TEST: 'test', // (e.g. e2e tests)
} as const;
export type Environment = ObjectValues<typeof Environment>;
