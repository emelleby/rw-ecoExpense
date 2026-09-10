-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "secondaryAmount" DECIMAL(65,30),
ADD COLUMN     "secondaryCurrency" VARCHAR(3),
ADD COLUMN     "secondaryExchangeRate" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "secondaryCurrency" VARCHAR(3);
