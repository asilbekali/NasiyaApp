/*
  Warnings:

  - Added the required column `borrowedProductId` to the `paymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."paymentHistory" ADD COLUMN     "borrowedProductId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."paymentHistory" ADD CONSTRAINT "paymentHistory_borrowedProductId_fkey" FOREIGN KEY ("borrowedProductId") REFERENCES "public"."borrowedProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
