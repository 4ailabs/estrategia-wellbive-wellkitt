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
    if (!data.content || !data.content[0] || !data.content[0].text) {
      Logger.log('Respuesta inesperada de API: ' + response.getContentText());
      SpreadsheetApp.getUi().alert('Error: Respuesta inesperada de Claude. Revisa el log.');
      return null;
    }
    var jsonText = data.content[0].text.trim();
    try {
      return JSON.parse(jsonText);
    } catch (jsonErr) {
      Logger.log('Claude no devolvió JSON válido: ' + jsonText);
      SpreadsheetApp.getUi().alert('Claude no devolvió un formato válido. Texto recibido: ' + jsonText.substring(0, 100));
      return null;
    }

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
