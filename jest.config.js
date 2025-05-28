module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/src/**/*.test.(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};