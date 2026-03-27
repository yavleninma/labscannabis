"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface OpenIndicatorProps {
  openTime?: string;
  closeTime?: string;
}

function isOpen(openTime: string, closeTime: string): boolean {
  const now = new Date();
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
}: OpenIndicatorProps) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(isOpen(openTime, closeTime));
    const interval = setInterval(() => {
      setOpen(isOpen(openTime, closeTime));
    }, 60000);
    return () => clearInterval(interval);
  }, [openTime, closeTime]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span
        className={`h-2 w-2 rounded-full ${
          open ? "bg-emerald-500 animate-pulse-green" : "bg-text-muted"
        }`}
      />
      <span className={open ? "text-emerald-400" : "text-text-muted"}>
        {open ? t("openNow") : t("closed")}
      </span>
    </div>
  );
}
