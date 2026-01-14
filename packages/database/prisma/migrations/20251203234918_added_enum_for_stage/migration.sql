/*
  Warnings:

  - You are about to drop the column `End` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `building` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `creatingFiles` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `finalzing` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `generatingCode` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `planning` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContractGenerationStage" AS ENUM ('PLANNING', 'GENERATING_CODE', 'BUILDING', 'CREATING_FILES', 'FINALIZING', 'END', 'ERROR');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "End",
DROP COLUMN "building",
DROP COLUMN "creatingFiles",
DROP COLUMN "error",
DROP COLUMN "finalzing",
DROP COLUMN "generatingCode",
DROP COLUMN "planning",
ADD COLUMN     "stage" "ContractGenerationStage";

-- DropEnum
DROP TYPE "public"."ContractGenerationPhase";
