import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro, formatShortGreekDate, STATUS_LABELS, type BookingStatus } from "@/lib/utils";
import {
  CalendarDays,
  Users,
  Euro,
  MessageCircle,
  Heart,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const today = now.toISOString().slice(0, 10);

  const [
    totalBookings,
    monthBookings,
    pending,
    upcoming,
    recentMessages,
    revenueRows,
    unreadMessages,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: { createdAt: { gte: new Date(monthStart) } },
    }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({
      where: {
        date: { gte: today },
        status: { in: ["pending", "confirmed"] },
      },
      include: { customer: true, package: true },
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
      take: 6,
    }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "completed"] },
        createdAt: { gte: new Date(monthStart) },
      },
      select: { totalPrice: true },
    }),
    prisma.message.count({ where: { read: false } }),
  ]);

  const monthlyRevenue = revenueRows.reduce((s, b) => s + b.totalPrice, 0);

  const stats = [
    {
      label: "Συνολικές κρατήσεις",
      value: String(totalBookings),
      icon: CalendarDays,
    },
    {
      label: "Νέες αυτόν τον μήνα",
      value: String(monthBookings),
      icon: Users,
    },
    {
      label: "Έσοδα μήνα",
      value: formatEuro(monthlyRevenue),
      icon: Euro,
    },
    {
      label: "Νέα μηνύματα",
      value: String(unreadMessages),
      icon: MessageCircle,
    },
    {
      label: "Ικανοποίηση",
      value: "98%",
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-dark-berry">Dashboard</h1>
        <p className="text-sm text-jadora-text/65">
          Καλώς ήρθες πίσω! {pending > 0 && `· ${pending} σε αναμονή`}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-soft flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-jadora-light text-mauve">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-jadora-text/55">{label}</p>
              <p className="font-serif text-2xl text-dark-berry">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_0.9fr]">
        <section className="card-soft p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-dark-berry">Επερχόμενες κρατήσεις</h2>
            <Link href="/admin/bookings" className="text-sm text-mauve">
              Όλες →
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.length === 0 && (
              <p className="text-sm text-jadora-text/55">Δεν υπάρχουν επερχόμενες κρατήσεις.</p>
            )}
            {upcoming.map((b) => {
              const { day, month } = formatShortGreekDate(b.date);
              return (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-[color:var(--soft-pink)]/30 p-3 transition hover:bg-jadora-light/40"
                >
                  <div className="flex h-14 w-12 flex-col items-center justify-center rounded-xl bg-jadora-dark text-white">
                    <span className="text-lg font-semibold leading-none">{day}</span>
                    <span className="text-[10px] uppercase">{month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-dark-berry">
                      {b.customer.name}
                    </p>
                    <p className="text-xs text-jadora-text/60">
                      {b.timeSlot} · {b.girlsCount} κορίτσια · {b.package.name}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] status-${b.status}`}
                  >
                    {STATUS_LABELS[b.status as BookingStatus] || b.status}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card-soft p-5">
          <h2 className="mb-4 font-serif text-xl text-dark-berry">Γρήγορες ενέργειες</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/bookings", label: "Προσθήκη / διαχείριση κράτησης" },
              { href: "/admin/packages", label: "Επεξεργασία πακέτων" },
              { href: "/admin/gallery", label: "Ανέβασμα φωτογραφιών" },
              { href: "/admin/content", label: "Επεξεργασία κειμένων" },
              { href: "/admin/calendar", label: "Ρυθμίσεις διαθεσιμότητας" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="block rounded-xl border border-[color:var(--soft-pink)]/40 px-4 py-3 text-sm text-dark-berry transition hover:border-mauve hover:bg-jadora-light/50"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="card-soft p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-dark-berry">Μηνύματα</h2>
            <Link href="/admin/settings#messages" className="text-sm text-mauve">
              Όλα →
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((m) => (
              <div key={m.id} className="rounded-xl bg-jadora-light/40 p-3">
                <p className="text-sm font-medium text-dark-berry">{m.name}</p>
                <p className="line-clamp-2 text-xs text-jadora-text/65">{m.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
