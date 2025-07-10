"use client";
import { useState } from "react";
import { RenderCalendar } from "./RenderCalendar";
import { TimeTable } from "./TimeTable";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const timeZones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
  // ...add more as needed
];

export default function BookingClientWrapper({
  availability,
  selectedDate,
  userName,
  meetingDuration,
}: {
  availability: { day: string; isActive: boolean }[];
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}) {
  const localTz = typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
  const [timeZone, setTimeZone] = useState(localTz);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Select Time Zone:</label>
        <Select value={timeZone} onValueChange={setTimeZone}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeZones.map((tz) => (
              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <RenderCalendar availability={availability} />
      <TimeTable
        selectedDate={selectedDate}
        userName={userName}
        meetingDuration={meetingDuration}
        timeZone={timeZone}
      />
    </div>
  );
}