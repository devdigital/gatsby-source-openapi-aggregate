import { flatten } from '../validator'

const obj = {
  foo: 'bar',
  bar: {
    baz: 'foo'
  }
}

describe('flatten', () => {
  it('should set all paths', () => {
    const flattened = flatten(obj)
    expect(flattened).toEqual([
      {
        path: 'foo',
        value: 'bar'
      },
      {
        path: 'bar.baz',
        value: 'foo'
      }
    ])
  })
})
