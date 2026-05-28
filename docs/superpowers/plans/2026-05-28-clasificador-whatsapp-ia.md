# Clasificador WhatsApp IA — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear un sistema en Google Sheets donde la secretaria pega el texto de una conversación de WhatsApp, presiona un botón, y Claude API la clasifica automáticamente llenando una fila de datos estructurados.

**Architecture:** Google Apps Script embebido en Google Sheets. Tres archivos `.gs`: `SheetManager.gs` configura las pestañas, `Clasificador.gs` llama a la Claude API y parsea el JSON, y `Code.gs` orquesta el flujo y expone el menú. El código fuente se guarda también en este repo como respaldo.

**Tech Stack:** Google Apps Script (JavaScript ES5+), Google Sheets API (via `SpreadsheetApp`), Claude API (`claude-haiku-4-5-20251001`), `UrlFetchApp`, `PropertiesService`.

---

## Estructura de archivos

```
herramientas/clasificador-whatsapp/
  Code.gs           ← función principal, menú onOpen, handler del botón
  Clasificador.gs   ← llamada a Claude API y parseo de JSON
  SheetManager.gs   ← configuración de pestañas y escritura de datos
  README.md         ← instrucciones de instalación en Apps Script
```

Estos archivos son la fuente de verdad. Se copian manualmente a Google Apps Script (instrucciones en README).

---

## Task 1: Código `SheetManager.gs` — configurar pestañas y escribir datos

**Files:**
- Create: `herramientas/clasificador-whatsapp/SheetManager.gs`

- [ ] **Paso 1.1: Crear el archivo**

Crear `herramientas/clasificador-whatsapp/SheetManager.gs` con este contenido exacto:

```javascript
/**
 * Crea o resetea las pestañas "Clasificar" y "Datos" en el Google Sheet activo.
 * Ejecutar UNA sola vez al instalar el sistema.
 */
function configurarHojas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Pestaña Clasificar ---
  var sheetClasificar = ss.getSheetByName('Clasificar');
  if (!sheetClasificar) {
    sheetClasificar = ss.insertSheet('Clasificar');
  } else {
    sheetClasificar.clearContents();
    sheetClasificar.clearFormats();
  }

  sheetClasificar.getRange('A1').setValue('Texto de la conversación de WhatsApp:');
  sheetClasificar.getRange('A1').setFontWeight('bold').setFontSize(12);
  sheetClasificar.getRange('A3').setValue('→ Pega aquí el texto completo (puede incluir nombres, emojis, etc.)');
  sheetClasificar.getRange('A3').setFontColor('#666666').setFontStyle('italic');
  sheetClasificar.getRange('B4').setBackground('#fff9c4').setWrap(true);
  sheetClasificar.setColumnWidth(2, 550);
  sheetClasificar.setRowHeight(4, 220);

  // --- Pestaña Datos ---
  var sheetDatos = ss.getSheetByName('Datos');
  if (!sheetDatos) {
    sheetDatos = ss.insertSheet('Datos');
  }

  var headers = [
    'Fecha', 'Nombre', 'Categoría', 'Subcategoría',
    'Productos mencionados', 'Cursos mencionados',
    'Palabra clave', 'Urgencia', 'Acción siguiente', 'Texto original'
  ];
  var headerRange = sheetDatos.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold').setBackground('#1a73e8').setFontColor('#ffffff').setFontSize(11);
  sheetDatos.setFrozenRows(1);
  sheetDatos.setColumnWidth(10, 400); // Texto original más ancho
  sheetDatos.setColumnWidth(9, 250); // Acción siguiente

  SpreadsheetApp.getUi().alert('✓ Hojas configuradas. Ahora usa el menú Wellbive > Clasificar conversación.');
}

/**
 * Escribe una fila con los datos clasificados en la pestaña Datos.
 * @param {Object} resultado - JSON retornado por Claude API
 * @param {string} textoOriginal - Texto pegado por la secretaria
 */
function escribirEnDatos(resultado, textoOriginal) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetDatos = ss.getSheetByName('Datos');

  if (!sheetDatos) {
    throw new Error('La pestaña "Datos" no existe. Ejecuta primero "Configurar hojas".');
  }

  var productos = Array.isArray(resultado.productos_mencionados)
    ? resultado.productos_mencionados.join(', ')
    : '';
  var cursos = Array.isArray(resultado.cursos_mencionados)
    ? resultado.cursos_mencionados.join(', ')
    : '';

  var fila = [
    new Date(),
    resultado.nombre || '',
    resultado.categoria || '',
    resultado.subcategoria || '',
    productos,
    cursos,
    resultado.palabra_clave || '',
    resultado.urgencia || '',
    resultado.accion_siguiente || '',
    textoOriginal
  ];

  sheetDatos.appendRow(fila);

  // Colorear urgencia
  var ultimaFila = sheetDatos.getLastRow();
  var celdaUrgencia = sheetDatos.getRange(ultimaFila, 8);
  var urgencia = resultado.urgencia || '';
  if (urgencia === 'Alta') {
    celdaUrgencia.setBackground('#f4cccc');
  } else if (urgencia === 'Media') {
    celdaUrgencia.setBackground('#fce8b2');
  } else if (urgencia === 'Baja') {
    celdaUrgencia.setBackground('#d9ead3');
  }
}

/**
 * Función de prueba — ejecutar en el editor de Apps Script para verificar que
 * la escritura funciona sin llamar a la API de Claude.
 */
function testEscribirEnDatos() {
  var resultadoFalso = {
    nombre: 'María García',
    categoria: 'Producto',
    subcategoria: 'Dolor articular, inflamación',
    productos_mencionados: ['Mincartil', 'Uña de Gato'],
    cursos_mencionados: [],
    palabra_clave: 'DOLOR',
    urgencia: 'Media',
    accion_siguiente: 'Enviar información del Kit Articulaciones y precio'
  };
  escribirEnDatos(resultadoFalso, 'Hola buenas, tengo mucho dolor en las rodillas y me dijeron que Mincartil ayuda');
  Logger.log('testEscribirEnDatos: OK — revisa la pestaña Datos');
}
```

- [ ] **Paso 1.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/SheetManager.gs
git commit -m "feat: agregar SheetManager.gs para configurar pestañas y escribir datos"
```

---

## Task 2: Código `Clasificador.gs` — llamada a Claude API

**Files:**
- Create: `herramientas/clasificador-whatsapp/Clasificador.gs`

- [ ] **Paso 2.1: Crear el archivo**

Crear `herramientas/clasificador-whatsapp/Clasificador.gs` con este contenido exacto:

```javascript
var CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
var CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
var MAX_TOKENS = 600;

var PROMPT_SISTEMA = 'Eres un asistente de análisis para el consultorio Wellbive / Wellkitt / ' +
  'Instituto Centrobioenergetica.\n\n' +
  'Analiza el siguiente texto de una conversación de WhatsApp y extrae esta información ' +
  'en formato JSON:\n\n' +
  '{\n' +
  '  "nombre": "nombre del cliente si aparece en el texto, o null",\n' +
  '  "categoria": "Consulta | Producto | Curso | Seguimiento | Pregunta | Queja | Otro",\n' +
  '  "subcategoria": "descripción breve del problema o tema (máx 10 palabras)",\n' +
  '  "productos_mencionados": ["lista de productos Wellkitt si se mencionan"],\n' +
  '  "cursos_mencionados": ["lista de cursos del Instituto si se mencionan"],\n' +
  '  "palabra_clave": "DIGESTION | ENERGIA | ESTRES | HORMONAS | DOLOR | DEFENSAS | PESO | PIEL | MENTE | DETOX | NINGUNA",\n' +
  '  "urgencia": "Alta | Media | Baja",\n' +
  '  "accion_siguiente": "descripción de la acción recomendada (máx 20 palabras)"\n' +
  '}\n\n' +
  'Reglas:\n' +
  '- urgencia Alta = queja, problema urgente de salud, o cliente que ya pagó y no recibió\n' +
  '- urgencia Media = interés de compra claro o pregunta con seguimiento necesario\n' +
  '- urgencia Baja = curiosidad general, pregunta de información sin urgencia\n' +
  '- Solo responde con el JSON. Sin texto adicional, sin ```json, solo el objeto {}.\n\n' +
  'CONVERSACIÓN:\n';

/**
 * Llama a la Claude API con el texto de la conversación.
 * @param {string} texto - Texto de la conversación de WhatsApp
 * @returns {Object|null} - JSON clasificado, o null si hubo error
 */
function llamarClaudeAPI(texto) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('CLAUDE_API_KEY');

  if (!apiKey) {
    SpreadsheetApp.getUi().alert(
      'Error: No se encontró la API key de Claude.\n\n' +
      'En el editor de Apps Script ve a:\n' +
      'Proyecto > Propiedades del proyecto > Propiedades de script\n' +
      'y agrega: CLAUDE_API_KEY = tu-api-key'
    );
    return null;
  }

  var payload = {
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    messages: [{ role: 'user', content: PROMPT_SISTEMA + texto }]
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(CLAUDE_API_URL, options);
    var code = response.getResponseCode();

    if (code !== 200) {
      Logger.log('Error HTTP ' + code + ': ' + response.getContentText());
      SpreadsheetApp.getUi().alert('Error al llamar a Claude (código ' + code + '). Revisa el log.');
      return null;
    }

    var data = JSON.parse(response.getContentText());
    var jsonText = data.content[0].text.trim();
    return JSON.parse(jsonText);

  } catch (e) {
    Logger.log('Excepción en llamarClaudeAPI: ' + e.toString());
    SpreadsheetApp.getUi().alert('Error procesando respuesta de Claude: ' + e.toString());
    return null;
  }
}

/**
 * Función de prueba — verifica que la API responde correctamente.
 * Ejecutar en el editor de Apps Script con la API key ya configurada.
 * Revisa el log (Ctrl+Enter) para ver el resultado.
 */
function testLlamarClaudeAPI() {
  var textoEjemplo = 'Hola doctora, soy Carmen. Tengo mucho cansancio todo el día, ' +
    'duermo bien pero me levanto agotada. Me dijeron que la Coenzima Q10 puede ayudar. ' +
    '¿Cuánto cuesta y cómo se toma?';

  var resultado = llamarClaudeAPI(textoEjemplo);

  if (resultado) {
    Logger.log('testLlamarClaudeAPI: OK');
    Logger.log('Resultado: ' + JSON.stringify(resultado, null, 2));
    // Verificaciones mínimas
    if (resultado.categoria !== 'Producto' && resultado.categoria !== 'Pregunta') {
      Logger.log('ALERTA: categoría inesperada: ' + resultado.categoria);
    }
    if (resultado.palabra_clave !== 'ENERGIA') {
      Logger.log('ALERTA: palabra_clave inesperada: ' + resultado.palabra_clave);
    }
  } else {
    Logger.log('testLlamarClaudeAPI: FALLÓ — resultado null');
  }
}
```

- [ ] **Paso 2.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/Clasificador.gs
git commit -m "feat: agregar Clasificador.gs con llamada a Claude API"
```

---

## Task 3: Código `Code.gs` — flujo principal y menú

**Files:**
- Create: `herramientas/clasificador-whatsapp/Code.gs`

- [ ] **Paso 3.1: Crear el archivo**

Crear `herramientas/clasificador-whatsapp/Code.gs` con este contenido exacto:

```javascript
/**
 * Se ejecuta automáticamente al abrir el Google Sheet.
 * Agrega el menú "Wellbive" con las opciones del sistema.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Wellbive')
    .addItem('⚡ Clasificar conversación', 'clasificarConversacion')
    .addSeparator()
    .addItem('⚙️ Configurar hojas (primera vez)', 'configurarHojas')
    .addToUi();
}

/**
 * Función principal. Lee el texto de B4 en la pestaña Clasificar,
 * lo envía a Claude, y escribe el resultado en Datos.
 */
function clasificarConversacion() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetClasificar = ss.getSheetByName('Clasificar');

  if (!sheetClasificar) {
    SpreadsheetApp.getUi().alert(
      'La pestaña "Clasificar" no existe.\n' +
      'Ve a Wellbive > Configurar hojas (primera vez).'
    );
    return;
  }

  var texto = sheetClasificar.getRange('B4').getValue();

  if (!texto || texto.toString().trim() === '') {
    SpreadsheetApp.getUi().alert('Pega primero el texto de la conversación en la celda amarilla (B4).');
    return;
  }

  // Indicador visual de procesamiento
  sheetClasificar.getRange('A6').setValue('⏳ Clasificando...');
  SpreadsheetApp.flush();

  var resultado = llamarClaudeAPI(texto.toString());

  sheetClasificar.getRange('A6').clearContent();

  if (!resultado) {
    return; // llamarClaudeAPI ya mostró el mensaje de error
  }

  escribirEnDatos(resultado, texto.toString());
  sheetClasificar.getRange('B4').clearContent();

  SpreadsheetApp.getUi().alert(
    '✓ Conversación clasificada\n\n' +
    'Categoría: ' + (resultado.categoria || '—') + '\n' +
    'Urgencia: ' + (resultado.urgencia || '—') + '\n' +
    'Acción: ' + (resultado.accion_siguiente || '—') + '\n\n' +
    'Los datos completos están en la pestaña Datos.'
  );
}

/**
 * Prueba de integración completa — llama a la API y escribe en Datos.
 * Ejecutar desde el editor de Apps Script para verificar el sistema completo.
 */
function testIntegracionCompleta() {
  var textoEjemplo = 'Buenos días, soy Ana. Tengo gastritis crónica y colitis. ' +
    'Un amigo me recomendó el Inulac y el Lacticol. ¿Los tienen? ' +
    '¿Hay algún kit para el sistema digestivo? Muchas gracias';

  Logger.log('testIntegracionCompleta: iniciando...');

  var resultado = llamarClaudeAPI(textoEjemplo);
  if (!resultado) {
    Logger.log('testIntegracionCompleta: FALLÓ en llamarClaudeAPI');
    return;
  }

  Logger.log('Claude respondió: ' + JSON.stringify(resultado, null, 2));
  escribirEnDatos(resultado, textoEjemplo);
  Logger.log('testIntegracionCompleta: OK — revisa la pestaña Datos');
}
```

- [ ] **Paso 3.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/Code.gs
git commit -m "feat: agregar Code.gs con menú y función principal de clasificación"
```

---

## Task 4: README de instalación

**Files:**
- Create: `herramientas/clasificador-whatsapp/README.md`

- [ ] **Paso 4.1: Crear el README**

Crear `herramientas/clasificador-whatsapp/README.md` con este contenido:

```markdown
# Clasificador WhatsApp IA

Sistema para clasificar conversaciones de WhatsApp automáticamente con Claude AI.

## Instalación (una sola vez)

### 1. Crear el Google Sheet

1. Abre [Google Sheets](https://sheets.google.com) y crea una hoja nueva.
2. Nómbrala "Clasificador WhatsApp Wellbive".

### 2. Abrir el editor de Apps Script

1. En el menú de Sheets: **Extensiones > Apps Script**
2. Borra el código de ejemplo que aparece (`function myFunction() {}`)

### 3. Copiar los tres archivos de código

En el editor de Apps Script, crea tres archivos con estos nombres y contenido:

| Archivo en Apps Script | Fuente en este repo |
|---|---|
| `Code.gs` (ya existe por defecto) | `Code.gs` de este directorio |
| `Clasificador.gs` (botón +) | `Clasificador.gs` de este directorio |
| `SheetManager.gs` (botón +) | `SheetManager.gs` de este directorio |

Para crear un archivo nuevo en Apps Script: clic en el **+** junto a "Archivos" > "Script".

### 4. Configurar la API key de Claude

1. En Apps Script, ve a **Proyecto (⚙️) > Propiedades del proyecto > Propiedades de script**
2. Haz clic en **Agregar propiedad**
3. Nombre: `CLAUDE_API_KEY`
4. Valor: tu API key de Anthropic (comienza con `sk-ant-...`)
5. Guarda

### 5. Ejecutar la configuración inicial

1. Cierra el editor de Apps Script y **recarga el Google Sheet**
2. Aparecerá el menú **Wellbive** en la barra superior
3. Ve a **Wellbive > Configurar hojas (primera vez)**
4. Autoriza los permisos que pide (acceso a Sheets y a internet)
5. Listo — las pestañas "Clasificar" y "Datos" están listas

## Uso diario (secretaria)

1. Abrir el Google Sheet
2. Ir a la pestaña **Clasificar**
3. Copiar el texto de la conversación de WhatsApp
4. Pegarlo en la celda amarilla (B4)
5. Ir al menú **Wellbive > ⚡ Clasificar conversación**
6. En ~5 segundos aparece un resumen; los datos completos están en **Datos**

## Verificar que funciona (pruebas)

Ejecutar estas funciones directamente en el editor de Apps Script (botón ▶):

1. `testEscribirEnDatos` — prueba la escritura sin llamar a la API
2. `testLlamarClaudeAPI` — prueba la llamada a Claude con un texto de ejemplo
3. `testIntegracionCompleta` — prueba el sistema completo de punta a punta

Revisa los resultados en **Ver > Registros** (Ctrl+Enter).

## Costos estimados

- Modelo: `claude-haiku-4-5` (el más económico)
- ~200 tokens de entrada + ~150 tokens de salida por conversación
- Costo aproximado: $0.0001 USD por conversación (menos de $0.01 por 100 conversaciones)
```

- [ ] **Paso 4.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/README.md
git commit -m "docs: agregar README con instrucciones de instalación del clasificador"
```

---

## Task 5: Instalar en Google Apps Script y probar

> Esta tarea se ejecuta manualmente en el navegador. No hay código que escribir.

- [ ] **Paso 5.1: Crear el Google Sheet**

1. Ir a [sheets.google.com](https://sheets.google.com) con la cuenta `contacto@institutocentrobioenergetica.com`
2. Crear hoja nueva, nombrarla **"Clasificador WhatsApp Wellbive"**

- [ ] **Paso 5.2: Copiar los archivos a Apps Script**

1. En Sheets: **Extensiones > Apps Script**
2. Borrar el código de `Code.gs` y reemplazar con el contenido de `herramientas/clasificador-whatsapp/Code.gs`
3. Crear archivo `Clasificador.gs` (botón + > Script) y pegar el contenido
4. Crear archivo `SheetManager.gs` (botón + > Script) y pegar el contenido
5. Guardar (Ctrl+S)

- [ ] **Paso 5.3: Configurar API key**

1. En Apps Script: **Proyecto (⚙️) > Propiedades del proyecto > Propiedades de script**
2. Agregar propiedad: `CLAUDE_API_KEY` = `[api key de Anthropic]`
3. Guardar

- [ ] **Paso 5.4: Ejecutar prueba sin API — `testEscribirEnDatos`**

1. En Apps Script, seleccionar función `testEscribirEnDatos` en el selector
2. Ejecutar (▶)
3. Autorizar permisos cuando se pida
4. Ir al Sheet > pestaña `Datos`
5. **Resultado esperado:** Una fila con datos de "María García", Producto, DOLOR, urgencia Media en color naranja

- [ ] **Paso 5.5: Ejecutar prueba con API — `testLlamarClaudeAPI`**

1. En Apps Script, seleccionar función `testLlamarClaudeAPI`
2. Ejecutar (▶)
3. Abrir **Ver > Registros** (Ctrl+Enter)
4. **Resultado esperado en log:**
```
testLlamarClaudeAPI: OK
Resultado: {
  "nombre": null,
  "categoria": "Producto",
  "subcategoria": "cansancio crónico, fatiga al despertar",
  "productos_mencionados": ["Coenzima Q10"],
  "cursos_mencionados": [],
  "palabra_clave": "ENERGIA",
  "urgencia": "Baja",
  "accion_siguiente": "..."
}
```

- [ ] **Paso 5.6: Prueba completa del flujo de la secretaria**

1. Recargar el Google Sheet (F5)
2. Ir a **Wellbive > Configurar hojas (primera vez)**
3. Ir a la pestaña **Clasificar**
4. Pegar este texto en B4:
   ```
   Hola buenas tardes, me llamo Roberto. Sufro de artritis en las manos hace 3 años.
   Vi el video de YouTube sobre el Mincartil y la Uña de Gato. ¿Cuánto cuestan?
   ¿Hay algún curso sobre dolor o biomagnetismo? Gracias
   ```
5. Ir a **Wellbive > ⚡ Clasificar conversación**
6. **Resultado esperado:** Alerta con categoría Producto, urgencia Media, y fila en pestaña Datos con productos `Mincartil, Uña de Gato`, palabra clave `DOLOR`

---

## Self-Review del plan

**Cobertura del spec:**
- ✓ Secretaria pega texto → botón → Claude clasifica
- ✓ Pestaña `Clasificar` con celda de entrada
- ✓ Pestaña `Datos` con 10 columnas incluyendo todas las del spec
- ✓ Claude API con prompt que incluye todas las categorías y palabras clave del spec
- ✓ API key en `PropertiesService` (no expuesta en la hoja)
- ✓ Instrucciones de instalación en README
- ✓ Pruebas manuales documentadas con resultado esperado

**Consistencia de tipos:**
- `escribirEnDatos(resultado, textoOriginal)` — definida en `SheetManager.gs`, llamada en `Code.gs` ✓
- `llamarClaudeAPI(texto)` — definida en `Clasificador.gs`, llamada en `Code.gs` ✓
- `configurarHojas()` — definida en `SheetManager.gs`, expuesta en menú de `Code.gs` ✓
- Celda de entrada: `B4` en todas las referencias ✓
