// scripts/simple-validation.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function simpleValidation() {
  console.log('🔍 Validación simple de datos en Turso...')
  
  try {
    // 1. Verificar conteos básicos
    console.log('\n📊 Conteos de registros:')
    
    const tables = ['parametros', 'servicios', 'proyectos', 'quienes_somos', 'formularios']
    const counts = {}
    
    for (const table of tables) {
      try {
        const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`)
        const count = result.rows[0].count
        counts[table] = count
        console.log(`  ${table}: ${count} registros`)
      } catch (error) {
        console.error(`  ❌ Error contando ${table}:`, error.message)
        counts[table] = 0
      }
    }
    
    // 2. Verificar datos específicos
    console.log('\n🔍 Verificación de datos específicos:')
    
    // Parámetros
    try {
      const params = await client.execute('SELECT clave, valor FROM parametros LIMIT 3')
      console.log('  📋 Parámetros de ejemplo:')
      params.rows.forEach(row => {
        console.log(`    - ${row.clave}: ${row.valor}`)
      })
    } catch (error) {
      console.error('  ❌ Error leyendo parámetros:', error.message)
    }
    
    // Servicios por idioma
    try {
      const serviciosES = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "ES"')
      const serviciosEN = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "EN"')
      console.log(`  🔧 Servicios por idioma: ES=${serviciosES.rows[0].count}, EN=${serviciosEN.rows[0].count}`)
      
      const servicioEjemplo = await client.execute('SELECT titulo, idioma FROM servicios LIMIT 1')
      if (servicioEjemplo.rows.length > 0) {
        console.log(`    Ejemplo: ${servicioEjemplo.rows[0].titulo} (${servicioEjemplo.rows[0].idioma})`)
      }
    } catch (error) {
      console.error('  ❌ Error leyendo servicios:', error.message)
    }
    
    // Proyectos
    try {
      const proyectoEjemplo = await client.execute('SELECT titulo FROM proyectos LIMIT 1')
      if (proyectoEjemplo.rows.length > 0) {
        console.log(`  🏗️ Proyecto ejemplo: ${proyectoEjemplo.rows[0].titulo}`)
      }
    } catch (error) {
      console.error('  ❌ Error leyendo proyectos:', error.message)
    }
    
    // 3. Test de operaciones CRUD básicas
    console.log('\n🧪 Testing operaciones CRUD básicas:')
    
    try {
      // CREATE
      await client.execute(
        'INSERT INTO parametros (clave, valor, descripcion) VALUES (?, ?, ?)',
        ['test_crud', 'test_value', 'Test CRUD operations']
      )
      console.log('  ✅ CREATE: OK')
      
      // READ
      const readResult = await client.execute(
        'SELECT * FROM parametros WHERE clave = ?',
        ['test_crud']
      )
      if (readResult.rows.length > 0) {
        console.log('  ✅ READ: OK')
      }
      
      // UPDATE
      await client.execute(
        'UPDATE parametros SET valor = ? WHERE clave = ?',
        ['updated_test_value', 'test_crud']
      )
      console.log('  ✅ UPDATE: OK')
      
      // DELETE
      await client.execute(
        'DELETE FROM parametros WHERE clave = ?',
        ['test_crud']
      )
      console.log('  ✅ DELETE: OK')
      
    } catch (error) {
      console.error('  ❌ Error en operaciones CRUD:', error.message)
    }
    
    // 4. Verificar relaciones
    console.log('\n🔗 Verificando relaciones:')
    
    try {
      const relaciones = await client.execute(`
        SELECT s.titulo as servicio, COUNT(p.id) as proyectos_count
        FROM servicios s 
        LEFT JOIN proyectos p ON s.id = p.servicio_id 
        GROUP BY s.id, s.titulo
        LIMIT 3
      `)
      
      console.log('  Relaciones servicio-proyecto:')
      relaciones.rows.forEach(row => {
        console.log(`    - ${row.servicio}: ${row.proyectos_count} proyectos`)
      })
      
    } catch (error) {
      console.error('  ❌ Error verificando relaciones:', error.message)
    }
    
    // 5. Resumen final
    console.log('\n📋 Resumen de validación:')
    const totalRecords = Object.values(counts).reduce((sum, count) => sum + Number(count), 0)
    console.log(`  Total de registros migrados: ${totalRecords}`)
    
    const tablesWithData = Object.entries(counts).filter(([table, count]) => Number(count) > 0)
    console.log(`  Tablas con datos: ${tablesWithData.length}/${tables.length}`)
    
    if (tablesWithData.length === tables.length && totalRecords > 0) {
      console.log('\n🎉 Validación exitosa: Todos los datos están disponibles en Turso!')
      return true
    } else {
      console.log('\n⚠️  Validación parcial: Algunos datos pueden estar faltando')
      return false
    }
    
  } catch (error) {
    console.error('❌ Error durante validación:', error)
    return false
  } finally {
    client.close()
  }
}

simpleValidation()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Validación falló:', error)
    process.exit(1)
  })
