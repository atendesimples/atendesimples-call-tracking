import { describe, it, expect, vi, afterEach } from 'vitest'

import AtendeSimples from '@/index'

console.info = vi.fn()

function createDiv() {
  let div = document.createElement('div')
  div.classList.add('phonenumber')
  div.innerHTML = ''

  document.body.appendChild(div)
}

function clearAllCookie() {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })
}

describe('AtendeSimples', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('#googleClientId', () => {
    it('should return a string', () => {
      document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'

      let callTracking = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      expect(callTracking.googleClientId()).toBe('553524416.1685026105')
    })

    it('should return a empty string', () => {
      clearAllCookie()

      const callTracking = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      expect(callTracking.googleClientId()).toBe('')
    })
  })

  it('#run', async () => {
    createDiv()

    document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'

    const callTracking = new AtendeSimples.CallTracking({
      token: 'UaoPcchkelsSn0BIELN89',
      fallback: {
        error: '1234',
      },
      html: {
        event: 'load',
        selector: '.phonenumber',
      },
    })

    let result = await callTracking.run()

    expect(result).toBeTruthy()
    expect(document.querySelector('.phonenumber').textContent).toBe(result)
  })

  it('empty number', async () => {
    createDiv()

    const callTracking = new AtendeSimples.CallTracking({
      token: 'some-token',
      fallback: {
        error: '1234',
      },
      html: {
        event: 'load',
        selector: '.phonenumber',
      },
    })

    let result = await callTracking.run()

    expect(result).toBeTruthy()
    expect(document.querySelector('.phonenumber').textContent).toBe('1234')
  })

  it('empty cid on the body', async () => {
    document.cookie = ''

    createDiv()

    const callTracking = new AtendeSimples.CallTracking({
      token: 'some-token',
      fallback: {
        error: '1234',
      },
      html: {
        event: 'load',
        selector: '.phonenumber',
      },
    })

    let result = await callTracking.run()

    expect(result).toBeTruthy()
    expect(document.querySelector('.phonenumber').textContent).toBe('1234')
  })

  it('when div doesnt exist', async () => {
    document.querySelectorAll('.phonenumber').forEach((div) => div.remove())

    const callTracking = new AtendeSimples.CallTracking({
      token: 'UaoPcchkelsSn0BIELN89',
      fallback: {
        error: '1234',
      },
      html: {
        event: 'load',
        selector: '.phonenumber',
      },
    })

    let result = await callTracking.run()

    expect(console.info).toHaveBeenCalledWith('[CallTracking] Campo HTML não encontrado')

    expect(result).toBeTruthy()
    expect(result).toBe('1234')
    expect(document.querySelector('.phonenumber')).toBeFalsy()
  })
})
