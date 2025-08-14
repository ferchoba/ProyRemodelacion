import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed parameters
  await prisma.parametro.upsert({
    where: { clave: 'correo_destino_formularios' },
    update: {},
    create: {
      clave: 'correo_destino_formularios',
      valor: 'fercho.ba@gmail.com',
      descripcion: 'Correo electrónico de destino para formularios de contacto y cotización',
    },
  });

  await prisma.parametro.upsert({
    where: { clave: 'whatsapp_numero' },
    update: {},
    create: {
      clave: 'whatsapp_numero',
      valor: '+573012571215',
      descripcion: 'Número de WhatsApp para contacto directo',
    },
  });

  // Seed Quienes Somos content
  await prisma.quienesSomos.upsert({
    where: { id: 1 },
    update: {},
    create: {
      titulo: 'Nuestra Historia y Compromiso',
      contenido_md: `
# Algecira Construcciones

Somos una empresa especializada en **remodelación y construcción** de espacios residenciales, comerciales y de oficina. Con años de experiencia en el sector, nos hemos consolidado como líderes en transformación de espacios.

## Nuestra Misión

Transformar espacios con calidad excepcional, brindando soluciones personalizadas que superen las expectativas de nuestros clientes.

## Nuestros Valores

- **Calidad**: Utilizamos materiales de primera y técnicas especializadas
- **Compromiso**: Cumplimos con los tiempos y presupuestos acordados
- **Innovación**: Incorporamos las últimas tendencias en diseño y construcción
- **Confianza**: Construimos relaciones duraderas con nuestros clientes

## Nuestros Servicios

### Remodelaciones Integrales
Transformamos completamente sus espacios residenciales y comerciales con diseños modernos y funcionales.

### Renovaciones Especializadas
- Cocinas modernas y funcionales
- Baños con diseños contemporáneos
- Garajes optimizados

### Acabados y Mantenimiento
- Instalación profesional de pisos
- Pintura especializada
- Mantenimiento preventivo

## ¿Por qué elegirnos?

Con más de **10 años de experiencia**, hemos completado cientos de proyectos exitosos. Nuestro equipo de profesionales expertos garantiza resultados excepcionales en cada proyecto.

*Contáctanos hoy mismo para una consulta gratuita y descubre cómo podemos transformar tu espacio.*
      `,
      imagen_equipo_url: null,
      activo: true,
    },
  });

  // Seed some example services (for Sprint 2)
  const servicios = [
    {
      slug: 'remodelaciones-integrales',
      titulo: 'Remodelaciones Integrales',
      descripcion_corta: 'Transformamos por completo sus espacios residenciales y comerciales.',
      contenido_md: `
# Remodelaciones Integrales

Transformamos completamente sus espacios con diseños modernos y funcionales.

## ¿Qué incluye?

- Diseño arquitectónico personalizado
- Demolición y construcción
- Instalaciones eléctricas y sanitarias
- Acabados de alta calidad
- Mobiliario y decoración

## Proceso

1. **Consulta inicial** - Evaluamos sus necesidades
2. **Diseño** - Creamos propuestas personalizadas
3. **Ejecución** - Realizamos el trabajo con calidad
4. **Entrega** - Garantizamos su satisfacción
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
      etiquetas: '["residencial", "comercial", "integral"]',
    },
    {
      slug: 'renovacion-cocinas',
      titulo: 'Renovación de Cocinas',
      descripcion_corta: 'Cocinas modernas y funcionales diseñadas a su medida.',
      contenido_md: `
# Renovación de Cocinas

Diseñamos y construimos cocinas modernas que combinan funcionalidad y estilo.

## Especialidades

- Cocinas modulares
- Islas y barras
- Electrodomésticos integrados
- Iluminación especializada
- Materiales de alta calidad
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
      etiquetas: '["cocinas", "residencial", "modular"]',
    },
    {
      slug: 'renovacion-banos',
      titulo: 'Renovación de Baños',
      descripcion_corta: 'Baños elegantes y funcionales con acabados de lujo.',
      contenido_md: `
# Renovación de Baños

Creamos baños elegantes que combinan confort y diseño contemporáneo.

## Servicios incluidos

- Diseño personalizado
- Instalaciones sanitarias
- Acabados en porcelanato
- Mamparas y accesorios
- Iluminación LED
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center',
      etiquetas: '["baños", "residencial", "lujo"]',
    },
  ];

  for (const servicio of servicios) {
    await prisma.servicio.upsert({
      where: { slug: servicio.slug },
      update: {},
      create: servicio,
    });
  }

  // Seed some example projects
  const proyectos = [
    {
      slug: 'universidad-santo-tomas-tunja',
      titulo: 'UNIVERSIDAD SANTO TOMAS DE TUNJA',
      descripcion_md: `
# UNIVERSIDAD SANTO TOMAS DE TUNJA

Proyecto de remodelación integral para la Universidad Santo Tomás de Tunja, enfocado en la modernización de espacios académicos con técnicas constructivas avanzadas.

## Servicios Incluidos

### Mampostería y Estructuras Internas
- **MAMPOSTERÍA INTERNA**: Construcción y reforzamiento de muros interiores para optimizar la distribución de espacios académicos
- **PAÑETES INTERNOS**: Aplicación de recubrimientos interiores de alta calidad para acabados duraderos y estéticamente superiores

### Acabados Exteriores
- **PAÑETES FACHADA**: Renovación completa de fachadas con materiales resistentes a la intemperie y técnicas modernas de aplicación

## Características del Proyecto

- **Tipo**: Remodelación integral educativa
- **Alcance**: Modernización de espacios académicos y administrativos
- **Calidad**: Materiales especializados para uso institucional intensivo
- **Diseño**: Arquitectura funcional adaptada a necesidades educativas

## Resultado

Un espacio educativo renovado que combina funcionalidad, durabilidad y estética, proporcionando un ambiente óptimo para el desarrollo académico.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/img1_gq88im.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img2_dmdh4x.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/img3_dlsj20.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-11-20'),
    },
    {
      slug: 'entreparques',
      titulo: 'ENTREPARQUES',
      descripcion_md: `
# ENTREPARQUES

Proyecto de remodelación integral del complejo residencial Entreparques, combinando técnicas modernas de mampostería y acabados de alta calidad.

## Servicios Incluidos

### Mampostería Especializada
- **MAMPOSTERÍA INTERNA**: Construcción de muros interiores con técnicas avanzadas para optimización de espacios residenciales
- **MAMPOSTERÍA FACHADA**: Renovación de fachadas exteriores con materiales de primera calidad y diseño contemporáneo

### Acabados Interiores
- **PAÑETES INTERNOS**: Aplicación de recubrimientos interiores con acabados lisos y duraderos para espacios habitacionales

## Características del Proyecto

- **Tipo**: Remodelación residencial integral
- **Alcance**: Renovación completa de estructuras internas y externas
- **Calidad**: Materiales premium para uso residencial
- **Diseño**: Arquitectura moderna y funcional

## Resultado

Un complejo residencial completamente renovado que ofrece espacios modernos, confortables y estéticamente atractivos para sus habitantes.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128765/img1_tdleuv.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128764/img2_duomt1.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-10-15'),
    },
    {
      slug: 'mega-colegio-san-marcos-funza',
      titulo: 'MEGA COLEGIO SAN MARCOS FUNZA',
      descripcion_md: `
# MEGA COLEGIO SAN MARCOS FUNZA

Proyecto de construcción integral para el Mega Colegio San Marcos en Funza, desarrollando infraestructura educativa de gran escala con los más altos estándares constructivos.

## Servicios Incluidos

### Estructura y Cimentación
- **CIMENTACIÓN**: Diseño y construcción de cimentaciones especializadas para infraestructura educativa de gran escala
- **ESTRUCTURA**: Desarrollo del sistema estructural completo adaptado a las necesidades de un mega colegio

### Mampostería Especializada
- **MAMPOSTERÍA FACHADA A LA VISTA**: Construcción de fachadas con mampostería vista de alta calidad, proporcionando durabilidad y estética institucional

## Características del Proyecto

- **Tipo**: Construcción educativa de gran escala
- **Alcance**: Infraestructura completa para mega colegio
- **Calidad**: Materiales y técnicas especializadas para uso educativo intensivo
- **Diseño**: Arquitectura educativa moderna y funcional

## Resultado

Una infraestructura educativa de primer nivel que proporciona espacios óptimos para el aprendizaje, con diseño moderno y construcción duradera.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129094/img1_bno9v7.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129115/img2_eqeigw.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129093/img3_amykhm.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-09-10'),
    },
    {
      slug: 'urbanizacion-hacienda-los-lagos',
      titulo: 'URBANIZACIÓN HACIENDA LOS LAGOS',
      descripcion_md: `
# URBANIZACIÓN HACIENDA LOS LAGOS

Proyecto de desarrollo urbano integral para la Urbanización Hacienda Los Lagos, enfocado en la construcción de infraestructura residencial de alta calidad.

## Servicios Incluidos

### Estructura y Cimentación
- **CIMENTACIÓN**: Diseño y construcción de cimentaciones especializadas para desarrollo residencial, garantizando estabilidad y durabilidad a largo plazo
- **ESTRUCTURA**: Desarrollo del sistema estructural completo para viviendas unifamiliares y multifamiliares

## Características del Proyecto

- **Tipo**: Desarrollo urbano residencial
- **Alcance**: Infraestructura completa para urbanización
- **Calidad**: Materiales y técnicas de construcción de primera calidad
- **Diseño**: Planificación urbana moderna y sostenible

## Resultado

Una urbanización moderna que ofrece espacios residenciales de alta calidad, con infraestructura sólida y diseño contemporáneo para el bienestar de sus habitantes.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129209/img1_bm3to1.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129208/img2_spqsoy.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-08-05'),
    },
    {
      slug: 'urbanza',
      titulo: 'URBANZA',
      descripcion_md: `
# URBANZA

Proyecto de desarrollo urbano Urbanza, especializado en la construcción de cimentaciones para infraestructura residencial y comercial de gran escala.

## Servicios Incluidos

### Cimentación Especializada
- **CIMENTACIÓN**: Diseño y construcción de sistemas de cimentación avanzados para proyectos de desarrollo urbano, utilizando técnicas modernas y materiales de alta resistencia

## Características del Proyecto

- **Tipo**: Desarrollo urbano integral
- **Alcance**: Cimentaciones para infraestructura mixta (residencial y comercial)
- **Calidad**: Técnicas especializadas en cimentación para grandes proyectos
- **Diseño**: Ingeniería estructural avanzada y planificación urbana sostenible

## Resultado

Un proyecto de desarrollo urbano con cimentaciones sólidas y duraderas, proporcionando la base perfecta para el crecimiento urbano planificado y sostenible.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129315/img1_evruea.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129317/img2_zg1xs4.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129320/img3_kopuza.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129313/img4_t9bxq8.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-07-20'),
    },
    {
      slug: 'edificio-q097',
      titulo: 'EDIFICIO Q097',
      descripcion_md: `
# EDIFICIO Q097

Proyecto de construcción integral del Edificio Q097, desarrollando infraestructura comercial y residencial con sistemas estructurales avanzados.

## Servicios Incluidos

### Estructura y Cimentación
- **CIMENTACIÓN**: Diseño y construcción de cimentaciones especializadas para edificaciones de mediana altura, garantizando estabilidad estructural óptima
- **ESTRUCTURA**: Desarrollo del sistema estructural completo para edificio multifuncional con técnicas constructivas modernas

## Características del Proyecto

- **Tipo**: Construcción de edificio multifuncional
- **Alcance**: Infraestructura completa desde cimentación hasta estructura
- **Calidad**: Materiales de alta resistencia y técnicas constructivas avanzadas
- **Diseño**: Arquitectura moderna adaptada a usos mixtos

## Resultado

Un edificio moderno y funcional con estructura sólida y cimentaciones duraderas, diseñado para satisfacer las necesidades de uso comercial y residencial.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755129367/img1_r0sznd.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755129370/img2_uqtews.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129365/img3_gqeqlk.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755129372/img4_p1hmht.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-06-30'),
    },
    {
      slug: 'altos-de-tundama',
      titulo: 'ALTOS DE TUNDAMA',
      descripcion_md: `
# ALTOS DE TUNDAMA

Proyecto integral de construcción que abarca desde la cimentación hasta los acabados finales, desarrollado con los más altos estándares de calidad y técnicas constructivas modernas.

## Servicios Incluidos

### Estructura y Cimentación
- **CIMENTACIÓN**: Diseño y construcción de bases sólidas y duraderas
- **ESTRUCTURA**: Desarrollo del sistema estructural completo del proyecto

### Mampostería
- **MAMPOSTERÍA FACHADA**: Construcción de muros exteriores con acabados de alta calidad
- **MAMPOSTERÍA INTERNA**: Levantamiento de muros interiores y divisiones

### Pañetes y Acabados
- **PAÑETE FACHADA**: Aplicación de recubrimientos exteriores resistentes a la intemperie
- **PAÑETE INTERNO**: Preparación de superficies interiores para acabados finales
- **ACABADOS**: Instalación de acabados finales de alta calidad

## Características del Proyecto

- **Tipo**: Remodelación integral
- **Alcance**: Proyecto completo desde cimentación hasta acabados
- **Calidad**: Materiales y técnicas de construcción de primera calidad
- **Diseño**: Arquitectura moderna y funcional

## Resultado

Un proyecto que combina solidez estructural, funcionalidad y estética, cumpliendo con todos los estándares de construcción y las expectativas del cliente.
      `,
      imagen_portada_url: 'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128196/img1_g1fpyl.jpg',
      galeria_urls: '["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128400/img2_cwmscc.jpg", "https://res.cloudinary.com/dq5joejf7/image/upload/v1755128408/img3_hn9agp.jpg"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-12-15'),
    },
  ];

  for (const proyecto of proyectos) {
    await prisma.proyecto.upsert({
      where: { slug: proyecto.slug },
      update: {},
      create: proyecto,
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
