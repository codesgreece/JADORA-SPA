import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  body: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone || "",
        subject: data.subject || "",
        body: data.body,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Μη έγκυρα δεδομένα" }, { status: 400 });
  }
}
