process.loadEnvFile();

// Mensaje de sistema: le dice al modelo cómo debe responder
const MENSAJE_SISTEMA =
  'You write prompts for an image generation model. ' +
  'You receive a JSON with a situation, a world and five colors. ' +
  'Reply with ONE single paragraph in English, between 80 and 120 words, ' +
  'that describes an image of that world: the scene, the main elements, the lighting, ' +
  'the composition and the artistic style. Mention all five colors (translate them to English). ' +
  'Describe an image, do not tell a story. ' +
  'No titles, no markdown, no lists, and no written text inside the image.'
    // Cambio propio 3: forzar el estilo acuarela en todas las imágenes
  'The artistic style must always be watercolor painting.';

const LIMITE_CARACTERES = 1500;

// Paso 2: pedir la descripción al modelo de texto (Groq)
async function describirMundo(mundo) {
  const respuesta = await fetch(process.env.TEXTO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.TEXTO_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.TEXTO_MODELO,
      messages: [
        { role: 'system', content: MENSAJE_SISTEMA },
        { role: 'user', content: JSON.stringify(mundo) },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!respuesta.ok) {
    const error = new Error(`El modelo de texto respondió con estado ${respuesta.status}`);
    error.estado = respuesta.status;
    error.retryAfter = respuesta.headers.get('retry-after');
    throw error;
  }

  const datos = await respuesta.json();
  let descripcion = (datos.choices?.[0]?.message?.content || '').trim();

  if (descripcion === '') {
    throw new Error('El modelo de texto devolvió una respuesta vacía.');
  }

  if (descripcion.length > LIMITE_CARACTERES) {
    console.log(`Aviso: la descripción tenía ${descripcion.length} caracteres y se recortó a ${LIMITE_CARACTERES}.`);
    descripcion = descripcion.slice(0, LIMITE_CARACTERES);
  }

  return descripcion;
}

module.exports = { describirMundo };