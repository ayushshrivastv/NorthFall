/*
  Warnings:

  - Added the required column `plannerContext` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ChatRole" ADD VALUE 'PLAN';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "plannerContext" TEXT NOT NULL;
