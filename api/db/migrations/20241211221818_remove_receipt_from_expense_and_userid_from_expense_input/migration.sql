/*
  Warnings:

  - You are about to drop the column `receiptFilename` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `receiptPath` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `receiptUploadedAt` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "receiptFilename",
DROP COLUMN "receiptPath",
DROP COLUMN "receiptUploadedAt";
