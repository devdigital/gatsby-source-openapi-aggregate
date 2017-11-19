import { filterProperties } from '../validator'

describe('filterProperties', () => {
  it('should filter out properties not matching predicate', () => {
    const obj = {
      foo: true,
      baz: {
        bar: 'foo'
      }
    }
    const result = filterProperties(p => p === true)(obj)
    expect(result).toEqual({
      foo: true
    })
  })
})
