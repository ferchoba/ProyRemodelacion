const { createClient } = require('@libsql/client');

// Credenciales de Turso
const TURSO_DATABASE_URL = "libsql://agl-construcciones-aglconstrucciones.aws-us-east-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTUyOTMyNzcsImlkIjoiMDRkYThkZmMtZWM5NC00YWYzLTlhZmQtMjZjNGJmMzgyOTk1IiwicmlkIjoiYmE4OWRiNzktNGU1ZS00ODY3LTk2OWYtYjZmZjQ1MGE3MzU2In0.OjvLf1I6gYcBmwCRWAo0z4T66Uz62kiQtCv7cLLXilNEEsSiJoYjCXKBJZp0EcEnUp5_KX9ksx9gNkRAqa4cBw";

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function migrateToTurso() {
  console.log('🚀 Migrando datos a Turso Cloud...\n');

  try {
    // Test 1: Verificar conectividad
    console.log('1️⃣ Verificando conectividad...');
    await client.execute('SELECT 1 as test');
    console.log('✅ Conectividad: OK');

    // Test 2: Verificar si las tablas existen
    console.log('\n2️⃣ Verificando estructura de tablas...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    console.log('📋 Tablas existentes:');
    tables.rows.forEach(row => console.log(`   - ${row.name}`));

    // Test 3: Verificar datos existentes
    console.log('\n3️⃣ Verificando datos existentes...');
    
    try {
      const serviciosCount = await client.execute('SELECT COUNT(*) as count FROM servicios');
      console.log(`   📋 Servicios: ${serviciosCount.rows[0].count}`);
      
      const proyectosCount = await client.execute('SELECT COUNT(*) as count FROM proyectos');
      console.log(`   📁 Proyectos: ${proyectosCount.rows[0].count}`);
      
      const parametrosCount = await client.execute('SELECT COUNT(*) as count FROM parametros');
      console.log(`   ⚙️  Parámetros: ${parametrosCount.rows[0].count}`);

      // Si ya hay datos, preguntar si queremos sobrescribir
      const totalRecords = Number(serviciosCount.rows[0].count) + 
                          Number(proyectosCount.rows[0].count) + 
                          Number(parametrosCount.rows[0].count);

      if (totalRecords > 0) {
        console.log(`\n⚠️  La base de datos Turso ya contiene ${totalRecords} registros.`);
        console.log('🔄 Procediendo a limpiar y repoblar...');
        
        // Limpiar datos existentes
        await client.execute('DELETE FROM proyectos');
        await client.execute('DELETE FROM servicios');
        await client.execute('DELETE FROM parametros');
        await client.execute('DELETE FROM quienes_somos');
        console.log('🧹 Datos existentes eliminados');
      }
    } catch (error) {
      console.log('ℹ️  Las tablas no existen o están vacías, creando datos...');
    }

    // Test 4: Poblar con datos
    console.log('\n4️⃣ Poblando base de datos...');

    // Crear parámetros
    console.log('📝 Creando parámetros...');
    await client.execute(`
      INSERT INTO parametros (clave, valor, descripcion) VALUES 
      ('whatsapp_numero', '+573012571215', 'Número de WhatsApp para contacto'),
      ('email_contacto', 'fercho.ba@gmail.com', 'Email principal de contacto'),
      ('direccion', 'Tunja, Boyacá, Colombia', 'Dirección de la empresa')
    `);

    // Crear servicios en español
    console.log('🔧 Creando servicios en español...');
    const serviciosES = [
      ['demoliciones', 'DEMOLICIONES', 'Demolición controlada y segura de estructuras', 'ES', 1],
      ['cimentacion', 'CIMENTACIÓN', 'Construcción de bases sólidas y duraderas', 'ES', 2],
      ['estructura', 'ESTRUCTURA', 'Construcción de estructuras resistentes', 'ES', 3],
      ['mamposteria', 'MAMPOSTERÍA', 'Construcción de muros y paredes', 'ES', 4],
      ['panetes', 'PAÑETES', 'Acabados de superficies y muros', 'ES', 5],
      ['acabados', 'ACABADOS', 'Acabados finales de construcción', 'ES', 6],
      ['estuco-pintura', 'ESTUCO Y PINTURA', 'Aplicación de estuco y pintura', 'ES', 7],
      ['drywall', 'DRYWALL', 'Instalación de sistemas drywall', 'ES', 8],
      ['enchapes', 'INSTALACIÓN DE ENCHAPES', 'Instalación de enchapes y cerámicas', 'ES', 9]
    ];

    for (const [slug, titulo, descripcion, idioma, orden] of serviciosES) {
      await client.execute(`
        INSERT INTO servicios (slug, titulo, descripcion_corta, contenido_md, imagen_principal_url, etiquetas, idioma, orden, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        slug, 
        titulo, 
        descripcion,
        `# ${titulo}\n\n${descripcion} con los más altos estándares de calidad.`,
        `https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/${slug}_es.jpg`,
        `["${slug}", "construcción", "calidad"]`,
        idioma,
        orden
      ]);
      console.log(`  ✅ ${titulo}`);
    }

    // Crear servicios en inglés
    console.log('🔧 Creando servicios en inglés...');
    const serviciosEN = [
      ['demolitions', 'DEMOLITIONS', 'Controlled and safe demolition of structures', 'EN', 1],
      ['foundation', 'FOUNDATION', 'Construction of solid and durable foundations', 'EN', 2],
      ['structure', 'STRUCTURE', 'Construction of resistant structures', 'EN', 3]
    ];

    for (const [slug, titulo, descripcion, idioma, orden] of serviciosEN) {
      await client.execute(`
        INSERT INTO servicios (slug, titulo, descripcion_corta, contenido_md, imagen_principal_url, etiquetas, idioma, orden, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `, [
        slug, 
        titulo, 
        descripcion,
        `# ${titulo}\n\n${descripcion} with the highest quality standards.`,
        `https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/${slug}_en.jpg`,
        `["${slug}", "construction", "quality"]`,
        idioma,
        orden
      ]);
      console.log(`  ✅ ${titulo}`);
    }

    // Crear proyectos
    console.log('📁 Creando proyectos...');
    
    // Obtener ID del servicio de estructura
    const estructuraResult = await client.execute(`
      SELECT id FROM servicios WHERE slug = 'estructura' AND idioma = 'ES' LIMIT 1
    `);
    
    if (estructuraResult.rows.length > 0) {
      const servicioId = estructuraResult.rows[0].id;
      
      const proyectos = [
        ['proyecto-universidad', 'UNIVERSIDAD SANTO TOMAS DE TUNJA', '2024-11-20'],
        ['proyecto-entreparques', 'ENTREPARQUES', '2024-10-15']
      ];

      for (const [slug, titulo, fecha] of proyectos) {
        await client.execute(`
          INSERT INTO proyectos (slug, titulo, descripcion_md, imagen_portada_url, galeria_urls, servicio_id, fecha_finalizacion, activo) 
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `, [
          slug,
          titulo,
          `# ${titulo}\n\nProyecto de construcción y remodelación de alta calidad.`,
          `https://res.cloudinary.com/dq5joejf7/image/upload/v1755128643/${slug}.jpg`,
          `["https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/${slug}_gallery.jpg"]`,
          servicioId,
          fecha
        ]);
        console.log(`  ✅ ${titulo}`);
      }
    }

    // Crear contenido "Quiénes Somos"
    console.log('👥 Creando contenido "Quiénes Somos"...');
    await client.execute(`
      INSERT INTO quienes_somos (titulo, contenido_md, imagen_equipo_url) 
      VALUES (?, ?, ?)
    `, [
      'Sobre AGL CONSTRUCCIONES SAS',
      '# Sobre Nosotros\n\nSomos una empresa especializada en construcción y remodelación con más de 10 años de experiencia.',
      'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/equipo.jpg'
    ]);

    // Verificar resultados finales
    console.log('\n5️⃣ Verificando migración...');
    
    const finalCounts = {
      servicios: await client.execute('SELECT COUNT(*) as count FROM servicios'),
      proyectos: await client.execute('SELECT COUNT(*) as count FROM proyectos'),
      parametros: await client.execute('SELECT COUNT(*) as count FROM parametros'),
      quienes_somos: await client.execute('SELECT COUNT(*) as count FROM quienes_somos')
    };

    console.log('\n📊 Resumen final:');
    Object.entries(finalCounts).forEach(([table, result]) => {
      console.log(`  ${table}: ${result.rows[0].count} registros`);
    });

    // Verificar servicios por idioma
    const serviciosESFinal = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "ES"');
    const serviciosENFinal = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "EN"');
    
    console.log('\n🌐 Servicios por idioma:');
    console.log(`  Español (ES): ${serviciosESFinal.rows[0].count}`);
    console.log(`  Inglés (EN): ${serviciosENFinal.rows[0].count}`);

    console.log('\n🎉 ¡Migración a Turso completada exitosamente!');
    console.log('🔗 La base de datos Turso está lista para usar en desarrollo.');

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }

  return true;
}

migrateToTurso()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Migración falló:', error);
    process.exit(1);
  });
