import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (image.url.startsWith("data:")) {
    const match = /^data:([^;]+);base64,([\s\S]+)$/.exec(image.url);
    if (!match) {
      return NextResponse.json({ error: "Invalid image" }, { status: 500 });
    }
    const buffer = Buffer.from(match[2], "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": match[1],
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  }

  if (image.url.startsWith("http://") || image.url.startsWith("https://")) {
    return NextResponse.redirect(image.url, 302);
  }

  // Local /public paths (seeded SVGs, legacy uploads)
  return NextResponse.redirect(new URL(image.url, req.nextUrl.origin));
}
