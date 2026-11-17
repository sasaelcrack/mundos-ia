# mundos-ia

Programa de consola en Node.js que genera bocetos visuales de mundos imaginarios.

1. Recibe por parámetros una situación, un mundo y 5 colores, y los guarda en un JSON.
2. Lee ese JSON y se lo envía a un modelo de lenguaje, que escribe la descripción de una imagen (se guarda en un `.txt`).
3. Envía esa descripción a un modelo de imágenes y guarda la imagen.

Si ejecutas el mismo comando otra vez, no se llama a ninguna API: se reutilizan los archivos ya generados.

## 🎥 Demostración del proyecto

[Ver video de demostración](https://youtu.be/YMB4Gvx3_f8?si=L8k9EUWaNLp87sjM)

## Servicios usados

- Texto: Groq, modelo `openai/gpt-oss-20b` (https://console.groq.com/keys)
- Imagen: Cloudflare Workers AI, modelo FLUX.1-schnell (https://developers.cloudflare.com/workers-ai/get-started/rest-api/)

Primero se intentó con NVIDIA FLUX.1-schnell para la imagen, pero el servicio no respondía (timeout, incluso en su propio playground), por eso se cambió a Cloudflare.

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Copiar `.env.example` a `.env` y poner tus claves:

```bash
cp .env.example .env
```

Variables: `TEXTO_API_KEY`, `TEXTO_URL`, `TEXTO_MODELO`, `IMAGEN_API_KEY`, `IMAGEN_URL`.
En `IMAGEN_URL` va la URL de Cloudflare con tu Account ID.

## Uso

```bash
npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta
```

Las comillas y el doble guion (`--`) son necesarios.

## Estructura

```
mundos-ia/
├── src/
│   ├── index.js     # orquesta los pasos 1 a 3
│   ├── mundo.js     # valida argumentos, crea, guarda y lee el JSON
│   ├── texto.js     # consulta al modelo de lenguaje
│   └── imagen.js    # consulta al modelo de imágenes
├── data/            # JSON de cada mundo (no va a Git)
├── descripciones/   # descripciones .txt (no va a Git)
├── imagenes/        # imágenes generadas (no va a Git)
├── .env             # claves (no va a Git)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Experimento: npm publish --dry-run con y sin .gitignore

- Con `.gitignore`: 7 archivos, 3.5 kB. Solo `src/`, `package.json`, `.env.example` y `README.md`.
- Sin `.gitignore` (renombrado a `.gitignore.off`): 21 archivos, 3.0 MB. Aparecieron `.env`, `data/`, `descripciones/` e `imagenes/`.
- Por qué es peligroso: si se publicara así, el `.env` quedaría en npm y cualquiera podría usar mis claves de Groq y Cloudflare.

## Preguntas de reflexión

1. ¿Por qué el id se calcula sin la fecha? ¿Qué pasaría si la incluyeras?

   (La fecha (creadoEn) cambia en cada ejecución. Si entrara en el hash, el mismo mundo daría un id distinto cada vez, y nunca encontraría el .txt ni la imagen ya generados. Sin la fecha, los mismos datos dan siempre el mismo id y se reutilizan los archivos)

2. ¿Por qué se le pide al modelo de texto la descripción en inglés?

   (Los modelos de imágenes se entrenaron sobre todo con textos en inglés, así que lo entienden mejor y suelen dar imágenes más fieles a la descripción.)

3. ¿Qué diferencia hay entre una respuesta JSON de texto y una respuesta con los bytes de una imagen? ¿Qué es base64?

   (datos.choices[0].message.content. Una imagen son bytes binarios, que no se pueden escribir directo en un JSON. Cloudflare los manda como base64, que es una forma de representar bytes usando solo caracteres de texto. Por eso uso Buffer.from(textoBase64, 'base64') para volver a tener los bytes.)

4. ¿Qué pasaría si guardas la imagen con 'utf-8'? ¿Por qué?

   (Con 'utf-8', writeFileSync trata el contenido como texto y lo codifica, así que los bytes de la imagen quedan alterados y el archivo no abre. Los bytes se guardan tal cual, sin pasar la codificación.)

5. ¿Qué pasos consumen cuota gratuita y cómo evitaste repetirlos?

   (Consumen cuota el Paso 2 (Groq) y el Paso 3 (Cloudflare); el Paso 1 no. Con fs.existsSync reviso si ya existe el .txt o el .jpg del id, y si existen no llamo a la API. Además, el id estable hace que el mismo comando encuentre esos archivos.)

6. Si usaste IA: ¿qué fue lo más difícil de pedirle y qué parte tuviste que corregir tú?

   (Sí usé IA (Claude) como guía para construir el proyecto paso a paso, y está declarado en PROMPT.md. Lo más difícil fue que los servicios fallaran por razones que la IA no podía ver desde mi lado: el login de Groq daba un error al iniciar sesión, y la API de imágenes de NVIDIA se quedaba en timeout (incluso en su propio playground), así que tuve que cambiar a Cloudflare Workers AI y sacar yo mismo el token y el Account ID. También tuve que probar cada paso en mi computador y llevarle los resultados reales: por ejemplo, cuando un archivo de prueba no existía en mi carpeta o cuando el README se había quedado vacío porque no lo había guardado. Los errores del Paso 5 (clave falsa, modelo inexistente y URL mal escrita) los provoqué yo para comprobar que los mensajes en español funcionaban. Lo que aprendí es que el código que genera la IA hay que ejecutarlo y entenderlo, no solo copiarlo.)