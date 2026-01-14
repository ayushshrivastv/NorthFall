/*
  Warnings:

  - Added the required column `summarisedObject` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "summarisedObject" TEXT NOT NULL;
