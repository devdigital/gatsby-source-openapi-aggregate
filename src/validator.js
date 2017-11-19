import { isObject } from './utils'
import deepmerge from 'deepmerge'
import { filter, isEmpty } from 'ramda'
import spected from 'spected'

export const nulliate = (schema, obj = {}) => {
  if (!schema) {
    throw new Error('No schema specified.')
  }

  if (!isObject(schema)) {
    throw new Error('Schema is not a valid object')
  }

  Object.keys(schema).forEach(p => {
    if (isObject(schema[p])) {
      obj[p] = {}
      nulliate(schema[p], obj[p])
      return
    }
    obj[p] = null
  })

  return obj
}

export const allPropertiesHaveValue = value => obj => {
  if (!obj) {
    throw new Error('No object specified.')
  }

  const a = filter(
    p => (isObject(p) ? !allPropertiesHaveValue(value)(p) : p !== value),
    obj
  )

  return isEmpty(a)
}

export const isValid = allPropertiesHaveValue(true)

// return all properties in obj2, not in obj1
// { additional: bool, properties: {} }
export const propertiesDiff = obj1 => (obj2, properties = {}) => {
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
    properties
  }
}

// takes nested object and flattens to paths
// { foo: { bar: 'value' }} => [ path: 'foo.bar', value: 'value' ]
export const flatten = (obj, path = null, result = []) => {
  Object.keys(obj).forEach(p => {
    if (isObject(obj[p])) {
      flatten(obj[p], path ? `${path}.${p}` : p, result)
      return
    }

    result.push({
      path: path ? `${path}.${p}` : p,
      value: obj[p]
    })
  })

  return result
}

// returns { isValid: boolean, errors: {} }
// or { isValid: boolean, errors:[] } if flattenErrors
export const verify = (schema, flattenErrors = false) => obj => {
  const diff = propertiesDiff(schema)(obj)
  if (diff.additional) {
    return {
      isValid: false,
      errors: []
    }
  }

  const objToValidate = deepmerge(nulliate(schema), obj)
  const validation = spected(schema, objToValidate)

  return {
    isValid: isValid(validation),
    errors: []
  }
}
