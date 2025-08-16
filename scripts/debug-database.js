const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDatabase() {
  console.log('🔍 Verificando estado de la base de datos...\n');

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Contar registros en cada tabla
    const counts = {
      parametros: await prisma.parametro.count(),
      servicios: await prisma.servicio.count(),
      proyectos: await prisma.proyecto.count(),
      quienes_somos: await prisma.quienesSomos.count(),
      formularios: await prisma.formulario.count(),
    };

    console.log('\n📊 Conteo de registros:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} registros`);
    });

    // Verificar servicios por idioma
    const serviciosES = await prisma.servicio.count({ where: { idioma: 'ES' } });
    const serviciosEN = await prisma.servicio.count({ where: { idioma: 'EN' } });
    const serviciosActivos = await prisma.servicio.count({ where: { activo: true } });

    console.log('\n🌐 Servicios por idioma:');
    console.log(`  Español (ES): ${serviciosES}`);
    console.log(`  Inglés (EN): ${serviciosEN}`);
    console.log(`  Activos: ${serviciosActivos}`);

    // Verificar proyectos activos
    const proyectosActivos = await prisma.proyecto.count({ where: { activo: true } });
    console.log(`\n📁 Proyectos activos: ${proyectosActivos}`);

    // Mostrar algunos servicios de ejemplo
    if (counts.servicios > 0) {
      console.log('\n📋 Servicios de ejemplo:');
      const serviciosEjemplo = await prisma.servicio.findMany({
        take: 3,
        select: {
          id: true,
          slug: true,
          titulo: true,
          idioma: true,
          activo: true,
        },
      });
      serviciosEjemplo.forEach(servicio => {
        console.log(`  - ${servicio.titulo} (${servicio.idioma}) - Activo: ${servicio.activo}`);
      });
    }

    // Mostrar algunos proyectos de ejemplo
    if (counts.proyectos > 0) {
      console.log('\n📁 Proyectos de ejemplo:');
      const proyectosEjemplo = await prisma.proyecto.findMany({
        take: 3,
        select: {
          id: true,
          slug: true,
          titulo: true,
          activo: true,
        },
      });
      proyectosEjemplo.forEach(proyecto => {
        console.log(`  - ${proyecto.titulo} - Activo: ${proyecto.activo}`);
      });
    }

    // Verificar si hay datos pero están inactivos
    const serviciosInactivos = await prisma.servicio.count({ where: { activo: false } });
    const proyectosInactivos = await prisma.proyecto.count({ where: { activo: false } });

    if (serviciosInactivos > 0 || proyectosInactivos > 0) {
      console.log('\n⚠️  Registros inactivos encontrados:');
      if (serviciosInactivos > 0) console.log(`  Servicios inactivos: ${serviciosInactivos}`);
      if (proyectosInactivos > 0) console.log(`  Proyectos inactivos: ${proyectosInactivos}`);
    }

  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase();
