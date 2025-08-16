import { getAllServicios } from './src/lib/repos/servicios'
import { getAllProyectos } from './src/lib/repos/proyectos'

async function main() {
  console.log('DEBUG_DB:', process.env.DEBUG_DB)
  const es = await getAllServicios('es')
  const en = await getAllServicios('en')
  console.log('Servicios ES:', es.length)
  console.log('Servicios EN:', en.length)
  const proy = await getAllProyectos()
  console.log('Proyectos:', proy.length)
}

main().catch(e => { console.error(e); process.exit(1) })

