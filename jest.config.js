module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "roots": [
    "<rootDir>/tests"
  ],
  moduleDirectories: ['node_modules', 'src'],
  "testMatch": [ "**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ],
  "coverageReporters": [
    "json-summary", 
    "text",
    "lcov"
  ]
};