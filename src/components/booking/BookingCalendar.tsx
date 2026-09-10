"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { el } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DayStatus = "available" | "booked" | "unavailable" | "blocked";

type Props = {
  monthStatuses: Record<string, DayStatus>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
  loading?: boolean;
  compact?: boolean;
};

export function BookingCalendar({
  monthStatuses,
  selectedDate,
  onSelectDate,
  onMonthChange,
  loading = false,
  compact = false,
}: Props) {
  const initial = selectedDate
    ? new Date(selectedDate + "T12:00:00")
    : new Date();
  const [current, setCurrent] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1)
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [current]);

  // Keep parent month in sync on mount
  useEffect(() => {
    onMonthChange?.(current.getFullYear(), current.getMonth() + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMonth = (next: Date) => {
    setCurrent(next);
    onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
  };

  const weekDays = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"];
  const ready = Object.keys(monthStatuses).length > 0;

  return (
    <div className={cn("relative w-full", compact ? "text-sm" : "")}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 text-sm text-mauve">
          Φόρτωση...
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className="rounded-full p-1.5 text-dark-berry transition hover:bg-jadora-light"
          onClick={() => changeMonth(subMonths(current, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-serif text-lg capitalize text-dark-berry">
          {format(current, "LLLL yyyy", { locale: el })}
        </h3>
        <button
          type="button"
          aria-label="Next month"
          className="rounded-full p-1.5 text-dark-berry transition hover:bg-jadora-light"
          onClick={() => changeMonth(addMonths(current, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-[color:var(--muted)]">
        {weekDays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, current);
          const status = ready
            ? monthStatuses[key] || "unavailable"
            : "unavailable";
          const selected = selectedDate === key;
          const isToday = isSameDay(day, new Date());
          const clickable =
            ready &&
            inMonth &&
            (status === "available" || status === "booked");

          return (
            <button
              key={key}
              type="button"
              disabled={!clickable}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (clickable) onSelectDate(key);
              }}
              className={cn(
                "calendar-day relative flex h-10 w-full flex-col items-center justify-center rounded-full text-sm touch-manipulation",
                !inMonth && "pointer-events-none opacity-0",
                selected && "bg-[color:var(--mauve)] font-semibold text-white",
                !selected &&
                  status === "blocked" &&
                  "bg-[color:var(--dark-berry)] text-white/90",
                !selected && status === "booked" && "font-medium text-dark-berry",
                !selected &&
                  status === "unavailable" &&
                  "text-[color:var(--muted)]",
                !selected &&
                  status === "available" &&
                  "cursor-pointer text-jadora-text hover:bg-jadora-light active:bg-[color:var(--soft-pink)]",
                isToday && !selected && "ring-1 ring-[color:var(--soft-pink)]"
              )}
            >
              <span className="pointer-events-none">{format(day, "d")}</span>
              {inMonth && status === "available" && !selected && (
                <span className="pointer-events-none absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[color:var(--soft-pink)]" />
              )}
              {inMonth && status === "booked" && !selected && (
                <span className="pointer-events-none absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[color:var(--dark-berry)]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-jadora-text/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--soft-pink)]" />{" "}
          Διαθέσιμο
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--dark-berry)]" />{" "}
          Κλεισμένο
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[color:var(--unavailable)]" />{" "}
          Μη διαθέσιμο
        </span>
      </div>
    </div>
  );
}
