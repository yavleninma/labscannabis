"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface OpenIndicatorProps {
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
}

function isOpen(openTime: string, closeTime: string, now: Date): boolean {
  const bangkokTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  const hours = bangkokTime.getHours();
  const minutes = bangkokTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function OpenIndicator({
  openTime = "12:00",
  closeTime = "01:00",
  isOpen24h = false,
}: OpenIndicatorProps) {
  const t = useTranslations("header");
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());
  const open =
    isOpen24h || openTime === closeTime || isOpen(openTime, closeTime, new Date(currentTimestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const statusLabel = open ? t("openNow") : t("closed");

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm" aria-label={statusLabel}>
      <span
        className={`h-2 w-2 rounded-full ${
          open ? "bg-emerald-500 animate-pulse-green" : "bg-text-muted"
        }`}
      />
      <span className={`${open ? "text-emerald-400" : "text-text-muted"} hidden sm:inline`}>
        {statusLabel}
      </span>
    </div>
  );
}
