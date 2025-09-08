/*
  Warnings:

  - You are about to drop the column `curreny` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "curreny",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "subscriptionEndDate" TIMESTAMP(3);
