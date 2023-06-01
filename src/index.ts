// Do this import before any code that manipulates the DOM.
import '@webcomponents/custom-elements'

// Do this create polyfill to fetch global function
import 'unfetch/polyfill'

import Checkin from '@/Checkin'
import Checkout from '@/Checkout'
import Ping from '@/Ping'
import Marketing from '@/Marketing'
import * as Page from '@/Page'

const delay = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms))

class CallTrackingNumber extends HTMLElement {
  number: string
  checkin: Checkin
  shadow: ShadowRoot
  token: string
  eventType: string
  fallbackErrorNumber: string
  utm: UTM
  visitorID: any
  checkinSendProps: any
  elementRef: HTMLElement
  pingTimer: any

  static get observedAttributes() {
    return ['token', 'fallback-error', 'event-type']
  }

  constructor() {
    super()

    this.shadow = this.attachShadow({ mode: 'open' })
    this.elementRef = document.createElement('div')

    this.token = this.getAttribute('token')
    this.eventType = this.getAttribute('event-type')
    this.fallbackErrorNumber = this.getAttribute('fallback-error')

    this.elementRef.textContent = ''

    if (this.eventType == 'click') {
      this.elementRef.textContent = 'click pra ver'
    }

    let analytics = Marketing.Analytics.call()
    this.utm = { ...analytics.fixed.attributes, ...analytics.latest.attributes } as UTM
    this.visitorID = this.utm.fingerprint

    this.checkin = new Checkin(this.token, this.fallbackErrorNumber)

    this.checkinSendProps = {
      utm: this.utm,
      visitor_id: this.visitorID,
      visitor_user_agent: Page.userAgent(),
      cid: '1126284224.1633708690', // Page.googleClientId(),
      date: new Date().toISOString(),
    }

    if (document.head.createShadowRoot || document.head.attachShadow) {
      this.shadow.appendChild(this.elementRef)
    } else {
      this.shadow.appendChild(this.elementRef)
    }
  }

  async pingPong() {
    const pingProps = {
      token: this.token,
      visitor: this.visitorID,
      number: this.checkin.result.number,
    }

    let pong = await Ping.call(pingProps)

    return pong
  }

  async checkIfNumberIsAvailable(retryCount?: number) {
    if (this.checkin.loading) return undefined

    retryCount = retryCount || 0
    let retryMax = 3

    clearInterval(this.pingTimer)

    if (retryCount >= retryMax) {
      console.log('CallTracking checkin was fail')
      this.elementRef.textContent = this.fallbackErrorNumber

      return false
    }

    this.checkin.clear()

    await this.checkin.send(this.checkinSendProps)

    let pong = await this.pingPong()

    if (pong.response?.type == 'no_lock') {
      retryCount++
      await delay(1_000)

      return this.checkIfNumberIsAvailable(retryCount)
    }

    if (pong.response?.type == 'no_pings') {
      await delay(1_000)

      await this.notifyCallTrackingCheckout()

      retryCount = 0

      return this.checkIfNumberIsAvailable(retryCount)
    }

    this.elementRef.textContent = this.checkin.result.number
    retryCount = 0

    this.pingTimer = setInterval(async () => {
      let pong = await this.pingPong()

      if (!pong.success) {
        this.elementRef.textContent = ''

        retryCount++

        return this.checkIfNumberIsAvailable(retryCount)
      }
    }, 10_000)
  }

  async notifyCallTrackingCheckout() {
    clearInterval(this.pingTimer)

    if (this.checkin) {
      Checkout.call({ token: this.token, number: this.checkin.result.number })
      this.checkin.clear()
    }

    this.elementRef.textContent = ''

    return true
  }

  async connectedCallback() {
    console.log('CallTracking element added to page.')

    if (this.eventType == 'click') {
      this.elementRef.addEventListener('click', async () => {
        this.elementRef.textContent = '-'
        await this.checkIfNumberIsAvailable()
      })
    } else {
      await this.checkIfNumberIsAvailable()
    }

    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState == undefined || document.visibilityState === 'visible') {
        if (this.eventType == 'load') {
          await this.checkIfNumberIsAvailable()
        }

        return true
      }

      setTimeout(() => {
        if (document.visibilityState === 'visible') return undefined

        this.notifyCallTrackingCheckout()
      }, 100)
    })

    window.addEventListener('beforeunload', () => {
      console.log('CallTracking beforeunload invoked')

      this.notifyCallTrackingCheckout()

      return true
    })

    window.addEventListener('online', (e) => {
      if (this.eventType == 'load') {
        this.checkIfNumberIsAvailable()
      }
    })

    window.addEventListener('offline', (e) => {
      console.log('CallTracking is now offline')

      this.notifyCallTrackingCheckout()

      this.elementRef.textContent = this.fallbackErrorNumber
    })
  }

  async disconnectedCallback() {
    console.log('CallTracking element removed from page.')

    await this.notifyCallTrackingCheckout()
  }
}

window.customElements.define('ct-number', CallTrackingNumber)
