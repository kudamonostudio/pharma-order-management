-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."collaborators" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50),
    "image" TEXT,
    "phone" VARCHAR(50),
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_code_key" ON "public"."collaborators"("code");

-- CreateIndex
CREATE UNIQUE INDEX "collaborators_email_key" ON "public"."collaborators"("email");
