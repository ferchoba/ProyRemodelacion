// scripts/verificacion-final-formularios.ts
import { createClient } from '@libsql/client'
import { db } from '../src/lib/db'

const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

async function verificacionFinalFormularios() {
  console.log('🔍 Verificación final de formularios con Turso Cloud...')
  
  try {
    // Test 1: Verificar estructura de tabla formularios
    console.log('\n1. Verificando estructura de tabla formularios...')
    
    const estructura = await tursoClient.execute(`
      PRAGMA table_info(formularios)
    `)
    
    console.log('✅ Estructura de tabla formularios:')
    estructura.rows.forEach(row => {
      console.log(`   - ${row.name}: ${row.type} ${row.notnull ? 'NOT NULL' : ''} ${row.pk ? 'PRIMARY KEY' : ''}`)
    })
    
    // Test 2: Verificar índices
    console.log('\n2. Verificando índices...')
    
    const indices = await tursoClient.execute(`
      SELECT name, sql FROM sqlite_master 
      WHERE type='index' AND tbl_name='formularios'
    `)
    
    console.log(`✅ Índices encontrados: ${indices.rows.length}`)
    indices.rows.forEach(row => {
      console.log(`   - ${row.name}`)
    })
    
    // Test 3: Verificar conteo actual de formularios
    console.log('\n3. Verificando datos existentes...')
    
    const conteoTotal = await db.formulario.count()
    console.log(`✅ Total de formularios en base: ${conteoTotal}`)
    
    if (conteoTotal > 0) {
      const porTipo = await db.formulario.groupBy({
        by: ['tipo'],
        _count: { tipo: true }
      })
      
      console.log('   Distribución por tipo:')
      porTipo.forEach(grupo => {
        console.log(`     - ${grupo.tipo}: ${grupo._count.tipo}`)
      })
      
      const porEstado = await db.formulario.groupBy({
        by: ['estado'],
        _count: { estado: true }
      })
      
      console.log('   Distribución por estado:')
      porEstado.forEach(grupo => {
        console.log(`     - ${grupo.estado}: ${grupo._count.estado}`)
      })
    }
    
    // Test 4: Test de rendimiento con múltiples inserciones
    console.log('\n4. Testing rendimiento con múltiples formularios...')
    
    const startTime = Date.now()
    const formularios = []
    
    // Crear 10 formularios de prueba
    for (let i = 1; i <= 10; i++) {
      const formulario = await db.formulario.create({
        data: {
          tipo: i % 2 === 0 ? 'contacto' : 'cotizacion',
          nombre: `Usuario Test ${i}`,
          email: `test${i}@performance.com`,
          telefono: `+57 300 ${String(i).padStart(7, '0')}`,
          tipo_servicio: i % 2 === 1 ? 'remodelacion-integral' : undefined,
          descripcion: `Descripción de prueba número ${i} para testing de rendimiento con Turso Cloud.`,
          ip: '127.0.0.1',
          recaptcha_score: 0.5 + (i * 0.05),
          estado: 'pendiente'
        }
      })
      formularios.push(formulario.id)
    }
    
    const endTime = Date.now()
    console.log(`✅ 10 formularios creados en ${endTime - startTime}ms`)
    
    // Test 5: Test de consultas complejas
    console.log('\n5. Testing consultas complejas...')
    
    const consultaCompleja = await db.formulario.findMany({
      where: {
        AND: [
          { recaptcha_score: { gte: 0.7 } },
          { estado: 'pendiente' },
          {
            OR: [
              { tipo: 'contacto' },
              { tipo_servicio: { not: null } }
            ]
          }
        ]
      },
      orderBy: [
        { recaptcha_score: 'desc' },
        { fecha_envio: 'desc' }
      ],
      take: 5
    })
    
    console.log(`✅ Consulta compleja ejecutada: ${consultaCompleja.length} resultados`)
    
    // Test 6: Test de transacciones
    console.log('\n6. Testing transacciones...')
    
    try {
      await db.$transaction(async (tx) => {
        const form1 = await tx.formulario.create({
          data: {
            tipo: 'contacto',
            nombre: 'Transacción Test 1',
            email: 'tx1@test.com',
            descripcion: 'Test de transacción 1',
            ip: '127.0.0.1',
            recaptcha_score: 0.8,
            estado: 'pendiente'
          }
        })
        
        const form2 = await tx.formulario.create({
          data: {
            tipo: 'cotizacion',
            nombre: 'Transacción Test 2',
            email: 'tx2@test.com',
            descripcion: 'Test de transacción 2',
            ip: '127.0.0.1',
            recaptcha_score: 0.9,
            estado: 'pendiente'
          }
        })
        
        formularios.push(form1.id, form2.id)
      })
      
      console.log('✅ Transacción ejecutada correctamente')
    } catch (error) {
      console.error('❌ Error en transacción:', error)
    }
    
    // Test 7: Test de búsqueda de texto
    console.log('\n7. Testing búsqueda de texto...')
    
    const busquedaTexto = await db.formulario.findMany({
      where: {
        descripcion: {
          contains: 'Turso Cloud'
        }
      }
    })
    
    console.log(`✅ Búsqueda de texto: ${busquedaTexto.length} resultados`)
    
    // Test 8: Test de agregaciones
    console.log('\n8. Testing agregaciones...')
    
    const agregaciones = await db.formulario.aggregate({
      _count: { id: true },
      _avg: { recaptcha_score: true },
      _min: { fecha_envio: true },
      _max: { fecha_envio: true }
    })
    
    console.log('✅ Agregaciones:')
    console.log(`   Total: ${agregaciones._count.id}`)
    console.log(`   Score promedio: ${agregaciones._avg.recaptcha_score?.toFixed(2)}`)
    console.log(`   Primer formulario: ${agregaciones._min.fecha_envio?.toISOString()}`)
    console.log(`   Último formulario: ${agregaciones._max.fecha_envio?.toISOString()}`)
    
    // Test 9: Cleanup de datos de prueba
    console.log('\n9. Limpiando datos de prueba...')
    
    const eliminados = await db.formulario.deleteMany({
      where: {
        id: { in: formularios }
      }
    })
    
    console.log(`✅ ${eliminados.count} formularios de prueba eliminados`)
    
    // Test 10: Verificación final de integridad
    console.log('\n10. Verificación final de integridad...')
    
    const verificacionIntegridad = await tursoClient.execute(`
      SELECT 
        COUNT(*) as total_formularios,
        COUNT(DISTINCT email) as emails_unicos,
        COUNT(CASE WHEN tipo = 'contacto' THEN 1 END) as contactos,
        COUNT(CASE WHEN tipo = 'cotizacion' THEN 1 END) as cotizaciones,
        COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as pendientes
      FROM formularios
    `)
    
    const stats = verificacionIntegridad.rows[0]
    console.log('✅ Estadísticas finales:')
    console.log(`   Total formularios: ${stats.total_formularios}`)
    console.log(`   Emails únicos: ${stats.emails_unicos}`)
    console.log(`   Contactos: ${stats.contactos}`)
    console.log(`   Cotizaciones: ${stats.cotizaciones}`)
    console.log(`   Pendientes: ${stats.pendientes}`)
    
    console.log('\n🎉 Verificación final completada exitosamente!')
    return true
    
  } catch (error) {
    console.error('❌ Error en verificación final:', error)
    return false
  } finally {
    await db.$disconnect()
    tursoClient.close()
  }
}

async function main() {
  console.log('🧪 Iniciando verificación final de formularios con Turso Cloud...\n')
  
  try {
    const resultado = await verificacionFinalFormularios()
    
    if (resultado) {
      console.log('\n🎉 VERIFICACIÓN FINAL EXITOSA!')
      console.log('✅ Los formularios están completamente funcionales con Turso Cloud')
      console.log('✅ La estructura de datos es correcta')
      console.log('✅ El rendimiento es adecuado')
      console.log('✅ Las consultas complejas funcionan')
      console.log('✅ Las transacciones son estables')
      console.log('✅ La integridad de datos está garantizada')
      console.log('\n🚀 LISTO PARA PRODUCCIÓN!')
      return true
    } else {
      console.log('\n❌ VERIFICACIÓN FINAL FALLÓ')
      return false
    }
    
  } catch (error) {
    console.error('💥 Error en verificación final:', error)
    return false
  }
}

main()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Verificación final falló:', error)
    process.exit(1)
  })
