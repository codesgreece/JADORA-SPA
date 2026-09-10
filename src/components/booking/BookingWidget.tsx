"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingCalendar } from "./BookingCalendar";
import { formatGreekDate, formatEuro, cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { PACKAGE_EXTRAS } from "@/components/public/PackagesSection";

type Package = {
  id: string;
  name: string;
  maxGirls: number;
  durationHrs: number;
  price: number;
  featured: boolean;
};

type Slot = {
  time: string;
  status: "available" | "booked" | "blocked" | "unavailable";
};

type Props = {
  packages: Package[];
  title?: string;
  subtitle?: string;
  embedded?: boolean;
};

type Step = "datetime" | "details" | "success";

export function BookingWidget({
  packages,
  title = "Κλείσε την ημερομηνία σου",
  subtitle = "Επίλεξε ημερομηνία και ώρα για να ζήσεις μια μοναδική εμπειρία!",
  embedded = false,
}: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthStatuses, setMonthStatuses] = useState<
    Record<string, "available" | "booked" | "unavailable" | "blocked">
  >({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages.find((p) => p.featured)?.id || packages[0]?.id || ""
  );
  const [step, setStep] = useState<Step>("datetime");
  const [loading, setLoading] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    girlsCount: 8,
    customerNotes: "",
  });
  const [extras, setExtras] = useState<string[]>([]);

  const loadMonth = useCallback(async (y: number, m: number) => {
    setCalendarLoading(true);
    try {
      const res = await fetch(`/api/availability?year=${y}&month=${m}`);
      if (!res.ok) return;
      const data = await res.json();
      setMonthStatuses(data.days || {});
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMonth(year, month);
  }, [year, month, loadMonth]);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedTime(null);
      return;
    }
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
        setSelectedTime(null);
      });
  }, [selectedDate]);

  const selectedPkg = packages.find((p) => p.id === selectedPackage);

  const submit = async () => {
    setError("");
    if (!selectedDate || !selectedTime || !selectedPackage) {
      setError("Επίλεξε πακέτο, ημερομηνία και ώρα.");
      return;
    }
    setLoading(true);
    try {
      const extrasNote =
        extras.length > 0
          ? `Extras: ${extras
              .map(
                (id) =>
                  PACKAGE_EXTRAS.find((e) => e.id === id)?.title || id
              )
              .join(", ")} (κατόπιν συνεννόησης)`
          : "";
      const customerNotes = [form.customerNotes.trim(), extrasNote]
        .filter(Boolean)
        .join("\n");

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerNotes,
          date: selectedDate,
          timeSlot: selectedTime,
          packageId: selectedPackage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Σφάλμα κράτησης");
      setStep("success");
      // refresh availability so slot shows as booked
      loadMonth(year, month);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Σφάλμα κράτησης");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "card-soft relative z-10 overflow-hidden bg-white",
        embedded ? "p-5" : "p-5 md:p-6"
      )}
    >
      <div className="mb-4">
        <h3 className="font-serif text-xl text-dark-berry flex items-center gap-2">
          {title} <Heart size={14} className="text-mauve fill-mauve/20" />
        </h3>
        <p className="mt-1 text-sm text-jadora-text/70 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {step === "success" ? (
        <div className="soft-scale py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jadora-light text-2xl text-mauve">
            ♡
          </div>
          <h4 className="font-serif text-2xl text-dark-berry">Ευχαριστούμε!</h4>
          <p className="mt-2 text-sm text-jadora-text/75">
            Η κράτησή σου καταχωρήθηκε και θα επιβεβαιωθεί σύντομα.
          </p>
          <button
            type="button"
            className="btn-primary mt-6"
            onClick={() => {
              setStep("datetime");
              setSelectedDate(null);
              setSelectedTime(null);
              setForm({
                name: "",
                email: "",
                phone: "",
                girlsCount: 8,
                customerNotes: "",
              });
              setExtras([]);
            }}
          >
            Νέα κράτηση
          </button>
        </div>
      ) : step === "details" ? (
        <div className="fade-in space-y-3">
          <div className="rounded-2xl bg-jadora-light/60 p-3 text-sm">
            <p className="font-medium text-dark-berry">
              {selectedPkg?.name} · {selectedDate && formatGreekDate(selectedDate)} ·{" "}
              {selectedTime}
            </p>
            <p className="text-jadora-text/70">
              {selectedPkg && formatEuro(selectedPkg.price)}
            </p>
          </div>
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve"
            placeholder="Ονοματεπώνυμο *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve"
            placeholder="Email *"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve"
            placeholder="Τηλέφωνο *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve"
            placeholder="Αριθμός κοριτσιών"
            type="number"
            min={1}
            max={selectedPkg?.maxGirls || 20}
            value={form.girlsCount}
            onChange={(e) =>
              setForm({ ...form, girlsCount: Number(e.target.value) })
            }
          />

          <div className="rounded-2xl border border-[color:var(--soft-pink)]/40 bg-white p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-jadora-text/55">
              Extras (κατόπιν συνεννόησης)
            </p>
            <div className="space-y-2">
              {PACKAGE_EXTRAS.map((extra) => {
                const checked = extras.includes(extra.id);
                return (
                  <label
                    key={extra.id}
                    className="flex cursor-pointer items-start gap-2.5 text-sm text-jadora-text"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-[color:var(--mauve)]"
                      checked={checked}
                      onChange={() =>
                        setExtras((prev) =>
                          checked
                            ? prev.filter((id) => id !== extra.id)
                            : [...prev, extra.id]
                        )
                      }
                    />
                    <span>
                      <span className="font-medium text-dark-berry">
                        {extra.title}
                      </span>
                      <span className="block text-xs text-jadora-text/60">
                        {extra.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <textarea
            className="w-full rounded-xl border border-[color:var(--soft-pink)]/50 bg-white px-3 py-2.5 text-sm outline-none focus:border-mauve"
            placeholder="Σχόλια / ευχές"
            rows={3}
            value={form.customerNotes}
            onChange={(e) =>
              setForm({ ...form, customerNotes: e.target.value })
            }
          />
          {error && <p className="text-sm text-deep-rose">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="rounded-full border border-mauve/30 px-4 py-2.5 text-sm text-mauve"
              onClick={() => setStep("datetime")}
            >
              Πίσω
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              disabled={loading}
              onClick={submit}
            >
              {loading ? "Αποστολή..." : "Ολοκλήρωση κράτησης ♡"}
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-jadora-text/55">
              Πακέτο
            </label>
            <div className="flex flex-col gap-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left text-sm transition",
                    selectedPackage === pkg.id
                      ? "border-mauve bg-jadora-light/80 text-dark-berry"
                      : "border-[color:var(--soft-pink)]/40 hover:border-mauve/40"
                  )}
                >
                  <span className="font-medium">
                    Έως {pkg.maxGirls} κορίτσια · {pkg.durationHrs} ώρες
                  </span>
                  <span className="float-right font-serif text-mauve">
                    {formatEuro(pkg.price)}
                  </span>
                  {pkg.featured && (
                    <span className="mt-1 block text-[10px] uppercase tracking-wide text-glam">
                      Πιο δημοφιλές
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <BookingCalendar
              monthStatuses={monthStatuses}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setError("");
                setSelectedDate(date);
              }}
              onMonthChange={(y, m) => {
                setYear(y);
                setMonth(m);
              }}
              loading={calendarLoading}
            />

            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium capitalize text-dark-berry">
                {selectedDate
                  ? formatGreekDate(selectedDate)
                  : "Επίλεξε ημερομηνία"}
              </p>
              <div className="flex flex-1 flex-col gap-2">
                {selectedDate ? (
                  slots.map((slot) => {
                    const disabled = slot.status !== "available";
                    const selected = selectedTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedTime(slot.time)}
                        className={cn(
                          "time-slot rounded-full border px-3 py-2 text-sm",
                          selected &&
                            "border-transparent bg-[color:var(--mauve)] text-white",
                          !selected &&
                            !disabled &&
                            "border-[color:var(--dark-berry)]/25 bg-white text-dark-berry",
                          disabled &&
                            "cursor-not-allowed border-transparent bg-[#f3ecef] text-[color:var(--muted)] line-through"
                        )}
                      >
                        {slot.time}
                        {slot.status === "booked" && " · κλεισμένο"}
                        {slot.status === "blocked" && " · μη διαθέσιμο"}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-jadora-text/55">
                    Επίλεξε μια διαθέσιμη ημερομηνία από το ημερολόγιο.
                  </p>
                )}
              </div>
              {error && <p className="mt-2 text-sm text-deep-rose">{error}</p>}
              <button
                type="button"
                className="btn-primary mt-4 self-end"
                onClick={() => {
                  if (!selectedPackage || !selectedDate || !selectedTime) {
                    setError("Επίλεξε πακέτο, ημερομηνία και ώρα.");
                    return;
                  }
                  setError("");
                  setStep("details");
                }}
              >
                Συνέχεια →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
