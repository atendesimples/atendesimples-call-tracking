import { describe, it, expect, afterEach, beforeAll } from 'vitest'

import { createLocation, clearSessionStorage } from './utils'

import Marketing from '@/Marketing'

describe('Marketing', () => {
  beforeAll(() => {
    document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'
  })

  afterEach(() => {
    clearSessionStorage()
  })

  it('create first access', () => {
    let locationObject = {
      utm_source: 'google1',
      utm_medium: 'cp',
      utm_campaign: 'test',
      utm_campaignid: '1',
      utm_content: 'test',
      utm_term: 'test',
    }

    // Setup
    createLocation(locationObject)

    const mkt1st = Marketing.Analytics.fixed()

    expect(mkt1st.attributes['utm_source']).toBe('google1')
    expect(mkt1st.attributes['cid']).toBe('553524416.1685026105')

    // Setup
    createLocation(locationObject)

    const mkt2st = Marketing.Analytics.fixed()

    expect(mkt2st.attributes['fingerprint']).toBeTruthy()
    expect(mkt2st.attributes['utm_source']).toBe('google1')
    expect(mkt2st.attributes['cid']).toBe('553524416.1685026105')
  })

  it('update last', () => {
    let locationObject = {
      utm_source: 'google1',
      utm_medium: 'cp',
      utm_campaign: 'test',
      utm_campaignid: '1',
      utm_content: 'test',
      utm_term: 'test',
    }

    // Setup
    createLocation(locationObject)

    Marketing.Analytics.createSessionByQueryString()

    const firstmkt1st = Marketing.Analytics.fixed()
    const lastmkt1st = Marketing.Analytics.latest()

    expect(firstmkt1st.attributes['utm_source']).toBe('google1')
    expect(firstmkt1st.attributes['cid']).toBe('553524416.1685026105')

    expect(lastmkt1st.attributes['last_utm_source']).toBe('google1')
  })

  it('in another tab session stoarge is empty', () => {
    let locationObject = {
      utm_source: 'google1',
      utm_medium: 'cp',
      utm_campaign: 'test',
      utm_campaignid: '1',
      utm_content: 'test',
      utm_term: 'test',
    }

    // Setup
    clearSessionStorage()
    createLocation({ ...locationObject, utm_source: 'google2' })

    const firstmkt2st = Marketing.Analytics.fixed()
    const lastmkt2st = Marketing.Analytics.latest()

    expect(firstmkt2st.attributes['cid']).toBe('553524416.1685026105')
    expect(firstmkt2st.attributes['utm_source']).toBe('google1')

    expect(lastmkt2st.attributes['last_utm_source']).toBe('google2')

    // setup
    clearSessionStorage()
    createLocation({ ...locationObject, utm_source: 'google3' })

    const firstmkt3st = Marketing.Analytics.fixed()
    const lastmkt3st = Marketing.Analytics.latest()

    expect(firstmkt3st.attributes['cid']).toBe('553524416.1685026105')
    expect(firstmkt3st.attributes['utm_source']).toBe('google1')

    expect(lastmkt3st.attributes['last_utm_source']).toBe('google3')
  })

  it('using Analytics', () => {
    let locationObject = {
      utm_source: 'google1',
      utm_medium: 'cp',
      utm_campaign: 'test',
      utm_campaignid: '1',
      utm_content: 'test',
      utm_term: 'test',
    }

    // Setup
    clearSessionStorage()
    createLocation({ ...locationObject, utm_source: 'google2' })

    const analytic1 = Marketing.Analytics.call()

    expect(analytic1.fixed.attributes['cid']).toBe('553524416.1685026105')
    expect(analytic1.fixed.attributes['utm_source']).toBe('google1')

    expect(analytic1.latest.attributes['last_utm_source']).toBe('google2')

    // Setup
    clearSessionStorage()
    createLocation({ ...locationObject, utm_source: 'google3' })

    const analytic2 = Marketing.Analytics.call()

    expect(analytic2.fixed.attributes['cid']).toBe('553524416.1685026105')
    expect(analytic2.fixed.attributes['utm_source']).toBe('google1')

    expect(analytic2.latest.attributes['last_utm_source']).toBe('google3')
  })
})
