import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { BOOKING_STATUSES } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { customer: true, package: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(booking);
}

const updateSchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  date: z.string().optional(),
  timeSlot: z.string().optional(),
  packageId: z.string().optional(),
  girlsCount: z.number().int().optional(),
  adminNotes: z.string().optional(),
  totalPrice: z.number().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = updateSchema.parse(await req.json());
  const nextDate = body.date || existing.date;
  const nextTime = body.timeSlot || existing.timeSlot;

  if (
    (body.date || body.timeSlot) &&
    (nextDate !== existing.date || nextTime !== existing.timeSlot)
  ) {
    const conflict = await prisma.booking.findFirst({
      where: {
        date: nextDate,
        timeSlot: nextTime,
        id: { not: id },
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Υπάρχει ήδη κράτηση σε αυτή την ώρα." },
        { status: 409 }
      );
    }
    const block = await prisma.availabilityBlock.findFirst({
      where: {
        date: nextDate,
        OR: [{ timeSlot: "" }, { timeSlot: nextTime }],
      },
    });
    if (block) {
      return NextResponse.json(
        { error: "Η ώρα είναι μπλοκαρισμένη." },
        { status: 409 }
      );
    }
  }

  if (body.packageId) {
    const pkg = await prisma.package.findUnique({
      where: { id: body.packageId },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: body,
    include: { customer: true, package: true },
  });
  return NextResponse.json(booking);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
