// Mirrors the functionality of yurnalist
const defaultReporter = {
  log: message => console.log(message),
  info: message => console.log(message),
  warn: message => console.warn(message),
  error: message => console.error(message),
  success: message => console.log(message),
}

// Gatsby uses yurnalist (https://github.com/0x80/yurnalist) for reporting
const loggerFactory = reporter => {
  const logger = reporter || defaultReporter
  return {
    trace: message => logger.log(message),
    info: message => logger.info(message),
    warning: message => logger.warn(message),
    error: message => logger.error(message),
    success: message => logger.success(message),
  }
}

const nullLoggerFactory = () => ({
  trace: _ => {},
  info: _ => {},
  warning: _ => {},
  error: _ => {},
  success: _ => {},
})

exports.nullLoggerFactory = nullLoggerFactory
exports.loggerFactory = loggerFactory
