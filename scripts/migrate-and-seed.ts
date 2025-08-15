import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateAndSeed() {
  try {
    console.log('🚀 Iniciando migración y seed...');

    // 1. Primero crear los servicios en español
    console.log('📝 Creando servicios en español...');
    
    const serviciosES = [
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
        idioma: 'ES',
        orden: 1
      },
      {
        slug: 'cimentacion',
        titulo: 'CIMENTACIÓN',
        descripcion_corta: 'Construimos las bases sólidas y duraderas que su edificación necesita. Realizamos cimentaciones seguras y estables, calculadas para garantizar la longevidad de su proyecto.',
        contenido_md: `
# CIMENTACIÓN

La cimentación es la base de toda construcción segura y perdurable. Nuestro servicio abarca desde el estudio de suelos hasta la ejecución de cimentaciones superficiales y profundas, adaptándonos a las características específicas del terreno y los requerimientos estructurales del proyecto.

Utilizamos técnicas constructivas modernas y materiales de primera calidad para garantizar la estabilidad y durabilidad de la estructura. Nuestro equipo especializado realiza un control riguroso en cada etapa del proceso, desde la excavación hasta el curado del concreto, asegurando que la cimentación cumpla con las especificaciones técnicas y normativas vigentes.

## Tipos de Cimentación

- Cimentaciones superficiales (zapatas aisladas, corridas y combinadas)
- Cimentaciones profundas (pilotes y caissones)
- Losas de cimentación para cargas distribuidas
- Muros de contención y sistemas de drenaje
- Mejoramiento de suelos cuando sea necesario
- Control de calidad en materiales y procesos constructivos
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 2
      },
      {
        slug: 'estructura',
        titulo: 'ESTRUCTURA',
        descripcion_corta: 'Levantamos el esqueleto de su edificación con precisión y máxima seguridad. Construimos estructuras de concreto reforzado que cumplen con los más altos estándares de calidad.',
        contenido_md: `
# ESTRUCTURA

La estructura es el sistema portante que garantiza la resistencia y estabilidad de cualquier edificación. Nuestro servicio abarca el diseño, cálculo y construcción de estructuras de concreto reforzado, acero y sistemas mixtos, cumpliendo con las normativas sísmicas y de construcción vigentes.

Contamos con ingenieros estructurales especializados que desarrollan soluciones técnicas óptimas para cada proyecto. Utilizamos software de análisis estructural avanzado y técnicas constructivas de vanguardia para garantizar la máxima seguridad y eficiencia en cada elemento estructural.

## Elementos Estructurales

- Columnas y vigas de concreto reforzado
- Losas macizas, aligeradas y prefabricadas
- Muros estructurales y de cortante
- Escaleras y elementos especiales
- Estructuras metálicas y sistemas mixtos
- Reforzamiento y rehabilitación estructural
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1519994999489-76f7f0230b9e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 3
      },
      {
        slug: 'mamposteria',
        titulo: 'MAMPOSTERÍA',
        descripcion_corta: 'Realizamos trabajos de mampostería para fachadas y divisiones interiores con precisión y acabados limpios, utilizando materiales de primera para muros sólidos y bien definidos.',
        contenido_md: `
# MAMPOSTERÍA

La mampostería es fundamental para delimitar espacios y conformar las fachadas de una edificación. Nuestro servicio incluye la construcción de muros de fachada, divisiones interiores y elementos arquitectónicos, utilizando diferentes tipos de materiales según las especificaciones del proyecto.

Trabajamos con bloques de concreto, ladrillo cerámico, ladrillo tolete y otros materiales especializados. Nuestro equipo garantiza la verticalidad, horizontalidad y alineación perfecta de todos los elementos, así como el cumplimiento de las especificaciones técnicas de resistencia y aislamiento.

## Tipos de Mampostería

- Mampostería estructural y de relleno
- Fachadas con acabado a la vista
- Divisiones interiores y tabiques
- Elementos decorativos y arquitectónicos
- Chimeneas y elementos especiales
- Reparación y mantenimiento de mampostería existente
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1559422501-f6a89498a4d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '["MAMPOSTERÍA FACHADA", "MAMPOSTERÍA FACHADA A LA VISTA", "MAMPOSTERÍA INTERNA"]',
        idioma: 'ES',
        orden: 4
      },
      {
        slug: 'panetes',
        titulo: 'PAÑETES',
        descripcion_corta: 'Aplicamos revestimientos de mortero en fachadas y muros interiores. Preparamos y protegemos las superficies, dejándolas listas para un acabado final de alta calidad.',
        contenido_md: `
# PAÑETES

El servicio de pañetes o revoques es clave para proteger la mampostería y crear una superficie uniforme lista para los acabados finales. Aplicamos morteros especializados tanto en fachadas como en espacios interiores, garantizando adherencia perfecta, resistencia a la intemperie y acabados de alta calidad.

Nuestro proceso incluye la preparación adecuada de las superficies, la aplicación de morteros en las proporciones correctas y el acabado con las texturas especificadas. Utilizamos aditivos especiales para mejorar la trabajabilidad, adherencia y durabilidad del pañete según las condiciones específicas de cada proyecto.

## Tipos de Pañetes

- Pañete liso para acabados finos
- Pañete rugoso para texturas especiales
- Pañetes impermeables para fachadas
- Pañetes especiales para zonas húmedas
- Reparación de pañetes existentes
- Aplicación de mallas de refuerzo cuando sea necesario
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1581121374966-23b2e595856e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '["PAÑETES FACHADA", "PAÑETES INTERNOS"]',
        idioma: 'ES',
        orden: 5
      },
      {
        slug: 'acabados',
        titulo: 'ACABADOS',
        descripcion_corta: 'Transformamos espacios en bruto en lugares funcionales y estéticos. Cuidamos cada detalle final, desde pisos y techos hasta la carpintería, para entregar un resultado impecable.',
        contenido_md: `
# ACABADOS

La fase de acabados es donde la visión del proyecto cobra vida. Nuestro servicio se enfoca en todos los detalles finales que transforman un espacio en bruto en un ambiente funcional y estéticamente atractivo. Desde pisos y enchapes hasta carpintería y elementos decorativos.

Coordinamos todos los oficios especializados para garantizar un resultado integral y de alta calidad. Nuestro equipo supervisa cada detalle, desde la instalación de pisos hasta los acabados de carpintería, asegurando que todos los elementos se integren perfectamente y cumplan con los estándares de calidad establecidos.

## Tipos de Acabados

- Pisos en cerámica, porcelanato y materiales especiales
- Enchapes en baños, cocinas y fachadas
- Carpintería en madera y materiales sintéticos
- Cielos rasos y elementos decorativos
- Instalación de puertas, ventanas y herrajes
- Acabados especiales según especificaciones del proyecto
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 6
      },
      {
        slug: 'estuco-y-pintura',
        titulo: 'ESTUCO Y PINTURA',
        descripcion_corta: 'Ofrecemos acabados de estuco y pintura para superficies lisas y perfectas. Logramos un resultado final duradero y de gran impacto visual con materiales de primera calidad.',
        contenido_md: `
# ESTUCO Y PINTURA

El servicio de estuco y pintura es el toque final que define la estética de los espacios. Aplicamos estucos de alta calidad para lograr superficies perfectamente lisas y uniformes, seguido de sistemas de pintura que brindan protección y belleza duradera a las superficies.

Utilizamos productos de marcas reconocidas y técnicas especializadas para garantizar acabados impecables. Nuestro proceso incluye la preparación minuciosa de superficies, aplicación de primers cuando sea necesario, y la aplicación de múltiples capas de pintura para lograr el color y acabado deseado.

## Tipos de Acabados

- Estuco liso y texturizado
- Pintura vinílica para interiores
- Pintura elastomérica para fachadas
- Esmaltes y acabados especiales
- Sistemas de pintura anticorrosiva
- Reparación y mantenimiento de acabados existentes
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1596731362429-3c483259844c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 7
      },
      {
        slug: 'drywall',
        titulo: 'DRYWALL',
        descripcion_corta: 'Construcción de muros, divisiones y techos con sistema drywall. Una solución rápida, limpia y versátil para crear o renovar espacios interiores con excelentes acabados.',
        contenido_md: `
# DRYWALL

El sistema drywall es una alternativa moderna y eficiente para la construcción de interiores. Nuestro servicio incluye el diseño e instalación de muros divisorios, cielos rasos y elementos arquitectónicos utilizando paneles de yeso laminado sobre estructuras metálicas.

Esta tecnología permite crear espacios funcionales de manera rápida y limpia, con excelentes propiedades de aislamiento acústico y térmico. Nuestro equipo especializado garantiza instalaciones perfectas, con acabados lisos listos para pintura y la posibilidad de integrar instalaciones eléctricas y de comunicaciones.

## Aplicaciones del Drywall

- Muros divisorios y tabiques
- Cielos rasos suspendidos
- Elementos decorativos y arquitectónicos
- Revestimiento de columnas y vigas
- Muebles empotrados y nichos
- Reparaciones y modificaciones de espacios existentes
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1581094021443-054f4b4c73ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 8
      },
      {
        slug: 'instalacion-de-enchapes',
        titulo: 'INSTALACIÓN DE ENCHAPES',
        descripcion_corta: 'Instalamos enchapes cerámicos y porcelánicos con precisión técnica. Creamos superficies duraderas, impermeables y estéticas para baños, cocinas, pisos y fachadas.',
        contenido_md: `
# INSTALACIÓN DE ENCHAPES

Nuestro servicio de instalación de enchapes garantiza acabados perfectos en superficies que requieren durabilidad, impermeabilidad y estética. Trabajamos con cerámicas, porcelanatos, piedras naturales y materiales especiales, aplicando técnicas especializadas para cada tipo de superficie.

El proceso incluye la preparación adecuada del sustrato, aplicación de impermeabilizantes cuando sea necesario, instalación con adhesivos especializados y acabado con juntas perfectamente alineadas. Garantizamos la planimetría, verticalidad y horizontalidad de todas las superficies enchapadas.

## Tipos de Enchapes

- Cerámicas y porcelanatos para pisos y muros
- Piedras naturales (mármol, granito, travertino)
- Enchapes especiales para fachadas
- Mosaicos y materiales decorativos
- Enchapes antideslizantes para zonas húmedas
- Reparación y mantenimiento de enchapes existentes
        `,
        imagen_principal_url: 'https://images.unsplash.com/photo-1603957278278-656331a6187a?q=80&w=1967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        etiquetas: '[]',
        idioma: 'ES',
        orden: 9
      }
    ];

    // Crear servicios en español
    for (const servicio of serviciosES) {
      await prisma.servicio.create({
        data: servicio
      });
      console.log(`✅ Creado servicio: ${servicio.titulo}`);
    }

    console.log('✅ Servicios en español creados exitosamente');
    return true;

  } catch (error) {
    console.error('❌ Error en migración y seed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

migrateAndSeed();
