// api/src/functions/uploadUrl/uploadUrl.ts
import { v4 as uuidv4 } from 'uuid'

import { storage, bucketName } from 'src/lib/storage'
export const handler = async () => {
  const bucket = storage.bucket(bucketName)
  const fileName = `receipts/${uuidv4()}`
  const file = bucket.file(fileName)
  // Generate signed URL for direct upload
  const [signedUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // Might need to handle .heic files from Apple devices via a converting function
    contentType: 'image/jpeg', // Adjust based on your needs
  })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow CORS from any origin
    },
    body: JSON.stringify({
      uploadUrl: signedUrl,
      fileUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`,
    }),
  }
}
