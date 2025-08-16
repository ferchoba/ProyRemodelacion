// scripts/check-sqlite-data.ts
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } },
  log: ['error']
})

async function checkData() {
  try {
    console.log('🔍 Verificando datos en SQLite...')
    
    // Verificar parámetros
    const paramCount = await db.parametro.count()
    console.log(`📋 Parámetros: ${paramCount}`)
    
    if (paramCount > 0) {
      const sampleParam = await db.parametro.findFirst()
      console.log(`  Ejemplo: ${sampleParam?.clave} = ${sampleParam?.valor}`)
    }
    
    // Verificar servicios
    const servicioCount = await db.servicio.count()
    console.log(`🔧 Servicios: ${servicioCount}`)
    
    if (servicioCount > 0) {
      const serviciosES = await db.servicio.count({ where: { idioma: 'ES' } })
      const serviciosEN = await db.servicio.count({ where: { idioma: 'EN' } })
      console.log(`  ES: ${serviciosES}, EN: ${serviciosEN}`)
      
      const sampleServicio = await db.servicio.findFirst()
      console.log(`  Ejemplo: ${sampleServicio?.titulo} (${sampleServicio?.idioma})`)
    }
    
    // Verificar proyectos
    const proyectoCount = await db.proyecto.count()
    console.log(`🏗️ Proyectos: ${proyectoCount}`)
    
    if (proyectoCount > 0) {
      const sampleProyecto = await db.proyecto.findFirst()
      console.log(`  Ejemplo: ${sampleProyecto?.titulo}`)
    }
    
    // Verificar quienes somos
    const contentCount = await db.quienesSomos.count()
    console.log(`👥 Quiénes Somos: ${contentCount}`)
    
    // Verificar formularios
    const formCount = await db.formulario.count()
    console.log(`📝 Formularios: ${formCount}`)
    
    console.log('\n✅ Verificación completada')
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error)
  } finally {
    await db.$disconnect()
  }
}

checkData()
