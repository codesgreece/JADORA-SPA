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
      process.env.NEXTAUTH_URL = "https://jadoragirlspa.gr";
    }
  }
  // Persistent Prisma Postgres — CLAIM THIS DB or set DATABASE_URL in Vercel
  // Claim: https://create-db.prisma.io/claim?projectID=proj_ph9u41fpi84zv547bzdra7sn
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgres://784eb50dd5aba855a7c7fc2e2e52334f78f510f7bac0c2a9146ab464586c158a:sk_XDWtPtb4susAD0r5qf-j1@db.prisma.io:5432/postgres?sslmode=require";
  }
}

ensureEnvDefaults();
