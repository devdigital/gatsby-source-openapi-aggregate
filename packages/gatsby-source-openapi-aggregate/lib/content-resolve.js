const contentResolve = logger => async spec => {
  let content = null

  try {
    content = await spec.resolve()
  } catch (exception) {
    // TODO: option to stop on spec fail
    logger.warning(
      `There was an error resolving spec '${spec.name}', ${exception.name} ${
        exception.message
      } ${exception.stack}`
    )
  }

  return content
}

module.exports.contentResolve = contentResolve
