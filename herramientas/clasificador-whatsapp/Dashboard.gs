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
