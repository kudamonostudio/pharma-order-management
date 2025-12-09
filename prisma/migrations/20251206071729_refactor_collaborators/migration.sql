/*
  Warnings:

  - The values [COLABORADOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `profileId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN_SUPREMO', 'TIENDA_ADMIN', 'SUCURSAL_ADMIN');
ALTER TABLE "public"."profiles" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."profiles" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."profiles" ALTER COLUMN "role" SET DEFAULT 'SUCURSAL_ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_profileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."profiles" DROP CONSTRAINT "profiles_storeId_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "profileId",
ADD COLUMN     "collaboratorAssignmentId" INTEGER,
ADD COLUMN     "storeId" INTEGER,
ALTER COLUMN "locationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."profiles" DROP COLUMN "storeId",
ADD COLUMN     "firstName" VARCHAR(100),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" VARCHAR(100),
ALTER COLUMN "role" SET DEFAULT 'SUCURSAL_ADMIN';

-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "withPrices" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."collaborators" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "image" TEXT,
    "phone" VARCHAR(50),
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."collaborator_assignments" (
    "id" SERIAL NOT NULL,
    "collaboratorId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collaborator_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_code_key" ON "public"."collaborators"("code");

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_email_key" ON "public"."collaborators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "collaborator_assignments_collaboratorId_storeId_locationId_key" ON "public"."collaborator_assignments"("collaboratorId", "storeId", "locationId");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_collaboratorAssignmentId_fkey" FOREIGN KEY ("collaboratorAssignmentId") REFERENCES "public"."collaborator_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."collaborator_assignments" ADD CONSTRAINT "collaborator_assignments_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "public"."collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."collaborator_assignments" ADD CONSTRAINT "collaborator_assignments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."collaborator_assignments" ADD CONSTRAINT "collaborator_assignments_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
