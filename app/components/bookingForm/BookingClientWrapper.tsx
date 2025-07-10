"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { RenderCalendar } from "./RenderCalendar";
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
}: {
  availability: { day: string; isActive: boolean }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeZone, setTimeZone] = useState(() =>
    searchParams.get("timeZone") || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("timeZone", timeZone);
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line
  }, [timeZone]);

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
      <RenderCalendar availability={availability} timeZone={timeZone} />
    </div>
  );
}