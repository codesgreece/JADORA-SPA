import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  name: z.string().min(1).optional(),
  maxGirls: z.number().int().positive().optional(),
  durationHrs: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const data = schema.parse(await req.json());
  const pkg = await prisma.package.update({ where: { id }, data });
  return NextResponse.json(pkg);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
