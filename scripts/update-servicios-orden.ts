import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateServiciosOrden() {
  try {
    console.log('🔄 Actualizando campo orden en servicios...');

    // Obtener todos los servicios ordenados por ID
    const servicios = await prisma.servicio.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, slug: true, titulo: true }
    });

    console.log(`📋 Encontrados ${servicios.length} servicios`);

    // Actualizar cada servicio con orden = id
    for (const servicio of servicios) {
      await prisma.servicio.update({
        where: { id: servicio.id },
        data: { 
          orden: servicio.id,
          idioma: 'ES' // Asegurar que todos tengan idioma ES
        }
      });
      
      console.log(`✅ Actualizado: ${servicio.titulo} (ID: ${servicio.id}, Orden: ${servicio.id})`);
    }

    console.log('🎉 Actualización completada exitosamente');
    
    // Verificar los resultados
    const serviciosActualizados = await prisma.servicio.findMany({
      orderBy: { orden: 'asc' },
      select: { id: true, slug: true, titulo: true, orden: true, idioma: true }
    });

    console.log('\n📊 Estado final de servicios:');
    serviciosActualizados.forEach(servicio => {
      console.log(`- ${servicio.titulo}: ID=${servicio.id}, Orden=${servicio.orden}, Idioma=${servicio.idioma}`);
    });

  } catch (error) {
    console.error('❌ Error actualizando servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServiciosOrden();
