import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};

export default config;
