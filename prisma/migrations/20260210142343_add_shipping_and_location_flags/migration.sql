-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "shippingAddress" TEXT;

-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "withLocation" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "withShipping" BOOLEAN NOT NULL DEFAULT false;
