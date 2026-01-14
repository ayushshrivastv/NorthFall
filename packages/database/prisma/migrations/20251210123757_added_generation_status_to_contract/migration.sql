-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('IDLE', 'GENERATING');

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "generationStatus" "GenerationStatus" NOT NULL DEFAULT 'IDLE';
