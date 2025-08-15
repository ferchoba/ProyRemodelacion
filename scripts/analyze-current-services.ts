import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeCurrentServices() {
  try {
    console.log('🔍 Analizando servicios actuales...');

    // Obtener todos los servicios ordenados por orden
    const servicios = await prisma.servicio.findMany({
      orderBy: { orden: 'asc' },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_corta: true,
        contenido_md: true,
        etiquetas: true,
        idioma: true,
        orden: true,
        activo: true,
        imagen_principal_url: true
      }
    });

    console.log(`📋 Total de servicios encontrados: ${servicios.length}`);
    console.log('\n📊 Servicios por idioma:');
    
    const serviciosPorIdioma = servicios.reduce((acc, servicio) => {
      acc[servicio.idioma] = (acc[servicio.idioma] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(serviciosPorIdioma).forEach(([idioma, count]) => {
      console.log(`- ${idioma}: ${count} servicios`);
    });

    console.log('\n📝 Detalle de servicios en español:');
    const serviciosES = servicios.filter(s => s.idioma === 'ES');
    
    serviciosES.forEach(servicio => {
      console.log(`\n${servicio.orden}. ${servicio.titulo}`);
      console.log(`   Slug: ${servicio.slug}`);
      console.log(`   Descripción: ${servicio.descripcion_corta?.substring(0, 80)}...`);
      console.log(`   Etiquetas: ${servicio.etiquetas}`);
      console.log(`   Imagen: ${servicio.imagen_principal_url || 'No definida'}`);
      console.log(`   Contenido MD: ${servicio.contenido_md.substring(0, 100)}...`);
    });

    console.log('\n📝 Servicios en inglés existentes:');
    const serviciosEN = servicios.filter(s => s.idioma === 'EN');
    
    if (serviciosEN.length === 0) {
      console.log('❌ No hay servicios en inglés');
    } else {
      serviciosEN.forEach(servicio => {
        console.log(`- ${servicio.titulo} (${servicio.slug})`);
      });
    }

    return serviciosES;

  } catch (error) {
    console.error('❌ Error analizando servicios:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

analyzeCurrentServices();
