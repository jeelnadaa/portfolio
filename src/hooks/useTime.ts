"use client";

import { useEffect, useState } from "react";

export function useBengaluruTime() {
  const [timeStr, setTimeStr] = useState("BLR --:--");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formatted = new Intl.DateTimeFormat("en-GB", options).format(now);
        setTimeStr(`BLR ${formatted}`);
      } catch {
        setTimeStr("BLR 17:30");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeStr;
}
