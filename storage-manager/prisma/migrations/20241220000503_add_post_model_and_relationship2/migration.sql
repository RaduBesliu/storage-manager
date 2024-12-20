-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_createdById_fkey";

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "createdById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
