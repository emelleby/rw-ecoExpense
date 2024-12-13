import * as Filestack from 'filestack-js'
import type {
  QueryResolvers,
  MutationResolvers,
  ReceiptRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { uploadToGCS } from 'src/lib/fileUpload'
import { logger } from 'src/lib/logger'
import { storage, bucketName } from 'src/lib/storage'

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
    data: input,
  })
}

// export const createReceipt = async ({ file, expenseId }) => {
//   const expense = await db.expense.findUnique({
//     where: { id: expenseId },
//     include: { user: true },
//   })
//   if (!expense) {
//     throw new Error('Expense not found')
//   }
//   const fileUrl = await uploadToGCS(file.buffer, file.originalname)

//   return db.receipt.create({
//     data: {
//       url: fileUrl,
//       fileName: file.originalname,
//       fileType: file.mimetype,
//       expense: {
//         connect: { id: expenseId },
//       },
//     },
//   })
// }

// export const updateReceipt: MutationResolvers['updateReceipt'] = ({
//   id,
//   input,
// }) => {
//   return db.receipt.update({
//     data: input,
//     where: { id },
//   })
// }

// export const deleteReceipt: MutationResolvers['deleteReceipt'] = ({ id }) => {
//   return db.receipt.delete({
//     where: { id },
//   })
// }

export const deleteReceipt: MutationResolvers['deleteReceipt'] = async ({
  id,
}) => {
  const client = Filestack.init(process.env.REDWOOD_ENV_FILESTACK_API_KEY)
  console.log('deleteReceipt')
  const receipt = await db.receipt.findUnique({
    where: { id },
  })

  // The `security.handle` is the unique part of the Filestack file's url.
  const handle = receipt.url.split('/').pop()
  logger.debug({
    message: '===== The handle is =====',
    handle,
  })

  const security = Filestack.getSecurity(
    {
      // We set `expiry` at `now() + 5 minutes`.
      expiry: new Date().getTime() + 5 * 60 * 1000,
      handle,
      call: ['remove'],
    },
    process.env.REDWOOD_ENV_FILESTACK_SECRET
  )
  logger.debug({
    message: '===== The handle is =====',
    handle,
  })
  logger.debug({
    message: '===== The security is =====',
    security,
  })
  await client.remove(handle, security)

  return db.receipt.delete({ where: { id } })
}

export const Receipt: ReceiptRelationResolvers = {
  expense: (_obj, { root }) => {
    return db.receipt.findUnique({ where: { id: root?.id } }).expense()
  },
}
