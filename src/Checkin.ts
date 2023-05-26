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

type CheckinProps = {
  token: string
  data: CheckinData
}

export default class Checkin {
  static async call({ token, data }: CheckinProps): Promise<CheckinResult> {
    const url = `${process.env.CALL_TRACKING_URL}/2/${token}`

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'x-as-key': token,
        'Content-type': 'application/json',
      },
    }

    let request = await fetch(url, options)
    let response = await request.json()

    return response
  }
}
