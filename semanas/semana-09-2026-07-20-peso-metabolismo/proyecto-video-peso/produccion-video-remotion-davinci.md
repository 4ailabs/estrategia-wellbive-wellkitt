# Producción del video principal — Semana 9 (Peso)

## Guion exacto + Remotion + DaVinci Resolve 21

Video: "Por qué tu cuerpo sigue quemando menos, aunque ya recuperaste el peso"
Formato: 1920×1080, 30 fps, \~12-13 min. Landscape para YouTube.
Método: Dr. grabado en pantalla verde + escenas de motion (Remotion) intercaladas, montado en DaVinci Resolve 21.
Paleta de las escenas: **brasa de ámbar (`#F5BC42`) sobre tierra oscura (`#1E1712`)** — el fuego metabólico dentro del cuerpo. Cero verde en las gráficas.

***

## 1. Cómo se lee este documento

Cada beat del guion está clasificado por **tipo de toma**:

* **\[CÁM]** — el Dr. a cámara (pantalla verde). Sin gráfica, o con lower-third discreto.

* **\[REM-FULL]** — corte a una escena Remotion a pantalla completa (B-roll de dato/diagrama). La voz del Dr. sigue sonando debajo. Es el "corte" clásico.

* **\[REM-OVL]** — elemento de Remotion como *overlay* flotando sobre el Dr. (fondo transparente). El Dr. sigue en cuadro.

* **\[REM-SPLIT]** — pantalla partida: el Dr. a un lado, la gráfica al otro.

Las escenas Remotion viven en `centrobioenergetica-videos`, proyecto `src/projects/peso/`. Cada una es una `<Composition>` que se renderiza a MP4 (o ProRes con alfa para overlays) y se arrastra a DaVinci.

Los **assets de imagen** (fotos/ilustraciones que no se pueden hacer con código) están listados en la §4 con su prompt exacto para Nano Banana / ChatGPT. Los **diagramas** NO son imágenes — se animan con código (es lo que lo separa de "slides que pasan").

***

## 2. Guion exacto como rundown de edición

| #  | Timecode aprox | Guion (fragmento)                                                                                             | Tipo                 | Escena Remotion / asset                        | Motion / nota de edición                                                                                                                        |
| -- | -------------- | ------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | 0:00–0:18      | "Comes menos. Te mueves más. Y el número en la báscula no se mueve igual… como si el cuerpo tuviera memoria." | **\[CÁM + REM-OVL]** | `PesoHookBascula` (overlay) + IMG-01 (báscula) | El Dr. abre a cámara. Overlay: la frase "como si el cuerpo tuviera memoria" entra en ámbar sobre el hombro. Corte breve a IMG-01.               |
| 2  | 0:18–0:32      | "O es llegar a las siete de la noche y ya no poder parar… es otra cosa la que pide comer."                    | **\[REM-FULL]**      | `PesoHookNoche` + IMG-02 (cocina de noche)     | Foto-ilustración editorial de la escena nocturna, con la frase clave quemada. Ancla emocional.                                                  |
| 3  | 0:32–0:42      | "'Te falta disciplina.' … No es así."                                                                         | **\[CÁM + REM-OVL]** | `PesoNoEsDisciplina` (overlay)                 | "Te falta disciplina" aparece y se **tacha** en clay; "No es así" entra en ámbar. Sobre el Dr.                                                  |
| 4  | 0:42–0:52      | "Soy el Dr. Miguel Ojeda… Esto es Wellbive."                                                                  | **\[CÁM]**           | Lower-third `PesoLowerThird` (overlay)         | Nombre + marca discretos, esquina inferior.                                                                                                     |
| 5  | 0:52–1:05      | "Dos cosas… una en tu metabolismo, otra en tu cabeza. Medibles, no falta de voluntad."                        | **\[REM-FULL]**      | `PesoDosFrentes`                               | Dos columnas que entran: **Metabolismo** / **Mente**. Establece la estructura del video.                                                        |
| 6  | 1:05–1:50      | El estudio: bajaron 58 kg, metabolismo −610.                                                                  | **\[REM-FULL]**      | `PesoEstudioSetup`                             | Línea de tiempo animada: inicio → fin de competencia. `CountUp` de 58 kg y −610 kcal.                                                           |
| 7  | 1:50–2:20      | "Seis años después… recuperaron 41 kg. Y su metabolismo seguía 704 por debajo."                               | **\[REM-FULL]**      | **`PesoDatoSeisAnos` ✅ (hecho)**               | El gancho. `CountUp` a −704 en ámbar incandescente. Ya construida.                                                                              |
| 8  | 2:20–2:45      | "El cuerpo desarrolla una memoria… un sistema que aprendió a defenderse."                                     | **\[REM-FULL]**      | `PesoModoAhorro`                               | Diagrama: un medidor/termostato que baja y se **traba** abajo. Concepto "modo ahorro".                                                          |
| 9  | 2:45–3:05      | "'Come menos y muévete más' deja de funcionar… están peleando contra un sistema."                             | **\[CÁM]**           | —                                              | El Dr. sostiene el punto emocional a cámara. Sin gráfica (respiro).                                                                             |
| 10 | 3:05–3:35      | "Segundo: la ansiedad por comer… el cortisol hace que comas más, azúcar y grasa."                             | **\[REM-FULL]**      | `PesoCortisol`                                 | Diagrama: estrés crónico → eje (cortisol) → flecha a "azúcar + grasa". Nodos que pulsan.                                                        |
| 11 | 3:35–4:15      | "Estrés y comida activan el mismo circuito de recompensa… se refuerza, cuesta resistirlo."                    | **\[REM-FULL]**      | `PesoCircuitoRecompensa` ⭐                     | **La escena estrella.** Loop cerebral animado: estrés → comer → alivio → refuerzo. El bucle se **engrosa/acelera** en cada vuelta. 100% código. |
| 12 | 4:15–4:30      | "Comer por ansiedad no es falta de carácter. Es un circuito biológico."                                       | **\[CÁM]**           | —                                              | Cierre del punto, a cámara.                                                                                                                     |
| 13 | 4:30–4:55      | "Galphimia glauca se vende como 'acelera el metabolismo'… pero la evidencia es sobre ansiedad."               | **\[REM-FULL]**      | **`PesoOjoDeGallina` ✅ (hecho)**               | Etiqueta tachada → verdad ansiolítica. Ya construida.                                                                                           |
| 14 | 4:55–5:25      | "Ensayo de 15 semanas, comparado contra una benzodiacepina. Efectividad comparable."                          | **\[REM-FULL]**      | `PesoEnsayoClinico`                            | Barra comparativa: Galphimia vs. benzodiacepina, dos barras que suben casi iguales. Dato clínico.                                               |
| 15 | 5:25–5:55      | "El compuesto actúa sobre el mismo circuito de recompensa… baja el gatillo que te hace comer de más."         | **\[REM-OVL]**       | `PesoConexion` (overlay)                       | Una flecha conecta "Galphimia" → el circuito de la escena 11 (callback visual). Sobre el Dr.                                                    |
| 16 | 5:55–6:35      | "El cromo (en Carnilis): antojos de carbohidratos. Glucosa estable → menos urgencia."                         | **\[REM-FULL]**      | `PesoCromo`                                    | Diagrama: montaña rusa de glucosa que se **aplana** → el antojo baja.                                                                           |
| 17 | 6:35–7:25      | "La L-carnitina transporta la grasa a la mitocondria… 37 estudios: 1-2 kg. Real pero modesto."                | **\[REM-FULL]**      | `PesoCarnitina`                                | Diagrama: ácido graso + carnitina cruzan la membrana mitocondrial → se quema. `CountUp` honesto "1–2 kg".                                       |
| 18 | 7:25–8:00      | "El té verde bloquea una enzima que degrada la señal de quemar grasa. Mecanismo real, evidencia mixta."       | **\[REM-FULL]**      | `PesoTeVerde`                                  | Tarjeta de mecanismo (COMT) con **sello de honestidad**: "mecanismo real · evidencia no garantizada".                                           |
| 19 | 8:00–8:30      | "La alcachofa no quema grasa. Estimula la bilis del hígado, mejora cómo digieres la grasa."                   | **\[REM-FULL]**      | `PesoAlcachofa`                                | Diagrama hígado → bilis → digestión de grasa. Rótulo: "soporte hepático, no termogénico".                                                       |
| 20 | 8:30–9:05      | "La jamaica: buena para la presión, débil para peso. Está por lo cardiovascular, no por la báscula."          | **\[REM-FULL]**      | `PesoJamaica`                                  | Tarjeta partida: ✓ **presión arterial** / ✗ **peso** (honestidad explícita).                                                                    |
| 21 | 9:05–9:50      | Recap: metabolismo adaptado / ansiedad decide / herramientas específicas.                                     | **\[REM-FULL]**      | `PesoSintesis`                                 | Tres filas que entran en secuencia. Recapitula la estructura de la escena 5.                                                                    |
| 22 | 9:50–10:30     | CTA: "Escribe PESO por WhatsApp… Jueves en Wellkitt, Acapulco 36…"                                            | **\[REM-FULL]**      | `PesoCTA`                                      | Palabra clave PESO grande + logística del Jueves (sede + Zoom).                                                                                 |
| 23 | 10:30–11:15    | Cierre: "No significa que estés haciendo algo mal… dale al cuerpo una salida distinta."                       | **\[CÁM + REM-OVL]** | `PesoCierre` (overlay)                         | El Dr. cierra a cámara; wordmark Wellbive entra al final.                                                                                       |

**Escenas Remotion a construir: 21** (2 ya hechas ✅). Diagramas 100% código: 14. Con imagen generada: 2 (hook). Overlays: 5.

***

## 3. Catálogo de escenas Remotion (motion design, no slides)

Principio: **cada escena revela en secuencia y tiene una idea visual propia** — nada de texto que solo aparece. Los diagramas usan nodos que laten, flechas que fluyen (stroke-draw), cifras que cuentan, y el sello ámbar/tierra.

| Escena                     | Idea de motion (el "no-slide")                                                                                         | Assets |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| `PesoDatoSeisAnos` ✅       | CountUp a −704 tratado como luz (bloom). Hairline de firma.                                                            | —      |
| `PesoOjoDeGallina` ✅       | Etiqueta que se tacha en clay → verdad en ámbar con bloom.                                                             | —      |
| `PesoHookBascula`          | Aguja de báscula que oscila y no baja; la frase se quema encima.                                                       | IMG-01 |
| `PesoHookNoche`            | Imagen editorial con viñeta que respira; frase clave por palabra.                                                      | IMG-02 |
| `PesoNoEsDisciplina`       | "Te falta disciplina" → tachado clay → "No es así" con punch.                                                          | —      |
| `PesoDosFrentes`           | Dos columnas (Metabolismo/Mente) que se dibujan desde el centro.                                                       | —      |
| `PesoEstudioSetup`         | Timeline horizontal; dos hitos; CountUp 58 kg y −610.                                                                  | —      |
| `PesoModoAhorro`           | Medidor tipo tacómetro que cae y se **traba**; candado ámbar.                                                          | —      |
| `PesoCortisol`             | Estrés (pulso) → nodo suprarrenal → flecha a íconos comida.                                                            | —      |
| `PesoCircuitoRecompensa` ⭐ | **Bucle cerrado** estrés→comer→alivio→refuerzo; cada vuelta el trazo se engrosa y el pulso acelera. La joya del video. | —      |
| `PesoEnsayoClinico`        | Dos barras que suben en paralelo casi a la misma altura; etiquetas Galphimia / benzodiacepina.                         | —      |
| `PesoConexion` (overlay)   | Flecha que viaja de "Galphimia" al circuito (callback). Alfa.                                                          | —      |
| `PesoCromo`                | Curva de glucosa dentada que se **suaviza**; medidor de antojo que baja.                                               | —      |
| `PesoCarnitina`            | Membrana mitocondrial; el ácido graso + carnitina cruzan; chispa de combustión; CountUp "1–2 kg".                      | —      |
| `PesoTeVerde`              | Enzima (COMT) bloqueada; sello "evidencia no garantizada".                                                             | —      |
| `PesoAlcachofa`            | Hígado → gota de bilis → grasa que se emulsiona. Rótulo honesto.                                                       | —      |
| `PesoJamaica`              | Tarjeta partida con ✓/✗ animados.                                                                                      | —      |
| `PesoSintesis`             | Tres filas ícono+texto en cascada (recap).                                                                             | —      |
| `PesoCTA`                  | PESO en grande + WhatsApp + fila de logística del Jueves.                                                              | —      |
| `PesoLowerThird` (overlay) | Nombre/marca que se dibuja, esquina inferior. Alfa.                                                                    | —      |
| `PesoCierre` (overlay)     | Wordmark Wellbive que entra al cierre. Alfa.                                                                           | —      |

***

## 4. Prompts de imágenes (Nano Banana / ChatGPT)

Solo 2 imágenes editoriales — el resto son diagramas de código. **Estilo unificado obligatorio** para que no se sientan stock:

> **Estilo base (pegar en todos):** cinematic editorial photograph, warm low-key lighting, deep amber and dark tobacco-brown tones (#1E1712 shadows, #F5BC42 highlights), soft film grain, shallow depth of field, moody and intimate, no text, no logos, 16:9, photorealistic but painterly. Mexican/Latin context, real and relatable, NOT stock-photo cheerful.

**IMG-01 — Báscula (hook):**

> \[estilo base] + A worn bathroom scale on a tiled floor seen from above, dim early-morning light, a single bare foot hesitating at the edge, tension and reluctance. Empty space on the right third for text overlay. Warm amber rim light.

**IMG-02 — Cocina de noche (ansiedad nocturna):**

> \[estilo base] + A person from behind, mid-40s, standing alone in a dark kitchen at night lit only by the open refrigerator's warm glow, reaching in. Quiet, not shameful — human and tender. Amber light from the fridge, deep brown shadows. Space on the left for text.

**Formato de entrega:** PNG, 1920×1080. Guardar en `centrobioenergetica-videos/public/images/peso/` como `bascula.png` y `cocina-noche.png`. Si generas variantes, manda 2-3 de cada una y elegimos.

> Nota: los diagramas (cerebro, mitocondria, hígado, glucosa) **no** se generan como imagen — se animan en código. Generar cerebros/órganos con IA se ve inconsistente y "stock médico". El motion vectorial es más limpio y coherente con la marca.

***

## 5. Flujo DaVinci Resolve 21 (paso a paso)

### 5.1 Preparación

1. **Project Settings** → Timeline 1920×1080, 30 fps (igual que Remotion, para que no haya conversión de framerate).
2. Importa a la Media Pool: (a) el clip del Dr. en verde, (b) todos los MP4 de Remotion desde `out/`, (c) SFX de whoosh y la pista de música.

### 5.2 Keying del presentador (2 caminos)

**Camino A — Chroma key clásico (Delta Keyer, el mejor para green screen):**

1. Pon el clip del Dr. en **V1**. Ve a la página **Color**.
2. Añade un nodo serial. Aplica **Delta Keyer** (Effects → ResolveFX Key). *Prefiérelo sobre el 3D Keyer para pantalla verde: está hecho para esto.*
3. Con el cuentagotas del Delta Keyer, haz clic en el verde. Refina con **Clean Black** / **Clean White** (cierra huecos y bordes) y activa **Despill** para matar el reborde verde en la piel/pelo.
4. Detrás pon el fondo (una escena Remotion, o el fondo tierra de marca) en un nodo/pista inferior.

**Camino B — Sin green screen (Magic Mask v2, novedad de R21):**

* Si la iluminación del verde queda irregular, R21 trae **Magic Mask v2 con Neural Engine**: selecciona a la persona y la IA la recorta sin croma. Es la red de seguridad. Más pesado de procesar, pero salva tomas con verde manchado.

### 5.3 Timeline y sincronización (el corazón del método)

1. Coloca la narración del Dr. como pista base. Reproduce.
2. En la **palabra exacta** donde debe entrar una escena (ej. "…seiscientas cuatro"), detén el playhead y presiona **M dos veces** para crear y **nombrar** el marcador (ej. "07 · dato 704"). Repite por todo el guion usando el rundown de §2.
3. Arrastra cada MP4 de Remotion y **alinéalo a su marcador**:

   * **\[REM-FULL]** → en V1, corta el clip del Dr. y mete la escena a pantalla completa. Elimina el hueco (gap) para que quede continuo. La voz del Dr. sigue en la pista de audio.

   * **\[REM-OVL]** → en **V2, sobre** el Dr. (necesita alfa, ver §5.5).

   * **\[REM-SPLIT]** → V2 con **Crop** al 40-50%, y al Dr. en V1 lo desplazas y le das zoom para reencuadrar al lado libre.

### 5.4 Transiciones "push in" (dinamismo, no slides)

* Para cada escena Remotion: en Inspector → **Transform → Zoom**, pon un keyframe 1.00 en el primer frame y 1.05 unos 8-10 frames después (un empuje corto y rápido). Repite invertido al salir. Da la sensación de "cámara que entra".

* Alternativa: transición ResolveFX **Smooth Cut** o **Zoom** entre clips.

* **SFX whoosh** justo en cada corte (pista A3) + música de fondo (A2) a **−20 dB** bajo la voz. El whoosh vende el ritmo.

### 5.5 Escenas overlay — exportar con alfa (importante)

Las escenas `[REM-OVL]` (lower-third, "No es así", conexión, cierre) deben flotar sobre el Dr. **sin caja**. Para eso NO se exportan en H.264 (no tiene alfa). Se exportan en **ProRes 4444** con canal alfa:

```
npx remotion render <EscenaOverlay> out/<escena>.mov --codec=prores --prores-profile=4444
```

La composición del overlay debe tener **fondo transparente** (sin `PesoAtmosphere`). En DaVinci se ponen en V2 y se ven encima sin keying. *(Alternativa del notebook: exportar con fondo verde y keyear en DaVinci — funciona, pero el alfa de ProRes es más limpio y sin trabajo de key.)*

### 5.6 Color y export final

* Las escenas Remotion ya traen su look (ámbar/tierra) — no las toques. Corrige solo al Dr. (balance, piel) para que "case" tonalmente con el mundo cálido de las gráficas: baja un poco la temperatura fría, sube calidez media.

* **Deliver** → preset **YouTube 1080p**, H.264/H.265, audio AAC 320k. Verifica loudness \~ −14 LUFS integrada (estándar YouTube).

***

## 6. Orden de producción sugerido

1. **Tú:** graba el guion completo en verde (una sola pasada; los cortes se deciden en edición). Agrega subtítulos temporales en DaVinci para ubicar las palabras.
2. **Tú:** genera IMG-01 e IMG-02 en Nano Banana con los prompts de §4.
3. **Yo:** construyo las escenas Remotion por lotes (empezando por las de dato/diagrama, que son el 80% del valor).
4. **Los dos:** montaje en DaVinci con el rundown de §2.

***

## 7. Estado actual

**15 de 21 escenas construidas y verificadas** (paleta ámbar/tierra, motion real):

Bloque 1 — estructura + datos + ansiedad: ✅ `PesoDosFrentes` (5), `PesoEstudioSetup` (6), `PesoDatoSeisAnos` (7), `PesoModoAhorro` (8), `PesoCortisol` (10), `PesoCircuitoRecompensa` ⭐ (11), `PesoOjoDeGallina` (13).

Bloque 2 — herramientas + recap + CTA: ✅ `PesoEnsayoClinico` (14), `PesoCromo` (16), `PesoCarnitina` (17), `PesoTeVerde` (18), `PesoAlcachofa` (19), `PesoJamaica` (20), `PesoSintesis` (21), `PesoCTA` (22).

**Pendiente — 6 overlays/hooks + 2 imágenes:**

* ⏳ `PesoHookBascula`, `PesoHookNoche` — necesitan IMG-01 / IMG-02 (§4).
* ⏳ `PesoNoEsDisciplina`, `PesoLowerThird`, `PesoConexion`, `PesoCierre` — overlays con alfa (ProRes 4444, §5.5).

Se construyen al final: dependen de las imágenes que generas en Nano Banana y de validar el keying/alfa en DaVinci con un clip de prueba.

**Render de las 15 listas** (para meterlas a DaVinci):

```
for id in PesoDosFrentes PesoEstudioSetup PesoDatoSeisAnos PesoModoAhorro \
  PesoCortisol PesoCircuitoRecompensa PesoOjoDeGallina PesoEnsayoClinico \
  PesoCromo PesoCarnitina PesoTeVerde PesoAlcachofa PesoJamaica \
  PesoSintesis PesoCTA; do
  npx remotion render "$id" "out/$id.mp4"
done
```

