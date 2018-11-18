const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig.spec.json');

module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: 'src',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/__test__/**/*.spec.(ts|js)'],
  testURL: 'http://localhost/',
  coverageDirectory: '../coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.path)
};
