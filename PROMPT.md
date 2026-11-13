# PROMPT.md

## A. Declaración de uso de inteligencia artificial

Durante el desarrollo del proyecto utilicé Claude como herramienta de apoyo para comprender los requisitos, organizar el trabajo y resolver dudas sobre la implementación. También me ayudó con la estructura y la elaboración de algunos archivos del código.

Por mi parte, me encargué de configurar las API, adaptar el proyecto a los servicios utilizados, realizar modificaciones en el código, ejecutar pruebas, solucionar errores y comprobar que cada fase funcionara correctamente.

## B. Herramienta de inteligencia artificial utilizada

- **Herramienta:** Claude.
- **Modelo:** Claude Sonnet 5.5.
- **Medio utilizado:** aplicación de chat de Claude.

## C. Prompt inicial

Quería comprender cómo debía desarrollar el proyecto y organizar sus diferentes partes antes de comenzar. Para ello, solicité ayuda con la interpretación de los requisitos y la planificación de las etapas de trabajo.

**Prompt:**

> Analiza los requisitos del proyecto y explícame qué debo desarrollar. Organiza el trabajo por fases, indicando qué debo hacer en cada una, qué archivos necesito y cómo se relacionan entre sí. Quiero avanzar paso a paso y entender el funcionamiento de cada parte.

## D. Prompts posteriores

**1. Organización de la primera fase**

- **Prompt:** «Ayúdame a comenzar con la fase inicial del proyecto y explícame qué debo preparar antes de programar».
- **Objetivo:** organizar la preparación del proyecto y comprender los primeros pasos.
- **Resultado:** obtuve una guía para preparar la estructura y el entorno de trabajo.

**2. Configuración de Groq**

- **Prompt:** «Explícame paso a paso cómo configurar la API de Groq y cómo conectarla con mi proyecto de Node.js».
- **Objetivo:** comprender cómo utilizar el servicio para generar las descripciones de los mundos.
- **Resultado:** pude configurar las variables necesarias y realizar pruebas de conexión.

**3. Configuración de Cloudflare**

- **Prompt:** «Necesito ayuda para configurar Cloudflare Workers AI y utilizarlo en la generación de imágenes de mi proyecto».
- **Objetivo:** entender cómo integrar el servicio de generación de imágenes.
- **Resultado:** revisé la configuración y adapté las variables del archivo `.env` para utilizar el servicio.

**4. Organización de los archivos**

- **Prompt:** «Ayúdame a organizar el código de los archivos del proyecto y explícame cómo debe funcionar cada uno».
- **Objetivo:** comprender la distribución de responsabilidades entre los diferentes módulos.
- **Resultado:** trabajé con la estructura propuesta y realicé pruebas para verificar el funcionamiento de los archivos.

## E. Cambios realizados en el código

**1. Archivo `src/mundo.js`**

- **Cambio:** agregué un mensaje de ayuda para recordar que la situación y el mundo deben escribirse entre comillas cuando contienen varias palabras.
- **Razón:** evitar que los argumentos se separen incorrectamente al ejecutar el programa desde la terminal.

**2. Archivo `src/mundo.js`**

- **Cambio:** agregué una validación para limitar a 200 caracteres la situación y la descripción del mundo.
- **Razón:** evitar entradas demasiado extensas y reducir el consumo innecesario de la API.

**3. Archivo `src/texto.js`**

- **Cambio:** ajusté las instrucciones del modelo para que las descripciones de las imágenes incluyan un estilo artístico de acuarela.
- **Razón:** mantener una apariencia visual uniforme en las imágenes generadas.

## F. Explicación de una línea de código

**Línea seleccionada:**

```js
const descripcionNueva = await describirMundo(mundo);
```

Esta línea llama a la función `describirMundo` y le envía la información del mundo para que el modelo de texto genere una descripción.

La palabra `await` hace que el programa espere hasta que termine esa operación antes de continuar con las siguientes instrucciones. Así, la descripción queda disponible para guardarla en el archivo correspondiente.

## G. Error encontrado y cómo lo solucioné

Durante el desarrollo tuve un problema con el servicio de generación de imágenes de NVIDIA. Al ejecutar el programa, las solicitudes tardaban demasiado y terminaban produciendo un error de tiempo de espera (*timeout*).

Primero intenté solucionarlo aumentando el tiempo máximo de espera de 60 a 180 segundos. Sin embargo, el problema continuó. También comprobé el funcionamiento directamente en el Playground de NVIDIA y observé que allí se presentaba una situación similar.

Después de realizar estas pruebas, decidí utilizar Cloudflare Workers AI como alternativa. Para hacer el cambio, actualicé `IMAGEN_URL` y `IMAGEN_API_KEY` en el archivo `.env` y adapté el código para obtener la imagen desde `result.image`.

Con este cambio pude continuar con el desarrollo y las pruebas de generación de imágenes.