export default function Context(attrs) {
  let attributes = {}

  for (var name in attrs) {
    attributes[name] = attrs[name]
  }

  let getByStorage = function (key: string) {
    var item = localStorage.getItem(key)
    return item || undefined
  }

  let first = function () {
    let cache = {}

    Object.keys(attributes).forEach(function (value, key) {
      if (!getByStorage(value)) {
        localStorage.setItem(value, attributes[value])
      }

      cache[value] = getByStorage(value)
    })

    return cache
  }

  let latest = function () {
    let cache = {}

    Object.keys(attributes).forEach(function (value, key) {
      localStorage.setItem(value, attributes[value])
      cache[value] = getByStorage(value)
    })

    return cache
  }

  return {
    properties: attributes,
    first,
    latest,
  }
}
