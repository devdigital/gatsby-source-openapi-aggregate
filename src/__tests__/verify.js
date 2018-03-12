import { isString, notEmpty, isFunction } from '../utils'
import { verify } from '../validator'

const schema = {
  name: [
    [isString, 'name must be a string'],
    [notEmpty, 'name must not be empty'],
  ],
  resolve: [[isFunction, 'resolve must be a function']],
}

describe('verify', () => {
  it('should return valid for satisfactory object', () => {
    const result = verify(schema)({
      name: 'name',
      resolve: () => {},
    })
    expect(result).toEqual({
      isValid: true,
      errors: {},
    })
  })

  it('should return errors for additional properties', () => {
    const result = verify(schema)({
      name: 'name',
      resolve: () => {},
      foo: 'bar',
      baz: {
        foo: 'baz',
      },
    })
    expect(result).toEqual({
      isValid: false,
      errors: {
        foo: ['Unexpected property.'],
        baz: {
          foo: ['Unexpected property.'],
        },
      },
    })
  })

  it('should return merged errors', () => {
    const result = verify(schema)({
      name: '',
      resolve: null,
      foo: 'bar',
    })
    expect(result).toEqual({
      isValid: false,
      errors: {
        name: ['name must not be empty'],
        resolve: ['resolve must be a function'],
        foo: ['Unexpected property.'],
      },
    })
  })
})
