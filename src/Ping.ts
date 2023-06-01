type PingProps = {
  token: string
  number: string
  visitor: string
}

export class Ping {
  success: boolean
  response: any

  async call({ token, visitor, number }: PingProps): Promise<any> {
    try {
      const url = `${process.env.CALL_TRACKING_PING_URL}/${visitor}/${number}`

      const options = {
        method: 'POST',
        headers: {
          'x-as-key': token,
          'Content-type': 'application/json',
        },
      }

      let request = await fetch(url, options)
      this.success = request.status == 200

      this.response = await request.json()

      return this
    } catch (error) {
      return this
    }
  }
}

export default new Ping()
