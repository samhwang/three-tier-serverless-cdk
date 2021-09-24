import type { Config } from '@jest/types';
import baseConfig from './jest.config.base';

const config: Config.InitialOptions = {
    ...baseConfig,
    projects: ['<rootDir>', '<rootDir>/src/*'],
};

export default config;
