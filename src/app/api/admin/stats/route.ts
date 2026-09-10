import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [
    totalBookings,
    monthBookings,
    pending,
    upcoming,
    recentMessages,
    revenueRows,
    blockedDates,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: { createdAt: { gte: new Date(monthStart) } },
    }),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.booking.findMany({
      where: {
        date: { gte: now.toISOString().slice(0, 10) },
        status: { in: ["pending", "confirmed"] },
      },
      include: { customer: true, package: true },
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
      take: 8,
    }),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.booking.findMany({
      where: {
        status: { in: ["confirmed", "completed"] },
        createdAt: { gte: new Date(monthStart) },
      },
      select: { totalPrice: true },
    }),
    prisma.availabilityBlock.count({ where: { timeSlot: "" } }),
  ]);

  const monthlyRevenue = revenueRows.reduce((sum, b) => sum + b.totalPrice, 0);
  const unreadMessages = await prisma.message.count({ where: { read: false } });

  return NextResponse.json({
    totalBookings,
    monthBookings,
    pending,
    monthlyRevenue,
    unreadMessages,
    blockedDates,
    upcoming,
    recentMessages,
    satisfaction: 98,
  });
}
