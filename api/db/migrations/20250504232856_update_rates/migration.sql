-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_customerId_fkey";

-- AlterTable
ALTER TABLE "Rate" ADD COLUMN     "internal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organizationId" INTEGER,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
