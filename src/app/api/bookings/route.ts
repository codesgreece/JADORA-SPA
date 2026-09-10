import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertSlotBookable } from "@/lib/availability";
import { requireAdmin } from "@/lib/admin-guard";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(4),
  packageId: z.string().min(1),
  girlsCount: z.coerce.number().int().min(1).max(50).optional(),
  customerNotes: z.string().optional(),
});

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const pkg = await prisma.package.findFirst({
      where: { id: data.packageId, active: true },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Μη έγκυρο πακέτο" }, { status: 400 });
    }

    if (data.girlsCount && data.girlsCount > pkg.maxGirls) {
      return NextResponse.json(
        { error: `Μέγιστος αριθμός κοριτσιών: ${pkg.maxGirls}` },
        { status: 400 }
      );
    }

    await assertSlotBookable(data.date, data.timeSlot);

    const customer = await prisma.customer.upsert({
      where: { email: data.email.toLowerCase() },
      update: { name: data.name, phone: data.phone },
      create: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
      },
    });

    try {
      const booking = await prisma.booking.create({
        data: {
          customerId: customer.id,
          packageId: pkg.id,
          date: data.date,
          timeSlot: data.timeSlot,
          girlsCount: data.girlsCount || pkg.maxGirls,
          customerNotes: data.customerNotes || "",
          totalPrice: pkg.price,
          status: "pending",
        },
        include: { customer: true, package: true },
      });
      return NextResponse.json(booking, { status: 201 });
    } catch (e: unknown) {
      if (
        typeof e === "object" &&
        e &&
        "code" in e &&
        (e as { code: string }).code === "P2002"
      ) {
        return NextResponse.json(
          { error: "Η ώρα μόλις κλείστηκε. Επίλεξε άλλη." },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Συμπλήρωσε σωστά όλα τα υποχρεωτικά πεδία." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Σφάλμα κράτησης" },
      { status: 400 }
    );
  }
}
