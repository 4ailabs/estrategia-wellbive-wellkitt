# Proyecto: Páginas web por semana · Wellkitt

**Estado:** Documentado — pendiente de desarrollo
**Repositorio destino:** Web-Centrobioenergetica- (React + Vite + Prisma)
**Fecha de idea:** 2026-06-18

---

## Objetivo

Crear una sección `/wellkitt` en el sitio web del Instituto donde cada semana temática tenga su propia página pública. Sirve como contenido educativo, landing de captación y referencia para quienes reciben el folleto o el mensaje de WhatsApp.

---

## Estructura de rutas propuesta

```
/wellkitt                        → Índice de todas las semanas
/wellkitt/estres                 → Semana 4 · Estrés
/wellkitt/calma                  → Semana 1 · Calma
/wellkitt/digestion              → Semana 3 · Digestión
/wellkitt/energia                → Semana 5 · Energía
... (una por semana del calendario)
```

---

## Contenido de cada página de semana

### Sección 1 — Hero
- Título del tema (ej. "Cuando el estrés se queda en el cuerpo")
- Subtítulo breve
- Estado de la semana: ACTIVA · PRÓXIMA · PASADA
- Fecha de Jueves Wellkitt correspondiente

### Sección 2 — Patrones
- Los 4 (o 5) patrones del tema en tarjetas interactivas
- Cada tarjeta: nombre, descripción, síntomas para identificarse
- Visual: los mismos colores del sistema de diseño del folleto

### Sección 3 — Productos
- Cada producto con foto, descripción y para qué patrón es
- Badge P·1 / P·2 etc. como en el folleto
- Sin precios en esta versión inicial

### Sección 4 — CTA
- Botón principal: "Reserva tu lugar · Jueves Wellkitt" → abre WhatsApp con mensaje pre-escrito
- Botón secundario: "Descarga el folleto" → PDF de la semana

---

## Decisiones pendientes antes de desarrollar

1. **¿Qué hace el visitante?** Definir el objetivo principal de la página:
   - Solo informarse (contenido educativo)
   - Reservar Jueves Wellkitt
   - Comprar productos
   - Las tres en ese orden (recomendado: funnel de arriba a abajo)

2. **¿Requiere login?** ¿O es página pública sin autenticación?

3. **¿El PDF se genera dinámicamente** desde los datos de la página, o se sube como archivo estático por semana?

4. **¿La información de productos viene de la base de datos de Prisma** o de archivos estáticos por semana?

---

## Relación con activos existentes

| Activo | Ubicación en este repo | Uso en la web |
|---|---|---|
| Folleto PDF | `semanas/semana-XX/material-jueves/folleto-*.pdf` | Descarga directa |
| Imágenes de productos | `base/productos/imagenes/` | `<img>` en sección productos |
| Logo Wellkitt | `marca/wellkitt.png` | Header de cada página |
| Contenido de patrones | `semanas/semana-XX/material-jueves/folleto-*.html` | Base para componentes React |

---

## Stack técnico (hereda del repo web)

- React + Vite
- Prisma (base de datos si se necesita guardar reservas)
- Tailwind CSS (verificar si está configurado) o CSS modules
- Deploy en Vercel

---

## Próximos pasos

- [ ] Definir las preguntas pendientes de arriba
- [ ] Crear componente `SemanaPage` en Web-Centrobioenergetica-
- [ ] Crear componente `PatronCard` reutilizable
- [ ] Crear componente `ProductoCard` reutilizable
- [ ] Poblar con datos de Semana 4 (Estrés) como prototipo
- [ ] Revisar si el CTA de WhatsApp ya existe en algún componente del sitio
