-- AlterTable
ALTER TABLE "User" ADD COLUMN     "iban" VARCHAR(50),
ADD COLUMN     "internationalAccountName" VARCHAR(100),
ADD COLUMN     "internationalBankAddress" VARCHAR(255),
ADD COLUMN     "swiftBic" VARCHAR(20);
