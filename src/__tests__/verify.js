import { isNonEmptyString, isFunction } from '../utils'
import { verify } from '../validator'

const schema = {
  name: [[isNonEmptyString, 'name must be a non empty string']],
  resolve: [[isFunction, 'resolve must be a function']]
}

describe('verify', () => {
  it('should return valid for satisfactory object', () => {
    const result = verify(schema)({
      name: 'name',
      resolve: () => {}
    })
    expect(result).toEqual({
      isValid: true,
      errors: []
    })
  })

  it('should return errors for additional properties', () => {
    const result = verify(schema)({
      name: 'name',
      resolve: () => {},
      foo: 'bar',
      baz: {
        foo: 'baz'
      }
    })
    expect(result).toEqual({
      isValid: false,
      errors: [
        {
          name: 'foo',
          message: 'Unexpected property.'
        },
        {
          name: 'baz',
          message: 'Unexpected property.'
        }
      ]
    })
  })
})
