import type { Prisma } from '@prisma/client'
import type {
  MutationResolvers,
  QueryResolvers,
  ReceiptRelationResolvers,
} from 'types/graphql'
import { v4 as uuidv4 } from 'uuid'

import { SyntaxError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { storage, bucketName } from 'src/lib/storage'

const UPLOAD_URL_EXPIRY_MS = 15 * 60 * 1000

export const receipts: QueryResolvers['receipts'] = () => {
  return db.receipt.findMany()
}

export const receipt: QueryResolvers['receipt'] = ({ id }) => {
  return db.receipt.findUnique({
    where: { id },
  })
}

export const createReceipt: MutationResolvers['createReceipt'] = ({
  input,
}) => {
  return db.receipt.create({
    data: input as Prisma.ReceiptUncheckedCreateInput,
  })
}

export const createUploadUrl: MutationResolvers['createUploadUrl'] = async ({
  contentType,
}) => {
  const isAllowed =
    contentType.startsWith('image/') || contentType === 'application/pdf'
  if (!isAllowed) {
    // SyntaxError messages are passed through to the client even when
    // Redwood masks unexpected errors in production
    throw new SyntaxError('Only images and PDFs can be uploaded as receipts')
  }
  if (!bucketName) {
    throw new SyntaxError(
      'Receipt storage is not configured: GOOGLE_CLOUD_BUCKET_NAME is missing'
    )
  }

  const extension = contentType.split('/')[1] || 'bin'
  const fileName = `receipts/${uuidv4()}.${extension}`

  let uploadUrl: string
  try {
    ;[uploadUrl] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + UPLOAD_URL_EXPIRY_MS,
        contentType,
      })
  } catch (error) {
    logger.error({
      message:
        'Failed to sign receipt upload URL — check GOOGLE_CLOUD_* env vars (must be in the root .env) and the service-account key',
      error,
    })
    throw error
  }

  return {
    uploadUrl,
    fileUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`,
    fileName,
  }
}

export const deleteReceipt: MutationResolvers['deleteReceipt'] = async ({
  id,
  url,
}) => {
  const gcsPrefix = `storage.googleapis.com/${bucketName}/`
  if (bucketName && url && url.includes(gcsPrefix)) {
    const objectPath = url.split(gcsPrefix)[1].split('?')[0]
    try {
      await storage
        .bucket(bucketName)
        .file(objectPath)
        .delete({ ignoreNotFound: true })
    } catch (error) {
      // Storage deletion must never block the DB row deletion
      logger.error({
        message: `Failed to delete receipt object ${objectPath} from storage`,
        error,
      })
    }
  }
  // Legacy Filestack URLs (dead account) are skipped: files are gone anyway.

  if (id === 0) {
    return { success: true }
  }

  const receipt = await db.receipt.delete({ where: { id } })
  return { id: receipt.id, success: true }
}

export const Receipt: ReceiptRelationResolvers = {
  expense: async (_obj, { root }) => {
    const expense = await db.receipt
      .findUnique({ where: { id: root?.id } })
      .Expense()
    return expense as unknown as ReturnType<
      NonNullable<ReceiptRelationResolvers['expense']>
    >
  },
}
