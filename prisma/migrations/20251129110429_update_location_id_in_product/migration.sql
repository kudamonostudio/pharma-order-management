-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_locationId_fkey";

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
