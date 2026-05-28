# Dashboard y Análisis para Alberto — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar al Google Sheet existente un Dashboard auto-actualizable, un reporte semanal por email automático, y una guía de Looker Studio para que Alberto analice los datos de WhatsApp clasificados.

**Architecture:** Nuevo archivo `Dashboard.gs` en Google Apps Script con `configurarDashboard()` (crea tab con fórmulas), `enviarReporteSemanal()` (envía HTML por email), y `configurarTrigger()` (activa envío automático lunes 8am). `Code.gs` se modifica para exponer las 3 funciones en el menú Wellbive. `LOOKER-STUDIO.md` es una guía de texto sin código.

**Tech Stack:** Google Apps Script (ES5), SpreadsheetApp (fórmulas COUNTIFS + QUERY), MailApp (email HTML), ScriptApp (time-based triggers), PropertiesService (ALBERTO_EMAIL).

---

## Estructura de archivos

```
herramientas/clasificador-whatsapp/
  Dashboard.gs        ← NUEVO: configurarDashboard(), enviarReporteSemanal(), configurarTrigger()
  Code.gs             ← MODIFICAR: agregar 3 items al menú onOpen()
  LOOKER-STUDIO.md    ← NUEVO: guía paso a paso para Looker Studio
```

---

## Task 1: `Dashboard.gs` — función `configurarDashboard()`

**Files:**
- Create: `herramientas/clasificador-whatsapp/Dashboard.gs`

- [ ] **Paso 1.1: Crear el archivo**

Crear `herramientas/clasificador-whatsapp/Dashboard.gs` con este contenido exacto:

```javascript
/**
 * Crea o recrea la pestaña Dashboard con métricas automáticas.
 * Ejecutar UNA vez desde Wellbive > Crear Dashboard.
 */
function configurarDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) {
    sheet = ss.insertSheet('Dashboard');
  } else {
    sheet.clearContents();
    sheet.clearFormats();
  }

  // Título principal
  sheet.getRange('A1').setValue('DASHBOARD — Clasificador WhatsApp Wellbive');
  sheet.getRange('A1').setFontSize(14).setFontWeight('bold')
    .setBackground('#1a73e8').setFontColor('#ffffff');
  sheet.getRange('A1:C1').merge();

  // --- HOY ---
  sheet.getRange('A3').setValue('📅 HOY');
  sheet.getRange('A3:C3').merge();
  sheet.getRange('A3').setFontWeight('bold').setFontSize(12).setBackground('#e8f0fe');

  sheet.getRange('A4').setValue('Fecha:');
  sheet.getRange('B4').setFormula('=TODAY()');
  sheet.getRange('B4').setNumberFormat('dd/mm/yyyy');

  sheet.getRange('A5').setValue('Conversaciones hoy:');
  sheet.getRange('B5').setFormula(
    '=IFERROR(COUNTIFS(Datos!A:A,">="&TODAY(),Datos!A:A,"<"&TODAY()+1),0)'
  );

  sheet.getRange('A6').setValue('Urgencias Alta hoy:');
  sheet.getRange('B6').setFormula(
    '=IFERROR(COUNTIFS(Datos!A:A,">="&TODAY(),Datos!A:A,"<"&TODAY()+1,Datos!H:H,"Alta"),0)'
  );
  sheet.getRange('B6').setBackground('#f4cccc');

  // --- ESTA SEMANA ---
  sheet.getRange('A8').setValue('📊 ESTA SEMANA');
  sheet.getRange('A8:C8').merge();
  sheet.getRange('A8').setFontWeight('bold').setFontSize(12).setBackground('#e8f0fe');

  // Fórmula base para "desde el lunes de esta semana hasta hoy"
  // WEEKDAY(...,2) devuelve 1=lunes, 7=domingo
  var desdeFormula = '">="&(TODAY()-WEEKDAY(TODAY(),2)+1),Datos!A:A,"<="&TODAY()';

  sheet.getRange('A9').setValue('Total conversaciones:');
  sheet.getRange('B9').setFormula('=IFERROR(COUNTIFS(Datos!A:A,' + desdeFormula + '),0)');

  var categorias = ['Consulta', 'Producto', 'Curso', 'Seguimiento', 'Pregunta', 'Queja'];
  for (var i = 0; i < categorias.length; i++) {
    sheet.getRange(10 + i, 1).setValue(categorias[i] + ':');
    sheet.getRange(10 + i, 2).setFormula(
      '=IFERROR(COUNTIFS(Datos!A:A,' + desdeFormula + ',Datos!C:C,"' + categorias[i] + '"),0)'
    );
  }

  // --- TOP PALABRAS CLAVE ---
  var rowKw = 17;
  sheet.getRange(rowKw, 1).setValue('🔑 TOP PALABRAS CLAVE (esta semana)');
  sheet.getRange(rowKw, 1, 1, 2).merge();
  sheet.getRange(rowKw, 1).setFontWeight('bold').setFontSize(12).setBackground('#e8f0fe');

  sheet.getRange(rowKw + 1, 1).setValue('Palabra clave');
  sheet.getRange(rowKw + 1, 2).setValue('Menciones');
  sheet.getRange(rowKw + 1, 1, 1, 2).setFontWeight('bold').setBackground('#f1f3f4');

  var keywords = ['DIGESTION','ENERGIA','ESTRES','HORMONAS','DOLOR','DEFENSAS','PESO','PIEL','MENTE','DETOX'];
  for (var j = 0; j < keywords.length; j++) {
    sheet.getRange(rowKw + 2 + j, 1).setValue(keywords[j]);
    sheet.getRange(rowKw + 2 + j, 2).setFormula(
      '=IFERROR(COUNTIFS(Datos!A:A,' + desdeFormula + ',Datos!G:G,"' + keywords[j] + '"),0)'
    );
  }

  // --- URGENCIAS ALTA PENDIENTES ---
  var rowUrg = rowKw + 2 + keywords.length + 2;
  sheet.getRange(rowUrg, 1).setValue('⚠️ URGENCIAS ALTA PENDIENTES');
  sheet.getRange(rowUrg, 1, 1, 3).merge();
  sheet.getRange(rowUrg, 1).setFontWeight('bold').setFontSize(12).setBackground('#f4cccc');

  sheet.getRange(rowUrg + 1, 1).setValue('Fecha');
  sheet.getRange(rowUrg + 1, 2).setValue('Nombre');
  sheet.getRange(rowUrg + 1, 3).setValue('Acción siguiente');
  sheet.getRange(rowUrg + 1, 1, 1, 3).setFontWeight('bold').setBackground('#f1f3f4');

  // QUERY filtra filas donde Urgencia (col H = col 8) = Alta, últimas 20
  sheet.getRange(rowUrg + 2, 1).setFormula(
    '=IFERROR(QUERY(Datos!A:J,' +
    '"SELECT A,B,I WHERE H=\'Alta\' ORDER BY A DESC LIMIT 20 LABEL A \'\', B \'\', I \'\'"' +
    ',0),"")'
  );

  // Anchos de columna
  sheet.setColumnWidth(1, 230);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 320);

  SpreadsheetApp.getUi().alert(
    '✓ Dashboard creado.\n\n' +
    'Los datos se actualizan automáticamente cada vez que se abra el Sheet.'
  );
}

/**
 * Prueba del Dashboard — verifica que la pestaña se crea sin errores.
 * Ejecutar desde el editor de Apps Script antes de usar en producción.
 */
function testConfigurarDashboard() {
  configurarDashboard();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dashboard');
  if (!sheet) {
    Logger.log('testConfigurarDashboard: FALLÓ — pestaña no creada');
    return;
  }
  if (sheet.getRange('A1').getValue() !== 'DASHBOARD — Clasificador WhatsApp Wellbive') {
    Logger.log('testConfigurarDashboard: FALLÓ — título incorrecto: ' + sheet.getRange('A1').getValue());
    return;
  }
  Logger.log('testConfigurarDashboard: OK');
}
```

- [ ] **Paso 1.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/Dashboard.gs
git commit -m "feat: agregar Dashboard.gs con configurarDashboard()"
```

---

## Task 2: `Dashboard.gs` — funciones de email `enviarReporteSemanal()` y `configurarTrigger()`

**Files:**
- Modify: `herramientas/clasificador-whatsapp/Dashboard.gs` (agregar al final)

- [ ] **Paso 2.1: Agregar las dos funciones al final de `Dashboard.gs`**

Abrir `herramientas/clasificador-whatsapp/Dashboard.gs` y **agregar al final** (después del cierre de `testConfigurarDashboard`) el siguiente código:

```javascript
/**
 * Genera y envía el reporte semanal por email a ALBERTO_EMAIL.
 * Se llama automáticamente cada lunes a las 8am (via configurarTrigger),
 * o manualmente desde Wellbive > Enviar reporte ahora.
 */
function enviarReporteSemanal() {
  var email = PropertiesService.getScriptProperties().getProperty('ALBERTO_EMAIL');
  if (!email) {
    try {
      SpreadsheetApp.getUi().alert(
        'Error: No se encontró el email de Alberto.\n\n' +
        'En Apps Script ve a:\n' +
        'Proyecto ⚙️ > Propiedades de la secuencia de comandos\n' +
        'y agrega: ALBERTO_EMAIL = email@ejemplo.com'
      );
    } catch(e) { Logger.log('ALBERTO_EMAIL no configurado'); }
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetDatos = ss.getSheetByName('Datos');
  if (!sheetDatos || sheetDatos.getLastRow() <= 1) {
    MailApp.sendEmail(email,
      'Reporte WhatsApp Wellbive — sin datos esta semana',
      'No hay conversaciones registradas esta semana.'
    );
    return;
  }

  var datos = sheetDatos.getDataRange().getValues();

  // Calcular rango lunes-domingo de la semana pasada
  var hoy = new Date();
  var diasDesdeHoy = (hoy.getDay() + 6) % 7; // días desde el lunes más reciente
  var lunesEstaSemana = new Date(hoy);
  lunesEstaSemana.setDate(hoy.getDate() - diasDesdeHoy);
  lunesEstaSemana.setHours(0, 0, 0, 0);

  var lunesPasado = new Date(lunesEstaSemana);
  lunesPasado.setDate(lunesEstaSemana.getDate() - 7);
  var domingoPasado = new Date(lunesPasado);
  domingoPasado.setDate(lunesPasado.getDate() + 6);
  domingoPasado.setHours(23, 59, 59, 999);

  var semana = datos.slice(1).filter(function(row) {
    var fecha = new Date(row[0]);
    return fecha >= lunesPasado && fecha <= domingoPasado;
  });

  // Acumular métricas
  var categorias = {};
  var keywords = {};
  var urgenciasAlta = [];

  semana.forEach(function(row) {
    var cat = row[2] || 'Otro';
    categorias[cat] = (categorias[cat] || 0) + 1;

    var kw = row[6] || 'NINGUNA';
    if (kw !== 'NINGUNA') {
      keywords[kw] = (keywords[kw] || 0) + 1;
    }

    if (row[7] === 'Alta') {
      urgenciasAlta.push({
        nombre: row[1] || 'Sin nombre',
        accion: row[8] || '—',
        fecha: row[0] instanceof Date
          ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'dd/MM/yyyy')
          : row[0]
      });
    }
  });

  var kwSorted = Object.keys(keywords).sort(function(a, b) {
    return keywords[b] - keywords[a];
  });

  var tz = Session.getScriptTimeZone();
  var fechaStr = Utilities.formatDate(lunesPasado, tz, 'dd/MM/yyyy') +
    ' al ' + Utilities.formatDate(domingoPasado, tz, 'dd/MM/yyyy');

  // Construir HTML
  var html = '<div style="font-family:Arial,sans-serif;max-width:600px">';
  html += '<h2 style="color:#1a73e8">Reporte WhatsApp Wellbive</h2>';
  html += '<p><strong>Semana:</strong> ' + fechaStr + '</p>';
  html += '<p><strong>Total conversaciones:</strong> ' + semana.length + '</p>';
  html += '<hr>';

  html += '<h3>Por categoría</h3>';
  html += '<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">';
  html += '<tr style="background:#1a73e8;color:white"><th>Categoría</th><th>Cantidad</th></tr>';
  Object.keys(categorias).sort().forEach(function(cat) {
    html += '<tr><td>' + cat + '</td><td>' + categorias[cat] + '</td></tr>';
  });
  html += '</table>';

  if (kwSorted.length > 0) {
    html += '<h3>Palabras clave más activas</h3>';
    html += '<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">';
    html += '<tr style="background:#1a73e8;color:white"><th>Palabra clave</th><th>Menciones</th></tr>';
    kwSorted.slice(0, 5).forEach(function(kw) {
      html += '<tr><td>' + kw + '</td><td>' + keywords[kw] + '</td></tr>';
    });
    html += '</table>';
  }

  if (urgenciasAlta.length > 0) {
    html += '<h3 style="color:#c62828">⚠️ Urgencias Alta (' + urgenciasAlta.length + ')</h3>';
    html += '<table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">';
    html += '<tr style="background:#f4cccc"><th>Fecha</th><th>Nombre</th><th>Acción siguiente</th></tr>';
    urgenciasAlta.forEach(function(u) {
      html += '<tr><td>' + u.fecha + '</td><td>' + u.nombre + '</td><td>' + u.accion + '</td></tr>';
    });
    html += '</table>';
  }

  html += '<p style="color:#999;font-size:12px;margin-top:24px">';
  html += 'Generado automáticamente — Clasificador WhatsApp Wellbive</p>';
  html += '</div>';

  var asunto = 'Reporte WhatsApp Wellbive — semana del ' + fechaStr;
  MailApp.sendEmail({ to: email, subject: asunto, htmlBody: html });
  Logger.log('Reporte enviado a ' + email);

  try {
    SpreadsheetApp.getUi().alert('✓ Reporte enviado a ' + email);
  } catch(e) {
    // Llamado desde trigger automático, sin UI disponible
  }
}

/**
 * Configura el trigger automático: envía el reporte cada lunes a las 8am.
 * Ejecutar UNA sola vez desde Wellbive > Activar envío automático.
 * Elimina triggers anteriores para evitar duplicados.
 */
function configurarTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'enviarReporteSemanal') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('enviarReporteSemanal')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  SpreadsheetApp.getUi().alert(
    '✓ Activado.\n\n' +
    'El reporte se enviará cada lunes a las 8am a la dirección en ALBERTO_EMAIL.\n\n' +
    'Si aún no configuraste ALBERTO_EMAIL ve a:\n' +
    'Apps Script > Proyecto ⚙️ > Propiedades de la secuencia de comandos'
  );
}

/**
 * Prueba del email — envía un reporte de prueba inmediatamente.
 * Ejecutar desde el editor de Apps Script para verificar que el email llega.
 */
function testEnviarReporte() {
  enviarReporteSemanal();
  Logger.log('testEnviarReporte: completado — revisa el correo de ALBERTO_EMAIL');
}
```

- [ ] **Paso 2.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/Dashboard.gs
git commit -m "feat: agregar enviarReporteSemanal() y configurarTrigger() a Dashboard.gs"
```

---

## Task 3: Modificar `Code.gs` — agregar 3 items al menú

**Files:**
- Modify: `herramientas/clasificador-whatsapp/Code.gs`

- [ ] **Paso 3.1: Reemplazar la función `onOpen()` en `Code.gs`**

El archivo actual tiene `onOpen()` con 2 items. Reemplazar **solo la función `onOpen()`** con esta versión que tiene 5 items:

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
    .addItem('📊 Crear Dashboard (una vez)', 'configurarDashboard')
    .addSeparator()
    .addItem('📧 Enviar reporte ahora', 'enviarReporteSemanal')
    .addItem('⏰ Activar envío automático (lunes 8am)', 'configurarTrigger')
    .addToUi();
}
```

El resto del archivo (`clasificarConversacion`, `testIntegracionCompleta`) no cambia.

- [ ] **Paso 3.2: Verificar que el resto del archivo es idéntico al original**

El archivo completo debe quedar así:

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
    .addItem('📊 Crear Dashboard (una vez)', 'configurarDashboard')
    .addSeparator()
    .addItem('📧 Enviar reporte ahora', 'enviarReporteSemanal')
    .addItem('⏰ Activar envío automático (lunes 8am)', 'configurarTrigger')
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

- [ ] **Paso 3.3: Commit**

```bash
git add herramientas/clasificador-whatsapp/Code.gs
git commit -m "feat: agregar 3 items al menú Wellbive para Dashboard y email"
```

---

## Task 4: `LOOKER-STUDIO.md` — guía de configuración

**Files:**
- Create: `herramientas/clasificador-whatsapp/LOOKER-STUDIO.md`

- [ ] **Paso 4.1: Crear el archivo**

Crear `herramientas/clasificador-whatsapp/LOOKER-STUDIO.md` con este contenido:

```markdown
# Looker Studio — Guía de configuración

Dashboard visual profesional conectado al Google Sheet del clasificador.
No requiere código. Tiempo estimado: 15-20 minutos.

## 1. Crear el reporte

1. Abrir [Looker Studio](https://lookerstudio.google.com)
2. Clic en **"+ Crear" > "Informe"**
3. En la pantalla de fuentes de datos, seleccionar **"Google Sheets"**
4. Autorizar permisos si se pide
5. Buscar y seleccionar el archivo **"Clasificador WhatsApp Wellbive"**
6. Seleccionar la hoja **"Datos"**
7. Activar la opción **"Usar primera fila como encabezado"**
8. Clic en **"Agregar"** y luego **"Agregar al informe"**

## 2. Configurar el campo Fecha

Para que los filtros de fecha funcionen correctamente:

1. En el panel derecho, buscar el campo **"Fecha"**
2. Si aparece como texto, hacer clic en él > cambiar tipo a **"Fecha y hora"**
3. Formato: `DD/MM/YYYY HH:MM:SS`

## 3. Gráfica 1 — Conversaciones por Categoría (barras)

1. Clic en **"Agregar un gráfico" > "Gráfico de barras"**
2. Dimensión: `Categoría`
3. Métrica: `Recuento de registros`
4. Ordenar por: Métrica, descendente
5. Título: "Conversaciones por Categoría"

## 4. Gráfica 2 — Palabras clave (pie chart)

1. Clic en **"Agregar un gráfico" > "Gráfico circular"**
2. Dimensión: `Palabra clave`
3. Métrica: `Recuento de registros`
4. Filtrar: excluir `NINGUNA` (clic en "Agregar filtro" > Palabra clave ≠ NINGUNA)
5. Título: "Temas más frecuentes"

## 5. Tabla — Urgencias Alta

1. Clic en **"Agregar un gráfico" > "Tabla"**
2. Dimensiones: `Fecha`, `Nombre`, `Categoría`, `Acción siguiente`
3. Filtro: `Urgencia = Alta`
4. Ordenar por: Fecha, descendente
5. Título: "Urgencias Alta"

## 6. Agregar filtro de fecha global

1. Clic en **"Agregar un control" > "Intervalo de fechas"**
2. Campo de fecha: `Fecha`
3. Valor predeterminado: "Últimos 7 días"
4. Esto filtrará las 3 gráficas al mismo tiempo

## 7. Compartir con Alberto

1. Clic en **"Compartir"** (arriba a la derecha)
2. Agregar el email de Alberto
3. Rol: **Visor** (solo lectura)
4. Alberto puede ver el dashboard desde su navegador sin necesitar cuenta de Looker Studio

## Notas

- El dashboard se actualiza automáticamente cada vez que se abren (no en tiempo real, sino al cargar).
- Para forzar actualización: clic en el ícono de actualización en la fuente de datos.
- Si los datos no aparecen, verificar que la pestaña "Datos" del Sheet tenga al menos una fila de datos además del encabezado.
```

- [ ] **Paso 4.2: Commit**

```bash
git add herramientas/clasificador-whatsapp/LOOKER-STUDIO.md
git commit -m "docs: agregar guía de configuración de Looker Studio"
```

---

## Task 5: Instalar en Apps Script y probar

> Tarea manual — ejecutar en el navegador.

- [ ] **Paso 5.1: Copiar `Dashboard.gs` a Apps Script**

1. Abrir Apps Script del Clasificador
2. Clic en **+** junto a Archivos > Script
3. Nombre: `Dashboard`
4. Pegar el contenido completo de `herramientas/clasificador-whatsapp/Dashboard.gs`
5. Guardar (Ctrl+S)

- [ ] **Paso 5.2: Actualizar `Code.gs` en Apps Script**

1. En Apps Script, abrir `Código.gs`
2. Reemplazar la función `onOpen()` con la versión nueva del Task 3 (5 items en vez de 2)
3. Guardar (Ctrl+S)

- [ ] **Paso 5.3: Probar `testConfigurarDashboard`**

1. En Apps Script, seleccionar función `testConfigurarDashboard` en el selector
2. Ejecutar (▶)
3. **Resultado esperado en log:** `testConfigurarDashboard: OK`
4. En el Sheet, verificar que apareció la pestaña `Dashboard` con:
   - Título azul "DASHBOARD — Clasificador WhatsApp Wellbive"
   - Secciones HOY, ESTA SEMANA, TOP PALABRAS CLAVE, URGENCIAS ALTA

- [ ] **Paso 5.4: Configurar ALBERTO_EMAIL**

1. En Apps Script: Proyecto ⚙️ > Propiedades de la secuencia de comandos
2. Agregar propiedad: `ALBERTO_EMAIL` = email real de Alberto
3. Guardar

- [ ] **Paso 5.5: Probar `testEnviarReporte`**

1. En Apps Script, seleccionar función `testEnviarReporte`
2. Ejecutar (▶) — autorizar acceso a Gmail si se pide
3. **Resultado esperado:** Email llega al correo de Alberto con tablas de categorías, palabras clave y urgencias

- [ ] **Paso 5.6: Activar trigger automático**

1. Recargar el Google Sheet (F5)
2. Ir a **Wellbive → ⏰ Activar envío automático (lunes 8am)**
3. **Resultado esperado:** Alerta de confirmación. En Apps Script > Activadores se ve `enviarReporteSemanal` con trigger semanal.

---

## Self-Review del plan

**Cobertura del spec:**
- ✓ Dashboard tab con 5 bloques (hoy, semana, categorías, palabras clave, urgencias Alta)
- ✓ Email automático semanal (lunes 8am) via `configurarTrigger()`
- ✓ Envío manual desde menú ("📧 Enviar reporte ahora")
- ✓ ALBERTO_EMAIL en PropertiesService (no hardcodeado)
- ✓ Menú Wellbive actualizado con 3 nuevos items
- ✓ Guía Looker Studio con las 3 gráficas del spec (barras categoría, pie keywords, tabla urgencias)
- ✓ Fórmulas con IFERROR para evitar errores #N/A con 0 datos

**Consistencia de tipos:**
- `configurarDashboard()` — definida en `Dashboard.gs`, expuesta en menú de `Code.gs` ✓
- `enviarReporteSemanal()` — definida en `Dashboard.gs`, expuesta en menú y como trigger ✓
- `configurarTrigger()` — definida en `Dashboard.gs`, referencia correcta a `enviarReporteSemanal` ✓
- `desdeFormula` string — usado consistentemente en todas las fórmulas ESTA SEMANA ✓
- Columnas Datos: A=Fecha(0), B=Nombre(1), C=Categoría(2), G=PalabraClave(6), H=Urgencia(7), I=AcciónSiguiente(8) — consistente con SheetManager.gs ✓
