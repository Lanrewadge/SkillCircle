module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'src/**/*.js',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  verbose: true,
}