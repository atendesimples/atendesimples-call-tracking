export default function QueryStringSession(attrs) {
  let cache = {}
  let attributes = {}

  for (var name in attrs) {
    attributes[name] = attrs[name]
  }

  Object.keys(attributes).forEach(function (value, key) {
    if (attrs[value]) {
      cache[value] = attrs[value]
      sessionStorage.setItem(value, attrs[value])
    }
  })

  return cache
}
