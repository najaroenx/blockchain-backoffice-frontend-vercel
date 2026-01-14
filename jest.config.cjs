const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],

  // ✅ เปิดการเก็บ coverage
  collectCoverage: true,

  // ✅ เก็บเฉพาะ coverage จากไฟล์ใน __tests__ เท่านั้น
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/__tests__/**",
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
