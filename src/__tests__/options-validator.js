import optionsValidator from '../options-validator'

describe('optionsValidator', () => {
  it('should throw with no options', () => {
    expect(() => {
      optionsValidator(null)
    }).toThrow()
  })

  it('should pass with valid specs', () => {
    const result = optionsValidator({
      specs: [{ name: 'foo', resolve: () => {} }],
    })

    expect(result).toEqual({
      isValid: true,
      errors: [],
    })
  })

  it('should fail with invalid name', () => {
    const result = optionsValidator({
      specs: [{ name: '', resolve: () => {} }],
    })

    expect(result).toEqual({
      isValid: false,
      errors: [{ name: 'name', messages: ['name must not be empty'] }],
    })
  })
})
