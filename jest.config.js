module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js'],
    transformIgnorePatterns: ['/node_modules/'],
    resetMocks: true,
    resetModules: true
  };