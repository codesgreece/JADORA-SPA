/**
 * Ensure required env defaults exist in serverless environments
 * when Project Environment Variables are not yet configured.
 */
export function ensureEnvDefaults() {
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET =
      "jadora-luxury-spa-secret-change-in-production-2026";
  }
  if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  }
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
}

ensureEnvDefaults();
