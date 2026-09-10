import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [blocks, workingHours, timeSlots] = await Promise.all([
    prisma.availabilityBlock.findMany({ orderBy: { date: "asc" } }),
    prisma.workingHours.findMany({ orderBy: { dayOfWeek: "asc" } }),
    prisma.timeSlotConfig.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return NextResponse.json({ blocks, workingHours, timeSlots });
}

const blockSchema = z.object({
  date: z.string(),
  timeSlot: z.string().optional(),
  reason: z.string().optional(),
  action: z.enum(["block", "unblock"]),
});

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();

  if (body.type === "workingHours") {
    const items = z
      .array(
        z.object({
          dayOfWeek: z.number().int().min(0).max(6),
          startTime: z.string(),
          endTime: z.string(),
          enabled: z.boolean(),
        })
      )
      .parse(body.hours);

    for (const item of items) {
      const existing = await prisma.workingHours.findFirst({
        where: { dayOfWeek: item.dayOfWeek },
      });
      if (existing) {
        await prisma.workingHours.update({
          where: { id: existing.id },
          data: item,
        });
      } else {
        await prisma.workingHours.create({ data: item });
      }
    }
    return NextResponse.json({ ok: true });
  }

  const data = blockSchema.parse(body);
  const timeSlot = data.timeSlot || "";

  if (data.action === "unblock") {
    await prisma.availabilityBlock.deleteMany({
      where: { date: data.date, timeSlot },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.availabilityBlock.upsert({
    where: {
      date_timeSlot: { date: data.date, timeSlot },
    },
    update: { reason: data.reason || "" },
    create: {
      date: data.date,
      timeSlot,
      reason: data.reason || "",
    },
  });

  return NextResponse.json({ ok: true });
}
