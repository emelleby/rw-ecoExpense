-- AlterTable
ALTER TABLE "User" ADD COLUMN     "homeAddress" VARCHAR(255),
ADD COLUMN     "homeLatitude" DOUBLE PRECISION,
ADD COLUMN     "homeLongitude" DOUBLE PRECISION,
ADD COLUMN     "workAddress" VARCHAR(255),
ADD COLUMN     "workLatitude" DOUBLE PRECISION,
ADD COLUMN     "workLongitude" DOUBLE PRECISION;
