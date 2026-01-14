/*
  Warnings:

  - Added the required column `isTemplate` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL;
