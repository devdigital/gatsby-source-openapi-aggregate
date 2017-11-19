import optionsValidator, { isValid } from '../options-validator'
import { isNonEmptyString, isFunction } from '../utils'
import { nulliate, allPropertiesHaveValue } from '../validator'

const specRules = {
  name: [[isNonEmptyString, 'name must be a non empty string']],
  resolve: [[isFunction, 'resolve must be a function']],
  foo: {
    bar: [[isNonEmptyString, 'baz']],
    baz: {
      foo: [[isFunction, 'bar']]
    }
  }
}

describe('optionsValidator', () => {
  it('should throw with no options', () => {
    expect(() => {
      optionsValidator(null)
    }).toThrow()
  })

  it('should throw with invalid specs', () => {
    expect(() => {
      optionsValidator({ specs: [(name: 'foo'), (resolve: () => {})] })
    })
  })
})
