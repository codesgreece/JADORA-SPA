"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { formatGreekDate, cn } from "@/lib/utils";

type Slot = {
  time: string;
  status: "available" | "booked" | "blocked" | "unavailable";
};

const dayNames = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];

export default function AdminCalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthStatuses, setMonthStatuses] = useState<
    Record<string, "available" | "booked" | "unavailable" | "blocked">
  >({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [workingHours, setWorkingHours] = useState<
    { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[]
  >([]);
  const [message, setMessage] = useState("");

  const loadMonth = useCallback(async (y: number, m: number) => {
    const res = await fetch(`/api/availability?year=${y}&month=${m}`);
    const data = await res.json();
    setMonthStatuses(data.days || {});
  }, []);

  const loadMeta = useCallback(async () => {
    const res = await fetch("/api/admin/availability");
    const data = await res.json();
    setWorkingHours(data.workingHours || []);
  }, []);

  useEffect(() => {
    loadMonth(year, month);
    loadMeta();
  }, [year, month, loadMonth, loadMeta]);

  useEffect(() => {
    if (!selectedDate) return;
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []));
  }, [selectedDate]);

  const toggleBlockDate = async () => {
    if (!selectedDate) return;
    const currentlyBlocked = monthStatuses[selectedDate] === "blocked";
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        timeSlot: "",
        action: currentlyBlocked ? "unblock" : "block",
        reason: currentlyBlocked ? "" : "Blocked by admin",
      }),
    });
    setMessage(
      currentlyBlocked
        ? "Η ημερομηνία ξεκλειδώθηκε."
        : "Η ημερομηνία μπλοκαρίστηκε."
    );
    await loadMonth(year, month);
    const d = await fetch(`/api/availability?date=${selectedDate}`).then((r) =>
      r.json()
    );
    setSlots(d.slots || []);
  };

  const toggleSlot = async (time: string, status: string) => {
    if (!selectedDate) return;
    const action = status === "blocked" ? "unblock" : "block";
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        timeSlot: time,
        action,
      }),
    });
    const d = await fetch(`/api/availability?date=${selectedDate}`).then((r) =>
      r.json()
    );
    setSlots(d.slots || []);
    await loadMonth(year, month);
  };

  const saveHours = async () => {
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "workingHours", hours: workingHours }),
    });
    setMessage("Τα ωράρια αποθηκεύτηκαν.");
    await loadMonth(year, month);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Ημερολόγιο</h1>
        <p className="text-sm text-jadora-text/65">
          Διαχείριση διαθεσιμότητας, μπλοκάρισμα ημερομηνιών και ωρών
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-soft p-5">
          <BookingCalendar
            monthStatuses={monthStatuses}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onMonthChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
          {selectedDate && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-primary text-sm" onClick={toggleBlockDate}>
                {monthStatuses[selectedDate] === "blocked"
                  ? "Ξεκλείδωμα ημερομηνίας"
                  : "Μπλοκάρισμα όλης της ημέρας"}
              </button>
            </div>
          )}
        </div>

        <div className="card-soft p-5">
          <h2 className="mb-3 font-serif text-xl text-dark-berry">
            {selectedDate ? formatGreekDate(selectedDate) : "Επίλεξε ημερομηνία"}
          </h2>
          {selectedDate ? (
            <div className="space-y-2">
              {slots.map((slot) => (
                <div
                  key={slot.time}
                  className="flex items-center justify-between rounded-xl border border-[color:var(--soft-pink)]/40 px-3 py-2"
                >
                  <div>
                    <span className="font-medium">{slot.time}</span>
                    <span className="ml-2 text-xs uppercase text-jadora-text/55">
                      {slot.status}
                    </span>
                  </div>
                  {slot.status !== "booked" && (
                    <button
                      type="button"
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        slot.status === "blocked"
                          ? "bg-jadora-light text-mauve"
                          : "bg-dark-berry text-white"
                      )}
                      onClick={() => toggleSlot(slot.time, slot.status)}
                    >
                      {slot.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-jadora-text/55">
              Επίλεξε ημερομηνία για διαχείριση ωρών.
            </p>
          )}
        </div>
      </div>

      <div className="card-soft p-5">
        <h2 className="mb-4 font-serif text-xl text-dark-berry">Ωράριο λειτουργίας</h2>
        <div className="space-y-2">
          {workingHours.map((wh, idx) => (
            <div
              key={wh.dayOfWeek}
              className="grid grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-2 text-sm"
            >
              <span>{dayNames[wh.dayOfWeek]}</span>
              <input
                className="rounded-lg border border-[color:var(--soft-pink)]/50 px-2 py-1"
                value={wh.startTime}
                onChange={(e) => {
                  const next = [...workingHours];
                  next[idx] = { ...wh, startTime: e.target.value };
                  setWorkingHours(next);
                }}
              />
              <input
                className="rounded-lg border border-[color:var(--soft-pink)]/50 px-2 py-1"
                value={wh.endTime}
                onChange={(e) => {
                  const next = [...workingHours];
                  next[idx] = { ...wh, endTime: e.target.value };
                  setWorkingHours(next);
                }}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wh.enabled}
                  onChange={(e) => {
                    const next = [...workingHours];
                    next[idx] = { ...wh, enabled: e.target.checked };
                    setWorkingHours(next);
                  }}
                />
                Ενεργό
              </label>
            </div>
          ))}
        </div>
        <button type="button" className="btn-primary mt-4 text-sm" onClick={saveHours}>
          Αποθήκευση ωραρίου
        </button>
        {message && <p className="mt-2 text-sm text-mauve">{message}</p>}
      </div>
    </div>
  );
}
