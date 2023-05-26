import 'unfetch/polyfill'

import Document from '@/Document'
import Checkin from '@/Checkin'
import Marketing from '@/Marketing'
import * as Page from '@/Page'

class CallTracking {
  #token: any
  #fallback: any
  #html: any
  utm: UTM

  constructor(props: CallTrackingProps) {
    this.#token = props.token
    this.#fallback = props.fallback
    this.#html = props.html

    this.utmAnalyzer()
  }

  utmAnalyzer() {
    let analytics = Marketing.Analytics.call()
    this.utm = { ...analytics.fixed.attributes, ...analytics.latest.attributes } as UTM
  }

  async checkin() {
    try {
      const data = await Checkin.call({
        token: this.#token,
        data: {
          utm: this.utm,
          page_cid: Page.googleClientId(),
          page_referrer: Page.referrer(),
          visitor_id: this.utm.fingerprint,
          visitor_user_agent: Page.userAgent(),
          date: new Date().toISOString(),
        },
      })

      return data.number
    } catch (error) {
      console.error(error)
      return this.#fallback.error
    }
  }

  async cretePhoneNumber() {
    let number = await this.checkin()
    return number || this.#fallback.error
  }

  async load() {
    let $el = Document.get(this.#html.selector)

    if (!$el) {
      return this.#fallback.error
    }

    if (this.#html.event == 'load') {
      let number = await this.cretePhoneNumber()
      Document.updateValue(this.#html.selector, number)

      return number
    } else if (this.#html.event == 'click') {
      $el.addEventListener('click', async () => {
        let number = await this.cretePhoneNumber()
        Document.updateValue(this.#html.selector, number)

        return number
      })
    }
  }
}

const AtendeSimples = { CallTracking }
window.AtendeSimples = AtendeSimples

export default AtendeSimples
