/**
 * Ensure required env defaults exist in serverless environments
 * when Project Environment Variables are not yet configured.
 *
 * NOTE: Claim the Prisma DB ASAP so it is not auto-deleted:
 * https://create-db.prisma.io/claim?projectID=proj_ph9u41fpi84zv547bzdra7sn
 */
export function ensureEnvDefaults() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      "jadora-luxury-spa-secret-change-in-production-2026";
  }

  // Prefer custom production domain
  const preferredUrl = "https://jadoragirlspa.gr";
  if (
    !process.env.NEXTAUTH_URL ||
    process.env.NEXTAUTH_URL.includes("jadora-spa.vercel.app") ||
    process.env.NEXTAUTH_URL.includes("vercel.app")
  ) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL?.includes("jadoragirlspa")) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else {
      process.env.NEXTAUTH_URL = preferredUrl;
    }
  }

  // Active Prisma Postgres connection (replaces expired create-db instance)
  const activeDatabaseUrl =
    "postgres://784eb50dd5aba855a7c7fc2e2e52334f78f510f7bac0c2a9146ab464586c158a:sk_XDWtPtb4susAD0r5qf-j1@db.prisma.io:5432/postgres?sslmode=require";

  // Always use active DB unless a non-expired custom URL is intentionally set
  // via FORCE_CUSTOM_DATABASE_URL=1
  if (process.env.FORCE_CUSTOM_DATABASE_URL !== "1") {
    process.env.DATABASE_URL = activeDatabaseUrl;
  } else if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = activeDatabaseUrl;
  }
}

ensureEnvDefaults();
