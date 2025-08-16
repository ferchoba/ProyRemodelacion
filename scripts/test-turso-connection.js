const { createClient } = require('@libsql/client');

// Credenciales directas para testing
const TURSO_DATABASE_URL = "libsql://agl-construcciones-aglconstrucciones.aws-us-east-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTUyOTMyNzcsImlkIjoiMDRkYThkZmMtZWM5NC00YWYzLTlhZmQtMjZjNGJmMzgyOTk1IiwicmlkIjoiYmE4OWRiNzktNGU1ZS00ODY3LTk2OWYtYjZmZjQ1MGE3MzU2In0.OjvLf1I6gYcBmwCRWAo0z4T66Uz62kiQtCv7cLLXilNEEsSiJoYjCXKBJZp0EcEnUp5_KX9ksx9gNkRAqa4cBw";

const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function testTursoConnection() {
  console.log('🔗 Probando conexión a Turso...\n');

  try {
    // Test 1: Conectividad básica
    console.log('1️⃣ Testing conectividad básica...');
    const connectTest = await client.execute('SELECT 1 as test');
    console.log('✅ Conectividad: OK');

    // Test 2: Listar tablas
    console.log('\n2️⃣ Listando tablas...');
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);
    console.log('✅ Tablas encontradas:');
    tables.rows.forEach(row => console.log(`   - ${row.name}`));

    // Test 3: Contar registros en tablas principales
    console.log('\n3️⃣ Contando registros...');
    
    const serviciosCount = await client.execute('SELECT COUNT(*) as count FROM servicios');
    console.log(`   📋 Servicios: ${serviciosCount.rows[0].count}`);
    
    const proyectosCount = await client.execute('SELECT COUNT(*) as count FROM proyectos');
    console.log(`   📁 Proyectos: ${proyectosCount.rows[0].count}`);
    
    const parametrosCount = await client.execute('SELECT COUNT(*) as count FROM parametros');
    console.log(`   ⚙️  Parámetros: ${parametrosCount.rows[0].count}`);

    // Test 4: Verificar servicios por idioma
    console.log('\n4️⃣ Verificando servicios por idioma...');
    
    const serviciosES = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "ES" AND activo = 1');
    console.log(`   🇪🇸 Servicios ES activos: ${serviciosES.rows[0].count}`);
    
    const serviciosEN = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "EN" AND activo = 1');
    console.log(`   🇺🇸 Servicios EN activos: ${serviciosEN.rows[0].count}`);

    // Test 5: Verificar proyectos activos
    console.log('\n5️⃣ Verificando proyectos activos...');
    
    const proyectosActivos = await client.execute('SELECT COUNT(*) as count FROM proyectos WHERE activo = 1');
    console.log(`   📁 Proyectos activos: ${proyectosActivos.rows[0].count}`);

    // Test 6: Mostrar algunos servicios de ejemplo
    console.log('\n6️⃣ Servicios de ejemplo...');
    
    const serviciosEjemplo = await client.execute(`
      SELECT titulo, idioma, activo 
      FROM servicios 
      WHERE activo = 1 
      ORDER BY idioma, orden 
      LIMIT 5
    `);
    
    serviciosEjemplo.rows.forEach(row => {
      console.log(`   - ${row.titulo} (${row.idioma}) - Activo: ${row.activo}`);
    });

    console.log('\n🎉 ¡Conexión a Turso exitosa! La base de datos está lista para usar.');
    return true;

  } catch (error) {
    console.error('❌ Error conectando a Turso:', error.message);
    return false;
  }
}

testTursoConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test falló:', error);
    process.exit(1);
  });
