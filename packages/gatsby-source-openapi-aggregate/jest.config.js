module.exports = {
  verbose: true,
  transform: { '^.+\\.js$': '<rootDir>/jest-preprocess.js' },
  setupFiles: ['<rootDir>/../../node_modules/regenerator-runtime/runtime'],
}
