/*
  Warnings:

  - You are about to drop the column `userId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "userId",
ADD COLUMN     "profileId" UUID;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "storeId" INTEGER;

-- DropTable
DROP TABLE "public"."users";

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "public"."profiles"("email");

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
