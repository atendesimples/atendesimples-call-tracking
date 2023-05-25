export {}

declare global {
  type CallTrackingProps = {
    token: string
    fallback?: any
    html: {
      event: string
      selector: string
    }
  }

  interface Window {
    AtendeSimples: {
      CallTracking: any
    }
  }
}
