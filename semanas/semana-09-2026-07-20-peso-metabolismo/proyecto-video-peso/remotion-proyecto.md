# Proyecto Remotion — Video PESO (Semana 9)

## Dirección del proyecto

```
/Users/miguelojedarios/centrobioenergetica-videos
```

Remotion 4.0.484. Las escenas del video PESO viven en:

- `src/projects/peso/PesoScenes.tsx` — paleta `PESO`, `PesoAtmosphere`, `PesoDatoSeisAnos`, `PesoOjoDeGallina`
- `src/projects/peso/PesoDiagramas.tsx` — el resto de escenas de diagrama
- `src/Root.tsx` — registro de todas las composiciones `Peso...`

## Video completo ensamblado — composición `PesoVideo`

El video entero ya está armado en Remotion: los 22 beats en secuencia, con la
**narración real de ElevenLabs** (voz del Dr., `public/audio/peso/section-01..22.mp3`)
sincronizada beat por beat. En los tramos donde va el Dr. a cámara se muestra una
**silueta** como marcador de posición, hasta que se grabe/keye el material real.
Los 2 hooks sin imagen (báscula, cocina de noche) llevan placeholder hasta que
lleguen IMG-01 / IMG-02.

- Composición: `PesoVideo` (1920x1080, 30fps). Duración total ~6:50 (se fija sola
  desde la duración real de cada audio vía `getAudioDurationInSeconds`).

### Revisión del guion (los dos perfiles)

El guion se reescribió para nombrar explícitamente **dos perfiles** —igual que en
dolor y hormonas— en vez de hablar de "dos cosas" sueltas:

- **Perfil 1 · el metabolismo que aprendió a defenderse** → cromo, carnitina, té
  verde, alcachofa.
- **Perfil 2 · la ansiedad que decide antes que tú** → Ojo de Gallina (Galphimia).

Cambios que esto trajo al proyecto:

- Los productos ya **no entran de golpe**: cada bloque se anuncia colgado de su
  perfil ("empiezo por el perfil dos…", "para el perfil uno hay tres herramientas…").
- Se **eliminó el beat de la jamaica** (era el antiguo beat 20). Con eso el video
  pasó de 23 a 22 beats, y se borró la escena `PesoJamaica` del código, de
  `Root.tsx` y su still de revisión.
- `PesoDosFrentes` y `PesoSintesis` se actualizaron para decir "Perfil 1 / Perfil 2"
  en pantalla, en línea con la narración.
- Archivos nuevos: `src/projects/peso/PesoVideo.tsx` (ensamblaje) y
  `src/projects/peso/PesoPresentador.tsx` (silueta del Dr. + placeholder nocturno).
- Guion de voz: `scripts/voiceover/peso.json`.

Para regenerar la narración (si cambias el guion):

```
npm run voiceover -- scripts/voiceover/peso.json --force
```

Render del video completo a MP4:

```
npx remotion render PesoVideo out/peso-semana9/PesoVideo-completo.mp4
```

### Qué falta para la versión final

- Grabar/keyear al Dr. y sustituir las siluetas por su video real (o dejar la
  silueta como estilo, si te gusta el resultado).
- Generar IMG-01 (báscula) e IMG-02 (cocina de noche) y montarlas en los hooks.
- Música de fondo: se puede añadir en post o con `npm run music`.

## Abrir el preview (Remotion Studio)

```
cd /Users/miguelojedarios/centrobioenergetica-videos
npm run dev
```

Abre el editor visual en el navegador (localhost). Elige la composición `PesoVideo`
para ver el video completo con audio, o cualquier escena suelta `Peso...`.

## Renderizar una escena a MP4

```
cd /Users/miguelojedarios/centrobioenergetica-videos
npx remotion render <IdComposicion> out/peso-semana9/<IdComposicion>.mp4
```

Ejemplo: `npx remotion render PesoDatoSeisAnos out/peso-semana9/PesoDatoSeisAnos.mp4`

## Capturar un frame suelto (still PNG)

```
npx remotion still <IdComposicion> out/x.png --frame=N --scale=0.5
```

## Carpeta de salida (los MP4 renderizados)

```
/Users/miguelojedarios/centrobioenergetica-videos/out/peso-semana9/
```

Contenido de esa carpeta:

- **26 MP4** del montaje, numerados por beat y **sin audio** (tu voz sale de tu grabación).
- `alternativas/` — el mismo beat en el otro modo (SPLIT ↔ FULL).
- `alfa/` — 19 `.mov` ProRes 4444: solo texto y animación, con transparencia.
- `00-FONDO-limpio.mp4` — placa de atmósfera sin texto, para ponerte detrás.
- `00-MUSICA-background.mp3` — 5 min instrumental (va en loop).
- `00-ORDEN-MONTAJE.txt` — beat · modo · archivo · palabra clave de entrada.

Para renumerar tras un re-render: `node scripts/organizar-peso-davinci.mjs`

## Estado de las escenas

Todas 1920x1080 a 30fps.

### Los 22 beats, por modo

Cada beat existe en el modo que le toca en el montaje (ver `00-ORDEN-MONTAJE.txt`):

- **FULL** (9) — gráfica o foto a pantalla completa: beats 1, 2, 7, 11, 12, 13, 14, 18, 22.
- **SPLIT** (9) — gráfica izquierda 58% + tú a la derecha: beats 5, 6, 8, 10, 16, 17, 19, 20, 21.
- **TEXTO** (4) — solo la frase clave + tú: beats 3, 4, 9, 15.

**Duraciones:** cada clip se dimensiona al **ritmo natural de tu voz + 15% de colchón**
(NO a la narración de IA, que va acelerada a 1.1x). Si regeneras el audio o cambias el
guion, hay que recalcularlas.

### Portada de stream (antes de la transmisión)

`PortadaStreamJuevesPeso` — 1920x1080, 5 minutos exactos, sin audio.
Sale en `out/peso-semana9/00-PORTADA-STREAM-jueves-peso.mp4`.

Es la pantalla de espera que corre **antes** de que arranque el Jueves en
Wellkitt. Sigue el patrón de las portadas que ya existían
(`src/projects/stream-portada/`), pero con la paleta y la tipografía del video
de peso, para que la semana entera se vea como un solo objeto.

Lo importante no es el diseño: es **el aviso**. Como la sesión es por Zoom y se
cae si la gente llega sin su hoja, la portada existe sobre todo para que la
busquen mientras esperan — pide la hoja impresa y el papel chico aparte.

El motivo de la derecha es el circuito de recompensa girando: el impulso recorre
el anillo y enciende cada nodo al llegar. Es el único diagrama de la sesión que
gana algo con estar en loop, porque cada vuelta lo refuerza — que es justo lo
que explica.

**Loop:** toda la animación ambiental es periódica sobre 300 frames, y 300
divide exacto los 9000 de la composición. Si se repite el archivo, la entrada
del texto vuelve a ocurrir; para stream continuo eso se ve bien.

Código: `src/projects/stream-portada/PortadaStreamJuevesPeso.tsx`.

### Remates de cierre

Tres tarjetas al final, sin ti en cuadro, cada una en `.mp4` con fondo y en `alfa/`:

| Archivo | Qué es |
|---|---|
| `23b-WellvibeTitulo-FULL` | La marca del **canal**. Wordmark tipográfico, sin símbolo (así lo pide el manual en `marca/wellvibe/`). Compuesto con Instrument Sans, la fuente del video. |
| `23-WellkittTitulo-FULL` | La marca de **producto**. El logo verde con hoja. |
| `24-Suscribete-FULL` | YouTube + campana. |

Los tres con zoom continuo de principio a fin: se pueden cortar en cualquier punto.
En alfa, el texto es tinta oscura — solo lee sobre fondo claro.

Código: `src/projects/peso/PesoRemates.tsx`.

### Overlays con canal alfa

Ya están hechos, en `out/peso-semana9/alfa/`. Para regenerar uno hacen falta **cuatro**
flags — con solo `--prores-profile=4444` sale ProRes 422 **sin** transparencia:

```
npx remotion render <Id> out/x.mov \
  --codec=prores --prores-profile=4444 \
  --pixel-format=yuva444p10le \
  --image-format=png \
  --muted
```

Comprobar que el alfa es real: `ffprobe -show_entries stream=pix_fmt` debe empezar en `yuva`.

## Enlaces del proyecto

- Rundown y flujo de edición: [produccion-video-remotion-davinci.md](produccion-video-remotion-davinci.md)
- Orden de montaje (junto a los clips): `out/peso-semana9/00-ORDEN-MONTAJE.txt`
- Prompts de imágenes: [prompts-imagenes.md](prompts-imagenes.md)
- Guion completo: [../teleprompter/video-principal-cuerpo-quema-menos-12min.md](../teleprompter/video-principal-cuerpo-quema-menos-12min.md)
- Investigación: [../investigacion-peso-metabolismo.md](../investigacion-peso-metabolismo.md)
