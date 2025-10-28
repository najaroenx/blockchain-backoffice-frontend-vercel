// jest.config.cjs
const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  collectCoverage: true,
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/__tests__/**",
    "!**/*.d.ts",
    "!**/*test.*",
    "!**/*spec.*",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/out/**",
    "!**/coverage/**",
    "!**/public/**",
    "!**/__mocks__/**",
    "!**/e2e/**",
    "!**/*config.{js,cjs,mjs,ts}",
    "!**/next.config.*",
    "!**/postcss.config.*",
    "!**/tailwind.config.*",
    "!**/edge-runtime-*.js",
    "!**/*manifest*.js",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
};

module.exports = createJestConfig(customJestConfig);
