import { isNonEmptyString, isFunction } from '../utils'
import { nulliate, allPropertiesHaveValue } from '../validator'

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

describe('nulliate', () => {
  it('should set all properties to null', () => {
    const nulliated = nulliate(schema)
    expect(allPropertiesHaveValue(null)(nulliated)).toBe(true)
  })
})
