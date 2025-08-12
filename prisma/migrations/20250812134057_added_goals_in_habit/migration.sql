-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('STREAK', 'WEEKLY_TARGET', 'MONTHLY_TARGET');

-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "goalDeadline" TIMESTAMP(3),
ADD COLUMN     "goalTarget" INTEGER DEFAULT 7,
ADD COLUMN     "goalType" "GoalType" DEFAULT 'STREAK',
ADD COLUMN     "isGoalActive" BOOLEAN NOT NULL DEFAULT false;
