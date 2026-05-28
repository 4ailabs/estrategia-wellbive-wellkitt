# Diseño: Clasificador de WhatsApp con IA para análisis de datos

**Fecha:** 2026-05-28
**Estado:** Aprobado para implementación
**Autor:** Dr. Miguel Ojeda / Claude

---

## Problema

Las conversaciones de WhatsApp (Wellbive / Wellkitt / Instituto) no se registran de forma estructurada. Esto impide saber qué quieren los clientes, qué productos se preguntan más, qué seguimientos hay pendientes, y dificulta el análisis de datos que realizará Alberto.

---

## Solución

Un sistema dentro de **Google Sheets** donde la secretaria pega el texto de una conversación de WhatsApp, hace clic en un botón, y la IA (Claude API) clasifica automáticamente el mensaje y llena una fila en la hoja de datos. Alberto accede a esa hoja en tiempo real para su análisis.

---

## Flujo

```
WhatsApp → Secretaria copia texto → Pestaña "Clasificar" en Google Sheets
→ Botón "Clasificar con IA" → Claude API procesa el texto
→ Fila nueva en pestaña "Datos" → Alberto analiza
```

---

## Arquitectura

### Componentes

1. **Google Sheets** — repositorio central de datos. Dos pestañas principales:
   - `Clasificar`: formulario de entrada donde la secretaria pega el texto
   - `Datos`: tabla acumulativa con todas las conversaciones clasificadas

2. **Google Apps Script** — código que se ejecuta dentro de Sheets. Toma el texto de la pestaña `Clasificar`, llama a la Claude API, y escribe el resultado en `Datos`.

3. **Claude API** — recibe el texto de la conversación y retorna un JSON estructurado con los campos clasificados.

### Pestaña `Clasificar` (vista secretaria)

| Campo | Descripción |
|---|---|
| Celda B2 | Pega aquí el texto de la conversación de WhatsApp |
| Botón "Clasificar" | Dispara el script de clasificación |
| Celda B10+ | Muestra el resultado antes de confirmar (opcional) |

### Pestaña `Datos` (vista Alberto / análisis)

| Columna | Contenido |
|---|---|
| Fecha | Fecha del registro |
| Nombre | Nombre del cliente (si aparece en el texto) |
| Categoría | Consulta / Producto / Curso / Seguimiento / Pregunta / Queja / Otro |
| Subcategoría | Problema detectado (ej: inflamación, cansancio, dolor) |
| Productos mencionados | Lista de productos Wellkitt detectados |
| Cursos mencionados | Cursos o talleres del Instituto mencionados |
| Palabra clave activada | DIGESTION / ENERGIA / ESTRES / HORMONAS / DOLOR / DEFENSAS / PESO / PIEL / MENTE / DETOX |
| Urgencia | Alta / Media / Baja |
| Acción siguiente | Texto sugerido por la IA |
| Texto original | El texto completo pegado por la secretaria |

---

## Prompt de clasificación (Claude API)

El script enviará el siguiente prompt al modelo:

```
Eres un asistente de análisis para el consultorio Wellbive / Wellkitt / Instituto Centrobioenergetica.

Analiza el siguiente texto de una conversación de WhatsApp y extrae esta información en formato JSON:

{
  "nombre": "nombre del cliente si aparece, o null",
  "categoria": "Consulta | Producto | Curso | Seguimiento | Pregunta | Queja | Otro",
  "subcategoria": "descripción breve del problema o tema (máx 10 palabras)",
  "productos_mencionados": ["lista", "de", "productos"],
  "cursos_mencionados": ["lista", "de", "cursos"],
  "palabra_clave": "DIGESTION | ENERGIA | ESTRES | HORMONAS | DOLOR | DEFENSAS | PESO | PIEL | MENTE | DETOX | NINGUNA",
  "urgencia": "Alta | Media | Baja",
  "accion_siguiente": "descripción de la acción recomendada (máx 20 palabras)"
}

Solo responde con el JSON. No añadas texto adicional.

CONVERSACIÓN:
[texto de la conversación]
```

---

## Consideraciones de seguridad

- La API key de Claude se guarda en las propiedades del script de Apps Script (no en la hoja), usando `PropertiesService.getScriptProperties()`.
- El texto original de las conversaciones NO se comparte con terceros fuera de la API de Anthropic, cubierta por su política de privacidad.
- El acceso a la hoja se restringe a: Dr. Miguel, secretaria, Alberto.

---

## Criterios de éxito

- La secretaria puede clasificar una conversación en menos de 30 segundos.
- La IA detecta correctamente la categoría en al menos el 85% de los casos.
- Alberto tiene acceso a una hoja filtrable y descargable en todo momento.
- No se requiere ninguna herramienta externa fuera de Google Sheets y la API de Claude.

---

## Fuera del alcance (por ahora)

- Integración directa con WhatsApp Business API (requiere cuenta de empresa verificada).
- Dashboard automático de análisis (eso lo hace Alberto con los datos exportados).
- Respuestas automáticas a clientes.
