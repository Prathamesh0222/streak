-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripeSubscriptionId" TEXT,
ALTER COLUMN "stripeSessionId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_stripeSubscriptionId_idx" ON "Payment"("stripeSubscriptionId");
