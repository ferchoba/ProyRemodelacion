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
      slug: 'remodelacion-cocina-moderna-bogota',
      titulo: 'Remodelación de Cocina Moderna en Bogotá',
      descripcion_md: `
# Remodelación de Cocina Moderna en Bogotá

Este proyecto consistió en la **transformación completa** de una cocina tradicional en un espacio moderno y funcional.

## Características del proyecto

- **Área**: 15 m²
- **Duración**: 3 semanas
- **Estilo**: Moderno minimalista

## Trabajos realizados

### Demolición y preparación
- Demolición de muebles antiguos
- Renovación de instalaciones eléctricas
- Actualización de plomería

### Instalación de nuevos elementos
- Muebles modulares en melamina blanca
- Encimera en cuarzo blanco
- Electrodomésticos empotrados
- Iluminación LED bajo muebles

### Acabados
- Pintura en tonos neutros
- Piso en porcelanato imitación madera
- Backsplash en cerámica tipo subway

## Resultado

Una cocina completamente renovada que maximiza el espacio disponible y ofrece una experiencia culinaria moderna y eficiente.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '[]',
      tipo_servicio_slug: 'renovacion-cocinas',
      fecha_finalizacion: new Date('2024-01-15'),
    },
    {
      slug: 'remodelacion-bano-principal-medellin',
      titulo: 'Remodelación de Baño Principal en Medellín',
      descripcion_md: `
# Remodelación de Baño Principal en Medellín

Transformación completa de un baño principal, creando un espacio elegante y relajante.

## Detalles del proyecto

- **Área**: 8 m²
- **Duración**: 2 semanas
- **Estilo**: Contemporáneo elegante

## Elementos destacados

### Sanitarios y grifería
- Sanitario de una pieza
- Lavamanos doble con mueble flotante
- Grifería cromada de alta gama
- Ducha tipo lluvia

### Acabados premium
- Porcelanato rectificado 60x60
- Enchapes en porcelanato tipo mármol
- Mampara en vidrio templado
- Iluminación LED perimetral

## Resultado final

Un baño moderno que combina funcionalidad y elegancia, creando un verdadero oasis de relajación.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '[]',
      tipo_servicio_slug: 'renovacion-banos',
      fecha_finalizacion: new Date('2024-02-28'),
    },
    {
      slug: 'remodelacion-integral-apartamento-cali',
      titulo: 'Remodelación Integral de Apartamento en Cali',
      descripcion_md: `
# Remodelación Integral de Apartamento en Cali

Proyecto de remodelación completa de un apartamento de 80 m², modernizando todos los espacios.

## Alcance del proyecto

- **Área total**: 80 m²
- **Duración**: 8 semanas
- **Espacios**: Sala, comedor, cocina, 2 habitaciones, 2 baños

## Trabajos realizados

### Espacios sociales
- Integración de sala y comedor
- Cocina abierta con isla
- Pisos en porcelanato rectificado

### Habitaciones
- Closets empotrados
- Iluminación LED
- Pintura en colores neutros

### Baños
- Renovación completa
- Acabados modernos
- Optimización de espacios

### Instalaciones
- Renovación eléctrica completa
- Actualización de plomería
- Sistema de aire acondicionado

## Resultado

Un apartamento completamente renovado con espacios modernos, funcionales y llenos de luz natural.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '[]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-03-20'),
    },
    {
      slug: 'apartamento-integral-moderno',
      titulo: 'Apartamento Integral Moderno',
      descripcion_md: `
# Apartamento Integral Moderno

Remodelación completa de apartamento con diseño contemporáneo y funcional.

## Características

- **Área**: 75 m²
- **Duración**: 6 semanas
- **Estilo**: Moderno contemporáneo

## Resultado

Espacios integrados con acabados de alta calidad y diseño funcional.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-03-20'),
    },
    {
      slug: 'cocina-contemporanea-lujo',
      titulo: 'Cocina Contemporánea de Lujo',
      descripcion_md: `
# Cocina Contemporánea de Lujo

Diseño de cocina moderna con acabados premium y electrodomésticos de alta gama.

## Características

- **Área**: 20 m²
- **Duración**: 4 semanas
- **Estilo**: Contemporáneo de lujo

## Resultado

Cocina funcional con isla central y acabados de lujo.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center"]',
      tipo_servicio_slug: 'renovacion-cocinas',
      fecha_finalizacion: new Date('2024-04-20'),
    },
    {
      slug: 'bano-spa-relajacion',
      titulo: 'Baño Spa de Relajación',
      descripcion_md: `
# Baño Spa de Relajación

Transformación de baño principal en un spa privado con acabados de lujo.

## Características

- **Área**: 12 m²
- **Duración**: 3 semanas
- **Estilo**: Spa contemporáneo

## Resultado

Baño tipo spa con tina de hidromasaje y acabados premium.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '["https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center"]',
      tipo_servicio_slug: 'renovacion-banos',
      fecha_finalizacion: new Date('2024-03-10'),
    },
    {
      slug: 'casa-moderna-integral',
      titulo: 'Remodelación Integral Casa Moderna',
      descripcion_md: `
# Remodelación Integral Casa Moderna

Proyecto completo de remodelación de casa unifamiliar con diseño moderno.

## Características

- **Área**: 150 m²
- **Duración**: 12 semanas
- **Estilo**: Moderno integral

## Resultado

Casa completamente renovada con espacios abiertos y diseño contemporáneo.
      `,
      imagen_portada_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
      galeria_urls: '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop&crop=center", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center"]',
      tipo_servicio_slug: 'remodelaciones-integrales',
      fecha_finalizacion: new Date('2024-06-15'),
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
