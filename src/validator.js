const { isObject } = require('./utils')
const deepmerge = require('deepmerge')
const { filter, isEmpty } = require('ramda')
const spected = require('spected').default

const nullify = (schema, obj = {}) => {
  if (!schema) {
    throw new Error('No schema specified.')
  }

  if (!isObject(schema)) {
    throw new Error('Schema is not a valid object')
  }

  Object.keys(schema).forEach(p => {
    if (isObject(schema[p])) {
      obj[p] = {}
      nullify(schema[p], obj[p])
      return
    }
    obj[p] = null
  })

  return obj
}

const allPropertiesHaveValue = value => obj => {
  if (!obj) {
    throw new Error('No object specified.')
  }

  const a = filter(
    p => (isObject(p) ? !allPropertiesHaveValue(value)(p) : p !== value),
    obj
  )

  return isEmpty(a)
}

const setAllProperties = value => obj => {
  if (!obj) {
    throw new Error('No object specified.')
  }

  Object.keys(obj).forEach(p => {
    if (isObject(obj[p])) {
      setAllProperties(value)(obj[p])
      return
    }

    obj[p] = value
  })
}

const filterProperties = predicate => (obj, result = {}) => {
  if (!obj) {
    throw new Error('No object specified.')
  }

  Object.keys(obj).forEach(p => {
    if (isObject(obj[p])) {
      filterProperties(predicate)(obj[p], result)
      return
    }

    if (predicate(obj[p])) {
      result[p] = obj[p]
    }
  })

  return result
}

const isValid = allPropertiesHaveValue(true)

// return all properties in obj2, not in obj1
// { additional: bool, properties: {} }
const propertiesDiff = obj1 => (obj2, properties = {}) => {
  Object.keys(obj2).forEach(p => {
    if (isObject(obj2[p])) {
      if (!obj1.hasOwnProperty(p)) {
        properties[p] = {}
      }
      propertiesDiff(obj1)(obj2[p], properties[p])
      return
    }

    if (!obj1.hasOwnProperty(p)) {
      properties[p] = obj2[p]
    }
  })

  return {
    additional: !isEmpty(Object.keys(properties)),
    properties,
  }
}

// takes nested object and flattens to paths
// { foo: { bar: 'value' }} => [ path: 'foo.bar', value: 'value' ]
const flatten = (obj, path = null, result = []) => {
  Object.keys(obj).forEach(p => {
    if (isObject(obj[p])) {
      flatten(obj[p], path ? `${path}.${p}` : p, result)
      return
    }

    result.push({
      path: path ? `${path}.${p}` : p,
      value: obj[p],
    })
  })

  return result
}

// returns { isValid: boolean, errors: {} }
const verify = (
  schema,
  unexpectedPropertyMessage = 'Unexpected property.'
) => obj => {
  const diff = propertiesDiff(schema)(obj)
  setAllProperties([unexpectedPropertyMessage])(diff.properties)

  const objToValidate = deepmerge(nullify(schema), obj)
  const validation = spected(schema, objToValidate)

  const validationErrors = filterProperties(p => p !== true)(validation)
  let errors = deepmerge(validationErrors, diff.properties)

  return {
    isValid: isValid(errors),
    errors,
  }
}

// TODO: to rename all functions
// converts { { } } to [{ name: '', messages: [''] }]
const flattenErrors = errors => {
  return flatten(errors).map(e => ({
    name: e.path,
    messages: e.value,
  }))
}

// converts { { } } to [{ name: '', message: '' }]
const flatErrors = verified => {
  const results = []

  const flat = flatten(errors)
  flat.forEach(f => {
    f.value.forEach(v => {
      results.push({
        name: f.path,
        message: v,
      })
    })
  })

  return results
}

module.exports = {
  nullify,
  allPropertiesHaveValue,
  propertiesDiff,
  filterProperties,
  flatten,
  verify,
  flattenErrors,
  flatErrors,
}
