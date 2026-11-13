const fs = require('fs');
const path = require('path');
const hash = require('object-hash');

// Carpeta data/ calculada desde la ubicación de este archivo
const CARPETA_DATA = path.join(__dirname, '..', 'data');

const USO =
  'Uso: npm start -- "<situación>" "<mundo>" <color1> <color2> <color3> <color4> <color5>\n' +
  'Ejemplo: npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" ' +
  '"Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta';

// Paso 1: validar los argumentos y crear el objeto del mundo
function crearMundo(args) {
  // 1.1 Deben llegar exactamente 7 argumentos
  if (args.length !== 7) {
    throw new Error(`Se esperaban 7 argumentos y llegaron ${args.length}.\n${USO}`);
  }

  // 1.2 Ninguno puede estar vacío ni tener solo espacios
  for (const arg of args) {
    if (arg.trim() === '') {
      throw new Error(`Ningún argumento puede estar vacío.\n${USO}`);
    }
  }

  const situacion = args[0].trim();
  const mundo = args[1].trim();
  const colores = args.slice(2).map((color) => color.trim());

  // 1.3 Los 5 colores deben ser distintos (sin distinguir mayúsculas)
  const distintos = new Set(colores.map((color) => color.toLowerCase()));
  if (distintos.size !== 5) {
    throw new Error(`Los 5 colores deben ser distintos.\n${USO}`);
  }

  // 1.4 El id sale del hash de los datos, SIN la fecha, para que sea siempre igual
  const id = hash({ situacion, mundo, colores }).slice(0, 8);

  return { id, situacion, mundo, colores, creadoEn: new Date().toISOString() };
}

// Paso 2: guardar el objeto en data/mundo_<id>.json y devolver la ruta
function guardarMundo(mundo) {
  fs.mkdirSync(CARPETA_DATA, { recursive: true });
  const ruta = path.join(CARPETA_DATA, `mundo_${mundo.id}.json`);
  fs.writeFileSync(ruta, JSON.stringify(mundo, null, 2), 'utf-8');
  return ruta;
}

// Paso 3: leer el JSON guardado y devolverlo como objeto
function leerMundo(ruta) {
  return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

module.exports = { crearMundo, guardarMundo, leerMundo };