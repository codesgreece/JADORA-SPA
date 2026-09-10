# J’ADORA — Luxury Girls Spa Parties

Premium boutique website + interactive booking + admin panel.

## Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind CSS 4
- Prisma + PostgreSQL
- NextAuth (credentials)

## Setup

```bash
npm install
cp .env.example .env
# set DATABASE_URL to your Postgres connection string
npx prisma db push
npm run db:seed
npm run dev
```

## Admin

- URL: `/admin/login`
- Default: `admin@jadora.gr` / `jadora2026`

## Booking

Public users select package → date → time → details → submit.
Admin can approve/reject and block dates/slots. Double-booking is prevented.
