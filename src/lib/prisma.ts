import "@/lib/env";
import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

function prepareDatabaseUrl() {
  const isServerless =
    process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (!isServerless) return;

  const tmpDir = "/tmp";
  const tmpDb = path.join(tmpDir, "jadora.db");
  const bundled = path.join(process.cwd(), "prisma", "seed.db");

  try {
    if (!existsSync(tmpDb) && existsSync(bundled)) {
      if (!existsSync(tmpDir)) mkdirSync(tmpDir, { recursive: true });
      copyFileSync(bundled, tmpDb);
    }
    if (existsSync(tmpDb)) {
      process.env.DATABASE_URL = `file:${tmpDb}`;
    }
  } catch (err) {
    console.error("Failed to prepare SQLite database for serverless:", err);
  }
}

prepareDatabaseUrl();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
