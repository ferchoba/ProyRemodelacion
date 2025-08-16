// scripts/basic-test.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function basicTest() {
  console.log('🧪 Test básico de Turso...')
  
  try {
    // Test 1: Conectividad
    console.log('1. Testing conectividad...')
    const connectTest = await client.execute('SELECT 1 as test')
    console.log('✅ Conectividad: OK')
    
    // Test 2: Listar tablas
    console.log('2. Listando tablas...')
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    console.log('✅ Tablas encontradas:')
    tables.rows.forEach(row => console.log(`   - ${row.name}`))
    
    // Test 3: Contar registros en cada tabla
    console.log('3. Contando registros...')
    for (const row of tables.rows) {
      try {
        const count = await client.execute(`SELECT COUNT(*) as count FROM ${row.name}`)
        console.log(`   ${row.name}: ${count.rows[0].count} registros`)
      } catch (error) {
        console.log(`   ${row.name}: Error - ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    
    // Test 4: Operación simple
    console.log('4. Test de operación simple...')
    try {
      const result = await client.execute('SELECT * FROM parametros LIMIT 1')
      if (result.rows.length > 0) {
        console.log('✅ Lectura de datos: OK')
        console.log(`   Ejemplo: ${result.rows[0].clave} = ${result.rows[0].valor}`)
      } else {
        console.log('⚠️  No hay datos en parametros')
      }
    } catch (error) {
      console.log(`❌ Error leyendo datos: ${error instanceof Error ? error.message : String(error)}`)
    }
    
    console.log('\n🎉 Test básico completado')
    return true
    
  } catch (error) {
    console.error('❌ Error en test básico:', error)
    return false
  } finally {
    client.close()
  }
}

basicTest()
  .then(success => {
    console.log(success ? '✅ Test exitoso' : '❌ Test falló')
    process.exit(success ? 0 : 1)
  })
