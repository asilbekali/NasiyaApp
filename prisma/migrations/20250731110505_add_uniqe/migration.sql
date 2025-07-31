/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `seller` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seller_name_key" ON "public"."seller"("name");
