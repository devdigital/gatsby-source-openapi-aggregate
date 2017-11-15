import optionsValidator from '../options-validator'

describe('optionsValidator', () => {
  it('should throw with no options', () => {
    expect(() => {
      optionsValidator(null)
    }).toThrow()
  })

  it('should throw with invalid specs', () => {
    expect(() => {
      optionsValidator({ specs: ['foogg', 'bar', 'baz'] })
    }).toThrow()
  })
})
