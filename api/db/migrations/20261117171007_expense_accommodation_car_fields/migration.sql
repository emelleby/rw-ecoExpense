-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "accommodationType" VARCHAR(50),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "fuelConsumption" DOUBLE PRECISION,
ADD COLUMN     "nights" INTEGER,
ADD COLUMN     "numberOfPeople" INTEGER,
ADD COLUMN     "passengers" INTEGER,
ADD COLUMN     "trailer" BOOLEAN;
