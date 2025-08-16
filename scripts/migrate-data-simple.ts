// scripts/migrate-data-simple.ts
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Cliente SQLite local
const sqliteDb = new PrismaClient({
  datasources: { db: { url: 'file:./prisma/dev.db' } },
  log: ['error']
})

// Cliente Turso
const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const adapter = new PrismaLibSQL(libsql)
const tursoDb = new PrismaClient({ 
  adapter,
  log: ['error']
})

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
    
    console.log(`  Encontrados ${parametros.length} parámetros`)
    for (const param of parametros) {
      try {
        await tursoDb.parametro.upsert({
          where: { clave: param.clave },
          update: param,
          create: param
        })
        console.log(`  ✅ ${param.clave}`)
      } catch (error) {
        console.error(`  ❌ Error migrando parámetro ${param.clave}:`, error)
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
    
    console.log(`  Encontrados ${servicios.length} servicios`)
    for (const servicio of servicios) {
      try {
        await tursoDb.servicio.upsert({
          where: { 
            slug_idioma: { 
              slug: servicio.slug, 
              idioma: servicio.idioma 
            } 
          },
          update: servicio,
          create: servicio
        })
        console.log(`  ✅ ${servicio.slug} (${servicio.idioma})`)
      } catch (error) {
        console.error(`  ❌ Error migrando servicio ${servicio.slug}-${servicio.idioma}:`, error)
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
    const proyectos = await sqliteDb.proyecto.findMany()
    let proyectoErrors = 0
    
    console.log(`  Encontrados ${proyectos.length} proyectos`)
    for (const proyecto of proyectos) {
      try {
        await tursoDb.proyecto.upsert({
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
        console.log(`  ✅ ${proyecto.slug}`)
      } catch (error) {
        console.error(`  ❌ Error migrando proyecto ${proyecto.slug}:`, error)
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
    
    console.log(`  Encontrados ${quienesSomos.length} contenidos`)
    for (const content of quienesSomos) {
      try {
        await tursoDb.quienesSomos.upsert({
          where: { id: content.id },
          update: content,
          create: content
        })
        console.log(`  ✅ Contenido ID ${content.id}`)
      } catch (error) {
        console.error(`  ❌ Error migrando contenido ${content.id}:`, error)
        contentErrors++
      }
    }
    
    stats.push({ 
      table: 'quienes_somos', 
      migrated: quienesSomos.length - contentErrors, 
      errors: contentErrors 
    })
    console.log(`✅ Quiénes Somos: ${quienesSomos.length - contentErrors}/${quienesSomos.length}`)

    // 5. Migrar Formularios
    console.log('\n📝 Migrando formularios...')
    const formularios = await sqliteDb.formulario.findMany()
    let formErrors = 0
    
    console.log(`  Encontrados ${formularios.length} formularios`)
    for (const form of formularios) {
      try {
        await tursoDb.formulario.create({ 
          data: {
            tipo: form.tipo,
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono,
            tipo_servicio: form.tipo_servicio,
            descripcion: form.descripcion,
            fecha_envio: form.fecha_envio,
            ip: form.ip,
            recaptcha_score: form.recaptcha_score,
            estado: form.estado
          }
        })
        console.log(`  ✅ Formulario ${form.tipo} - ${form.nombre}`)
      } catch (error) {
        console.error(`  ❌ Error migrando formulario ${form.id}:`, error)
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
    const totalMigrated = stats.reduce((sum, stat) => sum + stat.migrated, 0)
    
    if (totalErrors === 0) {
      console.log(`\n🎉 Migración completada exitosamente! ${totalMigrated} registros migrados.`)
    } else {
      console.log(`\n⚠️  Migración completada con ${totalErrors} errores. ${totalMigrated} registros migrados.`)
    }
    
  } catch (error) {
    console.error('💥 Migración falló:', error)
    process.exit(1)
  } finally {
    await sqliteDb.$disconnect()
    await tursoDb.$disconnect()
    libsql.close()
  }
}

main()
