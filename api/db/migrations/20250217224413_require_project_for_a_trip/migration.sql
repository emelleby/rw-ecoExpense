/*
  Warnings:

  - Made the column `projectId` on table `Trip` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_projectId_fkey";

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
