import type { Config } from '@jest/types';
import baseConfig from './jest.config.base';

const config: Config.InitialOptions = {
    ...baseConfig,
    projects: ['<rootDir>/packages/**/*'],
};

export default config;
