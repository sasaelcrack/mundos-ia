const fs = require('fs');
const path = require('path');
const { crearMundo, guardarMundo, leerMundo } = require('./mundo');
const { describirMundo } = require('./texto');
const { generarImagen } = require('./imagen');

const CARPETA_DESCRIPCIONES = path.join(__dirname, '..', 'descripciones');
const CARPETA_IMAGENES = path.join(__dirname, '..', 'imagenes');

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

    if (fs.existsSync(rutaDescripcion)) {
      console.log('Paso 2: la descripción ya existía, no se llamó al modelo de texto.');
    } else {
      const descripcionNueva = await describirMundo(mundo);
      fs.mkdirSync(CARPETA_DESCRIPCIONES, { recursive: true });
      fs.writeFileSync(rutaDescripcion, descripcionNueva, 'utf-8');
      console.log(`Paso 2: descripción guardada en descripciones/mundo_${mundo.id}.txt`);
    }

    // Paso 3: leer la descripción del .txt y pedir la imagen al modelo de imágenes
    const rutaImagen = path.join(CARPETA_IMAGENES, `mundo_${mundo.id}.jpg`);

    if (fs.existsSync(rutaImagen)) {
      console.log('Paso 3: la imagen ya existía, no se llamó al modelo de imágenes.');
    } else {
      const descripcion = fs.readFileSync(rutaDescripcion, 'utf-8');
      const bytes = await generarImagen(descripcion);
      fs.mkdirSync(CARPETA_IMAGENES, { recursive: true });
      fs.writeFileSync(rutaImagen, bytes); // bytes tal cual, SIN 'utf-8'
      console.log(`Paso 3: imagen guardada en imagenes/mundo_${mundo.id}.jpg`);
    }

    console.log('Listo. Revisa la carpeta imagenes/');
  } catch (error) {
    console.log(error.message);
    process.exitCode = 1;
  }
}

main();