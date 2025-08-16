// scripts/create-turso-schema.ts
import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function createSchema() {
  console.log('🚀 Creando esquema en Turso...')

  try {
    // Leer todas las migraciones en orden
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')
    const migrations = fs.readdirSync(migrationsDir)
      .filter(name => name !== 'migration_lock.toml')
      .sort()

    if (migrations.length === 0) {
      throw new Error('No se encontraron migraciones')
    }

    console.log(`📄 Aplicando ${migrations.length} migraciones en orden:`)
    migrations.forEach(migration => console.log(`  - ${migration}`))

    // Aplicar cada migración en orden
    for (const migration of migrations) {
      const migrationPath = path.join(migrationsDir, migration, 'migration.sql')

      if (!fs.existsSync(migrationPath)) {
        console.log(`⚠️  Saltando ${migration} (no tiene migration.sql)`)
        continue
      }

      const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
      console.log(`\n🔄 Aplicando migración: ${migration}`)

      // Ejecutar cada statement SQL por separado
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        try {
          console.log(`  Ejecutando: ${statement.substring(0, 50)}...`)
          await client.execute(statement)
        } catch (error) {
          console.error(`  ❌ Error en statement: ${error}`)
          // Continuar con el siguiente statement
        }
      }

      console.log(`  ✅ Migración ${migration} completada`)
    }

    console.log('\n✅ Esquema creado exitosamente en Turso')
    
    // Verificar tablas creadas
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)
    
    console.log('📋 Tablas creadas:')
    tables.rows.forEach(row => console.log(`  - ${row.name}`))
    
  } catch (error) {
    console.error('❌ Error creando esquema:', error)
    throw error
  } finally {
    client.close()
  }
}

createSchema()
  .then(() => {
    console.log('🎉 Proceso completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Proceso falló:', error)
    process.exit(1)
  })
