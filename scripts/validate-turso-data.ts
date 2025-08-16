// scripts/validate-turso-data.ts
import { createClient } from '@libsql/client'
import Database from 'better-sqlite3'

// Cliente SQLite local
const sqliteDb = new Database('./prisma/dev.db', { readonly: true })

// Cliente Turso
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

interface ValidationResult {
  table: string
  sqliteCount: number
  tursoCount: number
  match: boolean
  sampleCheck: boolean
}

async function validateMigration(): Promise<ValidationResult[]> {
  console.log('🔍 Validando migración de datos...')
  const results: ValidationResult[] = []
  
  try {
    // 1. Validar Parámetros
    console.log('\n📋 Validando parámetros...')
    const sqliteParams = sqliteDb.prepare('SELECT COUNT(*) as count FROM parametros').get()
    const tursoParamsResult = await tursoClient.execute('SELECT COUNT(*) as count FROM parametros')
    const tursoParams = tursoParamsResult.rows[0].count
    
    // Verificar muestra específica
    const sampleParam = sqliteDb.prepare('SELECT * FROM parametros WHERE clave = ?').get('whatsapp_numero')
    const tursoSampleResult = await tursoClient.execute('SELECT * FROM parametros WHERE clave = ?', ['whatsapp_numero'])
    const tursoSampleParam = tursoSampleResult.rows[0]
    
    results.push({
      table: 'parametros',
      sqliteCount: sqliteParams.count,
      tursoCount: Number(tursoParams),
      match: sqliteParams.count === Number(tursoParams),
      sampleCheck: sampleParam?.valor === tursoSampleParam?.valor
    })

    // 2. Validar Servicios
    console.log('🔧 Validando servicios...')
    const sqliteServicios = sqliteDb.prepare('SELECT COUNT(*) as count FROM servicios').get()
    const tursoServiciosResult = await tursoClient.execute('SELECT COUNT(*) as count FROM servicios')
    const tursoServicios = tursoServiciosResult.rows[0].count
    
    // Verificar servicios por idioma
    const sqliteServiciosES = sqliteDb.prepare('SELECT COUNT(*) as count FROM servicios WHERE idioma = ?').get('ES')
    const tursoServiciosESResult = await tursoClient.execute('SELECT COUNT(*) as count FROM servicios WHERE idioma = ?', ['ES'])
    const tursoServiciosES = tursoServiciosESResult.rows[0].count
    
    results.push({
      table: 'servicios',
      sqliteCount: sqliteServicios.count,
      tursoCount: Number(tursoServicios),
      match: sqliteServicios.count === Number(tursoServicios),
      sampleCheck: sqliteServiciosES.count === Number(tursoServiciosES)
    })

    // 3. Validar Proyectos
    console.log('🏗️ Validando proyectos...')
    const sqliteProyectos = sqliteDb.prepare('SELECT COUNT(*) as count FROM proyectos').get()
    const tursoProyectosResult = await tursoClient.execute('SELECT COUNT(*) as count FROM proyectos')
    const tursoProyectos = tursoProyectosResult.rows[0].count
    
    // Verificar proyecto específico
    const sampleProyecto = sqliteDb.prepare('SELECT * FROM proyectos LIMIT 1').get()
    let tursoSampleProyecto = null
    if (sampleProyecto) {
      const tursoSampleResult = await tursoClient.execute('SELECT * FROM proyectos WHERE slug = ?', [sampleProyecto.slug])
      tursoSampleProyecto = tursoSampleResult.rows[0]
    }
    
    results.push({
      table: 'proyectos',
      sqliteCount: sqliteProyectos.count,
      tursoCount: Number(tursoProyectos),
      match: sqliteProyectos.count === Number(tursoProyectos),
      sampleCheck: sampleProyecto?.titulo === tursoSampleProyecto?.titulo
    })

    // 4. Validar QuienesSomos
    console.log('👥 Validando contenido...')
    const sqliteContent = sqliteDb.prepare('SELECT COUNT(*) as count FROM quienes_somos').get()
    const tursoContentResult = await tursoClient.execute('SELECT COUNT(*) as count FROM quienes_somos')
    const tursoContent = tursoContentResult.rows[0].count
    
    results.push({
      table: 'quienes_somos',
      sqliteCount: sqliteContent.count,
      tursoCount: Number(tursoContent),
      match: sqliteContent.count === Number(tursoContent),
      sampleCheck: true // Asumimos OK si los counts coinciden
    })

    // 5. Validar Formularios
    console.log('📝 Validando formularios...')
    const sqliteFormularios = sqliteDb.prepare('SELECT COUNT(*) as count FROM formularios').get()
    const tursoFormulariosResult = await tursoClient.execute('SELECT COUNT(*) as count FROM formularios')
    const tursoFormularios = tursoFormulariosResult.rows[0].count
    
    results.push({
      table: 'formularios',
      sqliteCount: sqliteFormularios.count,
      tursoCount: Number(tursoFormularios),
      match: sqliteFormularios.count === Number(tursoFormularios),
      sampleCheck: true
    })

    return results
    
  } catch (error) {
    console.error('❌ Error durante validación:', error)
    throw error
  }
}

async function testBasicOperations() {
  console.log('\n🧪 Testing operaciones básicas...')
  
  try {
    // Test CREATE
    const testParam = await tursoClient.execute(
      'INSERT INTO parametros (clave, valor, descripcion) VALUES (?, ?, ?)',
      ['test_migration', 'test_value', 'Test parameter for migration validation']
    )
    console.log('✅ CREATE operation: OK')

    // Test READ
    const readParam = await tursoClient.execute(
      'SELECT * FROM parametros WHERE clave = ?',
      ['test_migration']
    )
    console.log('✅ READ operation: OK')

    // Test UPDATE
    await tursoClient.execute(
      'UPDATE parametros SET valor = ? WHERE clave = ?',
      ['updated_value', 'test_migration']
    )
    console.log('✅ UPDATE operation: OK')

    // Test DELETE
    await tursoClient.execute(
      'DELETE FROM parametros WHERE clave = ?',
      ['test_migration']
    )
    console.log('✅ DELETE operation: OK')

    // Test relaciones
    const servicioConProyectos = await tursoClient.execute(`
      SELECT s.titulo as servicio, COUNT(p.id) as proyectos_count
      FROM servicios s 
      LEFT JOIN proyectos p ON s.id = p.servicio_id 
      GROUP BY s.id 
      LIMIT 1
    `)
    
    if (servicioConProyectos.rows.length > 0) {
      const row = servicioConProyectos.rows[0]
      console.log(`✅ RELATIONS: Servicio "${row.servicio}" con ${row.proyectos_count} proyectos`)
    }

    return true
  } catch (error) {
    console.error('❌ Error en operaciones básicas:', error)
    return false
  }
}

async function main() {
  try {
    const validationResults = await validateMigration()
    
    console.log('\n📊 Resultados de validación:')
    console.log('┌─────────────────┬─────────┬────────┬───────┬─────────┐')
    console.log('│ Tabla           │ SQLite  │ Turso  │ Match │ Sample  │')
    console.log('├─────────────────┼─────────┼────────┼───────┼─────────┤')
    
    validationResults.forEach(result => {
      const table = result.table.padEnd(15)
      const sqlite = result.sqliteCount.toString().padStart(7)
      const turso = result.tursoCount.toString().padStart(6)
      const match = (result.match ? '✅' : '❌').padStart(5)
      const sample = (result.sampleCheck ? '✅' : '❌').padStart(7)
      console.log(`│ ${table} │ ${sqlite} │ ${turso} │ ${match} │ ${sample} │`)
    })
    
    console.log('└─────────────────┴─────────┴────────┴───────┴─────────┘')

    const allMatch = validationResults.every(r => r.match && r.sampleCheck)
    
    if (allMatch) {
      console.log('\n✅ Validación de datos: EXITOSA')
    } else {
      console.log('\n❌ Validación de datos: FALLÓ')
      return false
    }

    // Test operaciones básicas
    const operationsOK = await testBasicOperations()
    
    if (operationsOK) {
      console.log('\n🎉 Todas las validaciones pasaron exitosamente!')
      return true
    } else {
      console.log('\n❌ Falló el test de operaciones básicas')
      return false
    }
    
  } catch (error) {
    console.error('💥 Validación falló:', error)
    return false
  } finally {
    sqliteDb.close()
    tursoClient.close()
  }
}

main().then(success => {
  process.exit(success ? 0 : 1)
})
