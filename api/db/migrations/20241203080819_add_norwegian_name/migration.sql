/*
  Warnings:

  - A unique constraint covering the columns `[norName]` on the table `ExpenseCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `norName` to the `ExpenseCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseCategory" ADD COLUMN     "norName" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_norName_key" ON "ExpenseCategory"("norName");
