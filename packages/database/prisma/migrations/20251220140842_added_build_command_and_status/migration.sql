/*
  Warnings:

  - Added the required column `command` to the `BuildJob` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Command" AS ENUM ('NORTHFALL_BUILD', 'NORTHFALL_TEST', 'NORTHFALL_DEPLOY_DEVNET', 'NORTHFALL_DEPLOY_MAINNET', 'NORTHFALL_VERIFY');

-- AlterTable
ALTER TABLE "BuildJob" ADD COLUMN     "command" "Command" NOT NULL;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "lastBuildStatus" "BuildStatus" DEFAULT 'NEVER_BUILT',
ALTER COLUMN "lastBuildId" DROP NOT NULL;
