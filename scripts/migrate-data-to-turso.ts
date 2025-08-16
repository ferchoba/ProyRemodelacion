// scripts/migrate-data-to-turso.ts
import { sqliteDb, tursoClient } from '../src/lib/db-turso'

interface MigrationStats {
  table: string
  migrated: number
  errors: number
}

async function migrateData(): Promise<MigrationStats[]> {
  console.log('🚀 Iniciando migración de datos a Turso...')
  const stats: MigrationStats[] = []
  
  try {
    // 1. Migrar Parámetros
    console.log('\n📋 Migrando parámetros...')
    const parametros = await sqliteDb.parametro.findMany()
    let paramErrors = 0
    
    for (const param of parametros) {
      try {
        await tursoClient.parametro.upsert({
          where: { clave: param.clave },
          update: param,
          create: param
        })
      } catch (error) {
        console.error(`Error migrando parámetro ${param.clave}:`, error)
        paramErrors++
      }
    }
    
    stats.push({ 
      table: 'parametros', 
      migrated: parametros.length - paramErrors, 
      errors: paramErrors 
    })
    console.log(`✅ Parámetros: ${parametros.length - paramErrors}/${parametros.length}`)

    // 2. Migrar Servicios
    console.log('\n🔧 Migrando servicios...')
    const servicios = await sqliteDb.servicio.findMany({
      orderBy: { orden: 'asc' }
    })
    let servicioErrors = 0
    
    for (const servicio of servicios) {
      try {
        await tursoClient.servicio.upsert({
          where: { 
            slug_idioma: { 
              slug: servicio.slug, 
              idioma: servicio.idioma 
            } 
          },
          update: servicio,
          create: servicio
        })
      } catch (error) {
        console.error(`Error migrando servicio ${servicio.slug}-${servicio.idioma}:`, error)
        servicioErrors++
      }
    }
    
    stats.push({ 
      table: 'servicios', 
      migrated: servicios.length - servicioErrors, 
      errors: servicioErrors 
    })
    console.log(`✅ Servicios: ${servicios.length - servicioErrors}/${servicios.length}`)

    // 3. Migrar Proyectos
    console.log('\n🏗️ Migrando proyectos...')
    const proyectos = await sqliteDb.proyecto.findMany({
      include: { servicio: true }
    })
    let proyectoErrors = 0
    
    for (const proyecto of proyectos) {
      try {
        await tursoClient.proyecto.upsert({
          where: { slug: proyecto.slug },
          update: {
            titulo: proyecto.titulo,
            descripcion_md: proyecto.descripcion_md,
            imagen_portada_url: proyecto.imagen_portada_url,
            galeria_urls: proyecto.galeria_urls,
            servicio_id: proyecto.servicio_id,
            fecha_finalizacion: proyecto.fecha_finalizacion,
            activo: proyecto.activo,
            updated_at: new Date()
          },
          create: proyecto
        })
      } catch (error) {
        console.error(`Error migrando proyecto ${proyecto.slug}:`, error)
        proyectoErrors++
      }
    }
    
    stats.push({ 
      table: 'proyectos', 
      migrated: proyectos.length - proyectoErrors, 
      errors: proyectoErrors 
    })
    console.log(`✅ Proyectos: ${proyectos.length - proyectoErrors}/${proyectos.length}`)

    // 4. Migrar QuienesSomos
    console.log('\n👥 Migrando contenido Quiénes Somos...')
    const quienesSomos = await sqliteDb.quienesSomos.findMany()
    let contentErrors = 0
    
    for (const content of quienesSomos) {
      try {
        await tursoClient.quienesSomos.upsert({
          where: { id: content.id },
          update: content,
          create: content
        })
      } catch (error) {
        console.error(`Error migrando contenido ${content.id}:`, error)
        contentErrors++
      }
    }
    
    stats.push({ 
      table: 'quienes_somos', 
      migrated: quienesSomos.length - contentErrors, 
      errors: contentErrors 
    })
    console.log(`✅ Quiénes Somos: ${quienesSomos.length - contentErrors}/${quienesSomos.length}`)

    // 5. Migrar Formularios (si existen)
    console.log('\n📝 Migrando formularios...')
    const formularios = await sqliteDb.formulario.findMany()
    let formErrors = 0
    
    for (const form of formularios) {
      try {
        await tursoClient.formulario.create({ 
          data: {
            ...form,
            id: undefined // Dejar que se auto-genere
          }
        })
      } catch (error) {
        console.error(`Error migrando formulario ${form.id}:`, error)
        formErrors++
      }
    }
    
    stats.push({ 
      table: 'formularios', 
      migrated: formularios.length - formErrors, 
      errors: formErrors 
    })
    console.log(`✅ Formularios: ${formularios.length - formErrors}/${formularios.length}`)

    return stats

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  }
}

async function main() {
  try {
    const stats = await migrateData()

    console.log('\n📊 Resumen de migración:')
    console.log('┌─────────────────┬──────────┬────────┐')
    console.log('│ Tabla           │ Migrados │ Errores│')
    console.log('├─────────────────┼──────────┼────────┤')

    stats.forEach(stat => {
      const table = stat.table.padEnd(15)
      const migrated = stat.migrated.toString().padStart(8)
      const errors = stat.errors.toString().padStart(6)
      console.log(`│ ${table} │ ${migrated} │ ${errors} │`)
    })

    console.log('└─────────────────┴──────────┴────────┘')

    const totalErrors = stats.reduce((sum, stat) => sum + stat.errors, 0)

    if (totalErrors === 0) {
      console.log('\n🎉 Migración completada exitosamente!')
    } else {
      console.log(`\n⚠️  Migración completada con ${totalErrors} errores`)
    }

  } catch (error) {
    console.error('💥 Migración falló:', error)
    process.exit(1)
  } finally {
    await sqliteDb.$disconnect()
    await tursoClient.$disconnect()
  }
}

main()
