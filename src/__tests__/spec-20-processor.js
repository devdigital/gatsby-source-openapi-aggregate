import spec20Processor from '../processors/spec20Processor'

describe('spec20Processor', () => {
  it('should throw with no content', async () => {
    await expect(spec20Processor(null)).rejects.toHaveProperty(
      'message',
      'No content to process.'
    )
  })

  it('should throw with no context', async () => {
    const content = {
      bar: 'foo',
    }
    await expect(
      spec20Processor(JSON.stringify(content), null)
    ).rejects.toHaveProperty('message', 'No context provided.')
  })

  it('should throw SyntaxError with invalid json', async () => {
    await expect(spec20Processor('invalid', {})).rejects.toBeInstanceOf(
      SyntaxError
    )
  })

  it('should throw when invalid spec version', async () => {
    const version = '3.0'
    const content = {
      swagger: version,
    }

    await expect(
      spec20Processor(JSON.stringify(content), {})
    ).rejects.toHaveProperty(
      'message',
      `Unsupported spec version '${version}'.`
    )
  })
})
