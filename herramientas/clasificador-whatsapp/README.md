# Clasificador WhatsApp IA

Sistema para clasificar conversaciones de WhatsApp automáticamente con Claude AI.

## Instalación (una sola vez)

### 1. Crear el Google Sheet

1. Abre [Google Sheets](https://sheets.google.com) y crea una hoja nueva.
2. Nómbrala "Clasificador WhatsApp Wellbive".

### 2. Abrir el editor de Apps Script

1. En el menú de Sheets: **Extensiones > Apps Script**
2. Borra el código de ejemplo que aparece (`function myFunction() {}`)

### 3. Copiar los tres archivos de código

En el editor de Apps Script, crea tres archivos con estos nombres y contenido:

| Archivo en Apps Script | Fuente en este repo |
|---|---|
| `Code.gs` (ya existe por defecto) | `Code.gs` de este directorio |
| `Clasificador.gs` (botón +) | `Clasificador.gs` de este directorio |
| `SheetManager.gs` (botón +) | `SheetManager.gs` de este directorio |

Para crear un archivo nuevo en Apps Script: clic en el **+** junto a "Archivos" > "Script".

### 4. Configurar la API key de Claude

1. En Apps Script, ve a **Proyecto (⚙️) > Propiedades del proyecto > Propiedades de script**
2. Haz clic en **Agregar propiedad**
3. Nombre: `CLAUDE_API_KEY`
4. Valor: tu API key de Anthropic (comienza con `sk-ant-...`)
5. Guarda

### 5. Ejecutar la configuración inicial

1. Cierra el editor de Apps Script y **recarga el Google Sheet**
2. Aparecerá el menú **Wellbive** en la barra superior
3. Ve a **Wellbive > Configurar hojas (primera vez)**
4. Autoriza los permisos que pide (acceso a Sheets y a internet)
5. Listo — las pestañas "Clasificar" y "Datos" están listas

## Uso diario (secretaria)

1. Abrir el Google Sheet
2. Ir a la pestaña **Clasificar**
3. Copiar el texto de la conversación de WhatsApp
4. Pegarlo en la celda amarilla (B4)
5. Ir al menú **Wellbive > ⚡ Clasificar conversación**
6. En ~5 segundos aparece un resumen; los datos completos están en **Datos**

## Verificar que funciona (pruebas)

Ejecutar estas funciones directamente en el editor de Apps Script (botón ▶):

1. `testEscribirEnDatos` — prueba la escritura sin llamar a la API
2. `testLlamarClaudeAPI` — prueba la llamada a Claude con un texto de ejemplo
3. `testIntegracionCompleta` — prueba el sistema completo de punta a punta

Revisa los resultados en **Ver > Registros** (Ctrl+Enter).

## Costos estimados

- Modelo: `claude-haiku-4-5` (el más económico)
- ~200 tokens de entrada + ~150 tokens de salida por conversación
- Costo aproximado: $0.0001 USD por conversación (menos de $0.01 por 100 conversaciones)
