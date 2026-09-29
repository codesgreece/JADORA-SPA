import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const status = new URL(req.url).searchParams.get("status");
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    include: { customer: true, package: true },
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
  });
  return NextResponse.json(bookings);
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Οι online κρατήσεις έχουν απενεργοποιηθεί. Επικοινωνήστε μαζί μας μέσω φόρμας.",
    },
    { status: 410 }
  );
}
