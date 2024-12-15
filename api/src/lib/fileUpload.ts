// api/src/lib/fileUpload.ts

import { v4 as uuidv4 } from 'uuid'

import { storage, bucketName } from 'src/lib/storage'

export const uploadToGCS = async (fileBuffer: Buffer, originalName: string) => {
  const bucket = storage.bucket(bucketName)

  // Create a unique filename
  const fileExtension = originalName.split('.').pop()
  const fileName = `receipts/${uuidv4()}.${fileExtension}`

  const file = bucket.file(fileName)

  // Set metadata
  const metadata = {
    contentType: getContentType(fileExtension),
    cacheControl: 'public, max-age=31536000',
  }

  try {
    // Upload file to GCS
    await file.save(fileBuffer, {
      metadata,
    })

    // Make the file public (if needed)
    await file.makePublic()

    // Return the public URL
    return `https://storage.googleapis.com/${bucketName}/${fileName}`
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload file to Google Cloud Storage')
  }
}

// Helper to determine content type
const getContentType = (extension: string): string => {
  // Might need to handle .heic files from Apple devices
  const contentTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    pdf: 'application/pdf',
    // Add more as needed
  }
  return contentTypes[extension.toLowerCase()] || 'application/octet-stream'
}
