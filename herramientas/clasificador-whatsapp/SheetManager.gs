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
