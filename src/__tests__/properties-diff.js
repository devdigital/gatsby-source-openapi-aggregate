import { propertiesDiff } from '../validator'

const schema = {
  name: null,
  resolve: null
}

const obj = {
  name: null,
  resolve: null,
  foo: {
    bar: null,
    baz: {
      foo: null
    }
  }
}

describe('propertiesDiff', () => {
  it('should return additional properties', () => {
    const diff = propertiesDiff(schema)(obj)
    expect(diff).toEqual({
      additional: true,
      properties: {
        foo: {
          bar: null,
          baz: {
            foo: null
          }
        }
      }
    })
  })
})
