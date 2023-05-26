export {}

declare global {
  var $: any

  type CallTrackingProps = {
    token: string
    fallback?: any
    html: {
      event: string
      selector: string
    }
  }

  type UTM = {
    utm_source: any
    utm_medium: any
    utm_campaign: any
    utm_id: any
    utm_term: any
    utm_content: any
    referrer: any
    page: any
    querystring: any
    cid: any
    date: any
    fingerprint: any
    last_utm_source: any
    last_utm_medium: any
    last_utm_campaign: any
    last_utm_id: any
    last_utm_term: any
    last_utm_content: any
    last_referrer: any
    last_page: any
    last_querystring: any
    last_cid: any
    last_convert_page: any
  }

  interface Window {
    AtendeSimples: {
      CallTracking: any
    }
  }
}
