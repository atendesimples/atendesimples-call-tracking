type CheckoutProps = {
  token: string
  number: string
}

export default class Checkout {
  static async call({ token, number }: CheckoutProps): Promise<any> {
    // let cacheKey = `ct:checkin:${token}`
    // localStorage.removeItem(cacheKey)

    const url = `${process.env.CALL_TRACKING_CHECKOUT_URL}/${token}/${number}`

    const options = {
      method: 'POST',
      keepalive: true,
      headers: {
        'x-as-key': token,
        'Content-type': 'application/json',
      },
    }

    return fetch(url, options)
  }
}
