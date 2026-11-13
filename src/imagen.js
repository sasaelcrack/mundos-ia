process.loadEnvFile();

// Paso 3: enviar la descripción al modelo de imágenes (Cloudflare) y devolver los bytes
async function generarImagen(descripcion) {
  const respuesta = await fetch(process.env.IMAGEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.IMAGEN_API_KEY}`,
    },
    body: JSON.stringify({ prompt: descripcion, steps: 4 }),
    signal: AbortSignal.timeout(60000),
  });

  if (!respuesta.ok) {
    const error = new Error(`El modelo de imágenes respondió con estado ${respuesta.status}`);
    error.estado = respuesta.status;
    error.retryAfter = respuesta.headers.get('retry-after');
    throw error;
  }

  const datos = await respuesta.json();
  const textoBase64 = datos.result?.image;

  if (!textoBase64) {
    throw new Error('El modelo de imágenes no devolvió ninguna imagen.');
  }

  // La imagen llega como texto base64: la convertimos a bytes
  const bytes = Buffer.from(textoBase64, 'base64');

  if (bytes.length === 0) {
    throw new Error('La imagen recibida está vacía.');
  }

  return bytes;
}

module.exports = { generarImagen };