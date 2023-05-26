import Document from '@/Document'

export function parameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export function getSessionOrParameter(name) {
  if (sessionStorage.getItem(name)) return sessionStorage.getItem(name)
  if (parameterByName(name)) return parameterByName(name)

  return null
}

export function parameterOrDefault(name, defaultValue = 'no_utm') {
  if (getSessionOrParameter(name)) return getSessionOrParameter(name)

  return defaultValue || 'no_utm'
}

export function userAgent() {
  return navigator.userAgent || 'no_ua'
}

export function googleClientId() {
  return Document.cid() || 'no_cid'
}

export function locationPath() {
  if (location.protocol) {
    return location.protocol + '//' + location.hostname + location.pathname
  }

  return ''
}

export function queryStringText() {
  return location.search || ''
}

export function referrer() {
  return document.referrer || 'direto'
}
