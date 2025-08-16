// scripts/test-turso-functionality.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function testMultilingualContent() {
  console.log('🌐 Testing contenido multiidioma...')
  
  try {
    // Test servicios en español
    const serviciosES = await client.execute(`
      SELECT * FROM servicios 
      WHERE idioma = 'ES' AND activo = 1 
      ORDER BY orden ASC
    `)
    
    // Test servicios en inglés
    const serviciosEN = await client.execute(`
      SELECT * FROM servicios 
      WHERE idioma = 'EN' AND activo = 1 
      ORDER BY orden ASC
    `)
    
    console.log(`✅ Servicios ES: ${serviciosES.rows.length}`)
    console.log(`✅ Servicios EN: ${serviciosEN.rows.length}`)
    
    // Verificar que cada servicio en ES tiene su contraparte en EN
    const slugsES = serviciosES.rows.map(s => s.slug)
    const slugsEN = serviciosEN.rows.map(s => s.slug)
    const missingTranslations = slugsES.filter(slug => !slugsEN.includes(slug))
    
    if (missingTranslations.length === 0) {
      console.log('✅ Todas las traducciones están presentes')
    } else {
      console.log(`⚠️  Traducciones faltantes: ${missingTranslations.join(', ')}`)
    }
    
    return true
  } catch (error) {
    console.error('❌ Error testing contenido multiidioma:', error)
    return false
  }
}

async function testProjectRelations() {
  console.log('🔗 Testing relaciones proyecto-servicio...')
  
  try {
    const proyectosConServicio = await client.execute(`
      SELECT p.*, s.titulo as servicio_titulo
      FROM proyectos p 
      JOIN servicios s ON p.servicio_id = s.id 
      WHERE p.activo = 1
    `)
    
    console.log(`✅ Proyectos con servicio: ${proyectosConServicio.rows.length}`)
    
    // Verificar que todos los proyectos tienen servicio válido
    const proyectosSinServicio = await client.execute(`
      SELECT p.* FROM proyectos p 
      LEFT JOIN servicios s ON p.servicio_id = s.id 
      WHERE s.id IS NULL AND p.activo = 1
    `)
    
    if (proyectosSinServicio.rows.length === 0) {
      console.log('✅ Todas las relaciones proyecto-servicio están correctas')
    } else {
      console.log(`❌ Proyectos sin servicio: ${proyectosSinServicio.rows.length}`)
    }
    
    // Mostrar ejemplo de relación
    if (proyectosConServicio.rows.length > 0) {
      const ejemplo = proyectosConServicio.rows[0]
      console.log(`  Ejemplo: "${ejemplo.titulo}" → "${ejemplo.servicio_titulo}"`)
    }
    
    return proyectosSinServicio.rows.length === 0
  } catch (error) {
    console.error('❌ Error testing relaciones:', error)
    return false
  }
}

async function testParametersAccess() {
  console.log('⚙️ Testing acceso a parámetros...')
  
  try {
    const whatsappNumber = await client.execute(
      'SELECT * FROM parametros WHERE clave = ?',
      ['whatsapp_numero']
    )
    
    const emailDestino = await client.execute(
      'SELECT * FROM parametros WHERE clave = ?',
      ['correo_destino_formularios']
    )
    
    if (whatsappNumber.rows.length > 0 && emailDestino.rows.length > 0) {
      console.log('✅ Parámetros de configuración accesibles')
      console.log(`  WhatsApp: ${whatsappNumber.rows[0].valor}`)
      console.log(`  Email: ${emailDestino.rows[0].valor}`)
      return true
    } else {
      console.log('❌ Error accediendo parámetros de configuración')
      return false
    }
  } catch (error) {
    console.error('❌ Error testing parámetros:', error)
    return false
  }
}

async function testDataIntegrity() {
  console.log('🔍 Testing integridad de datos...')
  
  try {
    // Verificar que no hay registros duplicados en servicios
    const duplicateServices = await client.execute(`
      SELECT slug, idioma, COUNT(*) as count
      FROM servicios 
      GROUP BY slug, idioma 
      HAVING COUNT(*) > 1
    `)
    
    if (duplicateServices.rows.length === 0) {
      console.log('✅ No hay servicios duplicados')
    } else {
      console.log(`⚠️  Servicios duplicados encontrados: ${duplicateServices.rows.length}`)
    }
    
    // Verificar que no hay proyectos duplicados
    const duplicateProjects = await client.execute(`
      SELECT slug, COUNT(*) as count
      FROM proyectos 
      GROUP BY slug 
      HAVING COUNT(*) > 1
    `)
    
    if (duplicateProjects.rows.length === 0) {
      console.log('✅ No hay proyectos duplicados')
    } else {
      console.log(`⚠️  Proyectos duplicados encontrados: ${duplicateProjects.rows.length}`)
    }
    
    // Verificar integridad referencial
    const orphanProjects = await client.execute(`
      SELECT p.titulo FROM proyectos p 
      LEFT JOIN servicios s ON p.servicio_id = s.id 
      WHERE s.id IS NULL
    `)
    
    if (orphanProjects.rows.length === 0) {
      console.log('✅ Integridad referencial correcta')
    } else {
      console.log(`❌ Proyectos huérfanos encontrados: ${orphanProjects.rows.length}`)
    }
    
    return duplicateServices.rows.length === 0 && 
           duplicateProjects.rows.length === 0 && 
           orphanProjects.rows.length === 0
  } catch (error) {
    console.error('❌ Error testing integridad:', error)
    return false
  }
}

async function main() {
  console.log('🧪 Iniciando tests de funcionalidad de Turso...\n')
  
  try {
    const results = {
      multilingual: await testMultilingualContent(),
      relations: await testProjectRelations(),
      parameters: await testParametersAccess(),
      integrity: await testDataIntegrity()
    }
    
    console.log('\n📊 Resumen de tests:')
    console.log('┌─────────────────────┬────────┐')
    console.log('│ Test                │ Estado │')
    console.log('├─────────────────────┼────────┤')
    console.log(`│ Contenido multiidioma│ ${results.multilingual ? '✅ OK' : '❌ FAIL'} │`)
    console.log(`│ Relaciones          │ ${results.relations ? '✅ OK' : '❌ FAIL'} │`)
    console.log(`│ Parámetros          │ ${results.parameters ? '✅ OK' : '❌ FAIL'} │`)
    console.log(`│ Integridad de datos │ ${results.integrity ? '✅ OK' : '❌ FAIL'} │`)
    console.log('└─────────────────────┴────────┘')
    
    const allPassed = Object.values(results).every(result => result === true)
    
    if (allPassed) {
      console.log('\n🎉 Todos los tests de funcionalidad pasaron!')
      return true
    } else {
      console.log('\n⚠️  Algunos tests fallaron')
      return false
    }
    
  } catch (error) {
    console.error('❌ Error en tests de funcionalidad:', error)
    return false
  } finally {
    client.close()
  }
}

main()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Tests fallaron:', error)
    process.exit(1)
  })
