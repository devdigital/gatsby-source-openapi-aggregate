import { allPropertiesHaveValue } from '../validator'

describe('allPropertiesHaveValue', () => {
  it('should return true for null', () => {
    const result = allPropertiesHaveValue(null)({
      bar: null,
      baz: null,
      foo: {
        bar: null,
        baz: {
          foo: null
        }
      }
    })
    expect(result).toBe(true)
  })

  it('should return false for null invalid value', () => {
    const result = allPropertiesHaveValue(null)({
      bar: null,
      baz: null,
      foo: {
        bar: null,
        baz: {
          foo: 'bar'
        }
      }
    })
    expect(result).toBe(false)
  })

  it('should return true for scalar', () => {
    const result = allPropertiesHaveValue(5)({
      foo: 5,
      bar: 5,
      baz: {
        foo: 5
      }
    })
    expect(result).toBe(true)
  })

  it('should return false for scalar invalid value')
})
