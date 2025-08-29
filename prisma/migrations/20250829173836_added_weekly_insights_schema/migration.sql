-- CreateTable
CREATE TABLE "WeeklyInsight" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "insights" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklyInsight_userEmail_weekStart_idx" ON "WeeklyInsight"("userEmail", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyInsight_userEmail_weekStart_key" ON "WeeklyInsight"("userEmail", "weekStart");
