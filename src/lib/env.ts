/**
 * Ensure required env defaults exist in serverless environments
 * when Project Environment Variables are not yet configured.
 *
 * CLAIM THIS DATABASE (or it auto-deletes):
 * https://create-db.prisma.io/claim?projectID=proj_ph9u41fpi84zv547bzdra7sn
 */
export function ensureEnvDefaults() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      "jadora-luxury-spa-secret-change-in-production-2026";
  }

  // Prefer custom production domain for auth callbacks
  if (
    !process.env.NEXTAUTH_URL ||
    process.env.NEXTAUTH_URL.includes("vercel.app")
  ) {
    process.env.NEXTAUTH_URL = "https://jadoragirlspa.gr";
  }

  // Active Prisma Postgres — overwrites stale/expired Vercel DATABASE_URL
  // Set FORCE_CUSTOM_DATABASE_URL=1 in Vercel to keep a custom DATABASE_URL.
  const activeDatabaseUrl =
    "postgres://784eb50dd5aba855a7c7fc2e2e52334f78f510f7bac0c2a9146ab464586c158a:sk_XDWtPtb4susAD0r5qf-j1@db.prisma.io:5432/postgres?sslmode=require";

  if (process.env.FORCE_CUSTOM_DATABASE_URL !== "1") {
    process.env.DATABASE_URL = activeDatabaseUrl;
  } else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = activeDatabaseUrl;
  }
}

ensureEnvDefaults();
