import { optionsValidator } from './options-validator'

describe('optionsValidator', () => {
  it('should throw with no options', () => {
    const result = optionsValidator(null)
    expect(result.errors).toEqual({
      object: {
        validObject: 'Invalid object.',
      },
      property: {},
    })
  })

  it('should pass with valid specs', () => {
    const result = optionsValidator({
      specs: [{ name: 'foo', resolve: () => {} }],
    })

    expect(result.isValid).toEqual(true)
  })

  it('should fail with invalid name', () => {
    const result = optionsValidator({
      specs: [{ name: '', resolve: () => {} }],
    })

    expect(result).toEqual({
      isValid: false,
      errors: {
        object: {},
        property: {
          specs: {
            0: {
              name: ['name is a required string'],
            },
          },
        },
      },
    })
  })
})
