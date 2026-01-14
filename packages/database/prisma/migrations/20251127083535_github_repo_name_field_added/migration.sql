/*
  Warnings:

  - You are about to drop the column `githubRepoName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "githubRepoName" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubRepoName";
