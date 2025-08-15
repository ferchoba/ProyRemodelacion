import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProjects() {
  try {
    console.log('🚀 Iniciando creación de proyectos...');

    // Primero obtener los IDs de los servicios
    const servicios = await prisma.servicio.findMany({
      where: { idioma: 'ES' },
      select: { id: true, slug: true, titulo: true }
    });

    console.log('📋 Servicios encontrados:');
    servicios.forEach(s => console.log(`- ${s.titulo} (ID: ${s.id}, Slug: ${s.slug})`));

    // Mapear slugs a IDs
    const servicioMap: Record<string, number> = {};
    servicios.forEach(s => {
      servicioMap[s.slug] = s.id;
    });

    const proyectos = [
      {
        slug: 'universidad-santo-tomas-tunja',
        titulo: 'UNIVERSIDAD SANTO TOMAS DE TUNJA',
        descripcion_md: `
# UNIVERSIDAD SANTO TOMAS DE TUNJA

## Descripción del Proyecto

Proyecto de construcción y remodelación integral de las instalaciones de la Universidad Santo Tomás en Tunja. Este ambicioso proyecto abarcó múltiples fases de construcción, incluyendo la renovación de aulas, laboratorios, áreas administrativas y espacios comunes.

## Alcance de los Trabajos

- **Mampostería estructural y de fachada**
- **Renovación de espacios académicos**
- **Modernización de instalaciones**
- **Mejoramiento de infraestructura**

## Características Técnicas

- Área total intervenida: 2,500 m²
- Duración del proyecto: 8 meses
- Tipo de construcción: Educativa
- Normativas aplicadas: NSR-10, NTC

## Resultados

Un espacio educativo renovado que combina funcionalidad, durabilidad y estética, proporcionando un ambiente óptimo para el desarrollo académico.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img1_gq88im.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img2_dmdh4x.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img3_dlsj20.jpg"]',
        servicio_id: servicioMap['mamposteria'],
        fecha_finalizacion: new Date('2024-11-20'),
      },
      {
        slug: 'entreparques',
        titulo: 'ENTREPARQUES',
        descripcion_md: `
# ENTREPARQUES

## Descripción del Proyecto

Proyecto de remodelación integral del complejo residencial Entreparques, enfocado en la renovación de fachadas, espacios comunes y mejoramiento de la infraestructura general del conjunto.

## Alcance de los Trabajos

- **Mampostería de fachadas**
- **Renovación de áreas comunes**
- **Mejoramiento de accesos**
- **Paisajismo y acabados exteriores**

## Características Técnicas

- Área total: 1,800 m²
- Duración: 6 meses
- Tipo: Residencial
- Unidades beneficiadas: 120 apartamentos

## Resultados

Un complejo residencial completamente renovado que ofrece espacios modernos, confortables y estéticamente atractivos para sus habitantes.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128765/img1_tdleuv.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128764/img2_duomt1.jpg"]',
        servicio_id: servicioMap['mamposteria'],
        fecha_finalizacion: new Date('2024-10-15'),
      },
      {
        slug: 'mega-colegio-san-marcos-funza',
        titulo: 'MEGA COLEGIO SAN MARCOS FUNZA',
        descripcion_md: `
# MEGA COLEGIO SAN MARCOS FUNZA

## Descripción del Proyecto

Construcción de la estructura principal del Mega Colegio San Marcos en Funza, un proyecto educativo de gran envergadura que incluye aulas, laboratorios, biblioteca, áreas deportivas y administrativas.

## Alcance de los Trabajos

- **Estructura de concreto reforzado**
- **Columnas y vigas principales**
- **Losas de entrepiso y cubierta**
- **Elementos estructurales especiales**

## Características Técnicas

- Área construida: 4,200 m²
- Altura: 3 pisos
- Capacidad: 1,200 estudiantes
- Sistema estructural: Pórticos de concreto

## Resultados

Una infraestructura educativa de primer nivel que proporciona espacios óptimos para el aprendizaje, con diseño moderno y construcción duradera.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129094/img1_bno9v7.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129115/img2_eqeigw.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129093/img3_amykhm.jpg"]',
        servicio_id: servicioMap['estructura'],
        fecha_finalizacion: new Date('2024-09-10'),
      },
      {
        slug: 'urbanizacion-hacienda-los-lagos',
        titulo: 'URBANIZACIÓN HACIENDA LOS LAGOS',
        descripcion_md: `
# URBANIZACIÓN HACIENDA LOS LAGOS

## Descripción del Proyecto

Desarrollo de la cimentación para la Urbanización Hacienda Los Lagos, un proyecto residencial que incluye viviendas unifamiliares, zonas verdes y vías de acceso.

## Alcance de los Trabajos

- **Cimentaciones superficiales**
- **Zapatas aisladas y corridas**
- **Vigas de cimentación**
- **Sistemas de drenaje**

## Características Técnicas

- Área del proyecto: 15 hectáreas
- Número de lotes: 180
- Tipo de suelo: Arcilloso
- Profundidad promedio: 1.5 metros

## Resultados

Una urbanización moderna que ofrece espacios residenciales de alta calidad, con infraestructura sólida y diseño contemporáneo para el bienestar de sus habitantes.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129209/img1_bm3to1.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129208/img2_spqsoy.jpg"]',
        servicio_id: servicioMap['cimentacion'],
        fecha_finalizacion: new Date('2024-08-05'),
      },
      {
        slug: 'urbanza',
        titulo: 'URBANZA',
        descripcion_md: `
# URBANZA

## Descripción del Proyecto

Proyecto de cimentación para el desarrollo urbano Urbanza, incluyendo la construcción de cimentaciones para edificios residenciales y comerciales, así como infraestructura vial.

## Alcance de los Trabajos

- **Cimentaciones profundas**
- **Pilotes de concreto**
- **Losas de cimentación**
- **Muros de contención**

## Características Técnicas

- Área total: 25 hectáreas
- Profundidad de pilotes: hasta 12 metros
- Capacidad de carga: 150 ton/pilote
- Número de edificios: 8

## Resultados

Un proyecto de desarrollo urbano con cimentaciones sólidas y duraderas, proporcionando la base perfecta para el crecimiento urbano planificado y sostenible.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129315/img1_evruea.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129317/img2_zg1xs4.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129320/img3_kopuza.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129313/img4_t9bxq8.jpg"]',
        servicio_id: servicioMap['cimentacion'],
        fecha_finalizacion: new Date('2024-07-20'),
      },
      {
        slug: 'edificio-q097',
        titulo: 'EDIFICIO Q097',
        descripcion_md: `
# EDIFICIO Q097

## Descripción del Proyecto

Construcción de la estructura completa del Edificio Q097, un proyecto de uso mixto que combina espacios comerciales en los primeros pisos y residenciales en los niveles superiores.

## Alcance de los Trabajos

- **Estructura de concreto reforzado**
- **Sistema de pórticos resistentes**
- **Losas postensadas**
- **Núcleo de escaleras y ascensores**

## Características Técnicas

- Altura: 12 pisos
- Área por piso: 800 m²
- Sistema estructural: Pórticos + muros de cortante
- Resistencia del concreto: f'c = 28 MPa

## Resultados

Un edificio moderno y funcional con estructura sólida y cimentaciones duraderas, diseñado para satisfacer las necesidades de uso comercial y residencial.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129367/img1_r0sznd.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129370/img2_uqtews.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129365/img3_gqeqlk.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129372/img4_p1hmht.jpg"]',
        servicio_id: servicioMap['estructura'],
        fecha_finalizacion: new Date('2024-06-30'),
      },
      {
        slug: 'altos-de-tundama',
        titulo: 'ALTOS DE TUNDAMA',
        descripcion_md: `
# ALTOS DE TUNDAMA

## Descripción del Proyecto

Proyecto integral de acabados para el conjunto residencial Altos de Tundama, incluyendo pisos, enchapes, carpintería, pintura y todos los detalles finales que dan vida al proyecto.

## Alcance de los Trabajos

- **Instalación de pisos cerámicos y porcelanato**
- **Enchapes en baños y cocinas**
- **Carpintería en madera**
- **Pintura interior y exterior**
- **Instalación de puertas y ventanas**

## Características Técnicas

- Área de acabados: 3,500 m²
- Número de apartamentos: 48
- Tipos de pisos: Porcelanato y cerámica
- Acabados especiales: Cocinas integrales

## Resultados

Un proyecto que combina solidez estructural, funcionalidad y estética, cumpliendo con todos los estándares de construcción y las expectativas del cliente.
        `,
        imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128196/img1_g1fpyl.jpg',
        galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128400/img2_cwmscc.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755128408/img3_hn9agp.jpg"]',
        servicio_id: servicioMap['acabados'],
        fecha_finalizacion: new Date('2024-12-15'),
      },
    ];

    console.log('\n📝 Creando proyectos...');
    
    for (const proyecto of proyectos) {
      const created = await prisma.proyecto.create({
        data: proyecto
      });
      console.log(`✅ Creado proyecto: ${created.titulo}`);
    }

    console.log('\n🎉 ¡Proyectos creados exitosamente!');

    // Verificar el resultado
    const totalProyectos = await prisma.proyecto.count();
    console.log(`📊 Total de proyectos: ${totalProyectos}`);

    return true;

  } catch (error) {
    console.error('❌ Error creando proyectos:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

createProjects();
