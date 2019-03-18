module.exports = {
  'collectCoverageFrom': [
    '**/*.{js,jsx}',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/public/',
    '<rootDir>/types/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  setupFiles: [
    './jest.setup.js',
  ],
};
