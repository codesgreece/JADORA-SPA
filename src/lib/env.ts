/**
 * Ensure required env defaults exist in serverless environments
 * when Project Environment Variables are not yet configured.
 */
export function ensureEnvDefaults() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      "jadora-luxury-spa-secret-change-in-production-2026";
  }
  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    } else if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
      process.env.NEXTAUTH_URL = "https://jadora-spa.vercel.app";
    }
  }
  // Persistent Prisma Postgres (claim at create-db.prisma.io if prompted)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgres://13f178cc67fb4d57976e6d8bb894222ec5af3111fbee4f7e271dca3d0b8bd749:sk_DvG3xx5a8OOgNt3AmEdCU@db.prisma.io:5432/postgres?sslmode=require";
  }
}

ensureEnvDefaults();
