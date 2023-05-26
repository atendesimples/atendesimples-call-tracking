import { vi } from 'vitest'

global.$ = (string) => document.querySelector(string)

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function allow(spyObject: any) {
  return {
    receive(spyMethod: string) {
      return {
        returns(mockExpected: any) {
          return vi.spyOn(spyObject, spyMethod).mockImplementation(() => mockExpected)
        },
        promise(mockExpected: any) {
          return vi.spyOn(spyObject, spyMethod).mockResolvedValue(mockExpected)
        },
        reject(mockExpected: any) {
          return vi.spyOn(spyObject, spyMethod).mockRejectedValue(mockExpected)
        },
      }
    },
  }
}

export function clearAllCookie() {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}

export function createLocation(qsObject: object) {
  let url = 'http://localhost:3000/contato'

  let [firstKey, ...keys] = Object.keys(qsObject)
  let qs = [`?${firstKey}=${qsObject[firstKey]}`]

  for (let item of keys) {
    qs.push(`${item}=${qsObject[item]}`)
  }

  url += qs.join('&')

  return Location(url)
}

export function Location(href: string) {
  const url = new URL(href)

  window.location.href = href
  window.location.protocol = url.protocol
  window.location.hostname = url.hostname
  window.location.pathname = url.pathname
  window.location.search = url.search

  return url
}

export function clearSessionStorage() {
  window.sessionStorage.clear()
}
