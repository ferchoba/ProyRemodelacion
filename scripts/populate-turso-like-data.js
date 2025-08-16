const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateTursoLikeData() {
  console.log('🌱 Poblando base de datos SQLite con datos similares a Turso...\n');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await prisma.proyecto.deleteMany();
    await prisma.servicio.deleteMany();
    await prisma.parametro.deleteMany();
    await prisma.quienesSomos.deleteMany();

    // 1. Crear parámetros básicos
    console.log('📝 Creando parámetros...');
    await prisma.parametro.createMany({
      data: [
        {
          clave: 'whatsapp_numero',
          valor: '+573012571215',
          descripcion: 'Número de WhatsApp para contacto'
        },
        {
          clave: 'email_contacto',
          valor: 'fercho.ba@gmail.com',
          descripcion: 'Email principal de contacto'
        },
        {
          clave: 'direccion',
          valor: 'Tunja, Boyacá, Colombia',
          descripcion: 'Dirección de la empresa'
        }
      ]
    });

    // 2. Crear servicios en español
    console.log('🔧 Creando servicios en español...');
    const serviciosES = [
      {
        slug: 'demoliciones',
        titulo: 'DEMOLICIONES',
        descripcion_corta: 'Demolición controlada y segura de estructuras',
        contenido_md: '# DEMOLICIONES\n\nServicios profesionales de demolición controlada y segura. Contamos con el equipo y la experiencia necesaria para realizar demoliciones de todo tipo de estructuras.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/demoliciones_es.jpg',
        etiquetas: '["demolición", "construcción", "seguridad"]',
        idioma: 'ES',
        orden: 1,
        activo: true
      },
      {
        slug: 'cimentacion',
        titulo: 'CIMENTACIÓN',
        descripcion_corta: 'Construcción de bases sólidas y duraderas',
        contenido_md: '# CIMENTACIÓN\n\nEspecialistas en cimentaciones profundas y superficiales. Garantizamos la estabilidad y durabilidad de sus proyectos.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/cimentacion_es.jpg',
        etiquetas: '["cimentación", "fundaciones", "estructuras"]',
        idioma: 'ES',
        orden: 2,
        activo: true
      },
      {
        slug: 'estructura',
        titulo: 'ESTRUCTURA',
        descripcion_corta: 'Construcción de estructuras resistentes',
        contenido_md: '# ESTRUCTURA\n\nConstrucción de estructuras de concreto y acero con los más altos estándares de calidad.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/estructura_es.jpg',
        etiquetas: '["estructura", "concreto", "acero"]',
        idioma: 'ES',
        orden: 3,
        activo: true
      },
      {
        slug: 'mamposteria',
        titulo: 'MAMPOSTERÍA',
        descripcion_corta: 'Construcción de muros y paredes',
        contenido_md: '# MAMPOSTERÍA\n\nConstrucción de muros y paredes con materiales de primera calidad.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/mamposteria_es.jpg',
        etiquetas: '["mampostería", "muros", "construcción"]',
        idioma: 'ES',
        orden: 4,
        activo: true
      },
      {
        slug: 'panetes',
        titulo: 'PAÑETES',
        descripcion_corta: 'Acabados de superficies y muros',
        contenido_md: '# PAÑETES\n\nAplicación profesional de pañetes para acabados perfectos.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/panetes_es.jpg',
        etiquetas: '["pañetes", "acabados", "superficies"]',
        idioma: 'ES',
        orden: 5,
        activo: true
      },
      {
        slug: 'acabados',
        titulo: 'ACABADOS',
        descripcion_corta: 'Acabados finales de construcción',
        contenido_md: '# ACABADOS\n\nAcabados finales que dan el toque perfecto a su proyecto.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/acabados_es.jpg',
        etiquetas: '["acabados", "terminaciones", "detalles"]',
        idioma: 'ES',
        orden: 6,
        activo: true
      },
      {
        slug: 'estuco-pintura',
        titulo: 'ESTUCO Y PINTURA',
        descripcion_corta: 'Aplicación de estuco y pintura',
        contenido_md: '# ESTUCO Y PINTURA\n\nAplicación profesional de estuco y pintura para acabados impecables.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/estuco_es.jpg',
        etiquetas: '["estuco", "pintura", "acabados"]',
        idioma: 'ES',
        orden: 7,
        activo: true
      },
      {
        slug: 'drywall',
        titulo: 'DRYWALL',
        descripcion_corta: 'Instalación de sistemas drywall',
        contenido_md: '# DRYWALL\n\nInstalación profesional de sistemas drywall para divisiones y cielos rasos.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/drywall_es.jpg',
        etiquetas: '["drywall", "divisiones", "cielos"]',
        idioma: 'ES',
        orden: 8,
        activo: true
      },
      {
        slug: 'enchapes',
        titulo: 'INSTALACIÓN DE ENCHAPES',
        descripcion_corta: 'Instalación de enchapes y cerámicas',
        contenido_md: '# INSTALACIÓN DE ENCHAPES\n\nInstalación profesional de enchapes, cerámicas y porcelanatos.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/enchapes_es.jpg',
        etiquetas: '["enchapes", "cerámicas", "porcelanatos"]',
        idioma: 'ES',
        orden: 9,
        activo: true
      }
    ];

    for (const servicio of serviciosES) {
      await prisma.servicio.create({ data: servicio });
      console.log(`  ✅ ${servicio.titulo}`);
    }

    // 3. Crear servicios en inglés
    console.log('\n🔧 Creando servicios en inglés...');
    const serviciosEN = [
      {
        slug: 'demolitions',
        titulo: 'DEMOLITIONS',
        descripcion_corta: 'Controlled and safe demolition of structures',
        contenido_md: '# DEMOLITIONS\n\nProfessional controlled and safe demolition services.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/demolitions_en.jpg',
        etiquetas: '["demolition", "construction", "safety"]',
        idioma: 'EN',
        orden: 1,
        activo: true
      },
      {
        slug: 'foundation',
        titulo: 'FOUNDATION',
        descripcion_corta: 'Construction of solid and durable foundations',
        contenido_md: '# FOUNDATION\n\nSpecialists in deep and shallow foundations.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/foundation_en.jpg',
        etiquetas: '["foundation", "foundations", "structures"]',
        idioma: 'EN',
        orden: 2,
        activo: true
      },
      {
        slug: 'structure',
        titulo: 'STRUCTURE',
        descripcion_corta: 'Construction of resistant structures',
        contenido_md: '# STRUCTURE\n\nConstruction of concrete and steel structures.',
        imagen_principal_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/structure_en.jpg',
        etiquetas: '["structure", "concrete", "steel"]',
        idioma: 'EN',
        orden: 3,
        activo: true
      }
    ];

    for (const servicio of serviciosEN) {
      await prisma.servicio.create({ data: servicio });
      console.log(`  ✅ ${servicio.titulo}`);
    }

    // 4. Crear algunos proyectos
    console.log('\n📁 Creando proyectos...');
    
    // Obtener el ID del servicio de estructura
    const servicioEstructura = await prisma.servicio.findFirst({
      where: { slug: 'estructura', idioma: 'ES' }
    });

    if (servicioEstructura) {
      const proyectos = [
        {
          slug: 'proyecto-universidad',
          titulo: 'UNIVERSIDAD SANTO TOMAS DE TUNJA',
          descripcion_md: '# UNIVERSIDAD SANTO TOMAS DE TUNJA\n\nProyecto de remodelación integral de las instalaciones universitarias.',
          imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img1_gq88im.jpg',
          galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img2_dmdh4x.jpg"]',
          servicio_id: servicioEstructura.id,
          fecha_finalizacion: new Date('2024-11-20'),
          activo: true
        },
        {
          slug: 'proyecto-entreparques',
          titulo: 'ENTREPARQUES',
          descripcion_md: '# ENTREPARQUES\n\nProyecto residencial moderno con acabados de primera calidad.',
          imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img3_dlsj20.jpg',
          galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img4_abc123.jpg"]',
          servicio_id: servicioEstructura.id,
          fecha_finalizacion: new Date('2024-10-15'),
          activo: true
        }
      ];

      for (const proyecto of proyectos) {
        await prisma.proyecto.create({ data: proyecto });
        console.log(`  ✅ ${proyecto.titulo}`);
      }
    }

    // 5. Crear contenido "Quiénes Somos"
    console.log('\n👥 Creando contenido "Quiénes Somos"...');
    await prisma.quienesSomos.create({
      data: {
        titulo: 'Sobre AGL CONSTRUCCIONES SAS',
        contenido_md: '# Sobre Nosotros\n\nSomos una empresa especializada en construcción y remodelación con más de 10 años de experiencia en el sector.',
        imagen_equipo_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/equipo.jpg'
      }
    });

    console.log('\n✅ Base de datos poblada exitosamente con datos similares a Turso!');

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

    // Verificar servicios por idioma
    const countServiciosES = await prisma.servicio.count({ where: { idioma: 'ES' } });
    const countServiciosEN = await prisma.servicio.count({ where: { idioma: 'EN' } });
    console.log(`\n🌐 Servicios por idioma:`);
    console.log(`  Español (ES): ${countServiciosES}`);
    console.log(`  Inglés (EN): ${countServiciosEN}`);

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

populateTursoLikeData();
