import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import {
  persistGalleryImage,
  validateGalleryFile,
} from "@/lib/gallery-storage";
import { toGalleryPublicUrl } from "@/lib/gallery-url";

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(
    images.map((img) => ({ ...img, url: toGalleryPublicUrl(img) }))
  );
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    try {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const caption = String(form.get("caption") || "");
      if (!file) {
        return NextResponse.json(
          { error: "Δεν επιλέχθηκε αρχείο." },
          { status: 400 }
        );
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const validationError = validateGalleryFile(file, bytes);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const url = await persistGalleryImage(file, bytes);
      const count = await prisma.galleryImage.count();
      const image = await prisma.galleryImage.create({
        data: {
          url,
          caption,
          sortOrder: count + 1,
        },
      });
      return NextResponse.json(
        { ...image, url: toGalleryPublicUrl(image) },
        { status: 201 }
      );
    } catch (err) {
      console.error("Gallery upload failed", err);
      return NextResponse.json(
        { error: "Αποτυχία ανεβάσματος. Δοκιμάστε μικρότερη φωτογραφία." },
        { status: 500 }
      );
    }
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
