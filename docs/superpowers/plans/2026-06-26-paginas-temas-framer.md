# Paginas de Temas Wellbive en Framer — Plan de Implementacion

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear paginas publicas por tema de salud en Framer usando CMS Collections, con test interactivo, productos, video y CTA de WhatsApp.

**Architecture:** CMS de Framer con 3 Collections relacionales (Temas, Tipos, Productos). Una plantilla de pagina que se reutiliza para todos los temas. Un Code Component React para el test interactivo. Script Node.js que extrae datos del repositorio y genera JSON para poblar las Collections via Framer CLI.

**Tech Stack:** Framer (CMS Collections, Layout Pages, Code Components), Framer CLI, React (Code Component del test), Node.js (script de exportacion), repositorio estrategia-wellbive-wellkitt como fuente de datos.

## Global Constraints

- Sitio: `institutocentrobioenergetica.com` en Framer
- Rutas: `/energia`, `/estres`, `/digestion`, `/calma` (slug directo, sin prefijo)
- Idioma: espanol sin acentos en slugs, con acentos en contenido visible
- Sin login, sin pagos, paginas 100% publicas
- Responsivo: movil first
- Branding: logo Wellbive, tipografia Poppins/Inter/DM Sans, colores por tema
- Framer CLI debe trabajar en branch separada, nunca directo a main

---

### Task 1: Script de exportacion — extraer datos del repo a JSON

**Files:**
- Create: `herramientas/framer-export/exportar-temas.js`
- Create: `herramientas/framer-export/datos/temas.json`
- Create: `herramientas/framer-export/datos/tipos.json`
- Create: `herramientas/framer-export/datos/productos.json`
- Read: `estrategia/sistemas/sistema-perfiles-wellbive.md`
- Read: `estrategia/fuente-de-verdad/estrategia-temas-calendario-wellbive.md`
- Read: `base/productos/catalogo/LISTA_COMPLETA_PRODUCTOS_WELLKITT.md`
- Read: `semanas/semana-*/teleprompter/*.md`
- Read: `semanas/semana-*/material-jueves/folleto-*.html`

**Interfaces:**
- Consumes: archivos markdown y HTML del repositorio
- Produces: 3 archivos JSON que Tasks 3-5 usaran para poblar Framer

- [ ] **Step 1: Crear la estructura de carpetas**

```bash
mkdir -p herramientas/framer-export/datos
```

- [ ] **Step 2: Escribir el script de exportacion**

Crear `herramientas/framer-export/exportar-temas.js`:

```javascript
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'datos');

// Datos de los 4 temas iniciales (hardcoded desde el contenido existente del repo)
const temas = [
  {
    titulo: "Energia",
    slug: "energia",
    subtitulo: "Cuando el cansancio no se va con dormir",
    intro: "El cansancio no es un problema de actitud. Es un problema de tipo. Cada tipo tiene un mecanismo diferente dentro de la celula y una herramienta distinta. Identifica cual te describe mejor.",
    videoYoutube: "", // Se llena cuando se publique el video
    palabraClave: "ENERGIA",
    numeroWhatsApp: "5215512345678", // Actualizar con numero real
    colorAcento: "#2E7D32",
    baseTransversalTitulo: "Pirofosfato de Tiamina (Carzilasa)",
    baseTransversalTexto: "Forma activa de vitamina B1. Cofactor de PDH y OGDH, las dos enzimas que abren la produccion de energia. Sin Carzilasa, no importa cuanto Q10, carnitina o hierro tomes: la puerta esta cerrada y el ciclo no arranca.",
    orden: 5,
    activo: true
  },
  {
    titulo: "Estres",
    slug: "estres",
    subtitulo: "Cuando el cuerpo no encuentra cierre",
    intro: "El estres no siempre se va cuando termina el evento. Se queda en el cuerpo en forma de tension, cansancio o sueno roto. Identifica cual de estos patrones te describe mejor — cada uno tiene su propia ruta.",
    videoYoutube: "",
    palabraClave: "ESTRES",
    numeroWhatsApp: "5215512345678",
    colorAcento: "#4A6FA5",
    baseTransversalTitulo: "",
    baseTransversalTexto: "",
    orden: 4,
    activo: true
  },
  {
    titulo: "Digestion",
    slug: "digestion",
    subtitulo: "Me inflamo despues de comer",
    intro: "La inflamacion despues de comer no es normal. Tu tubo digestivo tiene varias capas y cada una puede estar afectada de forma diferente. Identifica cual es tu capa para saber por donde empezar.",
    videoYoutube: "",
    palabraClave: "DIGESTION",
    numeroWhatsApp: "5215512345678",
    colorAcento: "#8B6914",
    baseTransversalTitulo: "",
    baseTransversalTexto: "",
    orden: 3,
    activo: true
  },
  {
    titulo: "Calma y sueno",
    slug: "calma",
    subtitulo: "Tu cuerpo sigue en emergencia aunque ya termino el dia",
    intro: "Si tu cuerpo no puede descansar aunque estes en la cama, no es falta de disciplina. Es un sistema nervioso que no ha recibido la senal de que puede bajar la guardia. Identifica tu perfil de sueno.",
    videoYoutube: "",
    palabraClave: "CALMA",
    numeroWhatsApp: "5215512345678",
    colorAcento: "#5B4A8A",
    baseTransversalTitulo: "",
    baseTransversalTexto: "",
    orden: 1,
    activo: true
  }
];

// Tipos por tema
const tipos = [
  // ENERGIA - 5 tipos
  { tema: "energia", nombre: "Fatiga de esfuerzo", numero: 1,
    descripcion: "Te cansas con cualquier esfuerzo fisico. Antes podias y ahora no.",
    mecanismo: "La cadena de electrones no puede acelerar. Cuando haces esfuerzo, tus celulas necesitan producir mas ATP de golpe, pero si falta el transportador entre los complejos, la cadena no puede subir la produccion.",
    senal1: "Te cansas con cualquier esfuerzo fisico",
    senal2: "Antes podias y ahora no",
    senal3: "Un dia activo te cuesta 2-3 dias de agotamiento",
    senal4: "Recuperacion lenta",
    productoNombre: "Coenzima Q10", productoCientifico: "Ubiquinona-10",
    productoMecanismo: "Transportador de electrones entre complejos I/II y III de la cadena mitocondrial. Sin Q10, los electrones no pasan y no se produce ATP. Meta-analisis: 13 RCTs, 1,126 participantes, p=0.001.",
    productoPresentacion: "Capsulas 100mg + Vitamina E" },
  { tema: "energia", nombre: "Fatiga metabolica", numero: 2,
    descripcion: "Cansancio + dificultad para bajar de peso. Pesadez muscular.",
    mecanismo: "La grasa no entra a la mitocondria. Tu cuerpo tiene grasa almacenada — eso es combustible. Pero para quemarla, los acidos grasos tienen que cruzar la membrana mitocondrial. Si el transportador no esta disponible, la grasa se queda afuera.",
    senal1: "Cansancio + dificultad para bajar de peso",
    senal2: "Pesadez muscular",
    senal3: "Recuperacion lenta despues de cualquier esfuerzo",
    senal4: "Como si tuvieras combustible pero no pudieras usarlo",
    productoNombre: "Carnilis", productoCientifico: "Carnitina-Lisina + Cromo",
    productoMecanismo: "Transporta acidos grasos a traves de la membrana mitocondrial via CPT-I y CPT-II. Sin carnitina, la grasa no entra como combustible. Ensayo 2024: fatiga de 6.7 a 2.1 en 7 semanas.",
    productoPresentacion: "Capsulas" },
  { tema: "energia", nombre: "Fatiga silenciosa", numero: 3,
    descripcion: "Manos frias, palidez, falta de concentracion. Hemoglobina normal pero ferritina baja.",
    mecanismo: "Hierro bajo en las enzimas mitocondriales. Las enzimas de los complejos I, II y III necesitan hierro para funcionar. La hemoglobina puede mantenerse normal pero las enzimas mitocondriales se quedan sin cofactor.",
    senal1: "Manos frias, palidez, falta de concentracion",
    senal2: "Sensacion de que falta oxigeno",
    senal3: "Hemoglobina normal pero ferritina baja",
    senal4: "Tus estudios estan bien y sigues cansado",
    productoNombre: "Espirulina", productoCientifico: "Arthrospira platensis",
    productoMecanismo: "Hierro biodisponible (27% mayor absorcion). Cofactor de complejos I, II, III y aconitasa en Krebs. RCT: 80 mujeres, 8 semanas, incremento significativo en hemoglobina.",
    productoPresentacion: "Gotero o comprimidos" },
  { tema: "energia", nombre: "Fatiga post-desgaste", numero: 4,
    descripcion: "Meses cansado, nada funciona. Empezo tras infeccion, cirugia o estres prolongado.",
    mecanismo: "Mitocondrias danadas, depositos vacios. Cuando el cuerpo gasta mas de lo que repone durante meses, no solo se agotan los cofactores — las mitocondrias mismas se danan. No falta una sola pieza. Falta la fabrica entera.",
    senal1: "Meses cansado, nada funciona",
    senal2: "Empezo tras infeccion, cirugia o estres prolongado",
    senal3: "Has probado vitaminas y dormir mas sin resultado",
    senal4: "Depositos vacios en multiples niveles",
    productoNombre: "Fostprint MAX", productoCientifico: "10-HDA de jalea real + Complejo B + Minerales",
    productoMecanismo: "Activa via AMPK-PGC-1-alfa: biogenesis mitocondrial (crea nuevas mitocondrias, no repara las existentes). Incluye complejo B con tiamina y minerales. Ensayo 2025: aumento de PGC-1-alfa en 2 semanas.",
    productoPresentacion: "Ampollas" },
  { tema: "energia", nombre: "Fatiga reactiva", numero: 5,
    descripcion: "Energia que sube y baja segun tu estres. Como si alguien apagara el switch.",
    mecanismo: "WASF3 apaga la mitocondria con estres. El estres sostenido activa la proteina WASF3, que se mete dentro de la mitocondria y desarma fisicamente el supercomplejo III2+IV. Es un bloqueo activo, no un dano permanente.",
    senal1: "Energia que sube y baja segun tu estres",
    senal2: "Semanas buenas vs destruido",
    senal3: "Como si alguien apagara el switch",
    senal4: "Correlacion directa presion-agotamiento",
    productoNombre: "Maca Peruana", productoCientifico: "Lepidium meyenii",
    productoMecanismo: "Adaptogeno. Modula eje hipotalamo-hipofisis-adrenal (HPA) para regular cortisol y evitar que WASF3 apague los complejos mitocondriales. Complemento, no herramienta unica.",
    productoPresentacion: "Gotero" },

  // ESTRES - 4 patrones
  { tema: "estres", nombre: "Tension muscular", numero: 1,
    descripcion: "El cuerpo apretado aunque el problema termino.",
    mecanismo: "El sistema nervioso mantiene la activacion muscular como si la amenaza siguiera presente. Mandibula, cuello y hombros funcionan como alarma permanente.",
    senal1: "Mandibula apretada al despertar",
    senal2: "Cuello u hombros tensos al final del dia",
    senal3: "Dolor que mejora con masaje pero regresa",
    senal4: "Cuerpo tenso sin razon aparente",
    productoNombre: "Ner-vit", productoCientifico: "Galphimia + Valeriana + Azahar + Melisa + Pasiflora",
    productoMecanismo: "Extracto combinado de plantas con accion relajante muscular y nerviosa. No produce somnolencia. Reduce la activacion simpatica sostenida.",
    productoPresentacion: "Gotero" },
  { tema: "estres", nombre: "Ruido mental", numero: 2,
    descripcion: "Motor encendido sin nada que resolver.",
    mecanismo: "La corteza prefrontal sigue procesando como si hubiera problemas pendientes. El cerebro no recibe la senal de cierre del dia.",
    senal1: "La mente no para aunque el cuerpo descanso",
    senal2: "Repasas conversaciones del dia sin querer",
    senal3: "Tardas mas de 30 min en dormirte",
    senal4: "Sensacion de no poder apagar",
    productoNombre: "Valeriana", productoCientifico: "Valeriana officinalis",
    productoMecanismo: "Sedante nervioso suave. Facilita la transicion al sueno sin dependencia. Actua sobre receptores GABA.",
    productoPresentacion: "Gotero" },
  { tema: "estres", nombre: "Cansancio sin reserva", numero: 3,
    descripcion: "Agotado desde la manana sin importar cuanto duermas.",
    mecanismo: "El estres cronico agota el magnesio — mineral esencial para producir ATP y relajar la musculatura. Sin magnesio, el cuerpo no puede ni producir energia ni descansar.",
    senal1: "Te despiertas ya cansado",
    senal2: "Necesitas cafeina para arrancar",
    senal3: "Bajon de energia a media tarde",
    senal4: "Concentracion baja aunque hayas dormido",
    productoNombre: "Magnesio", productoCientifico: "Magnesio elemental",
    productoMecanismo: "Mineral esencial para produccion de ATP, relajacion muscular y funcion nerviosa. El estres cronico lo depleta rapidamente.",
    productoPresentacion: "Capsulas o polvo" },
  { tema: "estres", nombre: "Sueno roto", numero: 4,
    descripcion: "Duermes las horas pero el cuerpo no descansa.",
    mecanismo: "El sistema nervioso autonomo no entra en modo parasimpatico profundo. Te duermes pero no llegas al sueno reparador donde el cuerpo se recupera.",
    senal1: "Despiertas a las 2-3 am con la mente activa",
    senal2: "Sueno ligero, cualquier ruido te saca",
    senal3: "Duermes horas pero amaneces sin recuperacion",
    senal4: "Fatiga diurna aunque hayas dormido suficiente",
    productoNombre: "Zapote Blanco", productoCientifico: "Casimiroa edulis + Olivo + Espino blanco + Melisa + Galphimia",
    productoMecanismo: "Calma el sistema nervioso y apoya el reingreso al sueno. Sin dependencia. Combinacion de plantas con accion sedante suave y reguladora.",
    productoPresentacion: "Gotero" },

  // DIGESTION - 4 capas
  { tema: "digestion", nombre: "Pared intestinal erosionada", numero: 1,
    descripcion: "Inflamacion tras comer alimentos procesados o con emulsificantes.",
    mecanismo: "Los emulsificantes y aditivos de alimentos ultra-procesados danan la barrera intestinal. Las endotoxinas pasan a la circulacion y generan inflamacion cronica de bajo grado.",
    senal1: "Te inflamas despues de comer procesados",
    senal2: "Hinchazón que no se explica con un alimento especifico",
    senal3: "Sensibilidad a alimentos que antes tolerabas",
    senal4: "Inflamacion abdominal frecuente",
    productoNombre: "COLIX", productoCientifico: "Extracto de plantas antiinflamatorias intestinales",
    productoMecanismo: "Reduce la inflamacion de la mucosa intestinal y ayuda a restaurar la barrera selectiva del intestino.",
    productoPresentacion: "Gotero" },
  { tema: "digestion", nombre: "Flora bacteriana alterada", numero: 2,
    descripcion: "Historial de antibioticos, digestion irregular desde entonces.",
    mecanismo: "Los antibioticos eliminan tanto bacterias patogenas como beneficiosas. Sin flora equilibrada, la digestion se vuelve irregular y la barrera intestinal pierde su primera linea de defensa.",
    senal1: "Historial de antibioticos recientes",
    senal2: "Digestion irregular desde entonces",
    senal3: "Gases o hinchazón frecuente",
    senal4: "Alternancia entre estrenimiento y diarrea",
    productoNombre: "INULAC TABLETS", productoCientifico: "Prebiotico + probiotico",
    productoMecanismo: "Restaura la flora bacteriana intestinal. Alimenta las bacterias beneficiosas y ayuda a recolonizar el intestino con flora saludable.",
    productoPresentacion: "Tabletas masticables" },
  { tema: "digestion", nombre: "Estres digestivo", numero: 3,
    descripcion: "Sintomas digestivos ligados a momentos de estres o ansiedad.",
    mecanismo: "El eje intestino-cerebro transmite la activacion del estres directamente al sistema digestivo. El estres activa la inflamacion intestinal a traves del nervio vago.",
    senal1: "El estomago reacciona cuando estas estresado",
    senal2: "Retortijones o colon nervioso",
    senal3: "Los sintomas empeoran en semanas de presion",
    senal4: "Mejoras en vacaciones o fines de semana",
    productoNombre: "MELISSA", productoCientifico: "Melissa officinalis",
    productoMecanismo: "Calmante y antiespasmódica. Actua sobre el eje intestino-cerebro reduciendo la activacion nerviosa del sistema digestivo.",
    productoPresentacion: "Gotero" },
  { tema: "digestion", nombre: "Higado sobrecargado", numero: 4,
    descripcion: "Pesadez despues de comidas grasas, molestia en lado superior derecho.",
    mecanismo: "El higado procesa todo lo que comes. Cuando la carga es excesiva (grasas, aditivos, medicamentos), sus enzimas de detoxificacion se saturan y la digestion se vuelve pesada.",
    senal1: "Pesadez despues de comidas grasas",
    senal2: "Molestia en el lado superior derecho del abdomen",
    senal3: "Sabor amargo o boca pastosa al despertar",
    senal4: "Digestion lenta, sensacion de que la comida no baja",
    productoNombre: "HEPACRYL", productoCientifico: "Extracto hepatoprotector",
    productoMecanismo: "Apoya las funciones de detoxificacion del higado. Estimula la produccion de bilis y mejora el procesamiento de grasas.",
    productoPresentacion: "Gotero" },

  // CALMA - 5 perfiles
  { tema: "calma", nombre: "Ruido mental nocturno", numero: 1,
    descripcion: "Mente que no para al acostarse, repasa el dia, anticipa problemas.",
    mecanismo: "La corteza prefrontal mantiene actividad de procesamiento nocturno. El cerebro sigue en modo resolucion de problemas cuando deberia estar en modo descanso.",
    senal1: "La mente no para al acostarte",
    senal2: "Repasas el dia o anticipas problemas",
    senal3: "Tardas mucho en conciliar el sueno",
    senal4: "Sientes que tu cabeza no se apaga",
    productoNombre: "Valeriana", productoCientifico: "Valeriana officinalis",
    productoMecanismo: "Sedante nervioso suave que facilita la transicion al sueno actuando sobre receptores GABA. Sin dependencia.",
    productoPresentacion: "Gotero" },
  { tema: "calma", nombre: "Insomnio de conciliacion", numero: 2,
    descripcion: "El sueno no llega, cuerpo tenso, preocupacion por no dormir.",
    mecanismo: "El sistema nervioso simpatico sigue activado. El cuerpo esta en posicion de descanso pero fisiologicamente sigue en alerta. La preocupacion por no dormir genera un ciclo que empeora el insomnio.",
    senal1: "El sueno no llega aunque estes cansado",
    senal2: "Cuerpo tenso en la cama",
    senal3: "Preocupacion por no poder dormir",
    senal4: "Mientras mas lo intentas, peor es",
    productoNombre: "Valeriana", productoCientifico: "Valeriana officinalis",
    productoMecanismo: "Reduce la activacion simpatica y facilita la entrada al sueno. Tomar 30-45 minutos antes de dormir.",
    productoPresentacion: "Gotero" },
  { tema: "calma", nombre: "Despertares nocturnos", numero: 3,
    descripcion: "Se duerme bien pero despierta entre 2-4 am con alerta.",
    mecanismo: "El cortisol tiene un pico nocturno prematuro que despierta al cuerpo como si fuera de manana. El sistema de sueno se fragmenta.",
    senal1: "Te despiertas entre 2 y 4 am",
    senal2: "Al despertar la mente esta alerta, no adormilada",
    senal3: "Cuesta volver a dormir",
    senal4: "El patron se repite varias noches por semana",
    productoNombre: "Zapote Blanco", productoCientifico: "Casimiroa edulis",
    productoMecanismo: "Apoya el reingreso al sueno. Combinacion de plantas que calman el sistema nervioso y regulan el ciclo de despertar nocturno.",
    productoPresentacion: "Gotero" },
  { tema: "calma", nombre: "Cansancio al despertar", numero: 4,
    descripcion: "Duerme las horas pero no descansa.",
    mecanismo: "El sueno no alcanza la fase profunda (fase 3-4) donde ocurre la reparacion fisica. Duermes pero no te recuperas.",
    senal1: "Duermes las horas pero amaneces cansado",
    senal2: "No sientes que el sueno fue reparador",
    senal3: "Necesitas alarma para despertar",
    senal4: "Podrias seguir durmiendo todo el dia",
    productoNombre: "L-Triptofano", productoCientifico: "L-Triptofano",
    productoMecanismo: "Precursor de serotonina y melatonina. Regula el ritmo circadiano y la profundidad del sueno. Efecto gradual.",
    productoPresentacion: "Capsulas" },
  { tema: "calma", nombre: "Tension corporal constante", numero: 5,
    descripcion: "Mandibula, cuello, hombros tensos. Dolor de cabeza al despertar.",
    mecanismo: "El cuerpo mantiene patrones de tension muscular como respuesta al estres sostenido. Bruxismo nocturno, contracturas cervicales, cefalea tensional.",
    senal1: "Mandibula apretada, bruxismo",
    senal2: "Cuello y hombros permanentemente tensos",
    senal3: "Dolor de cabeza al despertar",
    senal4: "Tension que no cede con descanso",
    productoNombre: "Ner-vit", productoCientifico: "Galphimia + Valeriana + Azahar + Melisa + Pasiflora",
    productoMecanismo: "Relajante muscular y nervioso natural. Reduce la activacion simpatica que mantiene la tension corporal.",
    productoPresentacion: "Gotero" }
];

// Productos (catalogo general)
const productos = [
  { nombre: "Coenzima Q10", cientifico: "Ubiquinona-10", descripcionCorta: "Pieza clave de la cadena de energia celular", presentacion: "Capsulas 100mg + Vitamina E", horario: "Con alimento", categoria: "Energia" },
  { nombre: "Carnilis", cientifico: "Carnitina-Lisina + Cromo", descripcionCorta: "Transporta grasa como combustible a la mitocondria", presentacion: "Capsulas", horario: "Con alimento", categoria: "Energia" },
  { nombre: "Espirulina", cientifico: "Arthrospira platensis", descripcionCorta: "Hierro biodisponible para enzimas mitocondriales", presentacion: "Gotero o comprimidos", horario: "Con alimento", categoria: "Energia" },
  { nombre: "Fostprint MAX", cientifico: "10-HDA de jalea real + Complejo B + Minerales", descripcionCorta: "Genera nuevas mitocondrias", presentacion: "Ampollas", horario: "En ayunas o manana", categoria: "Energia" },
  { nombre: "Maca Peruana", cientifico: "Lepidium meyenii", descripcionCorta: "Adaptogeno que modula la respuesta al estres", presentacion: "Gotero", horario: "Manana o tarde", categoria: "Energia" },
  { nombre: "Ner-vit", cientifico: "Galphimia + Valeriana + Azahar + Melisa + Pasiflora", descripcionCorta: "Relajante nervioso y muscular sin somnolencia", presentacion: "Gotero", horario: "Manana, tarde y noche", categoria: "Estres" },
  { nombre: "Valeriana", cientifico: "Valeriana officinalis", descripcionCorta: "Sedante nervioso suave para conciliar el sueno", presentacion: "Gotero", horario: "30-45 min antes de dormir", categoria: "Calma" },
  { nombre: "Magnesio", cientifico: "Magnesio elemental", descripcionCorta: "Mineral para energia y relajacion muscular", presentacion: "Capsulas o polvo", horario: "Con desayuno o cena", categoria: "Estres" },
  { nombre: "Zapote Blanco", cientifico: "Casimiroa edulis + Olivo + Espino blanco", descripcionCorta: "Calma el sistema nervioso y apoya el sueno", presentacion: "Gotero", horario: "30 min antes de dormir", categoria: "Calma" },
  { nombre: "L-Triptofano", cientifico: "L-Triptofano", descripcionCorta: "Precursor de serotonina y melatonina", presentacion: "Capsulas", horario: "En la noche", categoria: "Calma" },
  { nombre: "COLIX", cientifico: "Extracto antiinflamatorio intestinal", descripcionCorta: "Reduce inflamacion de mucosa intestinal", presentacion: "Gotero", horario: "20 min antes de comer", categoria: "Digestion" },
  { nombre: "INULAC TABLETS", cientifico: "Prebiotico + probiotico", descripcionCorta: "Restaura la flora bacteriana intestinal", presentacion: "Tabletas masticables", horario: "Despues de comer", categoria: "Digestion" },
  { nombre: "MELISSA", cientifico: "Melissa officinalis", descripcionCorta: "Calmante y antiespasmódica digestiva", presentacion: "Gotero", horario: "20 min antes de comer", categoria: "Digestion" },
  { nombre: "HEPACRYL", cientifico: "Extracto hepatoprotector", descripcionCorta: "Apoya la detoxificacion del higado", presentacion: "Gotero", horario: "20 min antes de comer", categoria: "Digestion" },
  { nombre: "Melissa", cientifico: "Melissa officinalis", descripcionCorta: "Tension muscular con componente digestivo", presentacion: "Gotero", horario: "Manana, tarde y noche", categoria: "Estres" },
  { nombre: "Glicam", cientifico: "Glicina", descripcionCorta: "Neurotransmisor inhibidor para sueno profundo", presentacion: "Capsulas", horario: "30 min antes de dormir", categoria: "Calma" }
];

// Escribir JSONs
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'temas.json'), JSON.stringify(temas, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'tipos.json'), JSON.stringify(tipos, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'productos.json'), JSON.stringify(productos, null, 2));

console.log(`Exportados:`);
console.log(`  ${temas.length} temas`);
console.log(`  ${tipos.length} tipos`);
console.log(`  ${productos.length} productos`);
console.log(`  Carpeta: ${OUT_DIR}`);
```

- [ ] **Step 3: Ejecutar el script y verificar los JSON**

```bash
node herramientas/framer-export/exportar-temas.js
cat herramientas/framer-export/datos/temas.json | head -20
```

Expected: 4 temas, 18 tipos (5 energia + 4 estres + 4 digestion + 5 calma), 16 productos.

- [ ] **Step 4: Commit**

```bash
git add herramientas/framer-export/
git commit -m "feat: script de exportacion de datos de temas para Framer CMS"
```

---

### Task 2: Crear Collections en Framer via CLI

**Files:**
- Read: `herramientas/framer-export/datos/temas.json`
- Read: `herramientas/framer-export/datos/tipos.json`
- Read: `herramientas/framer-export/datos/productos.json`

**Interfaces:**
- Consumes: JSON generados en Task 1
- Produces: 3 Collections en Framer CMS (Temas, Tipos, Productos) pobladas con datos

**Prerequisito:** Tener Framer CLI conectado. Ejecutar `framer` en terminal y autorizar en el navegador.

- [ ] **Step 1: Conectar Framer CLI**

En la terminal, ejecutar el comando de Framer para conectar al proyecto:
```bash
framer
```
Autorizar en el navegador cuando se abra la ventana.

- [ ] **Step 2: Instruir a Claude Code para crear las Collections**

Con Framer CLI conectado, usar Claude Code para:
1. Crear la coleccion "Temas" con los campos del spec (Titulo, Slug, Subtitulo, Intro, Video YouTube, Palabra clave, Numero WhatsApp, Color acento, Base transversal titulo/texto, Orden, Activo)
2. Crear la coleccion "Tipos" con los campos del spec (Tema ref, Nombre, Numero, Descripcion, Mecanismo, Senales 1-4, Producto nombre/cientifico/mecanismo/presentacion)
3. Crear la coleccion "Productos" con los campos del spec (Nombre, Cientifico, Imagen, Descripcion corta, Presentacion, Horario, Categoria, Link tienda)
4. Poblar cada coleccion con los datos de los JSON
5. Todo en una branch separada

- [ ] **Step 3: Verificar en Framer**

Abrir el proyecto en Framer, ir a CMS, verificar que las 3 Collections existan con sus datos. Revisar que los campos esten correctos y los datos se vean bien.

- [ ] **Step 4: Aplicar a main**

Si todo esta correcto en la branch, hacer "Apply to main" en Framer.

---

### Task 3: Disenar la plantilla de pagina de tema en Framer

**Interfaces:**
- Consumes: Collections creadas en Task 2
- Produces: Layout Page en Framer que renderiza automaticamente cada tema

- [ ] **Step 1: Crear Layout Page para la coleccion Temas**

En Framer, crear una nueva Layout Page vinculada a la coleccion "Temas". Esto genera automaticamente una pagina por cada item de la coleccion con la ruta `/[slug]`.

- [ ] **Step 2: Disenar las secciones**

Seccion por seccion, siguiendo el spec:

1. **Hero:** Titulo + subtitulo (de la coleccion) + video YouTube embebido (iframe responsivo) + intro
2. **Base transversal:** Franja dorada con titulo y texto (solo si el campo tiene contenido)
3. **Espacio para test interactivo:** Placeholder donde ira el Code Component (Task 4)
4. **Tipos en detalle:** Lista de coleccion filtrada por tema, con tarjeta por tipo mostrando mecanismo y producto
5. **Productos:** Grid de productos filtrados por tema
6. **CTA:** Boton de descarga PDF + boton de WhatsApp (wa.me link dinamico con palabra clave)
7. **Sueroterapia:** Anuncio sutil
8. **Footer:** Logo, direccion, links

- [ ] **Step 3: Conectar variables del CMS**

Vincular cada elemento visual con los campos de la coleccion:
- Titulo → campo Titulo
- Subtitulo → campo Subtitulo
- Video → campo Video YouTube
- Intro → campo Intro
- Color → campo Color acento
- WhatsApp link → `wa.me/[Numero WhatsApp]?text=[Palabra clave]`
- PDF → campo Folleto PDF

- [ ] **Step 4: Verificar responsividad**

Probar en: movil (375px), tablet (768px), desktop (1280px). Todo debe ser legible y funcional.

---

### Task 4: Code Component — Test interactivo

**Files:**
- Create: Code Component en Framer (React)

**Interfaces:**
- Consumes: Datos de la coleccion Tipos (filtrados por tema)
- Produces: Test interactivo visual que resalta el tipo dominante

- [ ] **Step 1: Crear Code Component en Framer**

En Framer, crear un nuevo Code Component llamado "TestTipos". El componente recibe props que se conectan al CMS.

```tsx
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface Tipo {
  nombre: string
  senal1: string
  senal2: string
  senal3: string
  senal4: string
  productoNombre: string
}

interface Props {
  tipos: string // JSON string de tipos
  palabraClave: string
  numeroWhatsApp: string
  colorAcento: string
}

export default function TestTipos(props: Props) {
  const { palabraClave, numeroWhatsApp, colorAcento } = props
  let tipos: Tipo[] = []
  try { tipos = JSON.parse(props.tipos) } catch { tipos = [] }

  const [checks, setChecks] = useState<Record<string, boolean[]>>({})

  const toggle = (tipoIdx: number, senalIdx: number) => {
    setChecks(prev => {
      const key = String(tipoIdx)
      const arr = prev[key] || [false, false, false, false]
      const next = [...arr]
      next[senalIdx] = !next[senalIdx]
      return { ...prev, [key]: next }
    })
  }

  const counts = tipos.map((_, i) => {
    const arr = checks[String(i)] || [false, false, false, false]
    return arr.filter(Boolean).length
  })
  const maxCount = Math.max(...counts, 0)
  const winnerIdx = maxCount > 0 ? counts.indexOf(maxCount) : -1

  const whatsappUrl = winnerIdx >= 0
    ? `https://wa.me/${numeroWhatsApp}?text=Hola%2C%20me%20identifique%20con%20${encodeURIComponent(tipos[winnerIdx].nombre)}.%20Quiero%20orientacion.`
    : `https://wa.me/${numeroWhatsApp}?text=${palabraClave}`

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 24, textAlign: "center" }}>
        Cual es tu tipo?
      </h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 32, fontSize: 16 }}>
        Marca las senales que te describan. Tu tipo dominante se resaltara automaticamente.
      </p>

      {tipos.map((tipo, i) => {
        const isWinner = i === winnerIdx
        const senales = [tipo.senal1, tipo.senal2, tipo.senal3, tipo.senal4]
        const arr = checks[String(i)] || [false, false, false, false]
        return (
          <div key={i} style={{
            border: isWinner ? `2px solid ${colorAcento}` : "1px solid #e0e0e0",
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
            background: isWinner ? `${colorAcento}08` : "#fff",
            transition: "all 0.3s ease"
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colorAcento, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              Tipo {i + 1}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
              {tipo.nombre}
            </div>
            {senales.map((s, j) => (
              <label key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer", fontSize: 15, color: "#333" }}>
                <input type="checkbox" checked={arr[j]} onChange={() => toggle(i, j)}
                  style={{ width: 18, height: 18, accentColor: colorAcento }} />
                {s}
              </label>
            ))}
            {isWinner && (
              <div style={{ marginTop: 16, padding: 16, background: `${colorAcento}12`, borderRadius: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colorAcento, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                  Tu tipo dominante
                </div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  Producto recomendado: {tipo.productoNombre}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {winnerIdx >= 0 && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
          display: "block", textAlign: "center", padding: "16px 32px",
          background: colorAcento, color: "#fff", borderRadius: 8,
          fontSize: 18, fontWeight: 600, textDecoration: "none", marginTop: 24
        }}>
          Escribe {palabraClave} por WhatsApp
        </a>
      )}
    </div>
  )
}

addPropertyControls(TestTipos, {
  tipos: { type: ControlType.String, title: "Tipos (JSON)", defaultValue: "[]" },
  palabraClave: { type: ControlType.String, title: "Palabra clave", defaultValue: "ENERGIA" },
  numeroWhatsApp: { type: ControlType.String, title: "WhatsApp", defaultValue: "5215512345678" },
  colorAcento: { type: ControlType.Color, title: "Color acento", defaultValue: "#2E7D32" },
})
```

- [ ] **Step 2: Insertar el componente en la plantilla**

Colocar el Code Component en la seccion 3 de la plantilla (entre la base transversal y los tipos en detalle). Conectar las props con los datos del CMS.

- [ ] **Step 3: Probar el test**

Verificar que:
- Los checkboxes funcionan
- El tipo con mas marcas se resalta
- El producto recomendado aparece
- El boton de WhatsApp genera el link correcto con el tipo identificado

---

### Task 5: Crear pagina indice

**Interfaces:**
- Consumes: Coleccion Temas
- Produces: Pagina `/temas` con grid de tarjetas que lleva a cada tema

- [ ] **Step 1: Crear pagina en Framer**

Crear nueva pagina en la ruta que se defina (puede ser `/temas`, `/wellbive` o dentro de la navegacion existente).

- [ ] **Step 2: Agregar CMS List de Temas**

Insertar una lista de coleccion (CMS List) filtrada por `Activo = true`, ordenada por `Orden`. Cada item muestra:
- Imagen de portada
- Titulo
- Subtitulo
- Link a `/[slug]`

- [ ] **Step 3: Disenar las tarjetas**

Grid responsivo: 1 col movil, 2 col tablet, 3 col desktop. Tarjetas con hover sutil, imagen arriba, texto abajo.

- [ ] **Step 4: Verificar navegacion**

Probar que cada tarjeta lleva a la pagina correcta del tema.

---

### Task 6: Subir folletos PDF y verificar links

**Interfaces:**
- Consumes: PDFs exportados de folletos
- Produces: PDFs accesibles desde cada pagina de tema

- [ ] **Step 1: Subir PDFs a Framer**

Subir los folletos existentes al campo "Folleto PDF" de cada tema en la coleccion:
- `folleto-energia.pdf` → tema Energia
- `folleto-estres.pdf` → tema Estres (necesita exportarse)
- Digestion y Calma: marcar como pendientes si no existen

- [ ] **Step 2: Verificar boton de descarga**

En cada pagina de tema, verificar que el boton "Descargar PDF" funcione y descargue el archivo correcto.

- [ ] **Step 3: Verificar links de WhatsApp**

En cada pagina, verificar que el boton de WhatsApp abra `wa.me` con el numero correcto y la palabra clave correcta.

- [ ] **Step 4: Publicar**

Publicar el sitio en Framer. Verificar que las paginas sean accesibles en las rutas publicas.

- [ ] **Step 5: Commit del plan completado**

```bash
git add docs/superpowers/plans/2026-06-26-paginas-temas-framer.md
git commit -m "docs: plan de implementacion de paginas de temas en Framer completado"
```

---

## Resumen de entregables

| Task | Entregable | Donde |
|---|---|---|
| 1 | Script de exportacion + 3 JSONs | `herramientas/framer-export/` |
| 2 | 3 Collections en Framer CMS pobladas | Framer CMS |
| 3 | Plantilla de pagina de tema | Framer Layout Page |
| 4 | Code Component del test interactivo | Framer Code Component |
| 5 | Pagina indice con grid de temas | Framer page `/temas` |
| 6 | PDFs subidos + links verificados + publicado | Framer live |

## Dependencias externas

- Imagenes de productos (faltan la mayoria — se pueden agregar despues)
- Videos de YouTube publicados (URLs para embeber)
- Numero de WhatsApp real del Instituto
- Folletos PDF de digestion y calma (solo existen estres y energia)
