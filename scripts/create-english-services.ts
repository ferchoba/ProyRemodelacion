import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Traducciones oficiales de títulos
const TITLE_TRANSLATIONS: Record<string, string> = {
  'DEMOLICIONES': 'DEMOLITION',
  'CIMENTACIÓN': 'FOUNDATION',
  'ESTRUCTURA': 'STRUCTURE',
  'MAMPOSTERÍA': 'MASONRY',
  'PAÑETES': 'PLASTERING',
  'ACABADOS': 'FINISHES',
  'ESTUCO Y PINTURA': 'STUCCO AND PAINT',
  'DRYWALL': 'DRYWALL',
  'INSTALACIÓN DE ENCHAPES': 'TILING INSTALLATION'
};

// Traducciones de descripciones cortas
const SHORT_DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  'DEMOLICIONES': 'Professional service for safe and efficient structural dismantling. We guarantee a controlled process, complying with regulations and preparing the site for new projects.',
  'CIMENTACIÓN': 'We build the solid and durable foundations your building needs. We create safe and stable foundations, calculated to guarantee the longevity of your project.',
  'ESTRUCTURA': 'We build the skeleton of your building with precision and maximum safety. We construct reinforced concrete structures that meet the highest quality standards.',
  'MAMPOSTERÍA': 'We perform masonry work for facades and interior divisions with precision and clean finishes, using first-class materials for solid and well-defined walls.',
  'PAÑETES': 'We apply mortar coatings on facades and interior walls. We prepare and protect surfaces, leaving them ready for a high-quality final finish.',
  'ACABADOS': 'We transform raw spaces into functional and aesthetic places. We take care of every final detail, from floors and ceilings to carpentry, to deliver an impeccable result.',
  'ESTUCO Y PINTURA': 'We offer stucco and paint finishes for smooth and perfect surfaces. We achieve a durable final result with great visual impact using first-quality materials.',
  'DRYWALL': 'Construction of walls, partitions and ceilings with drywall system. A quick, clean and versatile solution to create or renovate interior spaces with excellent finishes.',
  'INSTALACIÓN DE ENCHAPES': 'We install ceramic and porcelain tiles with technical precision. We create durable, waterproof and aesthetic surfaces for bathrooms, kitchens, floors and facades.'
};

// Traducciones de etiquetas
const TAG_TRANSLATIONS: Record<string, string> = {
  'MAMPOSTERÍA FACHADA': 'FACADE MASONRY',
  'MAMPOSTERÍA FACHADA A LA VISTA': 'EXPOSED FACADE MASONRY',
  'MAMPOSTERÍA INTERNA': 'INTERNAL MASONRY',
  'PAÑETES FACHADA': 'FACADE PLASTERING',
  'PAÑETES INTERNOS': 'INTERNAL PLASTERING'
};

// Función para traducir etiquetas
function translateTags(etiquetasJson: string): string {
  try {
    const etiquetas = JSON.parse(etiquetasJson);
    if (!Array.isArray(etiquetas)) return etiquetasJson;
    
    const translatedTags = etiquetas.map(tag => TAG_TRANSLATIONS[tag] || tag);
    return JSON.stringify(translatedTags);
  } catch {
    return etiquetasJson;
  }
}

async function createEnglishServices() {
  try {
    console.log('🚀 Iniciando creación de servicios en inglés...');

    // Verificar que no existan servicios en inglés
    const existingEnglishServices = await prisma.servicio.findMany({
      where: { idioma: 'EN' }
    });

    if (existingEnglishServices.length > 0) {
      console.log('⚠️  Ya existen servicios en inglés. Eliminando primero...');
      await prisma.servicio.deleteMany({
        where: { idioma: 'EN' }
      });
      console.log(`✅ Eliminados ${existingEnglishServices.length} servicios en inglés existentes`);
    }

    // Obtener todos los servicios en español
    const serviciosES = await prisma.servicio.findMany({
      where: { idioma: 'ES' },
      orderBy: { orden: 'asc' }
    });

    console.log(`📋 Encontrados ${serviciosES.length} servicios en español para traducir`);

    let createdCount = 0;

    for (const servicioES of serviciosES) {
      const tituloEN = TITLE_TRANSLATIONS[servicioES.titulo];
      const descripcionEN = SHORT_DESCRIPTION_TRANSLATIONS[servicioES.titulo];

      if (!tituloEN || !descripcionEN) {
        console.log(`⚠️  No se encontró traducción para: ${servicioES.titulo}`);
        continue;
      }

      // Traducir contenido Markdown
      const contenidoEN = translateMarkdownContent(servicioES.contenido_md, servicioES.titulo);
      
      // Traducir etiquetas
      const etiquetasEN = translateTags(servicioES.etiquetas);

      // Crear el servicio en inglés
      const servicioEN = await prisma.servicio.create({
        data: {
          slug: servicioES.slug, // Mantener el mismo slug
          titulo: tituloEN,
          descripcion_corta: descripcionEN,
          contenido_md: contenidoEN,
          imagen_principal_url: servicioES.imagen_principal_url,
          etiquetas: etiquetasEN,
          idioma: 'EN',
          orden: servicioES.orden, // Mantener el mismo orden
          activo: servicioES.activo
        }
      });

      console.log(`✅ Creado: ${servicioEN.titulo} (orden: ${servicioEN.orden})`);
      createdCount++;
    }

    console.log(`\n🎉 ¡Proceso completado! Creados ${createdCount} servicios en inglés`);

    // Verificar el resultado
    const totalServicios = await prisma.servicio.count();
    const serviciosEN = await prisma.servicio.count({ where: { idioma: 'EN' } });
    const serviciosESFinal = await prisma.servicio.count({ where: { idioma: 'ES' } });

    console.log('\n📊 Resumen final:');
    console.log(`- Total de servicios: ${totalServicios}`);
    console.log(`- Servicios en español: ${serviciosESFinal}`);
    console.log(`- Servicios en inglés: ${serviciosEN}`);

    return true;

  } catch (error) {
    console.error('❌ Error creando servicios en inglés:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para traducir contenido Markdown
function translateMarkdownContent(contenidoMD: string, titulo: string): string {
  const tituloEN = TITLE_TRANSLATIONS[titulo];
  
  // Traducciones específicas por servicio
  const translations: Record<string, Record<string, string>> = {
    'DEMOLICIONES': {
      '# DEMOLICIONES': '# DEMOLITION',
      'Nuestro servicio de demoliciones abarca desde el desmonte parcial hasta el derribo completo de edificaciones, gestionando cada etapa con máxima seguridad y eficiencia. Realizamos un análisis técnico previo para definir la estrategia más adecuada, utilizando maquinaria especializada y técnicas de demolición controlada que minimizan el impacto en el entorno.': 'Our demolition service ranges from partial dismantling to complete building demolition, managing each stage with maximum safety and efficiency. We perform a prior technical analysis to define the most appropriate strategy, using specialized machinery and controlled demolition techniques that minimize environmental impact.',
      'Nos encargamos de la gestión de residuos conforme a las normativas ambientales, asegurando un sitio de trabajo limpio y seguro. Nuestro equipo experto garantiza que el terreno quede completamente despejado y listo para la fase de cimentación, cumpliendo rigurosamente con los plazos y estándares de calidad acordados.': 'We handle waste management in accordance with environmental regulations, ensuring a clean and safe work site. Our expert team guarantees that the site is completely cleared and ready for the foundation phase, strictly complying with agreed deadlines and quality standards.',
      '## Características del Servicio': '## Service Features',
      'Análisis técnico previo y planificación estratégica': 'Prior technical analysis and strategic planning',
      'Maquinaria especializada y técnicas de demolición controlada': 'Specialized machinery and controlled demolition techniques',
      'Cumplimiento estricto de normativas de seguridad': 'Strict compliance with safety regulations',
      'Gestión responsable de residuos y materiales': 'Responsible waste and material management',
      'Preparación del terreno para nuevas construcciones': 'Site preparation for new constructions',
      'Minimización del impacto ambiental y en el entorno': 'Minimization of environmental and surrounding impact'
    },
    'CIMENTACIÓN': {
      '# CIMENTACIÓN': '# FOUNDATION',
      'La cimentación es la base de toda construcción segura y perdurable. Nuestro servicio abarca desde el estudio de suelos hasta la ejecución de cimentaciones superficiales y profundas, adaptándonos a las características específicas del terreno y los requerimientos estructurales del proyecto.': 'Foundation is the basis of every safe and lasting construction. Our service ranges from soil studies to the execution of shallow and deep foundations, adapting to the specific characteristics of the terrain and the structural requirements of the project.',
      'Utilizamos técnicas constructivas modernas y materiales de primera calidad para garantizar la estabilidad y durabilidad de la estructura. Nuestro equipo especializado realiza un control riguroso en cada etapa del proceso, desde la excavación hasta el curado del concreto, asegurando que la cimentación cumpla con las especificaciones técnicas y normativas vigentes.': 'We use modern construction techniques and first-quality materials to guarantee the stability and durability of the structure. Our specialized team performs rigorous control at each stage of the process, from excavation to concrete curing, ensuring that the foundation meets current technical specifications and regulations.',
      '## Tipos de Cimentación': '## Foundation Types',
      'Cimentaciones superficiales (zapatas aisladas, corridas y combinadas)': 'Shallow foundations (isolated, continuous and combined footings)',
      'Cimentaciones profundas (pilotes y caissones)': 'Deep foundations (piles and caissons)',
      'Losas de cimentación para cargas distribuidas': 'Foundation slabs for distributed loads',
      'Muros de contención y sistemas de drenaje': 'Retaining walls and drainage systems',
      'Mejoramiento de suelos cuando sea necesario': 'Soil improvement when necessary',
      'Control de calidad en materiales y procesos constructivos': 'Quality control in materials and construction processes'
    },
    'ESTRUCTURA': {
      '# ESTRUCTURA': '# STRUCTURE',
      'La estructura es el sistema portante que garantiza la resistencia y estabilidad de cualquier edificación. Nuestro servicio abarca el diseño, cálculo y construcción de estructuras de concreto reforzado, acero y sistemas mixtos, cumpliendo con las normativas sísmicas y de construcción vigentes.': 'The structure is the load-bearing system that guarantees the resistance and stability of any building. Our service covers the design, calculation and construction of reinforced concrete, steel and mixed system structures, complying with current seismic and construction regulations.',
      'Contamos con ingenieros estructurales especializados que desarrollan soluciones técnicas óptimas para cada proyecto. Utilizamos software de análisis estructural avanzado y técnicas constructivas de vanguardia para garantizar la máxima seguridad y eficiencia en cada elemento estructural.': 'We have specialized structural engineers who develop optimal technical solutions for each project. We use advanced structural analysis software and cutting-edge construction techniques to guarantee maximum safety and efficiency in each structural element.',
      '## Elementos Estructurales': '## Structural Elements',
      'Columnas y vigas de concreto reforzado': 'Reinforced concrete columns and beams',
      'Losas macizas, aligeradas y prefabricadas': 'Solid, lightened and prefabricated slabs',
      'Muros estructurales y de cortante': 'Structural and shear walls',
      'Escaleras y elementos especiales': 'Stairs and special elements',
      'Estructuras metálicas y sistemas mixtos': 'Metal structures and mixed systems',
      'Reforzamiento y rehabilitación estructural': 'Structural reinforcement and rehabilitation'
    },
    'MAMPOSTERÍA': {
      '# MAMPOSTERÍA': '# MASONRY',
      'La mampostería es fundamental para delimitar espacios y conformar las fachadas de una edificación. Nuestro servicio incluye la construcción de muros de fachada, divisiones interiores y elementos arquitectónicos, utilizando diferentes tipos de materiales según las especificaciones del proyecto.': 'Masonry is fundamental for delimiting spaces and forming building facades. Our service includes the construction of facade walls, interior partitions and architectural elements, using different types of materials according to project specifications.',
      'Trabajamos con bloques de concreto, ladrillo cerámico, ladrillo tolete y otros materiales especializados. Nuestro equipo garantiza la verticalidad, horizontalidad y alineación perfecta de todos los elementos, así como el cumplimiento de las especificaciones técnicas de resistencia y aislamiento.': 'We work with concrete blocks, ceramic brick, tolete brick and other specialized materials. Our team guarantees the verticality, horizontality and perfect alignment of all elements, as well as compliance with technical specifications for resistance and insulation.',
      '## Tipos de Mampostería': '## Masonry Types',
      'Mampostería estructural y de relleno': 'Structural and infill masonry',
      'Fachadas con acabado a la vista': 'Facades with exposed finish',
      'Divisiones interiores y tabiques': 'Interior partitions and walls',
      'Elementos decorativos y arquitectónicos': 'Decorative and architectural elements',
      'Chimeneas y elementos especiales': 'Chimneys and special elements',
      'Reparación y mantenimiento de mampostería existente': 'Repair and maintenance of existing masonry'
    },
    'PAÑETES': {
      '# PAÑETES': '# PLASTERING',
      'El servicio de pañetes o revoques es clave para proteger la mampostería y crear una superficie uniforme lista para los acabados finales. Aplicamos morteros especializados tanto en fachadas como en espacios interiores, garantizando adherencia perfecta, resistencia a la intemperie y acabados de alta calidad.': 'The plastering or rendering service is key to protecting masonry and creating a uniform surface ready for final finishes. We apply specialized mortars both on facades and in interior spaces, guaranteeing perfect adhesion, weather resistance and high-quality finishes.',
      'Nuestro proceso incluye la preparación adecuada de las superficies, la aplicación de morteros en las proporciones correctas y el acabado con las texturas especificadas. Utilizamos aditivos especiales para mejorar la trabajabilidad, adherencia y durabilidad del pañete según las condiciones específicas de cada proyecto.': 'Our process includes proper surface preparation, application of mortars in correct proportions and finishing with specified textures. We use special additives to improve workability, adhesion and durability of the plaster according to the specific conditions of each project.',
      '## Tipos de Pañetes': '## Plastering Types',
      'Pañete liso para acabados finos': 'Smooth plaster for fine finishes',
      'Pañete rugoso para texturas especiales': 'Rough plaster for special textures',
      'Pañetes impermeables para fachadas': 'Waterproof plasters for facades',
      'Pañetes especiales para zonas húmedas': 'Special plasters for wet areas',
      'Reparación de pañetes existentes': 'Repair of existing plasters',
      'Aplicación de mallas de refuerzo cuando sea necesario': 'Application of reinforcement meshes when necessary'
    },
    'ACABADOS': {
      '# ACABADOS': '# FINISHES',
      'La fase de acabados es donde la visión del proyecto cobra vida. Nuestro servicio se enfoca en todos los detalles finales que transforman un espacio en bruto en un ambiente funcional y estéticamente atractivo. Desde pisos y enchapes hasta carpintería y elementos decorativos.': 'The finishing phase is where the project vision comes to life. Our service focuses on all the final details that transform a raw space into a functional and aesthetically attractive environment. From floors and tiles to carpentry and decorative elements.',
      'Coordinamos todos los oficios especializados para garantizar un resultado integral y de alta calidad. Nuestro equipo supervisa cada detalle, desde la instalación de pisos hasta los acabados de carpintería, asegurando que todos los elementos se integren perfectamente y cumplan con los estándares de calidad establecidos.': 'We coordinate all specialized trades to guarantee a comprehensive and high-quality result. Our team supervises every detail, from floor installation to carpentry finishes, ensuring that all elements integrate perfectly and meet established quality standards.',
      '## Tipos de Acabados': '## Finish Types',
      'Pisos en cerámica, porcelanato y materiales especiales': 'Ceramic, porcelain and special material floors',
      'Enchapes en baños, cocinas y fachadas': 'Tiles in bathrooms, kitchens and facades',
      'Carpintería en madera y materiales sintéticos': 'Carpentry in wood and synthetic materials',
      'Cielos rasos y elementos decorativos': 'Ceilings and decorative elements',
      'Instalación de puertas, ventanas y herrajes': 'Installation of doors, windows and hardware',
      'Acabados especiales según especificaciones del proyecto': 'Special finishes according to project specifications'
    },
    'ESTUCO Y PINTURA': {
      '# ESTUCO Y PINTURA': '# STUCCO AND PAINT',
      'El servicio de estuco y pintura es el toque final que define la estética de los espacios. Aplicamos estucos de alta calidad para lograr superficies perfectamente lisas y uniformes, seguido de sistemas de pintura que brindan protección y belleza duradera a las superficies.': 'The stucco and paint service is the final touch that defines the aesthetics of spaces. We apply high-quality stuccos to achieve perfectly smooth and uniform surfaces, followed by paint systems that provide protection and lasting beauty to surfaces.',
      'Utilizamos productos de marcas reconocidas y técnicas especializadas para garantizar acabados impecables. Nuestro proceso incluye la preparación minuciosa de superficies, aplicación de primers cuando sea necesario, y la aplicación de múltiples capas de pintura para lograr el color y acabado deseado.': 'We use products from recognized brands and specialized techniques to guarantee impeccable finishes. Our process includes meticulous surface preparation, application of primers when necessary, and application of multiple paint coats to achieve the desired color and finish.',
      '## Tipos de Acabados': '## Finish Types',
      'Estuco liso y texturizado': 'Smooth and textured stucco',
      'Pintura vinílica para interiores': 'Vinyl paint for interiors',
      'Pintura elastomérica para fachadas': 'Elastomeric paint for facades',
      'Esmaltes y acabados especiales': 'Enamels and special finishes',
      'Sistemas de pintura anticorrosiva': 'Anti-corrosive paint systems',
      'Reparación y mantenimiento de acabados existentes': 'Repair and maintenance of existing finishes'
    },
    'DRYWALL': {
      '# DRYWALL': '# DRYWALL',
      'El sistema drywall es una alternativa moderna y eficiente para la construcción de interiores. Nuestro servicio incluye el diseño e instalación de muros divisorios, cielos rasos y elementos arquitectónicos utilizando paneles de yeso laminado sobre estructuras metálicas.': 'The drywall system is a modern and efficient alternative for interior construction. Our service includes the design and installation of partition walls, ceilings and architectural elements using laminated gypsum panels on metal structures.',
      'Esta tecnología permite crear espacios funcionales de manera rápida y limpia, con excelentes propiedades de aislamiento acústico y térmico. Nuestro equipo especializado garantiza instalaciones perfectas, con acabados lisos listos para pintura y la posibilidad de integrar instalaciones eléctricas y de comunicaciones.': 'This technology allows creating functional spaces quickly and cleanly, with excellent acoustic and thermal insulation properties. Our specialized team guarantees perfect installations, with smooth finishes ready for painting and the possibility of integrating electrical and communication installations.',
      '## Aplicaciones del Drywall': '## Drywall Applications',
      'Muros divisorios y tabiques': 'Partition walls and partitions',
      'Cielos rasos suspendidos': 'Suspended ceilings',
      'Elementos decorativos y arquitectónicos': 'Decorative and architectural elements',
      'Revestimiento de columnas y vigas': 'Column and beam cladding',
      'Muebles empotrados y nichos': 'Built-in furniture and niches',
      'Reparaciones y modificaciones de espacios existentes': 'Repairs and modifications of existing spaces'
    },
    'INSTALACIÓN DE ENCHAPES': {
      '# INSTALACIÓN DE ENCHAPES': '# TILING INSTALLATION',
      'Nuestro servicio de instalación de enchapes garantiza acabados perfectos en superficies que requieren durabilidad, impermeabilidad y estética. Trabajamos con cerámicas, porcelanatos, piedras naturales y materiales especiales, aplicando técnicas especializadas para cada tipo de superficie.': 'Our tiling installation service guarantees perfect finishes on surfaces that require durability, waterproofing and aesthetics. We work with ceramics, porcelain, natural stones and special materials, applying specialized techniques for each type of surface.',
      'El proceso incluye la preparación adecuada del sustrato, aplicación de impermeabilizantes cuando sea necesario, instalación con adhesivos especializados y acabado con juntas perfectamente alineadas. Garantizamos la planimetría, verticalidad y horizontalidad de todas las superficies enchapadas.': 'The process includes proper substrate preparation, application of waterproofing when necessary, installation with specialized adhesives and finishing with perfectly aligned joints. We guarantee the planimetry, verticality and horizontality of all tiled surfaces.',
      '## Tipos de Enchapes': '## Tile Types',
      'Cerámicas y porcelanatos para pisos y muros': 'Ceramics and porcelain for floors and walls',
      'Piedras naturales (mármol, granito, travertino)': 'Natural stones (marble, granite, travertine)',
      'Enchapes especiales para fachadas': 'Special tiles for facades',
      'Mosaicos y materiales decorativos': 'Mosaics and decorative materials',
      'Enchapes antideslizantes para zonas húmedas': 'Non-slip tiles for wet areas',
      'Reparación y mantenimiento de enchapes existentes': 'Repair and maintenance of existing tiles'
    }
  };

  let contenidoTraducido = contenidoMD;
  
  // Aplicar traducciones específicas si existen
  if (translations[titulo]) {
    Object.entries(translations[titulo]).forEach(([original, traduccion]) => {
      contenidoTraducido = contenidoTraducido.replace(original, traduccion);
    });
  }

  // Reemplazar el título principal
  contenidoTraducido = contenidoTraducido.replace(`# ${titulo}`, `# ${tituloEN}`);

  return contenidoTraducido;
}

createEnglishServices();
