/*
  Warnings:

  - Added the required column `imageUrl` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ChatRole" ADD VALUE 'TEMPLATE';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
