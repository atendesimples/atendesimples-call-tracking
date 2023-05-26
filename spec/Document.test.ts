import { describe, it, expect } from 'vitest'

import Document from '@/Document'
import { clearAllCookie } from './utils'

describe('#googleClientId', () => {
  it('should return a string', () => {
    document.cookie = '_ga=GA1.1.553524416.1685026105;OptanonAlertBoxClosed=2023-02-01T15:12:04.164Z'

    expect(Document.cid()).toBe('553524416.1685026105')
  })

  it('should return a empty string', () => {
    clearAllCookie()

    expect(Document.cid()).toBe('')
  })
})
