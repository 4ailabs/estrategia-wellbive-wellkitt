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
  sheet.getRange('A3').setValue('HOY');
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
  sheet.getRange('A8').setValue('ESTA SEMANA');
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
  sheet.getRange(rowKw, 1).setValue('TOP PALABRAS CLAVE (esta semana)');
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
  sheet.getRange(rowUrg, 1).setValue('URGENCIAS ALTA PENDIENTES');
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
        'Proyecto > Propiedades de la secuencia de comandos\n' +
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
    html += '<h3 style="color:#c62828">Urgencias Alta (' + urgenciasAlta.length + ')</h3>';
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
    'Apps Script > Proyecto > Propiedades de la secuencia de comandos'
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
