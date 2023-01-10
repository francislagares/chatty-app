import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  roots: ['<rootDir>/server/src/tests', '<rootDir>/client/src/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  coverageReporters: ['text-summary', 'lcov'],
  coveragePathIgnorePatterns: ['(test/.*.mock).(jsx?|tsx?)$'],
  verbose: true,
  maxWorkers: 1,
  forceExit: true,
  detectOpenHandles: true,
  projects: [
    '<rootDir>/server/jest.config.ts',
    '<rootDir>/client/jest.config.ts',
  ],
  coverageDirectory: '<rootDir>/coverage/',
};

export default config;
