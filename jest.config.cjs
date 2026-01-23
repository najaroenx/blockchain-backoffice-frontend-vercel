const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],

  // ✅ เปิดการเก็บ coverage
  collectCoverage: true,

  // ✅ เก็บ coverage เฉพาะ components ที่ reusable และ testable
  collectCoverageFrom: [
    // Dashboard components
    "src/app/dlt/components/dashboard/**/*.{ts,tsx}",
    // Hooks
    "src/app/dlt/hooks/**/*.{ts,tsx}",
    // Contexts
    "src/app/dlt/contexts/**/*.{ts,tsx}",
    // Libs
    "src/libs/**/*.{ts,tsx}",
    // VerifyPhone components
    "src/components/verifyPhone/**/*.{ts,tsx}",
    // Middleware
    "src/middleware.ts",
    // Excludes
    "!**/*.d.ts",
    "!**/__tests__/**",
    "!**/page.tsx",
    "!**/layout.tsx",
  ],

  coverageReporters: ["text", "lcov", "html"],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "./.next/",
    "./out/",
    "/coverage/",
    "/e2e/",
  ],

  // ✅ Transform ESM modules from node_modules
  transformIgnorePatterns: [
    "/node_modules/(?!(react-hotkeys-hook|react-admin|ra-core|ra-ui-materialui)/)",
  ],

  moduleNameMapper: {
    // "^@/(.*)$": "<rootDir>/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$":
      "<rootDir>/test/__mocks__/fileMock.js",
  },
};

module.exports = createJestConfig(config);
