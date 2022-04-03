import baseConfig from '../../jest.config.base';

const config: typeof baseConfig = {
  ...baseConfig,
  setupFilesAfterEnv: ['<rootDir>/utils/setupTests.ts'],
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.dev.json',
    },
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/utils/file-stub.js`,
  },
};

export default config;
