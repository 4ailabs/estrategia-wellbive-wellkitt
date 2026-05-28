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
