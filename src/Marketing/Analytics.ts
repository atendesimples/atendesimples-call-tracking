import { v4 as uuidv4 } from 'uuid'

import QueryStringSession from './QueryStringSession'
import Context from './Context'

import { getSessionOrParameter, googleClientId, locationPath, parameterOrDefault, queryStringText, referrer } from '@/Page'

export default class Analytics {
  static createSessionByQueryString() {
    return QueryStringSession({
      utm_source: parameterOrDefault('utm_source'),
      utm_medium: parameterOrDefault('utm_medium'),
      utm_campaign: parameterOrDefault('utm_campaign'),
      utm_id: parameterOrDefault('utm_campaignid'),
      utm_term: parameterOrDefault('utm_term'),
      utm_content: parameterOrDefault('utm_content'),
      last_referrer: getSessionOrParameter('last_referrer') || referrer(),
      last_page: getSessionOrParameter('last_page') || locationPath(),
      last_querystring: getSessionOrParameter('last_querystring') || queryStringText(),
    })
  }

  static fixed() {
    let context = Context({
      utm_source: parameterOrDefault('utm_source'),
      utm_medium: parameterOrDefault('utm_medium'),
      utm_campaign: parameterOrDefault('utm_campaign'),
      utm_id: parameterOrDefault('utm_campaignid'),
      utm_term: parameterOrDefault('utm_term'),
      utm_content: parameterOrDefault('utm_content'),
      referrer: referrer(),
      page: locationPath(),
      querystring: queryStringText(),
      cid: googleClientId(),
      date: new Date().toISOString(),
      fingerprint: uuidv4(),
    })

    let attributes = context.first()

    return {
      context,
      attributes,
    }
  }

  static latest() {
    let context = Context({
      last_utm_source: parameterOrDefault('utm_source'),
      last_utm_medium: parameterOrDefault('utm_medium'),
      last_utm_campaign: parameterOrDefault('utm_campaign'),
      last_utm_id: parameterOrDefault('utm_campaignid'),
      last_utm_term: parameterOrDefault('utm_term'),
      last_utm_content: parameterOrDefault('utm_content'),
      last_referrer: getSessionOrParameter('last_referrer') || referrer(),
      last_page: getSessionOrParameter('last_page') || locationPath(),
      last_querystring: getSessionOrParameter('last_querystring') || queryStringText(),
      last_cid: googleClientId(),
      last_convert_page: location.href,
    })

    let attributes = context.latest()

    return {
      context,
      attributes,
    }
  }

  static call() {
    this.createSessionByQueryString()

    let fixed = this.fixed()
    let latest = this.latest()

    return { fixed, latest }
  }
}
