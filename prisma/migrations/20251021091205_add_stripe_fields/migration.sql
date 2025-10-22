/*
  Warnings:

  - Added the required column `stripeCustomerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeInvoiceId" TEXT;

-- CreateIndex
CREATE INDEX "Payment_stripeCustomerId_stripeInvoiceId_idx" ON "Payment"("stripeCustomerId", "stripeInvoiceId");
