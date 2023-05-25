import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import fetch from 'axios'

type CallTrackingProps = {
  token: string
  fallback?: any
  html: {
    event: string
    selector: string
  }
}

class CallTracking {
  #token: any
  #fallback: any
  #html: any

  constructor(props: CallTrackingProps) {
    this.#token = props.token
    this.#fallback = props.fallback
    this.#html = props.html
  }

  googleClientId() {
    let ga = document.cookie.split(';').find((o) => o.match(/_ga=(.+?)/))
    if (!ga) return ''

    return ga.split('.').slice(-2).join('.')
  }

  run() {
    const url = `${process.env.CALL_TRACKING_URL}/2/${this.#token}`

    const options = {
      method: 'POST',
      data: JSON.stringify({ cid: this.googleClientId() }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    let $el = document.querySelector(this.#html.selector)

    if (!$el) {
      console.info('[CallTracking] Campo HTML não encontrado')
      return this.#fallback.error
    }

    return fetch(url, options).then((response) => {
      const { data } = response

      // update HTML ELement
      $el.textContent = data?.number || this.#fallback.error

      return data?.number || this.#fallback.error
    })
  }
}

const AtendeSimples = { CallTracking }
window.AtendeSimples = AtendeSimples

export default AtendeSimples
