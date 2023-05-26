import { describe, it, test, expect, vi, beforeEach, afterEach } from 'vitest'

import AtendeSimples from '@/index'
import { allow, clearLocalStorage, clearSessionStorage, createLocation } from './utils'

console.info = vi.fn()

function createDiv() {
  let div = document.createElement('div')
  div.classList.add('phonenumber')
  div.innerHTML = ''

  document.body.appendChild(div)
}

describe('AtendeSimples', () => {
  beforeEach(() => {
    createLocation({
      utm_source: 'google',
      utm_medium: 'cp',
      utm_campaign: 'test',
      utm_campaignid: '1',
      utm_content: 'test',
      utm_term: 'test',
    })
  })

  afterEach(() => {
    clearSessionStorage()
  })

  describe('CallTracking#load', () => {
    test('when callTracking is success', async () => {
      clearLocalStorage()
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

      allow(callTracking).receive('checkin').returns('08005559981')

      let result = await callTracking.load()

      expect(result).toBeTruthy()
      expect($('.phonenumber').textContent).toBe('08005559981')
    })

    test('empty number', async () => {
      clearLocalStorage()
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

      allow(callTracking).receive('checkin').returns('')

      let result = await callTracking.load()

      expect(result).toBeTruthy()
      expect($('.phonenumber').textContent).toBe('1234')
    })

    test('empty cid on the body', async () => {
      document.cookie = ''

      clearLocalStorage()
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

      allow(callTracking).receive('checkin').returns('0800889001')

      let result = await callTracking.load()

      expect(result).toBeTruthy()
      expect($('.phonenumber').textContent).toBe('0800889001')
    })

    test('when div doesnt exist', async () => {
      clearLocalStorage()

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

      let result = await callTracking.load()

      expect(result).toBeTruthy()
      expect(result).toBe('1234')
      expect($('.phonenumber')).toBeFalsy()
    })

    test('when phone number saved by session store', async () => {
      createDiv()

      document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'

      const ct1 = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        fallback: {
          error: '1234',
        },
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      allow(ct1).receive('checkin').returns('08005559981')

      let result = await ct1.load()

      expect(result).toBeTruthy()
      expect($('.phonenumber').textContent).toBe('08005559981')

      // setup

      const ct2 = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        fallback: {
          error: '1234',
        },
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      let checkinSpy = vi.spyOn(ct2, 'checkin')

      allow(ct2).receive('checkin').returns('08005559982')

      let result2 = await ct2.load()

      expect(checkinSpy).not.toHaveBeenCalled()

      expect(result2).toBeTruthy()
      expect($('.phonenumber').textContent).toBe('08005559981')
    })
  })

  describe('Marketing Attributes', () => {
    test('check attributes', async () => {
      createDiv()

      document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'

      clearSessionStorage()

      createLocation({
        utm_source: 'google',
        utm_medium: 'cp',
        utm_campaign: 'test',
        utm_campaignid: '1',
        utm_content: 'test',
        utm_term: 'test',
      })

      const ct = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        fallback: {
          error: '1234',
        },
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      expect(ct.__utm.fingerprint).toBeTruthy()
      expect(ct.__utm.utm_source).toBe('google')
      expect(ct.__utm.utm_medium).toBe('cp')
      expect(ct.__utm.utm_campaign).toBe('test')
      expect(ct.__utm.utm_id).toBe('1')
      expect(ct.__utm.utm_content).toBe('test')
      expect(ct.__utm.referrer).toBe('direto')
      expect(ct.__utm.page).toBe('http://localhost/contato')
      expect(ct.__utm.querystring).toBe('?utm_source=google&utm_medium=cp&utm_campaign=test&utm_campaignid=1&utm_content=test&utm_term=test')
      expect(ct.__utm.cid).toBe('553524416.1685026105')

      expect(ct.__utm.last_utm_source).toBe('google')
      expect(ct.__utm.last_utm_medium).toBe('cp')
      expect(ct.__utm.last_utm_campaign).toBe('test')
      expect(ct.__utm.last_utm_id).toBe('1')
      expect(ct.__utm.last_utm_term).toBe('test')
      expect(ct.__utm.last_utm_content).toBe('test')
      expect(ct.__utm.last_referrer).toBe('direto')
      expect(ct.__utm.last_page).toBe('http://localhost/contato')
      expect(ct.__utm.last_querystring).toBe('?utm_source=google&utm_medium=cp&utm_campaign=test&utm_campaignid=1&utm_content=test&utm_term=test')
      expect(ct.__utm.last_cid).toBe('553524416.1685026105')
      expect(ct.__utm.last_convert_page).toBe(
        'http://localhost:3000/contato?utm_source=google&utm_medium=cp&utm_campaign=test&utm_campaignid=1&utm_content=test&utm_term=test',
      )

      // setup
      clearSessionStorage()

      createLocation({
        utm_source: 'google_changed',
        utm_medium: 'cp_changed',
        utm_campaign: 'test_changed',
        utm_campaignid: '1_changed',
        utm_content: 'test_changed',
        utm_term: 'test_changed',
      })

      const ct2 = new AtendeSimples.CallTracking({
        token: 'UaoPcchkelsSn0BIELN89',
        fallback: {
          error: '1234',
        },
        html: {
          event: 'load',
          selector: '.phonenumber',
        },
      })

      expect(ct2.__utm.fingerprint).toBeTruthy()
      expect(ct2.__utm.utm_source).toBe('google')
      expect(ct2.__utm.utm_medium).toBe('cp')
      expect(ct2.__utm.utm_campaign).toBe('test')
      expect(ct2.__utm.utm_id).toBe('1')
      expect(ct2.__utm.utm_content).toBe('test')
      expect(ct2.__utm.referrer).toBe('direto')
      expect(ct2.__utm.page).toBe('http://localhost/contato')
      expect(ct2.__utm.querystring).toBe('?utm_source=google&utm_medium=cp&utm_campaign=test&utm_campaignid=1&utm_content=test&utm_term=test')
      expect(ct2.__utm.cid).toBe('553524416.1685026105')

      expect(ct2.__utm.last_utm_source).toBe('google_changed')
      expect(ct2.__utm.last_utm_medium).toBe('cp_changed')
      expect(ct2.__utm.last_utm_campaign).toBe('test_changed')
      expect(ct2.__utm.last_utm_id).toBe('1_changed')
      expect(ct2.__utm.last_utm_term).toBe('test_changed')
      expect(ct2.__utm.last_utm_content).toBe('test_changed')
      expect(ct2.__utm.last_referrer).toBe('direto')
      expect(ct2.__utm.last_page).toBe('http://localhost/contato')
      expect(ct2.__utm.last_querystring).toBe(
        '?utm_source=google_changed&utm_medium=cp_changed&utm_campaign=test_changed&utm_campaignid=1_changed&utm_content=test_changed&utm_term=test_changed',
      )
      expect(ct2.__utm.last_cid).toBe('553524416.1685026105')
      expect(ct2.__utm.last_convert_page).toBe(
        'http://localhost:3000/contato?utm_source=google_changed&utm_medium=cp_changed&utm_campaign=test_changed&utm_campaignid=1_changed&utm_content=test_changed&utm_term=test_changed',
      )
    })
  })
})
