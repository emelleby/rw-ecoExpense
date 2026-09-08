import { Storage } from '@google-cloud/storage'

// Accepts every format the service-account key is commonly stored in:
// - PEM armored, single line with literal \n escapes (GCP console default)
// - PEM armored, multiline
// - bare base64 PKCS#8 body, single line or multiline (no BEGIN/END armor)
const normalizePrivateKey = (raw?: string): string | undefined => {
  if (!raw) return undefined
  let key = raw
    .trim()
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/\\n/g, '\n')
    .trim()
  if (!key.startsWith('-----BEGIN')) {
    key = `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----\n`
  }
  return key
}

export const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: normalizePrivateKey(process.env.GOOGLE_CLOUD_PRIVATE_KEY),
  },
})
export const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME
