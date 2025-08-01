-- CreateEnum
CREATE TYPE "public"."roles" AS ENUM ('admin', 'debtor', 'seller');

-- CreateTable
CREATE TABLE "public"."admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "role" "public"."roles" NOT NULL DEFAULT 'admin',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."debtor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "role" "public"."roles" NOT NULL DEFAULT 'debtor',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerId" INTEGER NOT NULL,

    CONSTRAINT "debtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."roles" NOT NULL DEFAULT 'seller',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."borrowedProduct" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "term" TIMESTAMP(3) NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "borrowedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paymentHistory" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."debtroPhoneNumber" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "debtroPhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."borrowedProductImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "borrowedProductId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "borrowedProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" INTEGER NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "debtorId" INTEGER NOT NULL,
    "borrowedProductId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messageSample" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messageSample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "public"."admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seller_name_key" ON "public"."seller"("name");

-- AddForeignKey
ALTER TABLE "public"."debtor" ADD CONSTRAINT "debtor_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowedProduct" ADD CONSTRAINT "borrowedProduct_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paymentHistory" ADD CONSTRAINT "paymentHistory_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."debtroPhoneNumber" ADD CONSTRAINT "debtroPhoneNumber_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowedProductImage" ADD CONSTRAINT "borrowedProductImage_borrowedProductId_fkey" FOREIGN KEY ("borrowedProductId") REFERENCES "public"."borrowedProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_borrowedProductId_fkey" FOREIGN KEY ("borrowedProductId") REFERENCES "public"."borrowedProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messageSample" ADD CONSTRAINT "messageSample_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
