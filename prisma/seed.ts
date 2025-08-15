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
# AGL CONSTRUCCIONES SAS

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

  // Seed servicios de construcción especializados
  const servicios = [
    {
      slug: 'demoliciones',
      titulo: 'DEMOLICIONES',
      descripcion_corta: 'Servicio profesional para el desmantelamiento seguro y eficiente de estructuras. Garantizamos un proceso controlado, cumpliendo normativas y preparando el terreno para nuevos proyectos.',
      contenido_md: `
# DEMOLICIONES

Nuestro servicio de demoliciones abarca desde el desmonte parcial hasta el derribo completo de edificaciones, gestionando cada etapa con máxima seguridad y eficiencia. Realizamos un análisis técnico previo para definir la estrategia más adecuada, utilizando maquinaria especializada y técnicas de demolición controlada que minimizan el impacto en el entorno.

Nos encargamos de la gestión de residuos conforme a las normativas ambientales, asegurando un sitio de trabajo limpio y seguro. Nuestro equipo experto garantiza que el terreno quede completamente despejado y listo para la fase de cimentación, cumpliendo rigurosamente con los plazos y estándares de calidad acordados.

## Características del Servicio

- Análisis técnico previo y planificación estratégica
- Maquinaria especializada y técnicas de demolición controlada
- Cumplimiento estricto de normativas de seguridad
- Gestión responsable de residuos y materiales
- Preparación del terreno para nuevas construcciones
- Minimización del impacto ambiental y en el entorno
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1593741462828-ea645318c641?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'cimentacion',
      titulo: 'CIMENTACIÓN',
      descripcion_corta: 'Construimos las bases sólidas y duraderas que su edificación necesita. Realizamos cimentaciones seguras y estables, calculadas para garantizar la longevidad de su proyecto.',
      contenido_md: `
# CIMENTACIÓN

La cimentación es la base de toda construcción segura y perdurable. Nuestro servicio se especializa en el diseño y ejecución de sistemas de cimentación, tanto superficiales (zapatas, losas) como profundas (pilotes, caissons), adaptados a las características específicas del suelo y del proyecto.

Iniciamos con un riguroso estudio geotécnico para determinar la solución óptima. Empleamos concreto de alta resistencia y acero de refuerzo que cumplen con las normativas de sismorresistencia vigentes. Cada proceso es supervisado por expertos para asegurar una correcta ejecución, garantizando la estabilidad y la distribución adecuada de las cargas de la estructura al terreno.

## Tipos de Cimentación

- **Cimentaciones superficiales**: Zapatas aisladas, corridas y losas de cimentación
- **Cimentaciones profundas**: Pilotes de concreto, acero y caissons
- **Estudios geotécnicos**: Análisis del suelo y recomendaciones técnicas
- **Materiales certificados**: Concreto de alta resistencia y acero de refuerzo
- **Control de calidad**: Supervisión técnica en todas las etapas
- **Cumplimiento normativo**: Adherencia a NSR-10 y códigos de construcción
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'estructura',
      titulo: 'ESTRUCTURA',
      descripcion_corta: 'Levantamos el esqueleto de su edificación con precisión y máxima seguridad. Construimos estructuras de concreto reforzado que cumplen con los más altos estándares de calidad.',
      contenido_md: `
# ESTRUCTURA

La estructura es el sistema portante que garantiza la resistencia y estabilidad de cualquier edificación. Nos especializamos en la construcción de estructuras de concreto reforzado, ejecutando con precisión elementos clave como columnas, vigas y losas.

Trabajamos en estricto cumplimiento con los planos de diseño y la normativa de sismorresistencia (NSR-10), utilizando materiales certificados y mano de obra calificada. Nuestro proceso incluye un riguroso control de calidad en el encofrado, el vaciado del concreto y el curado, asegurando que cada componente estructural alcance su máxima capacidad de carga y durabilidad para proteger su inversión y la seguridad de sus ocupantes.

## Elementos Estructurales

- **Columnas**: Elementos verticales de soporte y transmisión de cargas
- **Vigas**: Elementos horizontales para distribución de cargas
- **Losas**: Sistemas de entrepiso y cubierta
- **Muros estructurales**: Elementos de rigidización y soporte lateral
- **Escaleras**: Estructuras de circulación vertical
- **Control de calidad**: Supervisión técnica especializada en cada etapa
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1519994999489-76f7f0230b9e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'mamposteria',
      titulo: 'MAMPOSTERÍA',
      descripcion_corta: 'Realizamos trabajos de mampostería para fachadas y divisiones interiores con precisión y acabados limpios, utilizando materiales de primera para muros sólidos y bien definidos.',
      contenido_md: `
# MAMPOSTERÍA

La mampostería es fundamental para delimitar espacios y conformar las fachadas de una edificación. Ofrecemos un servicio integral que incluye desde muros divisorios internos hasta fachadas tradicionales y de ladrillo a la vista.

Empleamos materiales de alta calidad como ladrillos de arcilla y bloques de concreto, asegurando una instalación a plomo y nivel. Nuestro equipo de expertos aplica las mejores técnicas de pegado y rejuntado para garantizar uniones resistentes y un acabado estético impecable. Nos enfocamos en la durabilidad y el aislamiento térmico y acústico que una buena mampostería debe proporcionar, adaptándonos a las especificaciones de cada proyecto.

## Tipos de Mampostería

- **Mampostería de fachada**: Muros exteriores con acabados tradicionales
- **Mampostería a la vista**: Fachadas de ladrillo sin recubrimiento
- **Mampostería interna**: Divisiones y muros interiores
- **Materiales premium**: Ladrillos de arcilla y bloques de concreto
- **Técnicas especializadas**: Pegado, nivelación y rejuntado profesional
- **Aislamiento**: Térmico y acústico según especificaciones
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1559422501-f6a89498a4d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '["MAMPOSTERÍA FACHADA", "MAMPOSTERÍA FACHADA A LA VISTA", "MAMPOSTERÍA INTERNA"]',
    },
    {
      slug: 'panetes',
      titulo: 'PAÑETES',
      descripcion_corta: 'Aplicamos revestimientos de mortero en fachadas y muros interiores. Preparamos y protegemos las superficies, dejándolas listas para un acabado final de alta calidad.',
      contenido_md: `
# PAÑETES

El servicio de pañetes o revoques es clave para proteger la mampostería y crear una superficie uniforme y lisa. Aplicamos pañetes tanto en exteriores (fachadas) como en interiores, utilizando morteros con dosificaciones precisas que garantizan adherencia y resistencia a la intemperie.

Nuestro proceso técnico asegura paredes a plomo y superficies maestreadas, eliminando irregularidades y preparando el muro para recibir estuco, pintura o enchapes. Este revestimiento no solo cumple una función estética, sino que también actúa como una barrera protectora contra la humedad y los agentes externos, contribuyendo a la durabilidad general de la construcción.

## Tipos de Pañetes

- **Pañetes de fachada**: Revestimientos exteriores resistentes a la intemperie
- **Pañetes internos**: Acabados interiores lisos y uniformes
- **Morteros especializados**: Dosificaciones precisas según aplicación
- **Superficies maestreadas**: Paredes a plomo y nivel perfecto
- **Preparación para acabados**: Base ideal para estuco, pintura o enchapes
- **Protección**: Barrera contra humedad y agentes externos
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1581121374966-23b2e595856e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '["PAÑETES FACHADA", "PAÑETES INTERNOS"]',
    },
    {
      slug: 'acabados',
      titulo: 'ACABADOS',
      descripcion_corta: 'Transformamos espacios en bruto en lugares funcionales y estéticos. Cuidamos cada detalle final, desde pisos y techos hasta la carpintería, para entregar un resultado impecable.',
      contenido_md: `
# ACABADOS

La fase de acabados es donde la visión del proyecto cobra vida. Nuestro servicio se enfoca en materializar los detalles que definen el estilo, la comodidad y la funcionalidad de cada ambiente.

Coordinamos e instalamos una amplia gama de elementos, incluyendo pisos de alta calidad, enchapes cerámicos o de piedra, carpintería de madera para puertas y clósets, techos en drywall y la instalación de aparatos sanitarios y griferías. Trabajamos con precisión y atención al detalle, utilizando materiales de primera y mano de obra especializada para asegurar que cada rincón de su proyecto refleje los más altos estándares de calidad y diseño.

## Elementos de Acabados

- **Pisos**: Instalación de cerámica, porcelanato, madera y materiales premium
- **Enchapes**: Revestimientos cerámicos y de piedra natural
- **Carpintería**: Puertas, marcos, clósets y muebles empotrados
- **Techos**: Sistemas de drywall y cielos rasos especializados
- **Aparatos sanitarios**: Instalación de sanitarios, lavamanos y griferías
- **Detalles finales**: Molduras, zócalos y elementos decorativos
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'estuco-y-pintura',
      titulo: 'ESTUCO Y PINTURA',
      descripcion_corta: 'Ofrecemos acabados de estuco y pintura para superficies lisas y perfectas. Logramos un resultado final duradero y de gran impacto visual con materiales de primera calidad.',
      contenido_md: `
# ESTUCO Y PINTURA

El servicio de estuco y pintura es el toque final que define la estética de los espacios interiores y fachadas. Primero, aplicamos una capa de estuco para corregir cualquier mínima imperfección del pañete, logrando una superficie completamente lisa y tersa, ideal para la pintura.

Posteriormente, aplicamos pintura de alta calidad, seleccionando el tipo adecuado (vinilo, acrílico, epóxica) según las necesidades de cada área. Nuestro equipo profesional garantiza una aplicación uniforme, sin marcas y con excelente cubrimiento, protegiendo las paredes y entregando un acabado de color vibrante y duradero que realza el valor de la propiedad.

## Proceso y Materiales

- **Estuco profesional**: Corrección de imperfecciones y superficie lisa
- **Pintura especializada**: Vinilo, acrílico y epóxica según necesidades
- **Aplicación técnica**: Uniforme, sin marcas y con excelente cubrimiento
- **Preparación de superficies**: Limpieza y acondicionamiento previo
- **Colores personalizados**: Amplia gama de tonalidades y acabados
- **Durabilidad garantizada**: Protección y resistencia a largo plazo
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1596731362429-3c483259844c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'drywall',
      titulo: 'DRYWALL',
      descripcion_corta: 'Construcción de muros, divisiones y techos con sistema drywall. Una solución rápida, limpia y versátil para crear o renovar espacios interiores con excelentes acabados.',
      contenido_md: `
# DRYWALL

El sistema drywall es una alternativa moderna y eficiente para la construcción de interiores. Consiste en paneles de yeso fijados a una estructura metálica liviana, permitiendo crear divisiones, cielorrasos y diseños personalizados de forma rápida y con menos residuos que los métodos tradicionales.

Sus principales beneficios son la agilidad en la instalación, la limpieza de la obra y su bajo peso, que no sobrecarga la estructura principal. Además, ofrece un excelente aislamiento térmico y acústico. Es ideal para proyectos de remodelación y optimización de espacios, entregando superficies perfectamente lisas y listas para el acabado final.

## Ventajas del Sistema

- **Instalación rápida**: Construcción ágil y eficiente
- **Obra limpia**: Menos residuos y polvo que métodos tradicionales
- **Peso liviano**: No sobrecarga la estructura principal
- **Aislamiento**: Térmico y acústico superior
- **Versatilidad**: Diseños personalizados y formas complejas
- **Acabado perfecto**: Superficies lisas listas para pintar
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1581094021443-054f4b4c73ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
    {
      slug: 'instalacion-de-enchapes',
      titulo: 'INSTALACIÓN DE ENCHAPES',
      descripcion_corta: 'Instalamos enchapes cerámicos y porcelánicos con precisión técnica. Creamos superficies duraderas, impermeables y estéticas para baños, cocinas, pisos y fachadas.',
      contenido_md: `
# INSTALACIÓN DE ENCHAPES

Nuestro servicio de instalación de enchapes garantiza acabados perfectos y de larga duración para pisos y paredes. Trabajamos con todo tipo de revestimientos, como cerámica, porcelanato y piedra natural.

El proceso inicia con la preparación meticulosa de la superficie para asegurar una adherencia óptima. Utilizamos adhesivos y boquillas de alta calidad, específicos para cada tipo de material y uso (interior o exterior). Nuestro equipo se enfoca en la precisión de los cortes, la nivelación de cada pieza y la simetría de las juntas, logrando un resultado final estético, funcional y fácil de mantener, ideal para zonas húmedas y de alto tráfico.

## Tipos de Enchapes

- **Cerámica**: Revestimientos tradicionales para interiores y exteriores
- **Porcelanato**: Materiales de alta resistencia y bajo mantenimiento
- **Piedra natural**: Mármol, granito y materiales premium
- **Preparación técnica**: Superficies acondicionadas para adherencia óptima
- **Instalación precisa**: Cortes exactos y nivelación perfecta
- **Acabados duraderos**: Resistentes al agua y alto tráfico
      `,
      imagen_principal_url: 'https://images.unsplash.com/photo-1603957278278-656331a6187a?q=80&w=1967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      etiquetas: '[]',
    },
  ];

  for (const servicio of servicios) {
    await prisma.servicio.upsert({
      where: {
        slug_idioma: {
          slug: servicio.slug,
          idioma: servicio.idioma || 'ES'
        }
      },
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
      tipo_servicio_slug: 'mamposteria',
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
      tipo_servicio_slug: 'mamposteria',
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
      tipo_servicio_slug: 'estructura',
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
      tipo_servicio_slug: 'cimentacion',
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
      tipo_servicio_slug: 'cimentacion',
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
      tipo_servicio_slug: 'estructura',
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
      tipo_servicio_slug: 'acabados',
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
