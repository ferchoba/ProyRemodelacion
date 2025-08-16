// Configurar variables de entorno para debug
process.env.DEBUG_DB = 'true';

const { getAllServicios } = require('../src/lib/repos/servicios');
const { getAllProyectos } = require('../src/lib/repos/proyectos');

async function testReposFunctions() {
  console.log('🧪 Probando funciones de repositorio...\n');

  try {
    // Probar getAllServicios sin filtro de idioma
    console.log('1️⃣ Probando getAllServicios() sin filtro:');
    const todosServicios = await getAllServicios();
    console.log(`   Resultado: ${todosServicios.length} servicios encontrados`);
    if (todosServicios.length > 0) {
      console.log(`   Primer servicio: ${todosServicios[0].titulo} (${todosServicios[0].idioma})`);
    }

    // Probar getAllServicios con filtro ES
    console.log('\n2️⃣ Probando getAllServicios("ES"):');
    const serviciosES = await getAllServicios('ES');
    console.log(`   Resultado: ${serviciosES.length} servicios en español`);
    if (serviciosES.length > 0) {
      console.log(`   Primer servicio ES: ${serviciosES[0].titulo}`);
    }

    // Probar getAllServicios con filtro EN
    console.log('\n3️⃣ Probando getAllServicios("EN"):');
    const serviciosEN = await getAllServicios('EN');
    console.log(`   Resultado: ${serviciosEN.length} servicios en inglés`);
    if (serviciosEN.length > 0) {
      console.log(`   Primer servicio EN: ${serviciosEN[0].titulo}`);
    }

    // Probar getAllProyectos
    console.log('\n4️⃣ Probando getAllProyectos():');
    const proyectos = await getAllProyectos();
    console.log(`   Resultado: ${proyectos.length} proyectos encontrados`);
    if (proyectos.length > 0) {
      console.log(`   Primer proyecto: ${proyectos[0].titulo}`);
      console.log(`   Servicio asociado: ${proyectos[0].servicio?.titulo || 'Sin servicio'}`);
    }

    console.log('\n✅ Todas las pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.error('Stack:', error.stack);
  }
}

testReposFunctions();
