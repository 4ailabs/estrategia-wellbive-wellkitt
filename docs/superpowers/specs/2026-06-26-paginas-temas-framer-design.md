# Spec: Paginas de temas Wellbive en Framer
## Fecha: 26 junio 2026
## Estado: Diseno aprobado — pendiente de implementacion

---

## Objetivo

Crear una seccion de paginas publicas dentro del sitio de Framer (`institutocentrobioenergetica.com`) donde cada tema de salud (energia, estres, digestion, etc.) tenga su propia pagina permanente con contenido expandido, test de tipos, productos, video y CTA.

### Para que sirve

- **Desde YouTube:** Link en la descripcion del video que lleva a la pagina del tema con todo el contenido ampliado
- **Desde el Jueves en Wellkitt:** QR que se muestra en la clinica durante la sesion
- **Desde WhatsApp:** Link que se envia como respuesta cuando alguien escribe la palabra clave (ENERGIA, ESTRES, etc.)
- **Desde la revista Wellbive Inside:** Link o QR dentro de la revista digital

### Que NO es

- No es una tienda (la tienda es Wellkitt en Vercel, ya embebida)
- No es un blog (no tiene fechas, no caduca, no son "semanas")
- No requiere login

---

## Arquitectura: CMS de Framer con Collections

Se usan 3 Collections relacionales en el CMS de Framer. Los datos se pueblan automaticamente desde el repositorio usando Framer CLI + Claude Code.

### Coleccion 1: Temas

Cada item es un tema de salud (energia, estres, digestion, etc.). Genera una pagina automaticamente en `/[slug]`.

| Campo | Tipo en Framer | Ejemplo | Notas |
|---|---|---|---|
| Titulo | Text | Energia | Nombre visible en la pagina |
| Slug | Slug | energia | Genera la ruta: `/energia` |
| Subtitulo | Text | Cuando el cansancio no se va con dormir | Frase debajo del titulo |
| Intro | Rich Text | El cansancio no es un problema de actitud... | 2-3 parrafos de contexto |
| Video YouTube | Link | https://youtube.com/watch?v=ABC123 | Se embebe como iframe |
| Palabra clave | Text | ENERGIA | Para el boton de WhatsApp |
| Numero WhatsApp | Text | 5512345678 | Numero al que se envia el mensaje |
| Folleto PDF | File | folleto-energia.pdf | Descarga directa |
| Imagen portada | Image | portada-energia.jpg | Hero de la pagina |
| Color acento | Color | #2E7D32 | Color del tema para la pagina |
| Base transversal titulo | Text | Pirofosfato de Tiamina (Carzilasa) | Si aplica, se muestra como franja |
| Base transversal texto | Rich Text | Forma activa de vitamina B1... | Descripcion de la base transversal |
| Orden | Number | 5 | Para ordenar en el indice |
| Activo | Boolean | true | Para ocultar temas no publicados |

### Coleccion 2: Tipos

Cada item es un tipo/perfil dentro de un tema (ej: "Fatiga de esfuerzo" dentro de "Energia"). Relacionado con Temas.

| Campo | Tipo en Framer | Ejemplo | Notas |
|---|---|---|---|
| Tema | Reference (Temas) | Energia | Relacion con la coleccion Temas |
| Nombre | Text | Fatiga de esfuerzo | Nombre del tipo |
| Numero | Number | 1 | Orden dentro del tema |
| Descripcion | Text | Te cansas con cualquier esfuerzo fisico... | Descripcion corta |
| Mecanismo | Rich Text | La cadena de electrones no puede acelerar... | Que pasa adentro del cuerpo |
| Senales | Rich Text | - Subir escaleras te agota\n- Antes podias... | Lista de sintomas para el test |
| Senal 1 | Text | Te cansas con cualquier esfuerzo fisico | Para el test interactivo |
| Senal 2 | Text | Antes podias y ahora no | Para el test interactivo |
| Senal 3 | Text | Un dia activo te cuesta 2-3 dias | Para el test interactivo |
| Senal 4 | Text | Recuperacion lenta | Para el test interactivo |
| Producto nombre | Text | Coenzima Q10 | Producto recomendado |
| Producto cientifico | Text | Ubiquinona-10 | Nombre cientifico |
| Producto mecanismo | Rich Text | Transportador de electrones entre complejos I/II y III... | Como actua |
| Producto imagen | Image | q10.jpg | Foto del producto |
| Producto presentacion | Text | Capsulas 100mg | Formato del producto |

### Coleccion 3: Productos

Catalogo general de productos Wellkitt. Se puede referenciar desde Tipos pero tambien sirve como catalogo independiente.

| Campo | Tipo en Framer | Ejemplo | Notas |
|---|---|---|---|
| Nombre | Text | Coenzima Q10 | Nombre comercial |
| Nombre cientifico | Text | Ubiquinona-10 | Nombre cientifico/tecnico |
| Imagen | Image | q10.jpg | Foto del producto |
| Descripcion corta | Text | Pieza clave de la cadena de energia celular | Una linea |
| Mecanismo | Rich Text | Transportador de electrones entre... | Descripcion completa |
| Presentacion | Text | Capsulas 100mg + Vitamina E | Formato fisico |
| Horario | Text | Con alimento | Cuando tomarlo |
| Categoria | Text | Energia | Tema principal al que pertenece |
| Link tienda | Link | https://wellkitt.com/q10 | Link a la tienda en Vercel |
| Activo | Boolean | true | Para ocultar productos |

---

## Diseno de la pagina de tema (plantilla)

Una sola plantilla que se reutiliza para todos los temas. Los datos vienen de las Collections.

### Seccion 1: Hero

```
┌──────────────────────────────────────────────────────┐
│  [Logo Wellbive]                                     │
│                                                      │
│  ENERGIA                         ← Titulo del tema   │
│  Cuando el cansancio no se va    ← Subtitulo          │
│  con dormir                                          │
│                                                      │
│  ┌────────────────────────────────────────┐          │
│  │                                        │          │
│  │         VIDEO YOUTUBE EMBEBIDO         │          │
│  │              (iframe)                  │          │
│  │                                        │          │
│  └────────────────────────────────────────┘          │
│                                                      │
│  [Intro: 2-3 parrafos del tema]                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Fondo: color acento del tema en gradiente suave o imagen de portada
- Video embebido responsivo (16:9)
- Intro en texto legible, justificado

### Seccion 2: Base transversal (si aplica)

```
┌──────────────────────────────────────────────────────┐
│  APLICA A TODOS LOS TIPOS                            │
│                                                      │
│  Pirofosfato de Tiamina (Carzilasa)                  │
│  Forma activa de vitamina B1. Sin Carzilasa,         │
│  no importa cuanto Q10, carnitina o hierro           │
│  tomes: la puerta esta cerrada.                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Solo se muestra si el campo "Base transversal titulo" tiene contenido
- Fondo diferenciado (dorado suave como en el folleto)

### Seccion 3: Test interactivo — "Cual es tu tipo?"

```
┌──────────────────────────────────────────────────────┐
│  CUAL ES TU TIPO DE CANSANCIO?                       │
│                                                      │
│  Marca las que te describan:                         │
│                                                      │
│  ┌─ TIPO 1: Fatiga de esfuerzo ─────────────────┐   │
│  │  [ ] Te cansas con cualquier esfuerzo fisico  │   │
│  │  [ ] Antes podias y ahora no                  │   │
│  │  [ ] Un dia activo te cuesta 2-3 dias         │   │
│  │  [ ] Recuperacion lenta                       │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─ TIPO 2: Fatiga metabolica ──────────────────┐   │
│  │  [ ] Cansancio + dificultad para bajar peso   │   │
│  │  [ ] Pesadez muscular                         │   │
│  │  [ ] Combustible guardado que no puedes usar  │   │
│  │  [ ] Recuperacion lenta post-esfuerzo         │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ... (tipos 3, 4, 5)                                 │
│                                                      │
│  ┌──────────────────────────────────────────┐       │
│  │  TU TIPO DOMINANTE: Fatiga silenciosa    │       │
│  │  Producto recomendado: Espirulina        │       │
│  │  [Escribe ENERGIA por WhatsApp]          │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Funcionamiento del test:**
- Cada tipo muestra sus 4 senales como checkboxes
- El tipo con mas checkboxes marcados se resalta como "tu tipo dominante"
- Al resaltarse, muestra el producto recomendado y el boton de WhatsApp
- Si hay empate, se muestran ambos tipos
- El test es visual e inmediato — no requiere boton de "enviar"
- Implementacion: Code Component en Framer (React) que lee los datos de la coleccion Tipos

### Seccion 4: Los tipos en detalle

```
┌──────────────────────────────────────────────────────┐
│  LOS 5 TIPOS Y SUS HERRAMIENTAS                     │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  TIPO 1: FATIGA DE ESFUERZO                  │   │
│  │                                              │   │
│  │  Que pasa adentro:                           │   │
│  │  La cadena de electrones no puede            │   │
│  │  acelerar cuando necesitas mas energia...    │   │
│  │                                              │   │
│  │  ┌──────────┐  Coenzima Q10                  │   │
│  │  │  [IMG]   │  Ubiquinona-10                 │   │
│  │  │  Q10     │  Capsulas 100mg                │   │
│  │  └──────────┘                                │   │
│  │  Transportador de electrones entre           │   │
│  │  complejos I/II y III de la cadena           │   │
│  │  mitocondrial...                             │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ... (tipos 2, 3, 4, 5 con la misma estructura)      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Cada tipo es una tarjeta con: mecanismo de la fatiga, imagen del producto, nombre cientifico, mecanismo de accion
- Las tarjetas se generan automaticamente desde la coleccion Tipos
- Layout responsivo: 1 columna en movil, 2 en tablet, grid en desktop

### Seccion 5: Todos los productos del tema

```
┌──────────────────────────────────────────────────────┐
│  PRODUCTOS PARA ESTE TEMA                            │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │   │
│  │  Q10   │  │Carnilis│  │Espiru. │  │Fostp.  │   │
│  │ Caps.  │  │ Caps.  │  │Gotero  │  │Ampolla │   │
│  │ [Ver]  │  │ [Ver]  │  │ [Ver]  │  │ [Ver]  │   │
│  └────────┘  └────────┘  └────────┘  └────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Grid de productos con imagen, nombre y presentacion
- Boton "Ver" lleva a la tienda Wellkitt (Vercel) o abre un modal con mas info
- Las imagenes vienen de la coleccion Productos

### Seccion 6: Descarga y CTA

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  DESCARGA LA GUIA COMPLETA                           │
│  [Descargar PDF]  ← Folleto de la semana             │
│                                                      │
│  ─────────────────────────────────────────            │
│                                                      │
│  QUIERES ORIENTACION PERSONALIZADA?                  │
│  Escribe ENERGIA por WhatsApp y te decimos           │
│  cual es tu tipo y el siguiente paso concreto.       │
│                                                      │
│  [Escribir por WhatsApp]  ← Abre wa.me con mensaje   │
│                                                      │
│  ─────────────────────────────────────────            │
│                                                      │
│  SUEROTERAPIA PREMIUM                                │
│  Recarga tu energia desde adentro.                   │
│  [Agenda tu cita]                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Boton de descarga del PDF (campo Folleto PDF de la coleccion)
- Boton de WhatsApp que abre `wa.me/[numero]?text=ENERGIA` (palabra clave del tema)
- Anuncio de sueroterapia (se puede activar/desactivar por tema)

### Seccion 7: Footer

- Logo Wellbive + Instituto Centrobioenergetica
- Direccion: Acapulco 36, piso 8, Roma, CDMX
- Links a YouTube, Facebook, WhatsApp
- "Material educativo. No sustituye atencion medica."

---

## Pagina indice: `/temas` o `/wellbive`

Una pagina que lista todos los temas activos con tarjetas.

```
┌──────────────────────────────────────────────────────┐
│  WELLBIVE                                            │
│  Ciencia clinica para tu cuerpo                      │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ [IMG]    │  │ [IMG]    │  │ [IMG]    │          │
│  │ Energia  │  │ Estres   │  │Digestion │          │
│  │ 5 tipos  │  │ 4 patron │  │ 4 capas  │          │
│  │ [Ver]    │  │ [Ver]    │  │ [Ver]    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Calma    │  │ Dolor    │  │ Hormonas │          │
│  │          │  │          │  │          │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Lista de coleccion de Framer (CMS List)
- Solo muestra temas con `Activo = true`
- Ordenados por el campo `Orden`
- Cada tarjeta lleva a `/[slug]`

---

## Flujo de automatizacion: Repo → Framer CMS

### Paso 1: Exportar datos del repo a JSON

Script que lee los archivos del repositorio (`estrategia-wellbive-wellkitt`) y genera un JSON estructurado con todos los datos de cada tema, sus tipos y productos.

**Entrada:** Archivos del repo
- `semanas/semana-XX/teleprompter/*.md` → Intro, tipos, mecanismos
- `semanas/semana-XX/material-jueves/folleto-*.html` → Productos, senales
- `estrategia/sistemas/sistema-perfiles-wellbive.md` → Perfiles y productos por tema
- `base/productos/catalogo/LISTA_COMPLETA_PRODUCTOS_WELLKITT.md` → Datos de productos
- `estrategia/fuente-de-verdad/estrategia-temas-calendario-wellbive.md` → Temas, kits, palabras clave

**Salida:** `datos-framer/temas.json`, `datos-framer/tipos.json`, `datos-framer/productos.json`

### Paso 2: Subir a Framer via CLI

Usando Framer CLI conectado a Claude Code:
1. Conectar al proyecto: `framer` (en terminal)
2. Claude Code lee los JSON generados
3. Crea o actualiza las Collections con los datos
4. Sube imagenes de productos
5. Todo en una branch separada para revision
6. Revisar en Framer → "Apply to main"

### Paso 3: Mantenimiento semanal

Cada vez que se agrega una semana nueva al repo:
1. Se actualiza el JSON ejecutando el script
2. Se sube a Framer con el mismo flujo
3. La nueva pagina aparece automaticamente porque la plantilla ya existe

---

## Code Component: Test interactivo

Un componente React embebido en Framer que implementa el test de tipos.

**Props (conectadas al CMS):**
- `tipos`: array de tipos con sus senales (viene de la coleccion Tipos filtrada por tema)
- `palabraClave`: string (ENERGIA, ESTRES, etc.)
- `numeroWhatsApp`: string

**Comportamiento:**
- Renderiza checkboxes por cada senal de cada tipo
- Cuenta en tiempo real cuantos checkboxes estan marcados por tipo
- Resalta el tipo con mas marcas
- Muestra el producto recomendado del tipo ganador
- Boton de WhatsApp con mensaje pre-escrito: "Hola, me identifique con [tipo]. Quiero orientacion."

**Responsivo:**
- Movil: tipos apilados verticalmente, checkboxes a ancho completo
- Desktop: tipos en grid de 2 columnas

---

## Diseno visual

### Principios
- Mismo sistema tipografico que los folletos: Poppins (titulos), Inter (cuerpo), DM Sans (labels)
- Color acento por tema (viene del campo Color acento de la coleccion)
- Fondo blanco/crema, texto oscuro — legible, limpio, profesional
- Sin bordes laterales de color — consistente con la limpieza del folleto
- Imagenes de producto grandes y claras
- Espaciado generoso — no amontonar

### Responsivo
- Movil first: todo funciona en una columna
- Tablet: grid de 2 columnas para tipos y productos
- Desktop: max-width 1200px centrado, secciones con breathing room

### Consistencia con marca
- Logo Wellbive en el header
- Colores: verde (#2E7D32) como primario, dorado para Carzilasa/sueroterapia
- Sin elementos que compitan con la marca del Instituto

---

## Datos iniciales: temas disponibles para poblar

| Slug | Titulo | Tipos | Productos | Estado contenido |
|---|---|---|---|---|
| energia | Energia | 5 tipos de cansancio | Q10, Carnilis, Espirulina, Fostprint MAX, Maca, Carzilasa | Completo (semana 5) |
| estres | Estres | 4 patrones de tension | Nervit, Valeriana, Magnesio, Zapote Blanco, Glicam, Triptofano | Completo (semana 4) |
| digestion | Digestion | 4 capas del tubo digestivo | Colix, Inulac, Melissa, Hepacryl | Completo (semana 3) |
| calma | Calma y sueno | 5 perfiles de sueno | Valeriana, Nervit, Zapote Blanco, Triptofano, Ojo de Gallina | Completo (semana 1) |
| dolor | Dolor | Por definir | Curcuma, Harpagofito, Una de Gato, Mincartil | Parcial (semana 6) |
| hormonas | Hormonas | Por definir | Calciflavon, Fem-vit, Barbasco, Milenrama | Pendiente (semana 8) |
| peso | Peso y metabolismo | Por definir | Fat-less, Te Verde, Carnilis | Pendiente (semana 9) |
| detox | Detox | Por definir | Hepacryl, Diente de Leon, Cola de Caballo | Pendiente (semana 10) |
| defensas | Defensas | Por definir | Diatonato 1, Diatonato 2, Immune Herb, Equinacea | Pendiente (semana 11) |
| mente | Circulacion y mente | Por definir | Q10, Arginina, Resverasor, Fosfoserina | Pendiente (semana 13) |

**Lanzamiento inicial:** Empezar con los 4 temas completos (energia, estres, digestion, calma). Ir agregando los demas a medida que se completa el contenido.

---

## Entregables

1. **3 Collections en Framer** con campos definidos arriba
2. **1 plantilla de pagina de tema** (Layout Page en Framer)
3. **1 pagina indice** `/temas` o ruta que se defina
4. **1 Code Component** para el test interactivo
5. **1 script de exportacion** repo → JSON para las Collections
6. **4 temas poblados** inicialmente (energia, estres, digestion, calma)
7. **Imagenes de productos** subidas a la coleccion Productos

---

## Dependencias

- Acceso al proyecto de Framer via CLI
- Imagenes de productos (actualmente solo hay de los productos de estres — faltan energia, digestion, calma)
- Videos de YouTube publicados para cada tema (para embeber)
- Folletos PDF exportados de cada tema

---

*Spec generado el 26 de junio de 2026.*
*Instituto Centrobioenergetica — Proyecto Wellbive.*
