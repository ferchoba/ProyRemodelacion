// lib/db-turso.ts
// Este archivo ya no es necesario con la migración completa a Turso,
// pero lo dejamos como wrapper fino que usa siempre Turso sin fallback.
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getTursoPrisma(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    throw new Error('Faltan variables de entorno TURSO_DATABASE_URL y/o TURSO_AUTH_TOKEN')
  }

  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const libsql = createClient({ url, authToken })
  const adapter = new PrismaLibSQL(libsql)

  const prisma = new PrismaClient({ adapter, log: ['error'] })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

export const db = getTursoPrisma()
export const tursoClient = db
