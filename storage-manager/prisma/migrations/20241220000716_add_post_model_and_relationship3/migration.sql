-- DropForeignKey
ALTER TABLE "StoreChain" DROP CONSTRAINT "StoreChain_createdById_fkey";

-- AlterTable
ALTER TABLE "StoreChain" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StoreChain" ADD CONSTRAINT "StoreChain_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
