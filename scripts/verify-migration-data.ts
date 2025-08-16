// scripts/verify-migration-data.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function verifyMigration() {
  console.log('🔍 Verificando datos migrados en Turso...')
  
  try {
    // Verificar conteos de cada tabla
    const tables = ['parametros', 'servicios', 'proyectos', 'quienes_somos', 'formularios']
    
    console.log('\n📊 Conteos de registros:')
    for (const table of tables) {
      const result = await client.execute(`SELECT COUNT(*) as count FROM ${table}`)
      const count = result.rows[0].count
      console.log(`  ${table}: ${count} registros`)
    }
    
    // Verificar datos específicos
    console.log('\n🔍 Verificación de datos específicos:')
    
    // Parámetros
    const params = await client.execute('SELECT clave, valor FROM parametros LIMIT 3')
    console.log('  📋 Parámetros de ejemplo:')
    params.rows.forEach(row => {
      console.log(`    - ${row.clave}: ${row.valor}`)
    })
    
    // Servicios por idioma
    const serviciosES = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "ES"')
    const serviciosEN = await client.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = "EN"')
    console.log(`  🔧 Servicios por idioma: ES=${serviciosES.rows[0].count}, EN=${serviciosEN.rows[0].count}`)
    
    // Ejemplo de servicio
    const servicioEjemplo = await client.execute('SELECT titulo, idioma FROM servicios LIMIT 1')
    if (servicioEjemplo.rows.length > 0) {
      console.log(`    Ejemplo: ${servicioEjemplo.rows[0].titulo} (${servicioEjemplo.rows[0].idioma})`)
    }
    
    // Proyectos
    const proyectoEjemplo = await client.execute('SELECT titulo FROM proyectos LIMIT 1')
    if (proyectoEjemplo.rows.length > 0) {
      console.log(`  🏗️ Proyecto ejemplo: ${proyectoEjemplo.rows[0].titulo}`)
    }
    
    // Verificar relaciones
    const proyectosConServicio = await client.execute(`
      SELECT p.titulo, s.titulo as servicio_titulo 
      FROM proyectos p 
      JOIN servicios s ON p.servicio_id = s.id 
      LIMIT 1
    `)
    
    if (proyectosConServicio.rows.length > 0) {
      console.log(`  🔗 Relación ejemplo: ${proyectosConServicio.rows[0].titulo} → ${proyectosConServicio.rows[0].servicio_titulo}`)
    }
    
    console.log('\n✅ Verificación de migración completada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error)
    throw error
  } finally {
    client.close()
  }
}

verifyMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
