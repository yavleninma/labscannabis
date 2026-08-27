import type { Locale } from "@/lib/i18n";
import { getPublishableHours, type OpeningHours } from "@/data/site";
import { renderCopy } from "@/data/area-copy";
import { t } from "@/lib/ui";

/**
 * Opening hours: the publishable view and the "open now" contract.
 *
 * Everything here goes through `getPublishableHours()`, which returns `null`
 * while the owner has not confirmed the real schedule (O-01). That is the whole
 * point of the module: the mechanism is finished and testable, and it renders
 * nothing at all today. A visitor who reads "Open now" and finds a closed door
 * loses an evening; a visitor who reads nothing loses one WhatsApp message.
 *
 * The status itself cannot be computed at build time — a static page built at
 * 09:00 would freeze that answer for everyone. It is computed in the browser,
 * always in `HOURS.tz` and never in the device time zone: a tourist whose phone
 * is still on Moscow or Seoul time must see Pattaya's answer, not their own.
 */

/** "HH:MM" as minutes since local midnight, or `null` if it is not a valid time. */
export function parseTimeToMinutes(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export interface HoursView {
  hours: OpeningHours;
  /** "Daily 12:00 – 01:00" in the locale's language. */
  line: string;
  /** Badge copy for the two states; the browser picks one and fills `{open}`/`{close}`. */
  openLabel: string;
  closedLabel: string;
  opensMinutes: number;
  closesMinutes: number;
}

/**
 * Everything a component needs to render hours, or `null` when there is nothing
 * honest to render. Callers must not reach into `HOURS` directly — half a fact
 * ("Daily 12:00 – ") is worse than none.
 */
export function getHoursView(locale: Locale): HoursView | null {
  const hours = getPublishableHours();
  if (!hours) return null;
  const opensMinutes = parseTimeToMinutes(hours.opens);
  const closesMinutes = parseTimeToMinutes(hours.closes);
  if (opensMinutes === null || closesMinutes === null) return null;

  const ui = t(locale);
  const vars = { open: hours.opens, close: hours.closes };
  return {
    hours,
    line: renderCopy(ui.location.hours, vars),
    openLabel: renderCopy(ui.location.openNow, vars),
    closedLabel: renderCopy(ui.location.closedNow, vars),
    opensMinutes,
    closesMinutes,
  };
}

/**
 * `openingHoursSpecification` for JSON-LD, or `null` while the hours are
 * unconfirmed. schema.org allows `closes` earlier than `opens` for a window that
 * crosses midnight, so no second entry is needed for the after-midnight hour.
 *
 * The record describes one window that repeats every day. A different weekend
 * schedule or holiday closures would need separate entries — that is part of
 * what O-01 has to confirm before any of this is emitted.
 */
const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export function getOpeningHoursSpecification(): Record<string, unknown>[] | null {
  const hours = getPublishableHours();
  if (!hours) return null;
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...ALL_DAYS],
      opens: hours.opens,
      closes: hours.closes,
    },
  ];
}
