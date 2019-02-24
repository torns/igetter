module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "roots": [
    "<rootDir>/test"
  ],
  moduleDirectories: ['node_modules', 'src'],
  "testMatch": [ "**/test/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
};