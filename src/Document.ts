export default class Document {
  static get(selector) {
    return document.querySelector(selector)
  }

  static updateValue(selector, value) {
    let $el = this.get(selector)
    $el.textContent = value

    return $el
  }

  static cid() {
    let ga = document.cookie.split(';').find((o) => o.match(/_ga=(.+?)/))
    if (!ga) return ''

    return ga.split('.').slice(-2).join('.')
  }
}
