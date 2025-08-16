import { PrismaClient } from '@prisma/client';

async function main() {
  const db = new PrismaClient();
  try {
    console.log('DB URL:', process.env.DATABASE_URL);
    const s = await db.servicio.count();
    const p = await db.proyecto.count();
    console.log('Counts => servicios:', s, 'proyectos:', p);

    const sES = await db.servicio.count({ where: { idioma: 'ES' } });
    const sEN = await db.servicio.count({ where: { idioma: 'EN' } });
    console.log('Servicios por idioma => ES:', sES, 'EN:', sEN);

    const servicios = await db.servicio.findMany({
      orderBy: { id: 'asc' },
      take: 10,
      select: { id: true, slug: true, idioma: true, titulo: true, activo: true },
    });
    console.log('Servicios (sample 10):', servicios);

    const proyectos = await db.proyecto.findMany({
      orderBy: { id: 'asc' },
      take: 10,
      select: { id: true, slug: true, servicio_id: true, activo: true },
    });
    console.log('Proyectos (sample 10):', proyectos);

    // Check if column tipo_servicio_slug still exists by trying a raw query
    try {
      const any = await db.$queryRawUnsafe<any>("SELECT tipo_servicio_slug FROM proyectos LIMIT 1");
      console.log('Column tipo_servicio_slug exists on proyectos:', any);
    } catch (e) {
      console.log('Column tipo_servicio_slug does NOT exist on proyectos (expected with latest schema).');
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error('check-db error:', e);
  process.exit(1);
});

