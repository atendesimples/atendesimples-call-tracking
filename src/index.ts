import 'unfetch/polyfill'

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

  request() {
    const url = `${process.env.CALL_TRACKING_URL}/2/${this.#token}`

    const options = {
      method: 'POST',
      data: JSON.stringify({ cid: this.googleClientId() }),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    return fetch(url, options).then(async (response) => {
      const data = await response.json()

      // update HTML ELement
      let $el = document.querySelector(this.#html.selector)
      $el.textContent = data?.number || this.#fallback.error

      return data?.number || this.#fallback.error
    })
  }

  load() {
    let $el = document.querySelector(this.#html.selector)

    if (!$el) {
      return this.#fallback.error
    }

    if (this.#html.event == 'load') {
      return this.request()
    } else if (this.#html.event == 'click') {
      $el.addEventListener('click', async () => {
        // if (this.#html.loading) {
        //   $el.innerHTML = (await this.#html.loading()) || '...'
        // } else {
        // $el.textContent = '...'
        // }

        let result = await this.request()

        $el.textContent = result

        return result
      })
    }
  }
}

const AtendeSimples = { CallTracking }
window.AtendeSimples = AtendeSimples

export default AtendeSimples
