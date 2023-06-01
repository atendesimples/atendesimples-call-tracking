export type CheckinResult = {
  type: string
  number: string
}

type CheckinData = {
  utm: UTM
  visitor_id: string
  visitor_user_agent: string
  cid: string
  date: string
}

type CheckinProps = CheckinData

export default class Checkin {
  result: CheckinResult
  loading: boolean
  token: string
  fallbackError: string
  cacheKey: string

  constructor(token: string, fallbackError: string) {
    this.token = token
    this.fallbackError = fallbackError
    this.cacheKey = `ct:checkin:${this.token}`
  }

  clear() {
    this.loading = false
    this.result = undefined

    return this
  }

  async send(data: CheckinProps): Promise<CheckinResult> {
    this.loading = true

    try {
      // let cache = localStorage.getItem(this.cacheKey)

      // if (cache) {
      //   this.result = JSON.parse(cache)
      //   return this.result
      // }

      // Was created in the past
      if (this.result) {
        return this.result
      }

      const url = `${process.env.CALL_TRACKING_URL}/2/${this.token}`

      const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'x-as-key': this.token,
          'Content-type': 'application/json',
        },
      }

      let request = await fetch(url, options)

      if (request.status > 422) {
        this.result = { type: 'error', number: this.fallbackError }

        return this.result
      }

      let response = await request.json()

      this.result = response
      this.loading = false
      // localStorage.setItem(this.cacheKey, JSON.stringify(response))

      return response
    } catch (error) {
      this.result = { type: 'error', number: this.fallbackError }

      return this.result
    } finally {
      this.loading = false
    }
  }
}
