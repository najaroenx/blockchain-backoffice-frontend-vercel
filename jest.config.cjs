const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

const config = {
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.ts"],

  collectCoverage: true,

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
  // coverageThreshold: {
  //   global: {
  //     statements: 10,
  //     branches: 10,
  //     functions: 10,
  //     lines: 10,
  //   },
  // },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$":
      "<rootDir>/test/__mocks__/fileMock.js",
  },
};

module.exports = createJestConfig(config);
