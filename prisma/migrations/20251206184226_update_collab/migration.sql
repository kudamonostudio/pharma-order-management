/*
  Warnings:

  - You are about to drop the column `isActive` on the `collaborators` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `profiles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_locationId_fkey";

-- AlterTable
ALTER TABLE "collaborator_assignments" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "collaborators" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "locationId";
