import getSpecs from './get-specs'

describe('getSpecs', () => {
  it('should return invalid object with no options', () => {
    const result = getSpecs(null)
    expect(result.errors).toEqual({
      object: {
        validObject: 'Invalid object.',
      },
      property: {},
    })
  })
})
