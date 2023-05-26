import 'unfetch/polyfill'

import Document from '@/Document'
import Checkin from '@/Checkin'
import Marketing from '@/Marketing'
import * as Page from '@/Page'

class CallTracking {
  #token: any
  #fallback: any
  #html: any
  #hasClicked: any

  __utm: UTM
  __checkin: any
  __loading: boolean

  constructor(props: CallTrackingProps) {
    this.#token = props.token
    this.#fallback = props.fallback
    this.#html = props.html

    this.utmAnalyzer()
  }

  utmAnalyzer() {
    let analytics = Marketing.Analytics.call()
    this.__utm = { ...analytics.fixed.attributes, ...analytics.latest.attributes } as UTM
  }

  async checkin() {
    this.__loading = true

    try {
      this.__checkin = await Checkin.call({
        token: this.#token,
        data: {
          utm: this.__utm,
          visitor_id: this.__utm.fingerprint,
          visitor_user_agent: Page.userAgent(),
          cid: Page.googleClientId(),
          date: new Date().toISOString(),
        },
      })

      return this.__checkin.number
    } catch (error) {
      console.error(error)
      return this.#fallback.error
    } finally {
      this.__loading = false
    }
  }

  async createPhoneNumber() {
    let phoneBySession = localStorage.getItem('calltracking:phonenumber')

    if (phoneBySession) {
      return phoneBySession
    }

    let number = await this.checkin()
    let result = number || this.#fallback.error
    localStorage.setItem('calltracking:phonenumber', result)

    return result
  }

  async load() {
    if (this.__checkin?.number) {
      console.log('Already checkin before')
      Document.updateValue(this.#html.selector, this.__checkin.number)
      return this.__checkin.number
    }

    let $el = Document.get(this.#html.selector)

    if (!$el) {
      return this.#fallback.error
    }

    if (this.#html.event == 'load') {
      if (!this.__loading) {
        let number = await this.createPhoneNumber()
        Document.updateValue(this.#html.selector, number)

        return number
      }
    } else if (this.#html.event == 'click') {
      $el.addEventListener('click', async () => {
        if (this.#hasClicked || this.__loading) return undefined

        let number = await this.createPhoneNumber()
        this.#hasClicked = true

        Document.updateValue(this.#html.selector, number)

        return number
      })
    }
  }
}

const AtendeSimples = { CallTracking }
window.AtendeSimples = AtendeSimples

export default AtendeSimples
