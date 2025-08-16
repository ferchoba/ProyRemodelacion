const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateBasicData() {
  console.log('🌱 Poblando base de datos con datos básicos...\n');

  try {
    // 1. Crear parámetros básicos
    console.log('📝 Creando parámetros...');
    await prisma.parametro.upsert({
      where: { clave: 'whatsapp_numero' },
      update: {},
      create: {
        clave: 'whatsapp_numero',
        valor: '+573012571215',
        descripcion: 'Número de WhatsApp para contacto'
      }
    });

    await prisma.parametro.upsert({
      where: { clave: 'email_contacto' },
      update: {},
      create: {
        clave: 'email_contacto',
        valor: 'fercho.ba@gmail.com',
        descripcion: 'Email principal de contacto'
      }
    });

    // 2. Crear servicios en español
    console.log('🔧 Creando servicios en español...');
    const serviciosES = [
      {
        slug: 'demoliciones',
        titulo: 'DEMOLICIONES',
        descripcion_corta: 'Demolición controlada y segura de estructuras',
        contenido_md: '# DEMOLICIONES\n\nServicios profesionales de demolición controlada.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/demoliciones_es.jpg',
        etiquetas: '["demolición", "construcción", "seguridad"]',
        idioma: 'ES',
        orden: 1
      },
      {
        slug: 'cimentacion',
        titulo: 'CIMENTACIÓN',
        descripcion_corta: 'Construcción de bases sólidas y duraderas',
        contenido_md: '# CIMENTACIÓN\n\nEspecialistas en cimentaciones profundas y superficiales.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/cimentacion_es.jpg',
        etiquetas: '["cimentación", "fundaciones", "estructuras"]',
        idioma: 'ES',
        orden: 2
      },
      {
        slug: 'estructura',
        titulo: 'ESTRUCTURA',
        descripcion_corta: 'Construcción de estructuras resistentes',
        contenido_md: '# ESTRUCTURA\n\nConstrucción de estructuras de concreto y acero.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/estructura_es.jpg',
        etiquetas: '["estructura", "concreto", "acero"]',
        idioma: 'ES',
        orden: 3
      }
    ];

    for (const servicio of serviciosES) {
      await prisma.servicio.upsert({
        where: { slug_idioma: { slug: servicio.slug, idioma: servicio.idioma } },
        update: {},
        create: servicio
      });
      console.log(`  ✅ ${servicio.titulo}`);
    }

    // 3. Crear servicios en inglés
    console.log('🔧 Creando servicios en inglés...');
    const serviciosEN = [
      {
        slug: 'demolitions',
        titulo: 'DEMOLITIONS',
        descripcion_corta: 'Controlled and safe demolition of structures',
        contenido_md: '# DEMOLITIONS\n\nProfessional controlled demolition services.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/demolitions_en.jpg',
        etiquetas: '["demolition", "construction", "safety"]',
        idioma: 'EN',
        orden: 1
      },
      {
        slug: 'foundation',
        titulo: 'FOUNDATION',
        descripcion_corta: 'Construction of solid and durable foundations',
        contenido_md: '# FOUNDATION\n\nSpecialists in deep and shallow foundations.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/foundation_en.jpg',
        etiquetas: '["foundation", "foundations", "structures"]',
        idioma: 'EN',
        orden: 2
      },
      {
        slug: 'structure',
        titulo: 'STRUCTURE',
        descripcion_corta: 'Construction of resistant structures',
        contenido_md: '# STRUCTURE\n\nConstruction of concrete and steel structures.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/structure_en.jpg',
        etiquetas: '["structure", "concrete", "steel"]',
        idioma: 'EN',
        orden: 3
      }
    ];

    for (const servicio of serviciosEN) {
      await prisma.servicio.upsert({
        where: { slug_idioma: { slug: servicio.slug, idioma: servicio.idioma } },
        update: {},
        create: servicio
      });
      console.log(`  ✅ ${servicio.titulo}`);
    }

    // 4. Crear algunos proyectos
    console.log('📁 Creando proyectos...');
    
    // Primero obtener el ID del servicio de estructura
    const servicioEstructura = await prisma.servicio.findFirst({
      where: { slug: 'estructura', idioma: 'ES' }
    });

    if (servicioEstructura) {
      const proyectos = [
        {
          slug: 'proyecto-universidad',
          titulo: 'UNIVERSIDAD SANTO TOMAS DE TUNJA',
          descripcion_md: '# UNIVERSIDAD SANTO TOMAS DE TUNJA\n\nProyecto de remodelación integral.',
          imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img1_gq88im.jpg',
          galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img2_dmdh4x.jpg"]',
          servicio_id: servicioEstructura.id,
          fecha_finalizacion: new Date('2024-11-20')
        },
        {
          slug: 'proyecto-entreparques',
          titulo: 'ENTREPARQUES',
          descripcion_md: '# ENTREPARQUES\n\nProyecto residencial moderno.',
          imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img3_dlsj20.jpg',
          galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img4_abc123.jpg"]',
          servicio_id: servicioEstructura.id,
          fecha_finalizacion: new Date('2024-10-15')
        }
      ];

      for (const proyecto of proyectos) {
        await prisma.proyecto.upsert({
          where: { slug: proyecto.slug },
          update: {},
          create: proyecto
        });
        console.log(`  ✅ ${proyecto.titulo}`);
      }
    }

    // 5. Crear contenido "Quiénes Somos"
    console.log('👥 Creando contenido "Quiénes Somos"...');
    await prisma.quienesSomos.upsert({
      where: { id: 1 },
      update: {},
      create: {
        titulo: 'Sobre AGL CONSTRUCCIONES SAS',
        contenido_md: '# Sobre Nosotros\n\nSomos una empresa especializada en construcción y remodelación.',
        imagen_equipo_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/equipo.jpg'
      }
    });

    console.log('\n✅ Base de datos poblada exitosamente!');

    // Verificar datos
    const counts = {
      parametros: await prisma.parametro.count(),
      servicios: await prisma.servicio.count(),
      proyectos: await prisma.proyecto.count(),
      quienes_somos: await prisma.quienesSomos.count()
    };

    console.log('\n📊 Resumen:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} registros`);
    });

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

populateBasicData();
