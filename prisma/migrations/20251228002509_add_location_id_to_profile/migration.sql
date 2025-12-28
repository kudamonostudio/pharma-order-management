-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "locationId" INTEGER;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
