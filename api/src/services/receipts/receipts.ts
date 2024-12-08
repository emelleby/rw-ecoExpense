import type {
  QueryResolvers,
  MutationResolvers,
  ReceiptRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { uploadToGCS } from 'src/lib/fileUpload'
import { storage, bucketName } from 'src/lib/storage'

export const receipts: QueryResolvers['receipts'] = () => {
  return db.receipt.findMany()
}

export const receipt: QueryResolvers['receipt'] = ({ id }) => {
  return db.receipt.findUnique({
    where: { id },
  })
}

// export const createReceipt: MutationResolvers['createReceipt'] = ({
//   input,
// }) => {
//   return db.receipt.create({
//     data: input,
//   })
// }

export const createReceipt = async ({ file, expenseId }) => {
  const expense = await db.expense.findUnique({
    where: { id: expenseId },
    include: { user: true },
  })
  if (!expense) {
    throw new Error('Expense not found')
  }
  const fileUrl = await uploadToGCS(file.buffer, file.originalname)

  return db.receipt.create({
    data: {
      url: fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype,
      expense: {
        connect: { id: expenseId },
      },
    },
  })
}

export const updateReceipt: MutationResolvers['updateReceipt'] = ({
  id,
  input,
}) => {
  return db.receipt.update({
    data: input,
    where: { id },
  })
}

// export const deleteReceipt: MutationResolvers['deleteReceipt'] = ({ id }) => {
//   return db.receipt.delete({
//     where: { id },
//   })
// }

export const deleteReceipt: MutationResolvers['deleteReceipt'] = async ({
  id,
}) => {
  const receipt = await db.receipt.findUnique({
    where: { id },
  })
  if (receipt) {
    // Delete from GCS
    const fileName = receipt.url.split('/').pop()
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)

    try {
      await file.delete()
    } catch (error) {
      console.error('Failed to delete file from GCS:', error)
    }
    // Delete from database
    return db.receipt.delete({
      where: { id },
    })
  }
}

export const Receipt: ReceiptRelationResolvers = {
  expense: (_obj, { root }) => {
    return db.receipt.findUnique({ where: { id: root?.id } }).expense()
  },
}
