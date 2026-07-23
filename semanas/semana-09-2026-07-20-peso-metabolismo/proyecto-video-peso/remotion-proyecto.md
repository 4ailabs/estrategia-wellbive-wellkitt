# Proyecto Remotion — Video PESO (Semana 9)

## Dirección del proyecto

```
/Users/miguel/centrobioenergetica-videos
```

Remotion 4.0.484. Las escenas del video PESO viven en:

- `src/projects/peso/PesoScenes.tsx` — paleta `PESO`, `PesoAtmosphere`, `PesoDatoSeisAnos`, `PesoOjoDeGallina`
- `src/projects/peso/PesoDiagramas.tsx` — el resto de escenas de diagrama
- `src/Root.tsx` — registro de todas las composiciones `Peso...`

## Video completo ensamblado — composición `PesoVideo`

El video entero ya está armado en Remotion: los 23 beats en secuencia, con la
**narración real de ElevenLabs** (voz del Dr., `public/audio/peso/section-01..23.mp3`)
sincronizada beat por beat. En los tramos donde va el Dr. a cámara se muestra una
**silueta** como marcador de posición, hasta que se grabe/keye el material real.
Los 2 hooks sin imagen (báscula, cocina de noche) llevan placeholder hasta que
lleguen IMG-01 / IMG-02.

- Composición: `PesoVideo` (1920x1080, 30fps). Duración total ~8 min (se fija sola
  desde la duración real de cada audio vía `getAudioDurationInSeconds`).
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
cd /Users/miguel/centrobioenergetica-videos
npm run dev
```

Abre el editor visual en el navegador (localhost). Elige la composición `PesoVideo`
para ver el video completo con audio, o cualquier escena suelta `Peso...`.

## Renderizar una escena a MP4

```
cd /Users/miguel/centrobioenergetica-videos
npx remotion render <IdComposicion> out/peso-semana9/<IdComposicion>.mp4
```

Ejemplo: `npx remotion render PesoDatoSeisAnos out/peso-semana9/PesoDatoSeisAnos.mp4`

## Capturar un frame suelto (still PNG)

```
npx remotion still <IdComposicion> out/x.png --frame=N --scale=0.5
```

## Carpeta de salida (los MP4 renderizados)

```
/Users/miguel/centrobioenergetica-videos/out/peso-semana9/
```

Ahí están los 15 MP4 listos + `00-ORDEN-MONTAJE.txt` (mapa beat -> archivo). El FCPXML que exporta el timeline apunta a esta ruta.

## Estado de las escenas

Todas 1920x1080 a 30fps.

### Listas (15 escenas renderizadas)

| Composición | Frames | Beat |
|---|---|---|
| PesoDosFrentes | 150 | 5 |
| PesoEstudioSetup | 160 | 6 |
| PesoDatoSeisAnos | 170 | 7 |
| PesoModoAhorro | 170 | 8 |
| PesoCortisol | 160 | 10 |
| PesoCircuitoRecompensa | 252 | 11 |
| PesoOjoDeGallina | 192 | 13 |
| PesoEnsayoClinico | 150 | 14 |
| PesoCromo | 160 | 16 |
| PesoCarnitina | 165 | 17 |
| PesoTeVerde | 140 | 18 |
| PesoAlcachofa | 140 | 19 |
| PesoJamaica | 140 | 20 |
| PesoSintesis | 150 | 21 |
| PesoCTA | 150 | 22 |

### Pendientes (6 escenas overlay/hook)

- `PesoHookBascula`, `PesoHookNoche` — dependen de IMG-01 / IMG-02 (ver [prompts-imagenes.md](prompts-imagenes.md)).
- `PesoNoEsDisciplina`, `PesoLowerThird`, `PesoConexion`, `PesoCierre` — overlays con canal alfa. Se exportan en **ProRes 4444** (`.mov`), no MP4, porque llevan transparencia.

Para overlays con alfa el render lleva flags de codec:

```
npx remotion render PesoLowerThird out/peso-semana9/PesoLowerThird.mov --codec=prores --prores-profile=4444
```

## Enlaces del proyecto

- Rundown y flujo de edición: [produccion-video-remotion-davinci.md](produccion-video-remotion-davinci.md)
- Plano de montaje interactivo: [timeline-davinci-peso.html](timeline-davinci-peso.html)
- Prompts de imágenes: [prompts-imagenes.md](prompts-imagenes.md)
- Guion completo: [../teleprompter/video-principal-cuerpo-quema-menos-12min.md](../teleprompter/video-principal-cuerpo-quema-menos-12min.md)
- Investigación: [../investigacion-peso-metabolismo.md](../investigacion-peso-metabolismo.md)
