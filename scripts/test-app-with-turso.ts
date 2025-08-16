// scripts/test-app-with-turso.ts
import { db } from '../src/lib/db'

async function testAppWithTurso() {
  console.log('🧪 Testing aplicación con configuración de Turso...')
  
  try {
    // Test 1: Verificar conexión
    console.log('1. Testing conexión a base de datos...')
    const connectionTest = await db.$queryRaw`SELECT 1 as test`
    console.log('✅ Conexión exitosa:', connectionTest)
    
    // Test 2: Verificar datos de servicios
    console.log('2. Testing datos de servicios...')
    const servicios = await db.servicio.findMany({
      where: { activo: true },
      take: 3
    })
    console.log(`✅ Servicios encontrados: ${servicios.length}`)
    servicios.forEach(s => console.log(`   - ${s.titulo} (${s.idioma})`))
    
    // Test 3: Verificar datos de proyectos
    console.log('3. Testing datos de proyectos...')
    const proyectos = await db.proyecto.findMany({
      where: { activo: true },
      take: 3
    })
    console.log(`✅ Proyectos encontrados: ${proyectos.length}`)
    proyectos.forEach(p => console.log(`   - ${p.titulo}`))
    
    // Test 4: Verificar parámetros
    console.log('4. Testing parámetros de configuración...')
    const whatsapp = await db.parametro.findUnique({
      where: { clave: 'whatsapp_numero' }
    })
    if (whatsapp) {
      console.log(`✅ WhatsApp configurado: ${whatsapp.valor}`)
    }
    
    // Test 5: Verificar relaciones
    console.log('5. Testing relaciones...')
    const proyectoConServicio = await db.proyecto.findFirst({
      include: { servicio: true },
      where: { activo: true }
    })
    if (proyectoConServicio) {
      console.log(`✅ Relación proyecto-servicio: "${proyectoConServicio.titulo}" → "${proyectoConServicio.servicio.titulo}"`)
    }
    
    console.log('\n🎉 Todos los tests pasaron! La aplicación funciona correctamente con la configuración actual.')
    return true
    
  } catch (error) {
    console.error('❌ Error en testing:', error)
    return false
  } finally {
    await db.$disconnect()
  }
}

testAppWithTurso()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test falló:', error)
    process.exit(1)
  })
