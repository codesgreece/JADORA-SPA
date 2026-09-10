import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(packages);
}

const schema = z.object({
  name: z.string().min(1),
  maxGirls: z.number().int().positive(),
  durationHrs: z.number().int().positive(),
  price: z.number().positive(),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const data = schema.parse(await req.json());
  const pkg = await prisma.package.create({
    data: {
      ...data,
      description: data.description || "",
      featured: data.featured || false,
      active: data.active ?? true,
      sortOrder: data.sortOrder || 0,
    },
  });
  return NextResponse.json(pkg, { status: 201 });
}
