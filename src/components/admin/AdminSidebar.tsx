"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Users,
  Package,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Κρατήσεις", icon: CalendarDays },
  { href: "/admin/calendar", label: "Ημερολόγιο", icon: CalendarRange },
  { href: "/admin/customers", label: "Πελάτες", icon: Users },
  { href: "/admin/packages", label: "Πακέτα & Τιμές", icon: Package },
  { href: "/admin/services", label: "Υπηρεσίες", icon: Sparkles },
  { href: "/admin/gallery", label: "Φωτογραφίες", icon: ImageIcon },
  { href: "/admin/content", label: "Περιεχόμενο Site", icon: FileText },
  { href: "/admin/settings", label: "Ρυθμίσεις", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="J’ADORA"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full bg-white object-contain"
          />
          <div>
            <div className="font-serif text-lg text-white">J’ADORA</div>
            <div className="text-[10px] uppercase tracking-wider text-white/55">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-glam text-white shadow-lg shadow-glam/20"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Αποσύνδεση
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 rounded-full bg-jadora-dark p-2 text-white lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside className="hidden w-64 shrink-0 bg-jadora-dark lg:block">
        {Nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-jadora-dark shadow-xl">
            {Nav}
          </aside>
        </div>
      )}
    </>
  );
}
