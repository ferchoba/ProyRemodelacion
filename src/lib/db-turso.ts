// lib/db-turso.ts
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  turso: PrismaClient | undefined
}

// Cliente SQLite (desarrollo)
export const sqliteDb = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = sqliteDb
}

// Cliente Turso (producción y testing)
let tursoDb: PrismaClient

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  
  const adapter = new PrismaLibSQL(libsql)
  tursoDb = globalForPrisma.turso ?? new PrismaClient({ 
    adapter,
    log: ['query', 'error']
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.turso = tursoDb
  }
} else {
  // Fallback a SQLite si no hay credenciales de Turso
  tursoDb = sqliteDb
}

// Exportar cliente principal (Turso en producción, SQLite en desarrollo)
export const db = process.env.NODE_ENV === 'production' ? tursoDb : sqliteDb

// Exportar cliente específico de Turso para migración
export const tursoClient = tursoDb
