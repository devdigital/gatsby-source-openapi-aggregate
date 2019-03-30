import { getSpecs } from './get-specs'
import { nullLoggerFactory } from './logger-factory'

const emptyOptions = () => ({
  specs: [{ name: 'foo', resolve: () => {} }],
})

describe('getSpecs', () => {
  it('should throw on no logger', async () => {
    await expect(getSpecs(emptyOptions(), null)).rejects.toHaveProperty(
      'message',
      'The logger is invalid.'
    )
  })

  it('should throw on invalid logger', async () => {
    await expect(getSpecs(emptyOptions(), {})).rejects.toHaveProperty(
      'message',
      'The logger is invalid.'
    )
  })

  it('should throw on non object options', async () => {
    await expect(getSpecs(false, nullLoggerFactory())).rejects.toHaveProperty(
      'message',
      'The provided options are invalid.'
    )
  })

  it('should throw on empty options', async () => {
    await expect(getSpecs({}, nullLoggerFactory())).rejects.toHaveProperty(
      'message',
      'The provided options are invalid.'
    )
  })
})
