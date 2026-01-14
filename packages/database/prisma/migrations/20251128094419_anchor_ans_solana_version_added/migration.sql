/*
  Warnings:

  - The `tags` column on the `Template` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `anchorVersion` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `solanaVersion` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "anchorVersion" TEXT NOT NULL,
ADD COLUMN     "solanaVersion" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];
