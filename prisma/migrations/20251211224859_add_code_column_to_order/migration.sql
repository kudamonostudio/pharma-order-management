/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "collaborators" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "code" VARCHAR(25);

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");
