import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Το όνομα είναι υποχρεωτικό"),
  email: z.string().email("Μη έγκυρο email"),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  body: z.string().min(5, "Το μήνυμα είναι πολύ μικρό"),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const message = await prisma.message.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: (data.phone || "").trim(),
        subject: (data.subject || "").trim() || "Μήνυμα επικοινωνίας",
        body: data.body.trim(),
        read: false,
      },
    });
    return NextResponse.json(
      {
        id: message.id,
        ok: true,
        message: "Το μήνυμα καταχωρήθηκε επιτυχώς.",
      },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message || "Μη έγκυρα δεδομένα" },
        { status: 400 }
      );
    }
    console.error("Contact form error:", e);
    return NextResponse.json(
      { error: "Σφάλμα αποστολής. Δοκίμασε ξανά." },
      { status: 500 }
    );
  }
}
