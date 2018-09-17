module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: 'src',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/__test__/**/*.spec.(ts|js)'],
  testURL: 'http://localhost/',
  coverageDirectory: '../coverage'
};
