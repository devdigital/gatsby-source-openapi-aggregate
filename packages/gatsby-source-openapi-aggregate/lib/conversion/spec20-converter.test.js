import { toServers, spec20Converter } from './spec20-converter'

describe('toServers', () => {
  it('should return default server with undefined schemes', () => {
    const result = toServers(null, null)
    expect(result).toEqual([{ url: '/' }])
  })

  it('should return default server with null schemes', () => {
    const result = toServers(null, null, null)
    expect(result).toEqual([{ url: '/' }])
  })

  it('should return default server with empty schemes', () => {
    const result = toServers(null, null, [])
    expect(result).toEqual([{ url: '/' }])
  })

  it('should throw an error with non array schemes', () => {
    expect(() => toServers(null, null, 'foo')).toThrow(
      'Unexpected schemes value, must be an array.'
    )
  })

  it('should return schemeless server with no schemes and host', () => {
    const result = toServers('foo.com', null, null)
    expect(result).toEqual([{ url: '//foo.com' }])
  })

  it('should return schemeless server with empty schemes and host', () => {
    const result = toServers('foo.com', null, [])
    expect(result).toEqual([{ url: '//foo.com' }])
  })

  it('should return schemeless server with no schemes and base path', () => {
    const result = toServers(null, 'v1', null)
    expect(result).toEqual([{ url: '//v1' }])
  })

  it('should return schemeless server with empty schemes and base path', () => {
    const result = toServers(null, 'v1', [])
    expect(result).toEqual([{ url: '//v1' }])
  })

  it('should return schemeless server with no schemes and host and base path', () => {
    const result = toServers('foo.com', '/v1', null)
    expect(result).toEqual([{ url: '//foo.com/v1' }])
  })

  it('should return schemeless server with empty schemes and host and base path', () => {
    const result = toServers('foo.com', '/v1', [])
    expect(result).toEqual([{ url: '//foo.com/v1' }])
  })

  it('should return all schemes with host and base path', () => {
    const result = toServers('foo.com', '/v1', ['http', 'https'])
    expect(result).toEqual([
      { url: 'http://foo.com/v1' },
      { url: 'https://foo.com/v1' },
    ])
  })
})
