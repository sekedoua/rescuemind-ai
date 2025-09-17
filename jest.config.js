/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  modulePathIgnorePatterns: ["<rootDir>/cdk/cdk.out"], // 🚫 ignore CDK build artifacts
  collectCoverage: true,
  coverageDirectory: "coverage",
  verbose: true
};
