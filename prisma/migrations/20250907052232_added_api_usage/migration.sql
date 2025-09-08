-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "ApiType" AS ENUM ('AI_ASSISTANT', 'AI_INSIGHTS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscription" "SubscriptionType" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiType" "ApiType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiUsage_userId_apiType_date_idx" ON "ApiUsage"("userId", "apiType", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ApiUsage_userId_apiType_date_key" ON "ApiUsage"("userId", "apiType", "date");

-- AddForeignKey
ALTER TABLE "ApiUsage" ADD CONSTRAINT "ApiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
