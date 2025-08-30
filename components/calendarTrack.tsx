import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export const CalendarTrack = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Calendar</h2>
      <Calendar
        selected={date}
        onSelect={setDate}
        className="rounded-xl border w-[550px]"
      />
    </div>
  );
};
