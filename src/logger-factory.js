const logLevels = new Map()

logLevels.set('trace', 0)
logLevels.set('information', 1)
logLevels.set('warning', 2)
logLevels.set('error', 3)

const loggerFactory = currentLogLevel => logLevel => {
  const currentLogLevelValue = logLevels.get(currentLogLevel) || 1
  const logLevelValue = logLevels.get(logLevel) || 1

  if (currentLogLevelValue > logLevel) {
    return message => {}
  }

  return message => console.log(message)
}

module.exports = loggerFactory
