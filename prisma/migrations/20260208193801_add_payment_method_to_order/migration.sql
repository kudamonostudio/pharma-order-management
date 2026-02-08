-- CreateEnum
CREATE TYPE "public"."PaymentMethodType" AS ENUM ('WITH_CARD', 'WITH_CASH', 'EITHER');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "paymentMethodType" "public"."PaymentMethodType";
