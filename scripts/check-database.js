const { PrismaClient } = require('@prisma/client');

// Configurar para usar SQLite local
process.env.DATABASE_URL = "file:./prisma/dev.db";

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Verificando base de datos SQLite local...\n');

  try {
    // Verificar servicios
    console.log('📋 Verificando servicios...');
    const servicios = await prisma.servicio.findMany({
      select: {
        id: true,
        slug: true,
        titulo: true,
        idioma: true,
        activo: true
      },
      orderBy: [
        { idioma: 'asc' },
        { orden: 'asc' }
      ]
    });

    console.log(`Total servicios: ${servicios.length}`);
    
    const serviciosES = servicios.filter(s => s.idioma === 'ES');
    const serviciosEN = servicios.filter(s => s.idioma === 'EN');
    const serviciosActivos = servicios.filter(s => s.activo);
    
    console.log(`  - Español (ES): ${serviciosES.length}`);
    console.log(`  - Inglés (EN): ${serviciosEN.length}`);
    console.log(`  - Activos: ${serviciosActivos.length}`);

    if (servicios.length > 0) {
      console.log('\n📝 Primeros 5 servicios:');
      servicios.slice(0, 5).forEach(s => {
        console.log(`  ${s.idioma}: ${s.titulo} (${s.slug}) - ${s.activo ? 'Activo' : 'Inactivo'}`);
      });
    }

    // Verificar proyectos
    console.log('\n📁 Verificando proyectos...');
    const proyectos = await prisma.proyecto.findMany({
      select: {
        id: true,
        slug: true,
        titulo: true,
        activo: true,
        servicio: {
          select: {
            titulo: true
          }
        }
      }
    });

    console.log(`Total proyectos: ${proyectos.length}`);
    const proyectosActivos = proyectos.filter(p => p.activo);
    console.log(`  - Activos: ${proyectosActivos.length}`);

    if (proyectos.length > 0) {
      console.log('\n📝 Proyectos:');
      proyectos.forEach(p => {
        console.log(`  ${p.titulo} (${p.slug}) - ${p.activo ? 'Activo' : 'Inactivo'} - Servicio: ${p.servicio?.titulo || 'N/A'}`);
      });
    }

    // Verificar parámetros
    console.log('\n⚙️ Verificando parámetros...');
    const parametros = await prisma.parametro.findMany({
      select: {
        clave: true,
        valor: true
      }
    });

    console.log(`Total parámetros: ${parametros.length}`);
    if (parametros.length > 0) {
      console.log('\n📝 Parámetros:');
      parametros.forEach(p => {
        console.log(`  ${p.clave}: ${p.valor}`);
      });
    }

    // Probar consulta específica que usa la aplicación
    console.log('\n🔍 Probando consulta de servicios activos en español...');
    const serviciosActivosES = await prisma.servicio.findMany({
      where: {
        activo: true,
        idioma: 'ES'
      },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_corta: true,
        imagen_principal_url: true,
        etiquetas: true,
        idioma: true,
        orden: true,
        created_at: true
      },
      orderBy: {
        orden: 'asc'
      }
    });

    console.log(`Servicios activos en español: ${serviciosActivosES.length}`);
    if (serviciosActivosES.length > 0) {
      console.log('✅ La consulta funciona correctamente');
      serviciosActivosES.forEach(s => {
        console.log(`  - ${s.titulo} (orden: ${s.orden})`);
      });
    } else {
      console.log('❌ No se encontraron servicios activos en español');
    }

    console.log('\n✅ Verificación completada');
    return true;

  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
