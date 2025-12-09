-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "locationId" INTEGER,
ADD COLUMN     "storeId" INTEGER;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
