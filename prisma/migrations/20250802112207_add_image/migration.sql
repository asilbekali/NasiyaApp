-- CreateTable
CREATE TABLE "public"."debtor_image" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "debtorId" INTEGER NOT NULL,

    CONSTRAINT "debtor_image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."debtor_image" ADD CONSTRAINT "debtor_image_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
