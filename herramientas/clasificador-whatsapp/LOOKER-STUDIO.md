# Looker Studio — Guía de configuración

Dashboard visual profesional conectado al Google Sheet del clasificador.
No requiere código. Tiempo estimado: 15-20 minutos.

## 1. Crear el reporte

1. Abrir [Looker Studio](https://lookerstudio.google.com)
2. Clic en **"+ Crear" > "Informe"**
3. En la pantalla de fuentes de datos, seleccionar **"Google Sheets"**
4. Autorizar permisos si se pide
5. Buscar y seleccionar el archivo **"Clasificador WhatsApp Wellbive"**
6. Seleccionar la hoja **"Datos"**
7. Activar la opción **"Usar primera fila como encabezado"**
8. Clic en **"Agregar"** y luego **"Agregar al informe"**

## 2. Configurar el campo Fecha

Para que los filtros de fecha funcionen correctamente:

1. En el panel derecho, buscar el campo **"Fecha"**
2. Si aparece como texto, hacer clic en él > cambiar tipo a **"Fecha y hora"**
3. Formato: `DD/MM/YYYY HH:MM:SS`

## 3. Gráfica 1 — Conversaciones por Categoría (barras)

1. Clic en **"Agregar un gráfico" > "Gráfico de barras"**
2. Dimensión: `Categoría`
3. Métrica: `Recuento de registros`
4. Ordenar por: Métrica, descendente
5. Título: "Conversaciones por Categoría"

## 4. Gráfica 2 — Palabras clave (pie chart)

1. Clic en **"Agregar un gráfico" > "Gráfico circular"**
2. Dimensión: `Palabra clave`
3. Métrica: `Recuento de registros`
4. Filtrar: excluir `NINGUNA` (clic en "Agregar filtro" > Palabra clave ≠ NINGUNA)
5. Título: "Temas más frecuentes"

## 5. Tabla — Urgencias Alta

1. Clic en **"Agregar un gráfico" > "Tabla"**
2. Dimensiones: `Fecha`, `Nombre`, `Categoría`, `Acción siguiente`
3. Filtro: `Urgencia = Alta`
4. Ordenar por: Fecha, descendente
5. Título: "Urgencias Alta"

## 6. Agregar filtro de fecha global

1. Clic en **"Agregar un control" > "Intervalo de fechas"**
2. Campo de fecha: `Fecha`
3. Valor predeterminado: "Últimos 7 días"
4. Esto filtrará las 3 gráficas al mismo tiempo

## 7. Compartir con Alberto

1. Clic en **"Compartir"** (arriba a la derecha)
2. Agregar el email de Alberto
3. Rol: **Visor** (solo lectura)
4. Alberto puede ver el dashboard desde su navegador sin necesitar cuenta de Looker Studio

## Notas

- El dashboard se actualiza automáticamente cada vez que se abren (no en tiempo real, sino al cargar).
- Para forzar actualización: clic en el ícono de actualización en la fuente de datos.
- Si los datos no aparecen, verificar que la pestaña "Datos" del Sheet tenga al menos una fila de datos además del encabezado.
