const { createClient } = require('@libsql/client');

// Credenciales de Turso
const TURSO_DATABASE_URL = "libsql://agl-construcciones-aglconstrucciones.aws-us-east-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTUyOTMyNzcsImlkIjoiMDRkYThkZmMtZWM5NC00YWYzLTlhZmQtMjZjNGJmMzgyOTk1IiwicmlkIjoiYmE4OWRiNzktNGU1ZS00ODY3LTk2OWYtYjZmZjQ1MGE3MzU2In0.OjvLf1I6gYcBmwCRWAo0z4T66Uz62kiQtCv7cLLXilNEEsSiJoYjCXKBJZp0EcEnUp5_KX9ksx9gNkRAqa4cBw";

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function setupTursoSchema() {
  console.log('🔧 Configurando esquema de Turso...\n');

  try {
    // 1. Verificar conectividad
    console.log('1️⃣ Verificando conectividad...');
    await client.execute('SELECT 1 as test');
    console.log('✅ Conectividad: OK');

    // 2. Listar tablas existentes
    console.log('\n2️⃣ Verificando tablas existentes...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    const existingTables = tables.rows.map(row => row.name);
    console.log('📋 Tablas existentes:');
    existingTables.forEach(table => console.log(`   - ${table}`));

    // 3. Crear tablas faltantes
    console.log('\n3️⃣ Creando tablas faltantes...');

    // Tabla parametros
    if (!existingTables.includes('parametros')) {
      console.log('📝 Creando tabla parametros...');
      await client.execute(`
        CREATE TABLE parametros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clave TEXT NOT NULL UNIQUE,
          valor TEXT NOT NULL,
          descripcion TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla parametros creada');
    } else {
      console.log('✅ Tabla parametros ya existe');
    }

    // Tabla quienes_somos
    if (!existingTables.includes('quienes_somos')) {
      console.log('👥 Creando tabla quienes_somos...');
      await client.execute(`
        CREATE TABLE quienes_somos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          contenido_md TEXT NOT NULL,
          imagen_equipo_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla quienes_somos creada');
    } else {
      console.log('✅ Tabla quienes_somos ya existe');
    }

    // Tabla formularios (si no existe)
    if (!existingTables.includes('formularios')) {
      console.log('📋 Creando tabla formularios...');
      await client.execute(`
        CREATE TABLE formularios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          email TEXT NOT NULL,
          telefono TEXT,
          mensaje TEXT NOT NULL,
          tipo TEXT DEFAULT 'contacto',
          estado TEXT DEFAULT 'pendiente',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla formularios creada');
    } else {
      console.log('✅ Tabla formularios ya existe');
    }

    // 4. Poblar datos básicos si las tablas están vacías
    console.log('\n4️⃣ Verificando y poblando datos básicos...');

    // Verificar parámetros
    const parametrosCount = await client.execute('SELECT COUNT(*) as count FROM parametros');
    if (Number(parametrosCount.rows[0].count) === 0) {
      console.log('📝 Poblando parámetros...');
      await client.execute(`
        INSERT INTO parametros (clave, valor, descripcion) VALUES 
        ('whatsapp_numero', '+573012571215', 'Número de WhatsApp para contacto'),
        ('email_contacto', 'fercho.ba@gmail.com', 'Email principal de contacto'),
        ('direccion', 'Tunja, Boyacá, Colombia', 'Dirección de la empresa')
      `);
      console.log('✅ Parámetros poblados');
    } else {
      console.log('✅ Parámetros ya existen');
    }

    // Verificar quienes_somos
    const quienesSomosCount = await client.execute('SELECT COUNT(*) as count FROM quienes_somos');
    if (Number(quienesSomosCount.rows[0].count) === 0) {
      console.log('👥 Poblando contenido "Quiénes Somos"...');
      await client.execute(`
        INSERT INTO quienes_somos (titulo, contenido_md, imagen_equipo_url) 
        VALUES (?, ?, ?)
      `, [
        'Sobre AGL CONSTRUCCIONES SAS',
        '# Sobre Nosotros\n\nSomos una empresa especializada en construcción y remodelación con más de 10 años de experiencia.',
        'https://res.cloudinary.com/dq5joejf7/image/upload/v1755128641/equipo.jpg'
      ]);
      console.log('✅ Contenido "Quiénes Somos" poblado');
    } else {
      console.log('✅ Contenido "Quiénes Somos" ya existe');
    }

    // 5. Verificar estado final
    console.log('\n5️⃣ Verificando estado final...');
    
    const finalTables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    
    console.log('📋 Tablas finales:');
    finalTables.rows.forEach(row => console.log(`   - ${row.name}`));

    // Contar registros
    const finalCounts = {};
    for (const table of finalTables.rows) {
      try {
        const result = await client.execute(`SELECT COUNT(*) as count FROM ${table.name}`);
        finalCounts[table.name] = result.rows[0].count;
      } catch (error) {
        finalCounts[table.name] = 'Error';
      }
    }

    console.log('\n📊 Conteo de registros:');
    Object.entries(finalCounts).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} registros`);
    });

    // Verificar servicios por idioma
    try {
      const serviciosES = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "ES"');
      const serviciosEN = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "EN"');
      
      console.log('\n🌐 Servicios por idioma:');
      console.log(`  Español (ES): ${serviciosES.rows[0].count}`);
      console.log(`  Inglés (EN): ${serviciosEN.rows[0].count}`);
    } catch (error) {
      console.log('⚠️  No se pudo verificar servicios por idioma');
    }

    console.log('\n🎉 ¡Esquema de Turso configurado exitosamente!');
    console.log('🔗 La base de datos Turso está lista para usar.');

    return true;

  } catch (error) {
    console.error('❌ Error configurando esquema:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

setupTursoSchema()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Configuración falló:', error);
    process.exit(1);
  });
