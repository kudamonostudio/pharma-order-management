/*
  Warnings:

  - You are about to drop the column `collaboratorAssignmentId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `orderCode` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `orders` table. All the data in the column will be lost.
  - Added the required column `currency` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneContact` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'IN_PROGRESS';

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_collaboratorAssignmentId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "collaboratorAssignmentId",
DROP COLUMN "date",
DROP COLUMN "deletedAt",
DROP COLUMN "orderCode",
DROP COLUMN "total",
ADD COLUMN     "collaboratorId" INTEGER,
ADD COLUMN     "currency" VARCHAR(10) NOT NULL,
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "items" JSONB NOT NULL,
ADD COLUMN     "phoneContact" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "order_history" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "collaboratorId" INTEGER NOT NULL,
    "fromStatus" VARCHAR(20),
    "toStatus" VARCHAR(20) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborators"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
