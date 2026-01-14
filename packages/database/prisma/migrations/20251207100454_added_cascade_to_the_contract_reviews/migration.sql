-- DropForeignKey
ALTER TABLE "public"."ContractGenerationReviews" DROP CONSTRAINT "ContractGenerationReviews_contractId_fkey";

-- AddForeignKey
ALTER TABLE "ContractGenerationReviews" ADD CONSTRAINT "ContractGenerationReviews_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
