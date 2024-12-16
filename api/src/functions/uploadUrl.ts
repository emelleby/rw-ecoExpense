// api/src/functions/uploadUrl/uploadUrl.ts
import { v4 as uuidv4 } from 'uuid'

import { storage, bucketName } from 'src/lib/storage'

export const handler = async ({ body, httpMethod }) => {
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  }
  try {
    // Validate bucket name
    if (!bucketName) {
      throw new Error('Storage bucket name is not configured!')
    }

    // Parse request body
    const { contentType = 'image/jpeg' } = JSON.parse(body || '{}')
    if (!contentType.startsWith('image/')) {
      throw new Error('Invalid content type. Only image uploads are allowed.')
    }

    // Generate unique filename with proper extension
    const extension = contentType.split('/')[1] || 'jpeg'
    const fileName = `receipts/${uuidv4()}.${extension}`
    console.log(`[INFO] Generated filename: ${fileName}`)

    // Get bucket instance and file
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)

    // Generate signed URL for uploading
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    })

    // Generate public URL for accessing the file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`
    console.log(`[INFO] Public URL: ${publicUrl}`)

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      },
      body: JSON.stringify({
        uploadUrl: signedUrl,
        fileUrl: publicUrl,
        fileName,
      }),
    }
  } catch (error) {
    console.error(`[ERROR] Upload URL generation failed: ${error.message}`)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      },
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    }
  }
}

// export const handler = async ({ body }) => {
//   try {
//     // Validate bucket name
//     if (!bucketName) {
//       throw new Error('Storage bucket name not configured')
//     }

//     // Get file info from request
//     const { contentType = 'image/jpeg' } = JSON.parse(body || '{}')

//     // Get bucket instance
//     const bucket = storage.bucket(bucketName)

//     // Generate unique filename with extension
//     const extension = contentType.split('/')[1] || 'jpeg'
//     const fileName = `receipts/${uuidv4()}.${extension}`
//     console.log('Generated filename:', fileName)

//     const file = bucket.file(fileName)

//     // Generate signed URL
//     const [signedUrl] = await file.getSignedUrl({
//       version: 'v4',
//       action: 'write',
//       expires: Date.now() + 15 * 60 * 1000,
//       contentType,
//     })

//     const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`
//     console.log('Public URL:', publicUrl)

//     return {
//       statusCode: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: JSON.stringify({
//         uploadUrl: signedUrl,
//         fileUrl: publicUrl,
//         fileName,
//       }),
//     }
//   } catch (error) {
//     console.error('Upload URL generation failed:', error)
//     return {
//       statusCode: 500,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: JSON.stringify({
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
//       }),
//     }
//   }
// }
