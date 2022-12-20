module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testTimeout: 15000,
  globalSetup: '<rootDir>/test/jest/globalSetup.ts',
  setupFilesAfterEnv: ['<rootDir>/test/jest/setupFilesAfterEnv.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
};
