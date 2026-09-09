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
  // Uploads land in `pending/` first. If the expense is never saved, a bucket
  // lifecycle rule (infra/gcs-lifecycle.json) deletes stale pending objects.
  // On save, finalizePendingReceipt() moves the object to `receipts/`.
  const fileName = `receipts/pending/${uuidv4()}.${extension}`

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

const gcsUrlPrefix = () => `storage.googleapis.com/${bucketName}/`

// Called on expense save. Moves a freshly uploaded object from
// `receipts/pending/` to `receipts/` (where objects are permanent) and
// returns the final URL. URLs outside the pending prefix pass through
// unchanged, so editing an expense with an existing receipt is a no-op.
export const finalizePendingReceipt = async (url: string): Promise<string> => {
  const pendingMarker = 'receipts/pending/'
  if (!url || !url.includes(pendingMarker) || !bucketName) {
    return url
  }

  const pendingPath = url.split(gcsUrlPrefix())[1]?.split('?')[0]
  if (!pendingPath) {
    return url
  }

  const finalPath = pendingPath.replace(pendingMarker, 'receipts/')
  const bucket = storage.bucket(bucketName)

  try {
    await bucket.file(pendingPath).copy(bucket.file(finalPath))
  } catch (error) {
    const notFound = (error as { code?: number })?.code === 404
    if (notFound) {
      // Pending object already removed by the lifecycle rule
      throw new SyntaxError(
        'The uploaded receipt has expired and must be uploaded again'
      )
    }
    logger.error({
      message: `Failed to finalize pending receipt ${pendingPath}`,
      error,
    })
    throw error
  }

  await bucket
    .file(pendingPath)
    .delete({ ignoreNotFound: true })
    .catch((error) => {
      // Lifecycle rule will clean it up eventually; never block the save
      logger.warn({
        message: `Failed to delete pending receipt ${pendingPath} after copy`,
        error,
      })
    })

  return url.replace(pendingMarker, 'receipts/')
}

// Shared storage deletion used by deleteReceipt and deleteExpense. Never
// throws: a failed object deletion must not block DB writes.
export const deleteReceiptObject = async (url?: string | null) => {
  if (!bucketName || !url || !url.includes(gcsUrlPrefix())) {
    return
  }
  const objectPath = url.split(gcsUrlPrefix())[1]?.split('?')[0]
  if (!objectPath) {
    return
  }
  try {
    await storage
      .bucket(bucketName)
      .file(objectPath)
      .delete({ ignoreNotFound: true })
  } catch (error) {
    logger.error({
      message: `Failed to delete receipt object ${objectPath} from storage`,
      error,
    })
  }
}

export const deleteReceipt: MutationResolvers['deleteReceipt'] = async ({
  id,
  url,
}) => {
  await deleteReceiptObject(url)
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
