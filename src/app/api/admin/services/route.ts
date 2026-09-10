import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(services);
}

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const data = schema.parse(await req.json());
  const service = await prisma.service.create({
    data: {
      title: data.title,
      description: data.description || "",
      icon: data.icon || "sparkles",
      active: data.active ?? true,
      sortOrder: data.sortOrder || 0,
    },
  });
  return NextResponse.json(service, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = z
    .object({
      order: z.array(z.object({ id: z.string(), sortOrder: z.number() })),
    })
    .parse(await req.json());

  await Promise.all(
    body.order.map((item) =>
      prisma.service.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
