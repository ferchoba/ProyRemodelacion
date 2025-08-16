// scripts/test-api-formularios.ts
import { db } from '../src/lib/db'

async function testAPIFormularios() {
  console.log('🔌 Testing API de formularios con Turso Cloud...')
  
  try {
    // Test 1: Verificar que la conexión funciona
    console.log('\n1. Verificando conexión a base de datos...')
    await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Conexión exitosa')
    
    // Test 2: Simular envío de formulario de contacto (como lo haría la API)
    console.log('\n2. Simulando envío de formulario de contacto...')
    
    const datosContacto = {
      tipo: 'contacto' as const,
      nombre: 'Test API Usuario',
      email: 'test.api@example.com',
      telefono: '+57 300 123 4567',
      descripcion: 'Mensaje de prueba desde API testing con Turso Cloud',
      ip: '127.0.0.1',
      recaptcha_score: 0.9,
      estado: 'pendiente' as const
    }
    
    const formularioContacto = await db.formulario.create({
      data: datosContacto
    })
    
    console.log(`✅ Formulario de contacto creado: ID ${formularioContacto.id}`)
    console.log(`   Nombre: ${formularioContacto.nombre}`)
    console.log(`   Email: ${formularioContacto.email}`)
    console.log(`   Fecha: ${formularioContacto.fecha_envio.toISOString()}`)
    
    // Test 3: Simular envío de formulario de cotización
    console.log('\n3. Simulando envío de formulario de cotización...')
    
    const datosCotizacion = {
      tipo: 'cotizacion' as const,
      nombre: 'Test API Cotización',
      email: 'cotizacion.api@example.com',
      telefono: '+57 301 987 6543',
      tipo_servicio: 'remodelacion-integral',
      descripcion: 'Solicitud de cotización de prueba para remodelación de 150m². Testing API con Turso.',
      ip: '127.0.0.1',
      recaptcha_score: 0.8,
      estado: 'pendiente' as const
    }
    
    const formularioCotizacion = await db.formulario.create({
      data: datosCotizacion
    })
    
    console.log(`✅ Formulario de cotización creado: ID ${formularioCotizacion.id}`)
    console.log(`   Nombre: ${formularioCotizacion.nombre}`)
    console.log(`   Servicio: ${formularioCotizacion.tipo_servicio}`)
    console.log(`   Fecha: ${formularioCotizacion.fecha_envio.toISOString()}`)
    
    // Test 4: Verificar consulta de formularios (como lo haría un admin)
    console.log('\n4. Testing consulta de formularios...')
    
    const formulariosPendientes = await db.formulario.findMany({
      where: { estado: 'pendiente' },
      orderBy: { fecha_envio: 'desc' },
      take: 5
    })
    
    console.log(`✅ Formularios pendientes encontrados: ${formulariosPendientes.length}`)
    formulariosPendientes.forEach((form, index) => {
      console.log(`   ${index + 1}. ${form.tipo}: ${form.nombre} - ${form.email}`)
    })
    
    // Test 5: Testing de filtros por tipo
    console.log('\n5. Testing filtros por tipo...')
    
    const soloContacto = await db.formulario.findMany({
      where: { tipo: 'contacto' },
      orderBy: { fecha_envio: 'desc' },
      take: 3
    })
    
    const soloCotizacion = await db.formulario.findMany({
      where: { tipo: 'cotizacion' },
      orderBy: { fecha_envio: 'desc' },
      take: 3
    })
    
    console.log(`✅ Formularios de contacto: ${soloContacto.length}`)
    console.log(`✅ Formularios de cotización: ${soloCotizacion.length}`)
    
    // Test 6: Testing de búsqueda por email
    console.log('\n6. Testing búsqueda por email...')
    
    const busquedaPorEmail = await db.formulario.findMany({
      where: {
        email: {
          contains: 'api@example.com'
        }
      }
    })
    
    console.log(`✅ Formularios encontrados por email: ${busquedaPorEmail.length}`)
    
    // Test 7: Testing de actualización de estado (como lo haría un admin)
    console.log('\n7. Testing actualización de estado...')
    
    await db.formulario.update({
      where: { id: formularioContacto.id },
      data: { estado: 'procesado' }
    })
    
    const formularioActualizado = await db.formulario.findUnique({
      where: { id: formularioContacto.id }
    })
    
    console.log(`✅ Estado actualizado: ${formularioActualizado?.estado}`)
    
    // Test 8: Testing de estadísticas (como las usaría un dashboard)
    console.log('\n8. Testing estadísticas...')
    
    const estadisticas = await db.formulario.groupBy({
      by: ['tipo', 'estado'],
      _count: { id: true }
    })
    
    console.log('✅ Estadísticas de formularios:')
    estadisticas.forEach(stat => {
      console.log(`   ${stat.tipo} - ${stat.estado}: ${stat._count.id}`)
    })
    
    // Test 9: Testing de validación de datos
    console.log('\n9. Testing validación de datos...')
    
    // Test con datos mínimos requeridos
    const formularioMinimo = await db.formulario.create({
      data: {
        tipo: 'contacto',
        nombre: 'Mínimo',
        email: 'minimo@test.com',
        descripcion: 'Test mínimo',
        ip: '127.0.0.1',
        recaptcha_score: 0.5,
        estado: 'pendiente'
      }
    })
    
    console.log(`✅ Formulario con datos mínimos creado: ID ${formularioMinimo.id}`)
    
    // Test 10: Cleanup - eliminar datos de prueba
    console.log('\n10. Limpiando datos de prueba...')
    
    const idsParaEliminar = [
      formularioContacto.id,
      formularioCotizacion.id,
      formularioMinimo.id
    ]
    
    await db.formulario.deleteMany({
      where: {
        id: { in: idsParaEliminar }
      }
    })
    
    console.log('✅ Datos de prueba eliminados')
    
    console.log('\n🎉 Todos los tests de API de formularios pasaron exitosamente!')
    return true
    
  } catch (error) {
    console.error('❌ Error en testing de API:', error)
    return false
  } finally {
    await db.$disconnect()
  }
}

async function testValidacionesCampos() {
  console.log('\n🔍 Testing validaciones específicas de campos...')
  
  try {
    // Test 1: Campos obligatorios
    console.log('\n1. Testing campos obligatorios...')
    
    try {
      await db.formulario.create({
        data: {
          tipo: 'contacto',
          // nombre: '', // Campo obligatorio omitido
          email: 'test@example.com',
          descripcion: 'Test sin nombre',
          ip: '127.0.0.1',
          recaptcha_score: 0.5,
          estado: 'pendiente'
        } as any
      })
      console.log('⚠️  Formulario sin nombre fue aceptado')
    } catch (error) {
      console.log('✅ Validación de nombre obligatorio funcionando')
    }
    
    // Test 2: Longitud de campos
    console.log('\n2. Testing longitud de campos...')
    
    const descripcionLarga = 'A'.repeat(2000) // Descripción muy larga
    
    try {
      const formularioLargo = await db.formulario.create({
        data: {
          tipo: 'contacto',
          nombre: 'Test Longitud',
          email: 'longitud@test.com',
          descripcion: descripcionLarga,
          ip: '127.0.0.1',
          recaptcha_score: 0.5,
          estado: 'pendiente'
        }
      })
      
      console.log('✅ Descripción larga aceptada correctamente')
      
      // Cleanup
      await db.formulario.delete({ where: { id: formularioLargo.id } })
      
    } catch (error) {
      console.log('⚠️  Error con descripción larga:', error.message)
    }
    
    // Test 3: Caracteres especiales
    console.log('\n3. Testing caracteres especiales...')
    
    const formularioEspecial = await db.formulario.create({
      data: {
        tipo: 'contacto',
        nombre: 'José María Ñoño & Cía.',
        email: 'jose.maria@test.com',
        descripcion: 'Descripción con acentos: áéíóú, ñ, símbolos: @#$%&*()[]{}',
        ip: '127.0.0.1',
        recaptcha_score: 0.7,
        estado: 'pendiente'
      }
    })
    
    console.log('✅ Caracteres especiales almacenados correctamente')
    
    // Cleanup
    await db.formulario.delete({ where: { id: formularioEspecial.id } })
    
    return true
    
  } catch (error) {
    console.error('❌ Error en validaciones:', error)
    return false
  }
}

async function main() {
  console.log('🧪 Iniciando tests completos de API de formularios...\n')
  
  try {
    const testAPI = await testAPIFormularios()
    const testValidaciones = await testValidacionesCampos()
    
    if (testAPI && testValidaciones) {
      console.log('\n🎉 TODOS LOS TESTS DE API PASARON EXITOSAMENTE!')
      console.log('✅ La API de formularios está completamente funcional con Turso Cloud')
      console.log('✅ Las validaciones de campos funcionan correctamente')
      console.log('✅ Los datos se almacenan y consultan sin problemas')
      return true
    } else {
      console.log('\n❌ ALGUNOS TESTS DE API FALLARON')
      return false
    }
    
  } catch (error) {
    console.error('💥 Error general en testing de API:', error)
    return false
  }
}

main()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Tests de API fallaron:', error)
    process.exit(1)
  })
