const { crearMundo, guardarMundo, leerMundo } = require('./mundo');

async function main() {
  try {
    const args = process.argv.slice(2);
    const mundo = crearMundo(args);
    const ruta = guardarMundo(mundo);
    console.log(`Paso 1: mundo guardado en data/mundo_${mundo.id}.json`);
    console.log(leerMundo(ruta));
  } catch (error) {
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();