import { isNonEmptyString, isFunction } from '../utils'
import { nullify, allPropertiesHaveValue } from '../validator'

const schema = {
  name: [[isNonEmptyString, 'name must be a non empty string']],
  resolve: [[isFunction, 'resolve must be a function']],
  foo: {
    bar: [[isNonEmptyString, 'baz']],
    baz: {
      foo: [[isFunction, 'bar']]
    }
  }
}

describe('nullify', () => {
  it('should set all properties to null', () => {
    const nullified = nullify(schema)
    expect(allPropertiesHaveValue(null)(nullified)).toBe(true)
  })
})
