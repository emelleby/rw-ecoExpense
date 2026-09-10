// GCS objects are named `<uuid>.pdf` / `.jpeg` from the upload MIME type, so the
// URL extension is reliable. Also accepts a raw MIME string.
export const isPdf = (urlOrType: string) =>
  urlOrType === 'application/pdf' || /\.pdf(\?|$)/i.test(urlOrType)
