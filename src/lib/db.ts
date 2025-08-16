import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Verificar si estamos en el servidor
const isServer = typeof window === 'undefined';

let prisma: PrismaClient;

// Solo en el servidor, intentar configurar Turso
if (isServer) {
  const hasTursoCredentials = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

  if (hasTursoCredentials) {
    console.log('🔗 Configurando Turso Cloud...');
    console.log('📍 URL:', process.env.TURSO_DATABASE_URL);
    console.log('🔑 Token:', process.env.TURSO_AUTH_TOKEN ? 'Configurado' : 'No configurado');

    try {
      // Crear cliente Turso usando importaciones dinámicas
      const createTursoClient = async () => {
        const { PrismaLibSQL } = await import('@prisma/adapter-libsql');
        const { createClient } = await import('@libsql/client');

        const libsql = createClient({
          url: process.env.TURSO_DATABASE_URL!,
          authToken: process.env.TURSO_AUTH_TOKEN!,
        });

        const adapter = new PrismaLibSQL(libsql);
        return new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['error'] : []
        });
      };

      // Inicializar con SQLite temporalmente
      prisma = globalForPrisma.prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
      });

      // Reemplazar con Turso cuando esté listo
      createTursoClient().then(tursoClient => {
        // Reemplazar la instancia de prisma
        Object.setPrototypeOf(prisma, Object.getPrototypeOf(tursoClient));
        Object.assign(prisma, tursoClient);
        console.log('✅ Turso Cloud configurado exitosamente');
      }).catch(error => {
        console.warn('⚠️  Error configurando Turso:', error.message);
        console.log('💾 Continuando con SQLite local');
      });

    } catch (error) {
      console.warn('⚠️  Error configurando Turso, usando SQLite como fallback:', error.message);
      prisma = globalForPrisma.prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
      });
      console.log('💾 Usando SQLite local como base de datos');
    }
  } else {
    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    });
    console.log('💾 Usando SQLite local como base de datos (sin credenciales de Turso)');
  }
} else {
  // En el cliente, usar configuración por defecto
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  });
  console.log('🌐 Cliente: usando configuración por defecto');
}

// Configurar instancia global para desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const db = prisma;
