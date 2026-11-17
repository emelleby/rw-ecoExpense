// More info at https://redwoodjs.com/docs/project-configuration-dev-test-build

const path = require('path')

const preset = require('@redwoodjs/testing/config/jest/web/jest-preset')

const config = {
  rootDir: '../',
  preset: '@redwoodjs/testing/config/jest/web',
  // Keep Redwood's setup and add ours (Clerk + Google Maps mocks)
  setupFilesAfterEnv: [
    ...preset.setupFilesAfterEnv,
    path.join(__dirname, 'jest.setup.ts'),
  ],
}

module.exports = config
