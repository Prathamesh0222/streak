-- DropForeignKey
ALTER TABLE "HabitLogs" DROP CONSTRAINT "HabitLogs_habitId_fkey";

-- AddForeignKey
ALTER TABLE "HabitLogs" ADD CONSTRAINT "HabitLogs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
