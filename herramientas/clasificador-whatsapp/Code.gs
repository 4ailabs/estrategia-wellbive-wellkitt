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
