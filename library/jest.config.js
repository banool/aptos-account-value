/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testTimeout: 15000,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "node",
  coveragePathIgnorePatterns: [],
  testPathIgnorePatterns: ["dist/*", "examples/*"],
  collectCoverage: true,
  setupFiles: ["dotenv/config"],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // To help avoid exhausting all the available fds.
  maxWorkers: 4,
};
