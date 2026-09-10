import { isPdf } from './receipt'

describe('isPdf', () => {
  it('detects PDFs by URL extension', () => {
    expect(isPdf('https://gcs/receipts/abc.pdf')).toBe(true)
  })

  it('detects PDFs when the URL has a query suffix', () => {
    expect(isPdf('https://gcs/receipts/abc.pdf?x=1')).toBe(true)
  })

  it('detects PDFs by MIME string', () => {
    expect(isPdf('application/pdf')).toBe(true)
  })

  it('treats image URLs as not-PDF', () => {
    expect(isPdf('https://gcs/receipts/abc.jpeg')).toBe(false)
  })

  it('treats extension-less (legacy) URLs as not-PDF', () => {
    expect(isPdf('https://cdn.filestackcontent.com/abc123')).toBe(false)
  })
})
