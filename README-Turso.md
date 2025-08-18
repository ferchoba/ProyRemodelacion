# AGL CONSTRUCCIONES SAS – Configuración Turso (ES/EN)

## ES – Uso de Turso en todos los entornos

- La app utiliza únicamente Turso (libSQL).
- Requiere variables:
  - TURSO_DATABASE_URL
  - TURSO_AUTH_TOKEN
- Prisma está configurado con driverAdapters (libSQL).
- Cliente unificado: `src/lib/db.ts` (sin fallback a SQLite).

### Pasos rápidos
1. Copiar `.env.example` a `.env` y completar:
   - TURSO_DATABASE_URL="libsql://<db>.<org>.turso.io"
   - TURSO_AUTH_TOKEN="<token>"
2. Generar cliente Prisma:
   - `pnpm run db:generate`
3. Ejecutar chequeos:
   - `pnpm run type-check`
   - `pnpm run build`

### Notas
- Upstash Redis es opcional; si no hay credenciales válidas, el rate limiting se desactiva (fail-open) en `src/lib/rate-limit.ts`.
- Correo: `src/lib/email.ts` usa Nodemailer con transporte SMTP si hay credenciales; en dev cae a jsonTransport.

## EN – Turso usage across all environments

- The app uses Turso (libSQL) only.
- Required envs:
  - TURSO_DATABASE_URL
  - TURSO_AUTH_TOKEN
- Prisma uses `driverAdapters` with libSQL.
- Unified client: `src/lib/db.ts` (no SQLite fallback).

### Quick steps
1. Copy `.env.example` to `.env` and fill:
   - TURSO_DATABASE_URL="libsql://<db>.<org>.turso.io"
   - TURSO_AUTH_TOKEN="<token>"
2. Generate Prisma client:
   - `pnpm run db:generate`
3. Run checks:
   - `pnpm run type-check`
   - `pnpm run build`

### Notes
- Upstash Redis is optional; without valid credentials the limiter is disabled (fail-open) in `src/lib/rate-limit.ts`.
- Email: `src/lib/email.ts` uses SMTP transport when configured; in dev falls back to jsonTransport.

