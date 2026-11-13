const fs = require('fs');
const path = require('path');
const { crearMundo, guardarMundo, leerMundo } = require('./mundo');
const { describirMundo } = require('./texto');

const CARPETA_DESCRIPCIONES = path.join(__dirname, '..', 'descripciones');

async function main() {
  try {
    const args = process.argv.slice(2);

    // Paso 1: validar los argumentos y guardar el mundo en JSON
    const mundoNuevo = crearMundo(args);
    const rutaMundo = guardarMundo(mundoNuevo);
    console.log(`Paso 1: mundo guardado en data/mundo_${mundoNuevo.id}.json`);

    // Paso 2: leer el JSON guardado y pedir la descripción al modelo de texto
    const mundo = leerMundo(rutaMundo);
    const rutaDescripcion = path.join(CARPETA_DESCRIPCIONES, `mundo_${mundo.id}.txt`);
    let descripcion;

    if (fs.existsSync(rutaDescripcion)) {
      descripcion = fs.readFileSync(rutaDescripcion, 'utf-8');
      console.log('Paso 2: la descripción ya existía, no se llamó al modelo de texto.');
    } else {
      descripcion = await describirMundo(mundo);
      fs.mkdirSync(CARPETA_DESCRIPCIONES, { recursive: true });
      fs.writeFileSync(rutaDescripcion, descripcion, 'utf-8');
      console.log(`Paso 2: descripción guardada en descripciones/mundo_${mundo.id}.txt`);
    }
  } catch (error) {
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();