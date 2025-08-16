// scripts/migrate-basic-data.ts
import { createClient } from '@libsql/client'
import Database from 'better-sqlite3'

// Cliente SQLite local
const sqliteDb = new Database('./prisma/dev.db', { readonly: true })

// Cliente Turso
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

interface MigrationStats {
  table: string
  migrated: number
  errors: number
}

async function migrateData(): Promise<MigrationStats[]> {
  console.log('🚀 Iniciando migración básica de datos a Turso...')
  const stats: MigrationStats[] = []
  
  try {
    // 1. Migrar Parámetros
    console.log('\n📋 Migrando parámetros...')
    const parametros = sqliteDb.prepare('SELECT * FROM parametros').all()
    let paramErrors = 0
    
    console.log(`  Encontrados ${parametros.length} parámetros`)
    for (const param of parametros) {
      try {
        await tursoClient.execute({
          sql: 'INSERT OR REPLACE INTO parametros (clave, valor, descripcion) VALUES (?, ?, ?)',
          args: [param.clave, param.valor, param.descripcion]
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
    const servicios = sqliteDb.prepare('SELECT * FROM servicios ORDER BY orden ASC').all()
    let servicioErrors = 0
    
    console.log(`  Encontrados ${servicios.length} servicios`)
    for (const servicio of servicios) {
      try {
        await tursoClient.execute({
          sql: `INSERT OR REPLACE INTO servicios 
                (id, slug, titulo, descripcion_corta, contenido_md, imagen_principal_url, 
                 etiquetas, idioma, orden, activo, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            servicio.id, servicio.slug, servicio.titulo, servicio.descripcion_corta,
            servicio.contenido_md, servicio.imagen_principal_url, servicio.etiquetas,
            servicio.idioma, servicio.orden, servicio.activo, 
            servicio.created_at, servicio.updated_at
          ]
        })
        console.log(`  ✅ ${servicio.titulo} (${servicio.idioma})`)
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
    const proyectos = sqliteDb.prepare('SELECT * FROM proyectos').all()
    let proyectoErrors = 0
    
    console.log(`  Encontrados ${proyectos.length} proyectos`)
    for (const proyecto of proyectos) {
      try {
        await tursoClient.execute({
          sql: `INSERT OR REPLACE INTO proyectos 
                (id, slug, titulo, descripcion_md, imagen_portada_url, galeria_urls,
                 servicio_id, fecha_finalizacion, activo, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            proyecto.id, proyecto.slug, proyecto.titulo, proyecto.descripcion_md,
            proyecto.imagen_portada_url, proyecto.galeria_urls, proyecto.servicio_id,
            proyecto.fecha_finalizacion, proyecto.activo, 
            proyecto.created_at, proyecto.updated_at
          ]
        })
        console.log(`  ✅ ${proyecto.titulo}`)
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
    const quienesSomos = sqliteDb.prepare('SELECT * FROM quienes_somos').all()
    let contentErrors = 0
    
    console.log(`  Encontrados ${quienesSomos.length} contenidos`)
    for (const content of quienesSomos) {
      try {
        await tursoClient.execute({
          sql: `INSERT OR REPLACE INTO quienes_somos 
                (id, titulo, contenido_md, imagen_equipo_url, activo, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            content.id, content.titulo, content.contenido_md, content.imagen_equipo_url,
            content.activo, content.created_at, content.updated_at
          ]
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
    const formularios = sqliteDb.prepare('SELECT * FROM formularios').all()
    let formErrors = 0
    
    console.log(`  Encontrados ${formularios.length} formularios`)
    for (const form of formularios) {
      try {
        await tursoClient.execute({
          sql: `INSERT INTO formularios 
                (tipo, nombre, email, telefono, tipo_servicio, descripcion, 
                 fecha_envio, ip, recaptcha_score, estado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            form.tipo, form.nombre, form.email, form.telefono, form.tipo_servicio,
            form.descripcion, form.fecha_envio, form.ip, form.recaptcha_score, form.estado
          ]
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
    sqliteDb.close()
    tursoClient.close()
  }
}

main()
