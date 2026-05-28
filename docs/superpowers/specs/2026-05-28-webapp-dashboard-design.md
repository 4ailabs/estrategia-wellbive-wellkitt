# Diseño: Web App Dashboard — Monitor WhatsApp

**Fecha:** 2026-05-28
**Estado:** Aprobado para implementación

---

## Problema

El Dashboard en Google Sheets requiere abrir Sheets. Alberto necesita una URL pública que pueda abrir desde cualquier dispositivo sin login, con estilo visual profesional oscuro tipo analytics.

---

## Solución

Google Apps Script Web App con función `doGet()` que lee el Sheet y devuelve HTML completo. URL pública desplegada desde el mismo proyecto de Apps Script del clasificador.

---

## Arquitectura

**Nuevo archivo:** `WebApp.gs` en el proyecto Apps Script (y en el repo como respaldo).

`doGet()` lee la pestaña `Datos` del Sheet, calcula métricas en JavaScript, genera y retorna un string HTML con estilos inline. Sin librerías externas.

**Despliegue:** Apps Script → Implementar → Nueva implementación → Web App → Acceso: Cualquier persona.

---

## Layout y secciones

```
HEADER: "WELLBIVE — Monitor WhatsApp"  +  fecha/hora de carga

FILA DE KPIs (4 tarjetas):
  - Conversaciones esta semana
  - Urgencias Alta (rojo)
  - Palabra clave #1
  - Categoría #1

TABLA: Urgencias Alta (fecha, nombre, acción siguiente)

DOS COLUMNAS:
  - Categorías esta semana (barras CSS con conteo)
  - Top palabras clave esta semana (barras CSS con conteo)
```

---

## Estética

- Fondo: `#0d0d0d`
- Tarjetas KPI: `#1a1a2e`, borde `#2a2a4e`
- Número KPI principal: `60px`, bold, color acento
- Acento azul: `#4fc3f7`
- Urgencia Alta: `#ef5350` (rojo)
- Verde positivo: `#66bb6a`
- Texto: `#e0e0e0`
- Fuente: `system-ui, -apple-system, sans-serif`
- Barras CSS: divs con `background: linear-gradient` proporcional al máximo del grupo

---

## Datos calculados

"Esta semana" = lunes de la semana actual hasta hoy (mismo criterio que Dashboard.gs).

Métricas extraídas de la pestaña `Datos`:
- Total filas esta semana
- Count de Urgencia=Alta esta semana
- Palabra clave más frecuente esta semana
- Categoría más frecuente esta semana
- Lista de filas con Urgencia=Alta (todas las columnas relevantes)
- Count por categoría esta semana
- Count por palabra clave esta semana (excluye NINGUNA)

---

## Archivos

```
herramientas/clasificador-whatsapp/
  WebApp.gs    ← NUEVO: doGet(), calcularMetricas(), generarHTML()
```

No se modifica ningún archivo existente. El despliegue es manual en Apps Script.

---

## Criterios de éxito

- URL pública funciona sin login
- Se ve correctamente en celular y desktop
- Carga en menos de 3 segundos
- Muestra "Sin datos esta semana" si no hay filas (no errores)
- Fecha/hora de última carga visible en el header
