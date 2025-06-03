// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you by Next.js, but just in case)
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS modules (with identity-obj-proxy)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Ensure that 'jest-environment-jsdom' is specified correctly as a separate package
  testEnvironment: 'jest-environment-jsdom',
  // You no longer need 'preset: 'ts-jest'' or manual 'transform' rules,
  // as next/jest handles TypeScript and Babel transformations for Next.js projects.
};

// createJestConfig is an async function that returns a Jest config object.
// So the code below wraps the Jest config in an async function to ensure it's loaded with the Next.js config.
module.exports = async () => ({
  ...await createJestConfig(customJestConfig)(),
  // Make sure to ignore the .next folder in testMatch
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  // Add transformIgnorePatterns to prevent Jest from transforming node_modules for ts-jest
  // This rule should be handled by next/jest, but sometimes it helps explicitly
  // Re-adding this as a safeguard, similar to the initial robust config.
  transformIgnorePatterns: ['/node_modules/(?!(next)/)'],
  // This helps Jest resolve modules within the tsconfig.json 'paths' (if you have them)
  moduleDirectories: ['node_modules', '<rootDir>/'],
});