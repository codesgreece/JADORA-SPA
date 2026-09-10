import { NextRequest, NextResponse } from "next/server";
import {
  getDateAvailability,
  getMonthAvailability,
} from "@/lib/availability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (date) {
    const availability = await getDateAvailability(date);
    return NextResponse.json(availability);
  }

  if (year && month) {
    const days = await getMonthAvailability(Number(year), Number(month));
    return NextResponse.json({ days });
  }

  return NextResponse.json({ error: "Missing params" }, { status: 400 });
}
