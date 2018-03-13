import { setAllProperties, allPropertiesHaveValue } from '../validator'

describe('setAllProperties', () => {
  it('should set all properties to value', () => {
    const obj = {
      foo: null,
      baz: {
        bar: 'foo'
      }
    }
    setAllProperties(5)(obj)
    expect(allPropertiesHaveValue(5)(obj)).toBe(true)
  })
})
