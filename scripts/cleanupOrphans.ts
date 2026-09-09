import * as path from 'path'

require('dotenv').config({
  path: path.join(__dirname, '..', '.env'),
  multiline: true,
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { db } = require('api/src/lib/db')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { storage, bucketName } = require('api/src/lib/storage')

export default async () => {
  const referenced = new Set(
    (await db.receipt.findMany({ select: { url: true } })).map((r) => r.url)
  )
  const [files] = await storage
    .bucket(bucketName)
    .getFiles({ prefix: 'receipts/' })

  let deleted = 0
  for (const file of files) {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`
    if (referenced.has(publicUrl)) {
      console.log('KEEP (referenced):', file.name)
      continue
    }
    await file.delete({ ignoreNotFound: true })
    deleted++
    console.log('DELETE (orphan):', file.name)
  }
  console.log(`done: ${deleted} orphan(s) deleted, ${files.length} scanned`)
}
