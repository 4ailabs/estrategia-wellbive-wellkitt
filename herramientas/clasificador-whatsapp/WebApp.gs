/**
 * Procesa los datos crudos del Sheet y devuelve el objeto de métricas.
 * @param {Array[][]} datos - Resultado de sheetDatos.getDataRange().getValues()
 * @returns {Object} métricas para generarHTML()
 */
function calcularMetricas(datos) {
  var hoy = new Date();
  var diasDesdeHoy = (hoy.getDay() + 6) % 7;
  var lunesEstaSemana = new Date(hoy);
  lunesEstaSemana.setDate(hoy.getDate() - diasDesdeHoy);
  lunesEstaSemana.setHours(0, 0, 0, 0);

  var semana = datos.slice(1).filter(function(row) {
    if (!row[0]) return false;
    var fecha = new Date(row[0]);
    return fecha >= lunesEstaSemana && fecha <= hoy;
  });

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
        fecha: row[0] instanceof Date
          ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'dd/MM')
          : String(row[0]).substring(0, 5),
        nombre: row[1] || 'Sin nombre',
        accion: row[8] || '—'
      });
    }
  });

  var catSorted = Object.keys(categorias).sort(function(a, b) {
    return categorias[b] - categorias[a];
  });
  var kwSorted = Object.keys(keywords).sort(function(a, b) {
    return keywords[b] - keywords[a];
  });

  var maxCat = catSorted.length > 0 ? categorias[catSorted[0]] : 1;
  var maxKw = kwSorted.length > 0 ? keywords[kwSorted[0]] : 1;

  return {
    totalSemana: semana.length,
    urgenciasAltaCount: urgenciasAlta.length,
    topKeyword: kwSorted.length > 0 ? kwSorted[0] : 'N/A',
    topCategoria: catSorted.length > 0 ? catSorted[0] : 'N/A',
    urgenciasAlta: urgenciasAlta.slice(0, 10),
    categorias: catSorted.map(function(c) {
      return { nombre: c, count: categorias[c], pct: Math.round(categorias[c] / maxCat * 100) };
    }),
    keywords: kwSorted.slice(0, 8).map(function(k) {
      return { nombre: k, count: keywords[k], pct: Math.round(keywords[k] / maxKw * 100) };
    }),
    fechaCarga: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')
  };
}

/**
 * Prueba calcularMetricas() con datos sintéticos.
 * Ejecutar en Apps Script editor para verificar la lógica de cálculo.
 */
function testCalcularMetricas() {
  var hoy = new Date();
  var datosTest = [
    ['Fecha', 'Nombre', 'Categoría', 'Subcategoría', 'Productos', 'Cursos', 'Palabra clave', 'Urgencia', 'Acción'],
    [hoy, 'Ana', 'Producto', 'dolor rodilla', 'Mincartil', '', 'DOLOR', 'Media', 'Enviar info kit'],
    [hoy, 'Roberto', 'Consulta', 'cansancio', '', '', 'ENERGIA', 'Alta', 'Llamar mañana'],
    [hoy, 'Carmen', 'Producto', 'digestión', 'Inulac', '', 'DIGESTION', 'Baja', 'Enviar precios'],
    [hoy, 'Luis', 'Producto', 'dolor espalda', 'Harpagofito', '', 'DOLOR', 'Alta', 'Agendar consulta']
  ];

  var m = calcularMetricas(datosTest);

  if (m.totalSemana !== 4) {
    Logger.log('FALLÓ: totalSemana esperado 4, obtenido ' + m.totalSemana); return;
  }
  if (m.urgenciasAltaCount !== 2) {
    Logger.log('FALLÓ: urgenciasAltaCount esperado 2, obtenido ' + m.urgenciasAltaCount); return;
  }
  if (m.topKeyword !== 'DOLOR') {
    Logger.log('FALLÓ: topKeyword esperado DOLOR, obtenido ' + m.topKeyword); return;
  }
  if (m.topCategoria !== 'Producto') {
    Logger.log('FALLÓ: topCategoria esperado Producto, obtenido ' + m.topCategoria); return;
  }
  if (m.urgenciasAlta.length !== 2) {
    Logger.log('FALLÓ: urgenciasAlta.length esperado 2, obtenido ' + m.urgenciasAlta.length); return;
  }
  if (m.categorias[0].pct !== 100) {
    Logger.log('FALLÓ: pct de top categoría esperado 100, obtenido ' + m.categorias[0].pct); return;
  }

  Logger.log('testCalcularMetricas: OK — todas las verificaciones pasaron');
}

/**
 * Genera el HTML completo del dashboard a partir de las métricas.
 * @param {Object} metricas - Resultado de calcularMetricas()
 * @returns {string} HTML completo
 */
function generarHTML(metricas) {
  var urgColor = metricas.urgenciasAltaCount > 0 ? '#ef5350' : '#66bb6a';

  var urgenciasFilas = '';
  if (metricas.urgenciasAlta.length === 0) {
    urgenciasFilas = '<tr><td colspan="3" style="text-align:center;color:#555;padding:20px">Sin urgencias Alta esta semana ✓</td></tr>';
  } else {
    metricas.urgenciasAlta.forEach(function(u) {
      urgenciasFilas +=
        '<tr>' +
        '<td style="color:#aaa;font-size:13px;white-space:nowrap">' + u.fecha + '</td>' +
        '<td style="font-weight:600;color:#fff">' + u.nombre + '</td>' +
        '<td style="color:#b0bec5;font-size:13px">' + u.accion + '</td>' +
        '</tr>';
    });
  }

  var catBarras = '';
  if (metricas.categorias.length === 0) {
    catBarras = '<p style="color:#555;font-size:13px;padding:8px 0">Sin datos esta semana</p>';
  } else {
    metricas.categorias.forEach(function(c) {
      catBarras +=
        '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:5px">' +
        '<span style="color:#e0e0e0;font-size:14px">' + c.nombre + '</span>' +
        '<span style="color:#4fc3f7;font-weight:700;font-size:14px">' + c.count + '</span>' +
        '</div>' +
        '<div style="background:#2a2a4e;border-radius:4px;height:8px;overflow:hidden">' +
        '<div style="background:linear-gradient(90deg,#4fc3f7,#0288d1);width:' + c.pct + '%;height:8px;border-radius:4px;transition:width 0.3s"></div>' +
        '</div></div>';
    });
  }

  var kwBarras = '';
  if (metricas.keywords.length === 0) {
    kwBarras = '<p style="color:#555;font-size:13px;padding:8px 0">Sin datos esta semana</p>';
  } else {
    metricas.keywords.forEach(function(k) {
      kwBarras +=
        '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:5px">' +
        '<span style="color:#e0e0e0;font-size:14px">' + k.nombre + '</span>' +
        '<span style="color:#66bb6a;font-weight:700;font-size:14px">' + k.count + '</span>' +
        '</div>' +
        '<div style="background:#2a2a4e;border-radius:4px;height:8px;overflow:hidden">' +
        '<div style="background:linear-gradient(90deg,#66bb6a,#388e3c);width:' + k.pct + '%;height:8px;border-radius:4px;transition:width 0.3s"></div>' +
        '</div></div>';
    });
  }

  var css =
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{background:#0d0d0d;color:#e0e0e0;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;padding:24px;max-width:1100px;margin:0 auto}' +
    '.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:12px;padding-bottom:20px;border-bottom:1px solid #1e1e2e}' +
    'h1{font-size:clamp(16px,2.5vw,24px);font-weight:800;color:#fff;letter-spacing:-0.5px}' +
    '.ts{color:#444;font-size:12px}' +
    '.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:24px}' +
    '.kpi{background:#111827;border:1px solid #1f2937;border-radius:14px;padding:24px 20px}' +
    '.kpi-label{font-size:11px;color:#4b5563;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;font-weight:600}' +
    '.kpi-value{font-weight:800;line-height:1;margin-bottom:6px}' +
    '.kpi-sub{font-size:12px;color:#6b7280}' +
    '.section{background:#111827;border:1px solid #1f2937;border-radius:14px;padding:24px;margin-bottom:20px}' +
    '.section-title{font-size:11px;font-weight:700;color:#4b5563;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px}' +
    '.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}' +
    '@media(max-width:640px){.grid2{grid-template-columns:1fr}}' +
    'table{width:100%;border-collapse:collapse}' +
    'th{font-size:11px;color:#4b5563;text-transform:uppercase;letter-spacing:1px;font-weight:600;padding:0 12px 12px 12px;text-align:left;border-bottom:1px solid #1f2937}' +
    'td{padding:12px;border-bottom:1px solid #1a2030;vertical-align:top}' +
    'tr:last-child td{border-bottom:none}' +
    'tr:hover td{background:#131c2e}';

  return '<!DOCTYPE html><html lang="es"><head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Wellbive — Monitor WhatsApp</title>' +
    '<style>' + css + '</style>' +
    '</head><body>' +

    '<div class="header">' +
    '<h1>WELLBIVE <span style="color:#4fc3f7">·</span> Monitor WhatsApp</h1>' +
    '<span class="ts">Actualizado: ' + metricas.fechaCarga + '</span>' +
    '</div>' +

    '<div class="kpis">' +
    '<div class="kpi">' +
    '<div class="kpi-label">Esta semana</div>' +
    '<div class="kpi-value" style="font-size:56px;color:#4fc3f7">' + metricas.totalSemana + '</div>' +
    '<div class="kpi-sub">conversaciones</div>' +
    '</div>' +
    '<div class="kpi">' +
    '<div class="kpi-label">Urgencias Alta</div>' +
    '<div class="kpi-value" style="font-size:56px;color:' + urgColor + '">' + metricas.urgenciasAltaCount + '</div>' +
    '<div class="kpi-sub">requieren atención</div>' +
    '</div>' +
    '<div class="kpi">' +
    '<div class="kpi-label">Tema #1</div>' +
    '<div class="kpi-value" style="font-size:26px;color:#66bb6a;padding-top:10px">' + metricas.topKeyword + '</div>' +
    '<div class="kpi-sub" style="margin-top:10px">palabra clave</div>' +
    '</div>' +
    '<div class="kpi">' +
    '<div class="kpi-label">Categoría #1</div>' +
    '<div class="kpi-value" style="font-size:26px;color:#ffa726;padding-top:10px">' + metricas.topCategoria + '</div>' +
    '<div class="kpi-sub" style="margin-top:10px">más frecuente</div>' +
    '</div>' +
    '</div>' +

    '<div class="section">' +
    '<div class="section-title">⚠ Urgencias Alta</div>' +
    '<table><thead><tr>' +
    '<th>Fecha</th><th>Nombre</th><th>Acción siguiente</th>' +
    '</tr></thead><tbody>' + urgenciasFilas + '</tbody></table>' +
    '</div>' +

    '<div class="grid2">' +
    '<div class="section"><div class="section-title">Categorías esta semana</div>' + catBarras + '</div>' +
    '<div class="section"><div class="section-title">Palabras clave</div>' + kwBarras + '</div>' +
    '</div>' +

    '</body></html>';
}

/**
 * Entry point de la Web App. Google Apps Script llama esta función al abrir la URL pública.
 */
function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetDatos = ss.getSheetByName('Datos');

  var metricas;
  if (!sheetDatos || sheetDatos.getLastRow() <= 1) {
    metricas = {
      totalSemana: 0,
      urgenciasAltaCount: 0,
      topKeyword: 'N/A',
      topCategoria: 'N/A',
      urgenciasAlta: [],
      categorias: [],
      keywords: [],
      fechaCarga: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')
    };
  } else {
    var datos = sheetDatos.getDataRange().getValues();
    metricas = calcularMetricas(datos);
  }

  return HtmlService
    .createHtmlOutput(generarHTML(metricas))
    .setTitle('Wellbive — Monitor WhatsApp')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Prueba de integración completa — verifica que el HTML generado es correcto.
 * Ejecutar desde el editor de Apps Script.
 */
function testWebApp() {
  var output = doGet();
  var html = output.getContent();

  if (html.indexOf('WELLBIVE') === -1) {
    Logger.log('FALLÓ: título no encontrado en el HTML'); return;
  }
  if (html.indexOf('Monitor WhatsApp') === -1) {
    Logger.log('FALLÓ: subtítulo no encontrado'); return;
  }
  if (html.indexOf('conversaciones') === -1) {
    Logger.log('FALLÓ: KPI de conversaciones no encontrado'); return;
  }
  if (html.indexOf('Urgencias Alta') === -1) {
    Logger.log('FALLÓ: sección urgencias no encontrada'); return;
  }
  if (html.indexOf('Actualizado:') === -1) {
    Logger.log('FALLÓ: timestamp no encontrado'); return;
  }

  Logger.log('testWebApp: OK — HTML válido (' + html.length + ' chars)');
  Logger.log('Puedes abrir la Web App desde: Implementar > Administrar implementaciones');
}
