# Guia de fondos para videos con chroma / pantalla verde

Fecha: 2026-05-25

## Decision recomendada

Para Wellbive no conviene usar fondos llamativos, futuristas, muy clinicos o de tienda.

El fondo debe comunicar:

- calma
- salud seria
- confianza
- cercania
- educacion
- clinica real
- bienestar sin parecer anuncio

La propuesta principal es usar un fondo tipo **consultorio educativo calido**.

## Fondo maestro recomendado

### Consultorio educativo calido

Uso:

- Videos largos de YouTube.
- Teleprompter.
- Explicaciones de salud.
- Temas de sistema nervioso, digestion, energia, hormonas, defensas.

Descripcion visual:

- Fondo desenfocado de consultorio o sala terapeutica.
- Pared clara, no blanca pura.
- Luz natural lateral.
- Librero pequeno o repisa.
- Una planta discreta.
- Mesa o mueble bajo con pocos objetos.
- Nada de textos visibles.
- Nada que compita con el rostro.

Paleta:

- verde salvia
- blanco calido
- madera clara
- gris suave
- acentos dorado muy discretos

Sensacion:

```text
Estoy en un espacio de salud serio, humano y tranquilo.
```

## Fondos secundarios

### 1. Fondo clinica Wellkitt

Uso:

- Jueves Wellkitt.
- Invitaciones presenciales.
- Videos donde se hable de tienda fisica o cupon.

Descripcion:

- Mesa limpia con productos desenfocados.
- Repisa de tienda o consultorio al fondo.
- Luz calida.
- Sensacion real, no publicitaria.

Regla:

Los productos deben verse como contexto, no como protagonista.

### 2. Fondo aula / instituto

Uso:

- Cursos del Instituto.
- Actos que Mueven.
- Regulacion Bioelectrica.
- Temas sistemicos o educativos profundos.

Descripcion:

- Pizarra o pared con textura suave.
- Librero, libreta o mesa de trabajo.
- Ambiente de clase seria.
- Sin textos legibles al fondo.

### 3. Fondo neutro premium

Uso:

- Shorts.
- Videos muy directos.
- Clips de respuesta rapida.

Descripcion:

- Fondo liso con degradado muy suave.
- Color gris calido, verde salvia oscuro o beige suave.
- Ligera sombra o profundidad.

Regla:

Ideal cuando el mensaje es fuerte y no queremos distraccion.

## Fondo para la primera semana: CALMA

Tema:

```text
Tu cuerpo sigue en emergencia aunque ya termino el dia.
```

Fondo recomendado:

**Consultorio educativo calido en modo noche suave.**

Descripcion:

- Consultorio o estudio terapeutico.
- Luz baja, calida, lateral.
- Fondo con librero o repisa desenfocada.
- Planta discreta.
- Tono verde salvia / madera clara.
- Sensacion de noche tranquila, no dramatica.

Evitar:

- Persona en cama como fondo para todo el video.
- Fondo oscuro dramatico.
- Imagen de hospital.
- Fondo con demasiados productos.
- Fondo tipo spa generico.

Para la miniatura si puede usarse una escena de cama/alerta, pero para el video largo conviene mantener consultorio educativo.

## Reglas tecnicas para chroma

### Iluminacion

- Iluminar la pantalla verde de forma pareja.
- Iluminar a la persona por separado.
- Usar luz suave.
- Evitar sombras sobre la pantalla verde.
- Separar a la persona de la pantalla verde para reducir rebote verde.
- Usar una luz de contra o hair light si es posible, para separar hombros y cabello.

### Distancia

Ideal:

```text
Persona a 1.5-2.5 metros de la pantalla verde.
```

Si el espacio es pequeno:

- Alejarse lo maximo posible.
- Evitar ropa verde.
- Usar luz trasera suave.
- Revisar bordes de cabello y hombros.

### Camara

- Plano medio: pecho o cintura hacia arriba.
- Ojos cerca del tercio superior.
- Espacio lateral moderado si se van a agregar textos.
- Grabar en 4K si se puede, aunque se exporte en 1080p.
- Mantener el fondo virtual ligeramente desenfocado.

### Fondo virtual

El fondo debe coincidir con la luz de la persona.

Si la persona esta iluminada desde la izquierda, el fondo debe sugerir una luz parecida desde la izquierda.

Evitar fondos donde:

- La luz venga del lado contrario.
- Haya ventanas muy brillantes atras.
- Haya mucha profundidad hiperrealista.
- Parezca que la persona esta flotando.

## Composicion recomendada

Para videos largos:

```text
Persona centrada o ligeramente a un lado.
Fondo desenfocado.
Pocos elementos.
Espacio para texto ocasional.
```

Para Shorts:

```text
Plano mas cerrado.
Fondo neutro.
Texto grande arriba o abajo.
Sin elementos pequenos.
```

## Kit de fondos que deberiamos crear

1. `fondo-consultorio-calido-dia`
2. `fondo-consultorio-calido-noche`
3. `fondo-clinica-wellkitt-productos-suaves`
4. `fondo-aula-instituto`
5. `fondo-neutro-shorts-verde-salvia`

Con estos 5 fondos se cubren casi todos los videos de los 90 dias.

## Prompt base para generar fondo

```text
Fondo realista para video educativo de salud, consultorio terapeutico calido, pared verde salvia muy suave, madera clara, librero desenfocado, planta discreta, luz natural lateral suave, profundidad de campo, espacio limpio, sin personas, sin texto, sin logos, composicion para talking head, 16:9, profesional, tranquilo, confiable, no hospitalario, no spa generico.
```

## Prompt para semana CALMA

```text
Fondo realista para video educativo de salud sobre calma, sueño y sistema nervioso, consultorio terapeutico calido en ambiente de tarde/noche, luz lateral suave y calida, pared verde salvia muy discreta, madera clara, librero desenfocado, pequena lampara calida, planta sutil, sin personas, sin texto, sin logos, espacio limpio para talking head, profundidad de campo cinematografica, 16:9, profesional, tranquilo, confiable, no dramatico, no hospital.
```

## Fuentes consultadas

- YouTube Help recomienda cuidar iluminacion, usar key light y fill light, y agregar luces al fondo cuando sea necesario.
- YouTube Help para movil recomienda luz suave y pareja, y revisar como se ve el fondo antes de grabar.
- Adobe recomienda separar sujeto y pantalla verde, y cuidar que la pantalla no quede irregular o dificil de recortar.
- B&H recomienda iluminar la pantalla de forma pareja, separar sujeto y fondo, y hacer que la luz del sujeto tenga sentido con el fondo final.
- Wistia recomienda elegir fondos que no distraigan, usar principios basicos de iluminacion y crear fondos simples pero intencionales.

