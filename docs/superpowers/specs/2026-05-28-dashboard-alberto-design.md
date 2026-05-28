# Diseño: Sistema de análisis para Alberto

**Fecha:** 2026-05-28
**Estado:** Aprobado para implementación
**Depende de:** `2026-05-28-clasificador-whatsapp-ia-design.md` (la pestaña Datos ya existe)

---

## Problema

Los datos clasificados en la pestaña `Datos` del Google Sheet no tienen un formato de análisis. Alberto (nivel básico en Sheets) necesita ver tendencias diarias y semanales sin construir fórmulas ni tablas dinámicas él mismo.

---

## Solución en tres partes

### A — Pestaña `Dashboard`

Nueva pestaña en el mismo Google Sheet con fórmulas preconfiguradas que se actualizan automáticamente cada vez que se agrega una fila en `Datos`. Alberto solo abre el Sheet y lee los números.

**Bloques del Dashboard:**

| Bloque | Descripción | Fórmula base |
|---|---|---|
| Resumen de hoy | Total conversaciones, cuántas Alta urgencia | COUNTIFS con fecha = hoy |
| Resumen esta semana | Total + desglose por Categoría | COUNTIFS con fecha >= lunes |
| Top 5 Productos | Los más mencionados últimos 7 días | QUERY sobre Datos |
| Top 5 Palabras clave | Ranking de keywords activadas | QUERY sobre Datos |
| Urgencias Alta pendientes | Nombre + Acción siguiente de las filas con Urgencia=Alta | QUERY filtrando Urgencia |

**Layout (columnas A-B, filas organizadas por sección):**

```
A1: DASHBOARD — Clasificador WhatsApp Wellbive
A3: HOY (fecha dinámica)
A4: Total conversaciones hoy    B4: =COUNTIFS(...)
A5: Urgencias Alta hoy          B5: =COUNTIFS(...)
A7: ESTA SEMANA
A8: Total conversaciones         B8: =COUNTIFS(...)
A9: Consultas                    B9: =COUNTIFS(...)
A10: Productos                   B10: =COUNTIFS(...)
A11: Cursos                      B11: =COUNTIFS(...)
A12: Seguimientos                B12: =COUNTIFS(...)
A14: TOP 5 PRODUCTOS (últimos 7 días)
[tabla QUERY]
A21: TOP 5 PALABRAS CLAVE (últimos 7 días)
[tabla QUERY]
A28: URGENCIAS ALTA PENDIENTES
[tabla QUERY: nombre + acción siguiente]
```

**Implementación:** Apps Script `configurarDashboard()` que crea la pestaña y escribe todas las fórmulas. Se agrega al menú Wellbive como "📊 Crear Dashboard (una vez)".

---

### B — Email automático semanal

**Función:** `enviarReporteSemanal()` en Apps Script

**Contenido del email:**
- Asunto: `Reporte WhatsApp Wellbive — semana del [fecha]`
- Cuerpo HTML con los mismos 5 bloques del Dashboard
- Tabla de Urgencias Alta con nombre y acción sugerida
- Enviado a: email configurable en PropertiesService (`ALBERTO_EMAIL`)

**Trigger:** Time-based trigger, cada lunes a las 8:00am (configurado via `configurarTrigger()`).

**Botón manual:** Item adicional en el menú Wellbive: "📧 Enviar reporte ahora" para que el Dr. Miguel pueda enviarlo en cualquier momento.

**Seguridad:** El email de Alberto se guarda en PropertiesService (`ALBERTO_EMAIL`), no en el código.

---

### C — Looker Studio (guía de configuración)

No requiere código. Se entrega como instrucciones en `herramientas/clasificador-whatsapp/LOOKER-STUDIO.md`:

1. Abrir Looker Studio y conectar el Google Sheet como fuente de datos
2. Seleccionar la pestaña `Datos`
3. Crear 3 visualizaciones básicas:
   - Gráfica de barras: Categoría (eje X) vs Conteo (eje Y)
   - Pie chart: Palabra clave
   - Tabla: Urgencia Alta — Nombre + Acción siguiente + Fecha
4. Configurar filtro de fecha para ver últimos 7 días / 30 días

---

## Archivos a crear/modificar

```
herramientas/clasificador-whatsapp/
  Dashboard.gs        ← Nueva: configurarDashboard(), enviarReporteSemanal(), configurarTrigger()
  Code.gs             ← Modificar: agregar 3 items al menú Wellbive
  LOOKER-STUDIO.md    ← Nueva: guía paso a paso para Looker Studio
```

---

## Criterios de éxito

- Alberto abre el Sheet y ve el Dashboard actualizado sin hacer nada
- El email llega cada lunes a las 8am con datos de la semana anterior
- Las fórmulas no se rompen cuando hay 0 datos (evitar errores #N/A)
- El Dashboard funciona correctamente desde la primera fila de datos
