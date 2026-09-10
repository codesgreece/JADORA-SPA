import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEuro(amount: number) {
  return (
    new Intl.NumberFormat("el-GR", {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount) + "€"
  );
}

export function formatGreekDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortGreekDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("el-GR", { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  return { day, month };
}

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "rejected",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Σε αναμονή",
  confirmed: "Επιβεβαιωμένη",
  cancelled: "Ακυρωμένη",
  completed: "Ολοκληρωμένη",
  rejected: "Απορρίφθηκε",
};
