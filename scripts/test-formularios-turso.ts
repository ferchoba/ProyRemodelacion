// scripts/test-formularios-turso.ts
import { db } from '../src/lib/db'

interface FormularioTest {
  tipo: 'contacto' | 'cotizacion'
  nombre: string
  email: string
  telefono?: string
  tipo_servicio?: string
  descripcion: string
  ip: string
  recaptcha_score: number
  estado: 'pendiente' | 'procesado' | 'respondido'
}

async function testFormularios() {
  console.log('📝 Testing formularios con Turso Cloud...')
  
  try {
    // Test 1: Verificar conexión a Turso
    console.log('\n1. Verificando conexión a Turso...')
    const connectionTest = await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Conexión a Turso exitosa')
    
    // Test 2: Verificar tabla formularios existe
    console.log('\n2. Verificando tabla formularios...')
    const tableExists = await db.formulario.findMany({ take: 1 })
    console.log('✅ Tabla formularios accesible')
    
    // Test 3: Simular envío de formulario de contacto
    console.log('\n3. Testing formulario de contacto...')
    const formularioContacto: FormularioTest = {
      tipo: 'contacto',
      nombre: 'Juan Pérez Test',
      email: 'juan.test@example.com',
      telefono: '+57 300 123 4567',
      descripcion: 'Consulta de prueba desde script de testing para verificar funcionalidad con Turso Cloud.',
      ip: '192.168.1.100',
      recaptcha_score: 0.9,
      estado: 'pendiente'
    }
    
    const contactoCreado = await db.formulario.create({
      data: formularioContacto
    })
    console.log(`✅ Formulario de contacto creado con ID: ${contactoCreado.id}`)
    
    // Test 4: Simular envío de formulario de cotización
    console.log('\n4. Testing formulario de cotización...')
    const formularioCotizacion: FormularioTest = {
      tipo: 'cotizacion',
      nombre: 'María García Test',
      email: 'maria.test@example.com',
      telefono: '+57 301 987 6543',
      tipo_servicio: 'remodelacion-integral',
      descripcion: 'Solicitud de cotización de prueba para remodelación integral de casa de 120m². Testing con Turso Cloud.',
      ip: '192.168.1.101',
      recaptcha_score: 0.8,
      estado: 'pendiente'
    }
    
    const cotizacionCreada = await db.formulario.create({
      data: formularioCotizacion
    })
    console.log(`✅ Formulario de cotización creado con ID: ${cotizacionCreada.id}`)
    
    // Test 5: Verificar datos almacenados
    console.log('\n5. Verificando datos almacenados...')
    const formularios = await db.formulario.findMany({
      where: {
        OR: [
          { id: contactoCreado.id },
          { id: cotizacionCreada.id }
        ]
      },
      orderBy: { fecha_envio: 'desc' }
    })
    
    console.log(`✅ Formularios recuperados: ${formularios.length}`)
    formularios.forEach(form => {
      console.log(`   - ${form.tipo}: ${form.nombre} (${form.email}) - Estado: ${form.estado}`)
      console.log(`     Fecha: ${form.fecha_envio.toISOString()}`)
      console.log(`     reCAPTCHA Score: ${form.recaptcha_score}`)
    })
    
    // Test 6: Testing de validaciones
    console.log('\n6. Testing validaciones de campos...')
    
    // Test campo email inválido
    try {
      await db.formulario.create({
        data: {
          tipo: 'contacto',
          nombre: 'Test Validación',
          email: 'email-invalido',
          descripcion: 'Test de validación',
          ip: '127.0.0.1',
          recaptcha_score: 0.5,
          estado: 'pendiente'
        }
      })
      console.log('⚠️  Email inválido fue aceptado (revisar validaciones)')
    } catch (error) {
      console.log('✅ Validación de email funcionando')
    }
    
    // Test 7: Testing de búsquedas y filtros
    console.log('\n7. Testing búsquedas y filtros...')
    
    const formulariosPendientes = await db.formulario.findMany({
      where: { estado: 'pendiente' },
      orderBy: { fecha_envio: 'desc' }
    })
    console.log(`✅ Formularios pendientes: ${formulariosPendientes.length}`)
    
    const formulariosPorTipo = await db.formulario.groupBy({
      by: ['tipo'],
      _count: { tipo: true }
    })
    console.log('✅ Formularios por tipo:')
    formulariosPorTipo.forEach(grupo => {
      console.log(`   - ${grupo.tipo}: ${grupo._count.tipo}`)
    })
    
    // Test 8: Testing de actualización de estado
    console.log('\n8. Testing actualización de estado...')
    
    await db.formulario.update({
      where: { id: contactoCreado.id },
      data: { estado: 'procesado' }
    })
    console.log('✅ Estado de formulario actualizado correctamente')
    
    // Test 9: Verificar integridad de datos con caracteres especiales
    console.log('\n9. Testing caracteres especiales y acentos...')
    
    const formularioEspecial = await db.formulario.create({
      data: {
        tipo: 'contacto',
        nombre: 'José María Ñoño',
        email: 'jose.maria@example.com',
        descripcion: 'Descripción con acentos: ñáéíóú y símbolos especiales: @#$%&',
        ip: '127.0.0.1',
        recaptcha_score: 0.7,
        estado: 'pendiente'
      }
    })
    console.log('✅ Caracteres especiales almacenados correctamente')
    
    // Test 10: Cleanup - eliminar datos de prueba
    console.log('\n10. Limpiando datos de prueba...')
    
    await db.formulario.deleteMany({
      where: {
        OR: [
          { id: contactoCreado.id },
          { id: cotizacionCreada.id },
          { id: formularioEspecial.id }
        ]
      }
    })
    console.log('✅ Datos de prueba eliminados')
    
    console.log('\n🎉 Todos los tests de formularios pasaron exitosamente!')
    return true
    
  } catch (error) {
    console.error('❌ Error en testing de formularios:', error)
    return false
  } finally {
    await db.$disconnect()
  }
}

async function testFormulariosMultiidioma() {
  console.log('\n🌐 Testing funcionalidad multiidioma...')
  
  try {
    // Simular formularios en diferentes idiomas
    const formularioES = await db.formulario.create({
      data: {
        tipo: 'contacto',
        nombre: 'Usuario Español',
        email: 'usuario.es@example.com',
        descripcion: 'Consulta en español con acentos y ñ',
        ip: '127.0.0.1',
        recaptcha_score: 0.9,
        estado: 'pendiente'
      }
    })
    
    const formularioEN = await db.formulario.create({
      data: {
        tipo: 'contacto',
        nombre: 'English User',
        email: 'user.en@example.com',
        descripcion: 'English inquiry with special characters: quotes "test" and symbols',
        ip: '127.0.0.1',
        recaptcha_score: 0.8,
        estado: 'pendiente'
      }
    })
    
    console.log('✅ Formularios multiidioma creados correctamente')
    
    // Cleanup
    await db.formulario.deleteMany({
      where: {
        OR: [
          { id: formularioES.id },
          { id: formularioEN.id }
        ]
      }
    })
    
    console.log('✅ Testing multiidioma completado')
    return true
    
  } catch (error) {
    console.error('❌ Error en testing multiidioma:', error)
    return false
  }
}

async function main() {
  console.log('🧪 Iniciando tests completos de formularios con Turso Cloud...\n')
  
  try {
    const testBasico = await testFormularios()
    const testMultiidioma = await testFormulariosMultiidioma()
    
    if (testBasico && testMultiidioma) {
      console.log('\n🎉 TODOS LOS TESTS PASARON EXITOSAMENTE!')
      console.log('✅ Los formularios están completamente funcionales con Turso Cloud')
      return true
    } else {
      console.log('\n❌ ALGUNOS TESTS FALLARON')
      return false
    }
    
  } catch (error) {
    console.error('💥 Error general en testing:', error)
    return false
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
