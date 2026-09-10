import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  const customer = await prisma.customer.update({
    where: { id: body.id },
    data: {
      name: body.name,
      phone: body.phone,
      notes: body.notes,
    },
  });
  return NextResponse.json(customer);
}
