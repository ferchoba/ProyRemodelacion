// scripts/verify-turso-schema.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function verifySchema() {
  console.log('🔍 Verificando esquema en Turso...')
  
  try {
    // Verificar tablas creadas
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    
    console.log('📋 Tablas encontradas:')
    tables.rows.forEach(row => console.log(`  - ${row.name}`))
    
    // Verificar que tenemos las tablas esperadas
    const expectedTables = ['parametros', 'servicios', 'proyectos', 'quienes_somos', 'formularios']
    const foundTables = tables.rows.map(row => row.name)
    
    console.log('\n✅ Verificación de tablas esperadas:')
    expectedTables.forEach(table => {
      const found = foundTables.includes(table)
      console.log(`  ${found ? '✅' : '❌'} ${table}`)
    })
    
    // Verificar estructura de una tabla clave
    const serviciosStructure = await client.execute(`
      PRAGMA table_info(servicios)
    `)
    
    console.log('\n📊 Estructura de tabla servicios:')
    serviciosStructure.rows.forEach(row => {
      console.log(`  - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`)
    })
    
    console.log('\n🎉 Esquema verificado exitosamente')
    
  } catch (error) {
    console.error('❌ Error verificando esquema:', error)
    throw error
  } finally {
    client.close()
  }
}

verifySchema()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
