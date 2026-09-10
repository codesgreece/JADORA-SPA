import { prisma } from "./prisma";

export async function getEnabledTimeSlots(): Promise<string[]> {
  const slots = await prisma.timeSlotConfig.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });
  return slots.map((s) => s.time);
}

export async function getDateAvailability(date: string) {
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const working = await prisma.workingHours.findFirst({
    where: { dayOfWeek },
  });

  const slots = await getEnabledTimeSlots();
  const fullDayBlock = await prisma.availabilityBlock.findFirst({
    where: { date, timeSlot: "" },
  });

  const slotBlocks = await prisma.availabilityBlock.findMany({
    where: { date, NOT: { timeSlot: "" } },
  });
  const blockedSlots = new Set(slotBlocks.map((b) => b.timeSlot));

  const bookings = await prisma.booking.findMany({
    where: {
      date,
      status: { in: ["pending", "confirmed"] },
    },
  });
  const bookedSlots = new Set(bookings.map((b) => b.timeSlot));

  if (!working?.enabled || fullDayBlock) {
    return {
      date,
      status: "unavailable" as const,
      slots: slots.map((time) => ({
        time,
        status: "unavailable" as const,
      })),
    };
  }

  const slotStatuses = slots.map((time) => {
    if (blockedSlots.has(time)) {
      return { time, status: "blocked" as const };
    }
    if (bookedSlots.has(time)) {
      return { time, status: "booked" as const };
    }
    if (time < working.startTime || time > working.endTime) {
      return { time, status: "unavailable" as const };
    }
    return { time, status: "available" as const };
  });

  const hasAvailable = slotStatuses.some((s) => s.status === "available");
  const allUnavailable = !hasAvailable;

  return {
    date,
    status: !hasAvailable
      ? slotStatuses.some((s) => s.status === "booked")
        ? ("booked" as const)
        : ("unavailable" as const)
      : ("available" as const),
    slots: slotStatuses,
    allUnavailable,
  };
}

export async function getMonthAvailability(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const results: Record<
    string,
    "available" | "booked" | "unavailable" | "blocked"
  > = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date + "T12:00:00");
    if (d < today) {
      results[date] = "unavailable";
      continue;
    }
    const avail = await getDateAvailability(date);
    if (avail.status === "unavailable") {
      const fullBlock = await prisma.availabilityBlock.findFirst({
        where: { date, timeSlot: "" },
      });
      results[date] = fullBlock ? "blocked" : "unavailable";
    } else {
      results[date] = avail.status;
    }
  }

  return results;
}

export async function assertSlotBookable(date: string, timeSlot: string) {
  const avail = await getDateAvailability(date);
  const slot = avail.slots.find((s) => s.time === timeSlot);
  if (!slot || slot.status !== "available") {
    throw new Error("Η επιλεγμένη ώρα δεν είναι διαθέσιμη.");
  }
}
