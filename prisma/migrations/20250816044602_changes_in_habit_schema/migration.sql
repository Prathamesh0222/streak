/*
  Warnings:

  - You are about to drop the column `goalDeadline` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `goalType` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "goalDeadline",
DROP COLUMN "goalType";

-- DropEnum
DROP TYPE "GoalType";
