module.exports = {
  projects: [
    {
      displayName: "client",
      testEnvironment: "jsdom",
      testMatch: ["**/__tests__/app.test.js"],
      setupFilesAfterEnv: ["./src/__tests__/jest.setup.cjs"],
      moduleNameMapper: {
        '\\.(scss)$': 'identity-obj-proxy'
      }
    },
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["**/__tests__/server.test.js"],
      transform: {
        '^.+\\.js$': 'babel-jest'
      }
    }
  ]
};