import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const caption = String(form.get("caption") || "");
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);

    const count = await prisma.galleryImage.count();
    const image = await prisma.galleryImage.create({
      data: {
        url: `/uploads/${filename}`,
        caption,
        sortOrder: count + 1,
      },
    });
    return NextResponse.json(image, { status: 201 });
  }

  const data = z
    .object({
      url: z.string().min(1),
      caption: z.string().optional(),
      active: z.boolean().optional(),
      sortOrder: z.number().optional(),
    })
    .parse(await req.json());

  const image = await prisma.galleryImage.create({
    data: {
      url: data.url,
      caption: data.caption || "",
      active: data.active ?? true,
      sortOrder: data.sortOrder || 0,
    },
  });
  return NextResponse.json(image, { status: 201 });
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
      prisma.galleryImage.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
