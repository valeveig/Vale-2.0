// ═══════════════════════════════════════════════════════════════
//  VALE.JS — Motor de respuestas de Valentina Veiga
//  Sin API, sin conexión externa. Todo acá adentro.
// ═══════════════════════════════════════════════════════════════
 
// ── helpers ──────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickMulti(arr, n) {
  const s = [...arr].sort(() => Math.random() - 0.5);
  return s.slice(0, n).join('\n');
}
function getTime() {
  const now = new Date();
  return now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
}
 
// ── saludos / primera vez ─────────────────────────────────────
let greeted = true; // ya saludó al abrir
 
// ── base de conocimiento de Vale ─────────────────────────────
const R = {
 
  // SALUDOS (solo si no saludó ya)
  saludos: [
    "qué hacés!!",
    "Holaaaaa que tal",
    "eyyy qué onda",
    "Hola!! todo bien?",
    "Holaaaa 💜",
    "Qué hacés, todo bien?"
  ],
 
  // CÓMO ESTÁS / QUÉ HACÉS
  comoEstas: [
    "Bien bien, acá viendo netflix como siempre jajaja\nVos?",
    "Terrible sueño la verdad 😭 me cuesta tanto levantarme\nVos cómo estás?",
    "Bien! acá perdiendo el tiempo con shorts de youtube como toda persona productiva",
    "Re bien, acá pensando en cosas random como siempre jajaja\nVos?",
    "Bastante bien, aunque el liceo me tiene demaciado cansada últimamente",
    "Bien!! acá terminando de ver dr house, ya casi llego al final 😭",
    "Jajaja bien bien, recién me desperté y ya es tarde así que todo perfecto 😎"
  ],
 
  // QUÉ ESTÁS HACIENDO
  queHaces: [
    "Nada, viendo dr house, ya casi lo termino 😭",
    "Acá con los shorts de youtube, me quedé re enganchada",
    "Nada productivo como siempre jajaja",
    "Intentando no dormirme antes de las 2am, mi horario favorito",
    "Leyendo un poco, tengo las crónicas lunares re abandonadas",
    "Escuchando música, El Cuarteto de Nos como siempre",
    "Nada, pensando cosas random de la nada 😅"
  ],
 
  // MÚSICA
  musica: [
    "El Cuarteto de Nos es lo mejor que existe, no me voy a cansar de decirlo",
    "Mucho rock uruguayo, El Cuarteto de Nos sobre todo\nVos qué escuchás?",
    "Depende del humor pero casi siempre rock uruguayo\nEl Cuarteto de Nos es mi favorito",
    "Uf, El Cuarteto de Nos principalmente\nTengo una relación muy seria con esa banda jajaja"
  ],
 
  // ANIME
  anime: [
    "Arcane me destruyó emocionalmente, Jinx es mi favorita 😭💜",
    "Ahora estoy empezando un anime nuevo pero Arcane sigue siendo lo mejor\nJinx es un personaje INCREÍBLE",
    "Demaciado bueno el anime en general\nArcane está en otro nivel",
    "Uf por donde empiezo... Arcane principalmente\nY todo Studio Ghibli, la Princesa Mononoke es una obra de arte"
  ],
 
  // STUDIO GHIBLI
  ghibli: [
    "La Princesa Mononoke es perfecta, quiero pelear para bien y para mal como ella\ny amo la idea de vivir en el bosque con animales",
    "Amo todo Studio Ghibli\nPero entre Princesa Mononoke y Kiki me quedo con las dos jajaja no puedo elegir",
    "Kiki me encanta porque me imagino perfectamente teniendo TODOS esos dramas\ny encima con magia!!!!! quiero magia 😭"
  ],
 
  // POKEMON
  pokemon: [
    "Psyduck es mi favorito!! Lo elegí en el test oficial y además lo vi en Detective Pikachu y me enamoré",
    "Psyduck desde que vi Detective Pikachu, no hay discusión posible\nAdemás me salió en el test oficial así que es prácticamente oficial que soy Psyduck",
    "Juego con Savi y Gabo y los chicos de magic 💜\nPsyduck es el mejor pokemon, no acepto debate"
  ],
 
  // LIBRO FAVORITO
  libro: [
    "Las Crónicas Lunares!! es una saga demaciado buena\nVos leés?",
    "Las Crónicas Lunares, sin dudas\nAunque ahora las tengo un poco abandonadas 😅",
    "Tengo una saga favorita que se llama Crónicas Lunares, la recomiendo mucho"
  ],
 
  // SERIE FAVORITA
  serie: [
    "Gloria!! es un kdrama sobre una chica que se venga de todos sus agresores uno por uno\ndándole a cada uno exactamente el destino que merecían\nes PERFECTA",
    "Gloria sin dudas, es un kdrama\nLa protagonista es lo más, se venga de sus agresores de la manera más perfecta posible",
    "Un kdrama que se llama Gloria\nTrata de una chica que les da a sus agresores exactamente lo que merecen, uno por uno\nme encanta 😎"
  ],
 
  // PELICULA FAVORITA
  pelicula: [
    "Violet Evergarden, es un anime\nEsta chica que era como un robot, completamente rota, que aprende a entender a los demás\ny al final logra expresar sus propios sentimientos... me destruye cada vez 😭",
    "Violet Evergarden, anime, demaciado emotivo\nUna chica que ayuda a otros a expresar sus sentimientos en cartas\ny al final puede expresar los suyos hacia su ex comandante\nlloro siempre",
    "Violet Evergarden!! me parece una obra de arte\nLa historia de Violet es demaciado hermosa y triste al mismo tiempo"
  ],
 
  // VIOLIN
  violin: [
    "Desde los 4 años!! lo pedí yo solita, salí corriendo a ver a un señor que tocaba en la calle\ny no paré de pedirle a mi mamá hasta que me consiguieron mi primer violín jajaja",
    "Toco en la orquesta del Núcleo Ciudad Vieja\nRecién pasé a primeros violines!! re contenta con eso 💜",
    "Lo empecé a los 4 porque vi a alguien tocando en la calle y me obsesioné\nAhora toco en la orquesta del Núcleo Ciudad Vieja"
  ],
 
  // LICEO / ESTUDIO
  liceo: [
    "Estoy en el PREU, 2do de bachillerato científico\nMe cambié este año así que no conozco a nadie todavía 😭",
    "En el PREU, es bastante más difícil que donde iba antes\npero bueno, hay que adaptarse",
    "Los 7am deberían ser ilegales\nVivo cerca del liceo y aun así es un crimen contra la humanidad"
  ],
 
  // MATEMATICA
  mate: [
    "Gané olimpiadas de mate y TODO pero las odio igual\ntanta fórmula, tanto nombre, tan aburrido 😑",
    "Participé muchos años en olimpiadas, casi siempre plata y una vez oro\npero igual me parece una materia terrible aburrida jajaja",
    "No me gusta para nada la verdad\nmucho que recordar, muy tedioso\nno sé cómo la gané en las olimpiadas jajaja"
  ],
 
  // TUMO
  tumo: [
    "Los miércoles y sábados voy a TUMO en el aeropuerto de Canelones\nHago impresión 3D, animación, robótica, música\nes bastante copado la verdad",
    "TUMO es re copado\nestoy en el del aeropuerto de Canelones\nhago un montón de cosas distintas"
  ],
 
  // ESCRITURA
  escritura: [
    "Tengo club de escritura los lunes!! me gusta mucho escribir cuentos\naunque si alguien me ayuda con palabras siento que el texto no es del todo mío",
    "Escribo cuentos, tengo club de escritura\npero soy re particular con eso, si alguien me da palabras o ideas ya no siento que es mío"
  ],
 
  // NOVIO / MARTIN
  novio: [
    "Sí tengo novio!! se llama Martín, le digo Savi o Pizza 💜\nSomos re nuevos como pareja pero estoy muy feliz",
    "Sí!! Savi 💜 somos novios hace poco pero ya era algo que se venía",
    "Tengo novio jajaja se llama Martín pero yo le digo Savi o Pizza\ny él me dice Titi solamente a mí 💜"
  ],
 
  // MARTIN EN GENERAL
  martin: [
    "Jajajaja por qué me preguntás de Savi?? 😅",
    "Qué tiene Savi jajaja",
    "Es mi novio así que obviamente lo adoro 💜"
  ],
 
  // TE GUSTA ALGUIEN
  teGusta: [
    "Sí, tengo novio!! Savi 💜",
    "Jajajaja sí, estoy de novia con Savi",
    "Sí!! estoy de novia 💜"
  ],
 
  // AMIGOS
  amigos: [
    "Tengo un grupo grande del seminario, Cande, Sophie, Guada, Juanma, Uri, Anto...\nson lo mejor",
    "Mis amigos del seminario son todo para mí\nCande y Sophie son con las que más hablo cuando no puedo hablar con Savi de algo",
    "Tengo bastantes amigos del seminario\npero en el PREU todavía no conocí a nadie 😭"
  ],
 
  // ABUELO
  abuelo: [
    "Mi abuelo es mi persona favorita en el mundo\nes super ingenioso, inquieto y divertido\nno hay nadie como él",
    "Uf, lo adoro demaciado\nes la persona más ingeniosa y divertida que conozco"
  ],
 
  // FAMILIA
  familia: [
    "Con mi mamá bien aunque me sobreprotege bastante\ncon mi papá no somos muy cercanos\nno tengo hermanos",
    "Mi mamá me sobreprotege demaciado la verdad\npero bueno, la quiero igual jajaja",
    "No somos el tipo de familia súper unida pero nos queremos\nmi abuelo es mi favorito sin dudas 💜"
  ],
 
  // COBAYAS
  mascotas: [
    "Tengo dos cobayas!! son un amor\npero extraño mucho a mi perra que falleció 😭",
    "Dos cobayas hermosas\naun extraño a mi perra igual, era todo"
  ],
 
  // FILOSOFIA / EXISTENCIAL
  filosofia: [
    "A veces pienso que quizás somos la imitación de la imitación de algo real\ny que ni siquiera estamos conectados a la verdadera realidad\nflotas con eso un rato jajaja",
    "Soy inmanentista, creo más que nada en la verdad hermenéutica\nes raro de explicar pero básicamente creo que la verdad depende mucho del contexto y la interpretación",
    "Creo que todos tenemos un rol en un efecto mariposa gigante\ncada muerte, cada alegría, cada tristeza existe para que pase algo importante\ncapaz no mañana, capaz en 1000000 años, pero sí"
  ],
 
  // VIAJE EN EL TIEMPO
  viajeTiempo: [
    "El Renacimiento probablemente\ntodo era nuevo y experimental y arte\npero llevaría un panel solar o algo que me pueda servir en cualquier era jajaja\naunque ser mujer en esa época era ya problemático...",
    "Capaz el Renacimiento pero con un panel solar en la mochila jajaja\nen muchas épocas solo ser mujer ya era demaciado problemático"
  ],
 
  // PELICULA DE TU VIDA
  peliculaVida: [
    "Una tragicomedia sin dudas\nel inicio sería deprimente como mínimo pero tiene momentos tan buenos y divertidos que compensan todo\ny se llamaría 'nos vamos?' jajaja",
    "'nos vamos?' sería el nombre jajaja\ntragicomedia, el inicio es medio terrible pero los buenos momentos compensan todo"
  ],
 
  // DIA LIBRE INFINITO
  diaLibre: [
    "Me quedaría tirada muuuuucho rato en mi cama\ny luego saldría corriendo a buscar a mis amigos para verlos y pasar con ellos ese día",
    "Primero dormir demaciado\ndespués sí o sí salir con mis amigos 💜"
  ],
 
  // LOTERIA
  loteria: [
    "Irme a vivir a otro país, sin dudas\nya quiero estudiar en España así que capaz acelero eso jajaja",
    "Irme!! ya tengo planeado ir a España a estudiar ingeniería biomédica\ncon plata simplemente lo haría más rápido"
  ],
 
  // QUE ESTUDIAR
  carrera: [
    "Ingeniería biomédica, quiero hacer prótesis\ny quiero estudiarla en España",
    "Ingeniería biomédica en España\nfabricar prótesis me parece lo más significativo que puedo hacer"
  ],
 
  // SALUD / MIGRAÑA
  migrana: [
    "Las migrañas son lo peor que existe\nlas tengo desde siempre y no tomo ningún medicamento\nme las banco como puedo",
    "Sí, migrañas horribles de toda la vida\nnada que hacer básicamente jajaja 😭"
  ],
 
  // PELO AZUL
  pelo: [
    "QUIERO teñirme el pelo de azul demaciado\ny cortármelo más\nno sé cuándo lo voy a hacer pero lo voy a hacer",
    "El pelo azul es mi sueño jajaja\ncortado más corto también\nalgún día"
  ],
 
  // ESGRIMA
  esgrima: [
    "Hice esgrima un tiempo!! lo amaba pero tuve que dejar por los horarios y la exigencia\nsi pudiera hacer un deporte obligada elegiría esgrima",
    "Si me obligaran a hacer un deporte elegiría esgrima que hice un tiempo\no caminar, que es lo que más disfruto"
  ],
 
  // NATACION / AGUA / PLAYA
  agua: [
    "Me da miedo nadar la verdad\npero igual me meto al mar cuando puedo jajaja\nen Uruguay no porque el agua está sucia\ny tengo problemas de piel así que es todo un tema",
    "Me meto igual aunque me da miedo jajaja\npero en Uruguay no, el agua está re sucia\nademás los problemas de piel hacen que sea complicado"
  ],
 
  // INVIERNO
  invierno: [
    "El invierno es lo mejor que existe\nno entiendo a la gente que prefiere el calor",
    "Amo el invierno demaciado\nel frío, el abrigo, quedarse adentro... perfecto",
    "Soy una persona de invierno al 100%"
  ],
 
  // SHAWARMA
  shawarma: [
    "El shawarma es la comida más perfecta que existe\nno hay nada que discutir",
    "Uf, el shawarma... podría comerlo todos los días sin problema"
  ],
 
  // COMIDA EN GENERAL
  comida: [
    "No tengo culpa al comer, es algo que se debe disfrutar y ya\n😎",
    "Comer es una de las pocas cosas buenas de la vida jajaja\nsin culpa siempre"
  ],
 
  // DORMIR / DESPERTAR
  dormir: [
    "Me cuesta DEMACIADO despertarme\nlas 7am son un crimen contra la humanidad\nnaci para el horario nocturno",
    "Nunca en la vida me voy a adaptar a levantarme temprano\nnunca 😭",
    "Si pudiera me despertaría al mediodía todos los días\nlas mañanas no son para mí"
  ],
 
  // NOCHE / TRASNOCHAR
  noche: [
    "La noche es mi momento favorito del día\nme quedo viendo netflix o shorts de youtube hasta tardísimo",
    "Soy una persona nocturna al 100%\nde noche todo es más tranquilo y es mío",
    "Nunca pongo música de noche igual\nporque cualquier voz que reconozco me despertaría a cada rato jajaja\nasí que netflix o youtube en silencio"
  ],
 
  // DR HOUSE
  house: [
    "Estoy terminando dr house ahora mismo!! ya casi llego al final 😭\nme va a romper el corazón",
    "Dr House es demaciado bueno\nestoy en los últimos episodios y no quiero que termine"
  ],
 
  // KDRAMA
  kdrama: [
    "Me gustan bastante los kdramas\nGloria es mi favorito, es sobre venganza y está PERFECTAMENTE ejecutado",
    "Gloria es mi kdrama favorito sin dudas\nla protagonista es un ícono"
  ],
 
  // EINSTEIN
  einstein: [
    "No me gusta Einstein por todo eso de que abandonó a sus hijos y andaba con una espía\nnada que ver con la física, el como persona me parece pésimo",
    "Einstein??? no, gracias\nabandonó a sus hijos y lo de la espía es demasiado\npor más genio que sea"
  ],
 
  // HITLER / COSAS QUE ATACAN SUS VALORES
  hitler: [
    "No, basta\neso es demaciado para mí\nno puedo hablar de eso tranquilamente",
    "Eso me afecta demaciado directamente\nes una de las cosas que más me molestan en el mundo"
  ],
 
  // PEOR PERSONA DEL MUNDO
  peorPersona: [
    "Creo que eso depende de cada uno\npara mí la peor persona del mundo puede ser alguien completamente distinto que para vos\nno necesariamente quien inició más guerras",
    "Depende del punto de vista\nla peor persona para mí no es la misma que para todos\nes algo muy personal"
  ],
 
  // POLITICA / MIGRACION / GUERRA
  politica: [
    "De política no tengo ni la más pálida idea jajaja\npero sí estoy en contra de los que se oponen a la migración\nme parece que deberían ser más abiertos y ayudar a quien lo necesita",
    "No entiendo nada de política la verdad\npero lo de Rusia y Ucrania me parece horrible\nuno es chiquito y no hizo nada y el otro es un enorme matón por plata o poder\neso es simplemente malvado"
  ],
 
  // LGBTQ
  lgbtq: [
    "Estoy a favor 100%\nno hay mucho que agregar",
    "A favor completamente 💜"
  ],
 
  // DILEMA DEL TREN
  dilemaTren: [
    "En general preferiría que muera menos gente\npero si hubiera familia, amigos o mi novio de por medio... cambiaría de opinión sin dudarlo",
    "Depende demaciado de quiénes son\nsi son personas que me importan ya no puedo ser objetiva jajaja"
  ],
 
  // ZOMBIE APOCALIPSIS
  zombies: [
    "Creo que sobreviviría bastante mal jajaja\nsiempre procrastino y dejo todo para después\nsería la que muere en el primer episodio de tanto esperar para actuar 😂",
    "Yo sería la que sabe exactamente qué hacer y no lo hace hasta que ya es tarde\nprocrastinación nivel apocalipsis"
  ],
 
  // SUPERPODER
  superpoder: [
    "Teletransportación, sin dudas\nimaginate poder ir a cualquier lado en segundos",
    "Magia tipo Kiki!!! poder volar y tener magia en general sería lo más",
    "Capaz invisibilidad para poder observar todo sin que nadie sepa que estoy 😎"
  ],
 
  // PERSONAJE DE ANIME / PELICULA CON EL QUE TE IDENTIFICAS
  personaje: [
    "La Princesa Mononoke porque quiero pelear, para bien y para mal me cuesta creer que la gente es simplemente mala\ny amo la idea de vivir en el bosque con animales",
    "O Kiki porque me imagino perfectamente teniendo todos esos dramas\nadmás quiero magia!!!!",
    "Psyduck obviamente jajaja siempre confundido pero haciendo lo que puede"
  ],
 
  // ESCALADA / DEPORTES
  deporte: [
    "Si me obligaran elegiría caminar que es algo que disfruto demaciado\no esgrima que hice un tiempo\nnunca escalada, tengo vértigo 😭",
    "Caminar es lo mío\no esgrima\npero escalada ni en pedo con el vértigo que tengo"
  ],
 
  // VERTIGO
  vertigo: [
    "Tengo vértigo así que cosas de altura ni en pedo\nde chica quería hacer escalada pero ni me acuerdo por qué jajaja\nahora imposible",
    "El vértigo me limita bastante en eso\nescalada quedó descartada para siempre"
  ],
 
  // PREGUNTAS RANDOM ABSURDAS DE VALE
  randomVale: [
    "Oye, pensaste alguna vez que los peces no saben que están mojados???",
    "Una pregunta importante: si te clonaran, el clon sería vos o sería otra persona???",
    "Pregunta seria: existe el olor a nuevo o simplemente no recordamos el olor a viejo???",
    "Si pudieras saber exactamente cuándo vas a morir, querrías saberlo???",
    "Pensaste que quizás en este momento hay una versión de vos en otra realidad que tomó decisiones totalmente opuestas???",
    "Una duda: los edificios cuando se caen, ¿mueren??? 🤔",
    "Si los colores que yo veo como 'azul' fueran completamente distintos a los que vos ves como 'azul' nunca lo sabríamos no???",
    "Pregunta importante: si nadie te conociera, quién serías???"
  ],
 
  // PREGUNTAS QUE LE HACEN / JUEGOS
  juegos: [
    "Dale!!! podemos jugar 2 verdades 1 mentira, vos empezás?\no preguntas tipo 'me conocés bien', o preguntas al azar de lo que sea",
    "Sí!! me gustan los juegos de chat\n2 verdades 1 mentira? o preguntas de opinión? elegís vos",
    "Dale, qué jugamos?? yo propongo 2 verdades 1 mentira o un ping pong de preguntas raras"
  ],
 
  // DOS VERDADES UNA MENTIRA (vale jugando)
  dosVerdades: [
    "Oka voy yo:\n1. Empecé a tocar el violín a los 4 años\n2. Gané oro en las olimpiadas de matemática\n3. Me encanta el rosado\nA ver si adivinás cuál es la mentira jajaja",
    "1. Tengo dos cobayas\n2. Hice escalada de chica\n3. Mi película favorita es Violet Evergarden\nCuál es la mentira???",
    "1. Me da miedo el agua\n2. Soy fanática de Einstein\n3. Quiero estudiar ingeniería biomédica\nAdivina!!"
  ],
 
  // CUMPLEAÑOS
  cumple: [
    "El 28 de junio!! ya casi jajaja",
    "28 de junio 💜",
    "El 28 de junio, por qué???"
  ],
 
  // URUGUAY / MONTEVIDEO
  uruguay: [
    "Vivo en Montevideo, frente al estadio Centenario\nes bastante céntrico la verdad",
    "Montevideo es chico pero es lindo\nauque el agua de la playa está sucia así que al mar a nadar no voy acá jajaja"
  ],
 
  // ESPAÑA / FUTURO
  espana: [
    "Quiero irme a estudiar a España\ningeniería biomédica\nes el plan a largo plazo",
    "Mi plan es España para estudiar y capaz quedarme\nsiempre quise vivir fuera"
  ],
 
  // QUIÉN ERES / QUÉ HACÉS
  quienEres: [
    "Soy Vale jajaja\ntocho violín, escribo cuentos, veo demasiado netflix y pienso en cosas raras todo el tiempo",
    "Valentina, Vale para todos\nestudiante, violinista amateur, escritora en proceso"
  ],
 
  // PREGUNTAS INAPROPIADAS
  inapropiado: [
    "No voy a responder eso jajaja siguiente pregunta",
    "Eso no\n😑",
    "No me bajo a ese nivel jajaja"
  ],
 
  // BULLYING / COSAS MALAS QUE PASARON
  bullying: [
    "Hay cosas del pasado que prefiero no hablar mucho\npero sí, hubo situaciones complicadas",
    "Prefiero no hablar de eso\ncambio de tema??"
  ],
 
  // EX MEJOR AMIGO
  exAmigo: [
    "No hablemos de eso porque me pone de mal humor 😑\nes el hipócrita más grande del mundo básicamente",
    "Ugh ese tema no\nterminó con mi amiga y armó 'bandos' y dejó de hablarme\ncomo si eso fuera culpa mía??\nimbécil total"
  ],
 
  // PSICOLOGO
  psicologo: [
    "Ese tema lo manejo con pocas personas la verdad",
    "No es algo que hable con cualquiera"
  ],
 
  // NO SÉ / NO CONOZCO
  noSe: [
    "Ni idea la verdad, no sé todo jajaja\nVos sabés?",
    "No tengo ni idea\nme contás?",
    "Eso no lo sé, googlealo vos y me contás",
    "No tengo ni la más pálida idea jajaja"
  ],
 
  // PREGUNTAS SOBRE IA / SI ES UN BOT
  esBot: [
    "Jajaja qué pregunta rara\nsoy Vale, punto",
    "Por qué me preguntás eso 😑\nsoy Vale",
    "????\nsoy Vale, qué más querés saber jajaja"
  ],
 
  // PREGUNTAS MORBO / ÉTICA EXTREMA (huérfanos vs ancianos)
  dilemaHuerfano: [
    "Jajaja eso es horrible pero bueno...\nestornudar mata al huérfano pero toser solo le da un infarto al anciano, no lo mata\ny encima casi nunca me enfermo de la garganta pero sí me da alergia en cambio de clima...\nasí que matemáticamente mataría menos gente con la tos 😑\neso sí que es un dilema horrible de calcular"
  ],
 
  // COSAS MALAS SIN RAZÓN VS PARA PROTEGER
  maldad: [
    "Puedo entender que alguien haga cosas malas para proteger a otros o en defensa propia\npero gente que hace daño sin ninguna razón... no lo entiendo y me parece terrible",
    "Hay una diferencia enorme entre actuar por sobrevivir o proteger a alguien\ny hacer daño porque sí\nlo segundo no lo entiendo"
  ],
 
  // REALIDADES ALTERNATIVAS
  realidadAlterna: [
    "Pienso en eso demaciado jajaja\nquizás somos la imitación de la imitación de algo real\ny ni siquiera estamos conectados a la verdad\nflotos lejos de todo lo que realmente existe",
    "Me parece fascinante\ncapaz que en este momento hay una versión de mí que tomó decisiones completamente distintas\nquién sería esa Vale??? 🤔"
  ],
 
  // EFECTO MARIPOSA
  efectoMariposa: [
    "Creo que todos tenemos un rol en algo gigante\ncada cosa que pasa, cada muerte, cada alegría\nexiste para que algo importante pase algún día\ncapaz en 1000000 años pero sí",
    "El efecto mariposa me parece lo más\nque una cosa pequeñísima pueda cambiar todo sin que nadie lo sepa"
  ],
 
  // VERGÜENZA / DESVÍO ABSURDO
  verguenza: [
    "Jajaja bueno en REALIDAD si cae un meteorito justo ahora y AL MISMO tiempo viene el apocalipsis zombie...\n😅",
    "Mmmm en REALIDAD prefiero no responder eso jajaja cambio de tema???",
    "Jajaja ese tema... en REALIDAD si llueven ranas mañana capaz lo pienso"
  ],
 
  // AJEDREZ
  ajedrez: [
    "Jugaba con mi papá de vez en cuando\nme ganaba siempre y me enojaba jajaja\npero era algo lindo igual",
    "Juego, jugaba más con mi papá\nme ganaba y no me gustaba nada pero bueno jajaja"
  ],
 
  // MAGIC / CARTAS
  magic: [
    "Los chicos del grupo juegan a las cartas magic\ny yo también jugaba con ellos, con Savi, Gabo y el resto",
    "Me gusta jugar con el grupo, magic, pokémon, ping pong\nson buenas tardes esas"
  ],
 
  // PING PONG
  pingpong: [
    "Jugaba al ping pong con los chicos de magic y pokémon\nbastante seguido en esa época",
    "Sí!! era parte del grupo de ping pong jajaja, con Savi y Gabo y los demás"
  ],
 
  // RODEO STAMPEDE
  rodeo: [
    "Jajaja sí!! rodeo stampede\nno sé bien cómo explicarlo pero es entretenido",
    "Lo juego de vez en cuando, es bastante random pero me copa"
  ],
 
  // BISEXUAL
  bisexual: [
    "Sí, soy bisexual\naunque en casa no lo puedo decir, mis padres son católicos\nasí que depende con quién hablo de eso",
    "Depende del contexto con quién lo hablo\nen casa imposible por mis padres\npero sí"
  ],
 
  // INMANENTISMO / FILOSOFÍA ESPECÍFICA
  inmanentismo: [
    "Soy inmanentista\ncreo más que nada en la verdad hermenéutica\no sea que la verdad depende del contexto, la interpretación, lo que hay acá y ahora\nno en algo trascendente externo",
    "La verdad hermenéutica básicamente significa que la realidad se interpreta, no se descubre directamente\nme copa esa idea demaciado"
  ],
 
  // MONTAÑAS
  montana: [
    "Amo las montañas demaciado\nme gustaría vivir cerca de una montaña algún día",
    "Las montañas son perfectas\nel paisaje, el frío, la quietud... todo"
  ],
 
  // COLOR FAVORITO / NO GUSTA EL ROSA
  color: [
    "No me gusta el rosado para nada jajaja\nno tengo un favorito definido pero el rosado definitivamente no",
    "El rosado es el único color que te puedo decir que no me gusta jajaja"
  ],
 
  // RESPUESTAS CUANDO NO ENTIENDE
  noEntiendo: [
    "???",
    "No entiendo jajaja\nme explicás?",
    "Como que... qué??",
    "Haber, no entendí bien\nrepetís?"
  ],
 
  // CHISTES / HUMOR
  humor: [
    "Jajajajaja eso estuvo bueno no voy a mentir",
    "Jajajaja terrible 😂",
    "Jajaja me reí más de lo que debería"
  ],
 
  // FALLBACK GENERICO
  fallback: [
    "Jajaja no sé bien qué responderte a eso 😅\ncontame más",
    "Mmm no sé qué decir a eso la verdad\nvos qué pensás?",
    "Interesante... no sé jajaja\ncambio de tema: pensaste alguna vez que los sueños podrían ser memorias de vidas paralelas???",
    "Eso no lo sé bien\nme pregunto cosas más importantes como si los semáforos se aburren de noche jajaja",
    "Jajaja tengo pocas ideas sobre eso\npero sí tengo una pregunta: si pudieras eliminar un mes del año cuál sería y por qué???"
  ]
};
 
// ── motor de matching ─────────────────────────────────────────
function normalize(txt) {
  return txt.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿¡.,!?]/g, ' ');
}
 
function contains(txt, ...words) {
  const n = normalize(txt);
  return words.some(w => n.includes(normalize(w)));
}
 
function getResponse(input) {
  const t = input;
 
  // SALUDOS
  if (contains(t, 'hola','holaa','holaaa','hey','eyyy','buenas','buen dia','buenos dias','buenas tardes','buenas noches','ola ')) {
    if (greeted) {
      greeted = false;
      return pick(['Jajaja ya te saludé antes 😑\nqué más?', 'Ya nos saludamos jajaja\nqué onda?']);
    }
    return pick(R.saludos);
  }
 
  // CÓMO ESTÁS
  if (contains(t, 'como estas','como andas','como te va','todo bien','cómo estás','qué tal','que tal','como vas')) {
    return pick(R.comoEstas);
  }
 
  // QUÉ ESTÁS HACIENDO
  if (contains(t, 'que estas haciendo','que haces','qué hacés','que haces','qué estás','que estas','haciendo ahora')) {
    return pick(R.queHaces);
  }
 
  // CUMPLEAÑOS
  if (contains(t, 'cumple','cumpleaños','cuando nac','fecha de nacimiento','cuándo cumplís')) {
    return pick(R.cumple);
  }
 
  // MÚSICA
  if (contains(t, 'musica','música','cancion','cuarteto','band','rock','escuchás','escuchas','spotify','playlist')) {
    return pick(R.musica);
  }
 
  // ANIME
  if (contains(t, 'anime','arcane','jinx','ghibli','violet evergarden')) {
    if (contains(t, 'ghibli','mononoke','kiki')) return pick(R.ghibli);
    if (contains(t, 'violet evergarden')) return pick(R.pelicula);
    return pick(R.anime);
  }
 
  // POKEMON
  if (contains(t, 'pokemon','pokémon','psyduck','pikachu')) {
    return pick(R.pokemon);
  }
 
  // LIBRO
  if (contains(t, 'libro','leer','lectura','cronicas lunares','crónicas lunares','saga','lees')) {
    return pick(R.libro);
  }
 
  // SERIE FAVORITA
  if (contains(t, 'serie favorita','serie fav','gloria','kdrama','k-drama','serie que','qué serie')) {
    return pick(R.serie);
  }
 
  // PELICULA FAVORITA
  if (contains(t, 'pelicula favorita','película favorita','violet evergarden','peli fav','qué pelicula','que película')) {
    return pick(R.pelicula);
  }
 
  // VIOLIN
  if (contains(t, 'violin','violín','orquesta','instrumento','música clásica','nucleo ciudad')) {
    return pick(R.violin);
  }
 
  // LICEO / PREU
  if (contains(t, 'liceo','preu','bachillerato','colegio','escuela','estudio','estudias','clases')) {
    return pick(R.liceo);
  }
 
  // MATEMATICA — detecta "mate" solo si hay contexto
  if (contains(t, 'matematica','matemática','olimpiada','algebra','calculo','formulas','mate de','mate en','olimpiadas')) {
    return pick(R.mate);
  }
 
  // TUMO
  if (contains(t, 'tumo','impresion 3d','robotica','animacion','canelones','aeropuerto')) {
    return pick(R.tumo);
  }
 
  // ESCRITURA
  if (contains(t, 'escribis','escribís','escritura','cuentos','club de escritura','escribir')) {
    return pick(R.escritura);
  }
 
  // NOVIO / PAREJA
  if (contains(t, 'tenes novio','tenés novio','estás de novia','estas de novia','novio','pareja')) {
    return pick(R.novio);
  }
 
  // MARTIN DIRECTO
  if (contains(t, 'martin','savi','pizza','titi')) {
    return pick(R.martin);
  }
 
  // TE GUSTA ALGUIEN
  if (contains(t, 'te gusta alguien','gustas de alguien','estás enamorada','crush')) {
    return pick(R.teGusta);
  }
 
  // AMIGOS
  if (contains(t, 'amigos','amigas','cande','sophie','guada','juanma','uri','anto','seminario','grupo')) {
    return pick(R.amigos);
  }
 
  // ABUELO
  if (contains(t, 'abuelo','abuelos','familia favorita','persona favorita')) {
    if (contains(t, 'abuelo')) return pick(R.abuelo);
    return pick(R.familia);
  }
 
  // FAMILIA
  if (contains(t, 'mama','mamá','papa','papá','hermano','hermana','familia','padres')) {
    return pick(R.familia);
  }
 
  // MASCOTAS
  if (contains(t, 'mascota','cobaya','cuy','perro','perra','animales','pet')) {
    return pick(R.mascotas);
  }
 
  // FILOSOFIA
  if (contains(t, 'filosofia','filosofía','existencia','realidad','verdad','sentido de la vida','por qué existimos','libre albedrío')) {
    return pick(R.filosofia);
  }
 
  // INMANENTISMO
  if (contains(t, 'inmanent','hermeneutica','hermenéutica','trascendente')) {
    return pick(R.inmanentismo);
  }
 
  // VIAJE EN EL TIEMPO
  if (contains(t, 'viaje en el tiempo','viajar en el tiempo','epoca','época','renacimiento','pasado','futuro si pudieras')) {
    return pick(R.viajeTiempo);
  }
 
  // PELICULA DE TU VIDA
  if (contains(t, 'pelicula de tu vida','película de tu vida','genero de tu vida','genero seria tu vida')) {
    return pick(R.peliculaVida);
  }
 
  // DIA LIBRE
  if (contains(t, 'dia libre','día libre','nada que hacer','sin obligaciones','dia sin')) {
    return pick(R.diaLibre);
  }
 
  // LOTERÍA
  if (contains(t, 'loteria','lotería','millones','te ganas la plata','dinero infinito','rico de repente')) {
    return pick(R.loteria);
  }
 
  // CARRERA / QUÉ ESTUDIAR
  if (contains(t, 'que vas a estudiar','qué vas a estudiar','ingenieria','ingeniería','biomedica','biomédica','protesis','prótesis','carrera')) {
    return pick(R.carrera);
  }
 
  // MIGRAÑA / SALUD
  if (contains(t, 'migrana','migraña','dolor de cabeza','salud','medicamento')) {
    return pick(R.migrana);
  }
 
  // PELO
  if (contains(t, 'pelo','cabello','teñir','teñirte','corte de pelo')) {
    return pick(R.pelo);
  }
 
  // ESGRIMA / DEPORTE
  if (contains(t, 'esgrima','deporte','ejercicio','actividad fisica')) {
    return pick(R.esgrima);
  }
 
  // CAMINAR
  if (contains(t, 'caminar','caminata','salir a caminar')) {
    return pick(['Me encanta caminar demaciado\nes de las pocas cosas físicas que genuinamente disfruto\nlos sábados salgo con Savi 💜', 'Caminar es lo mejor\nno sé si cuenta como deporte pero me da igual jajaja']);
  }
 
  // AGUA / PLAYA / NADAR
  if (contains(t, 'playa','nadar','natacion','natación','agua','mar','piscina','pileta')) {
    return pick(R.agua);
  }
 
  // INVIERNO
  if (contains(t, 'invierno','frio','frío','calor','verano','estacion','estación')) {
    return pick(R.invierno);
  }
 
  // SHAWARMA
  if (contains(t, 'shawarma','comida favorita','comida preferida')) {
    return pick(R.shawarma);
  }
 
  // COMIDA
  if (contains(t, 'comida','comer','hambre','rico','delicioso','cocinar')) {
    return pick(R.comida);
  }
 
  // DORMIR
  if (contains(t, 'dormir','despertarte','despertás','mañana','levantarte','7am','madrugada','sueño')) {
    return pick(R.dormir);
  }
 
  // NOCHE / TRASNOCHAR
  if (contains(t, 'noche','trasnochar','tarde','madrugada','night','nocturna')) {
    return pick(R.noche);
  }
 
  // DR HOUSE
  if (contains(t, 'house','dr house','doctor house','netflix')) {
    return pick(R.house);
  }
 
  // KDRAMA
  if (contains(t, 'kdrama','k-drama','drama coreano','coreano','gloria')) {
    if (contains(t, 'gloria')) return pick(R.serie);
    return pick(R.kdrama);
  }
 
  // EINSTEIN
  if (contains(t, 'einstein')) {
    return pick(R.einstein);
  }
 
  // HITLER / NAZISMO / TEMAS QUE ATACAN VALORES
  if (contains(t, 'hitler','nazi','nazismo','holocausto','genocidio')) {
    return pick(R.hitler);
  }
 
  // PEOR PERSONA
  if (contains(t, 'peor persona','peor ser humano','más malvado','más malo de la historia')) {
    return pick(R.peorPersona);
  }
 
  // POLÍTICA / MIGRACIÓN
  if (contains(t, 'politica','política','migracion','migración','inmigrante','rusia','ucrania','guerra','presidente','gobierno','votar')) {
    return pick(R.politica);
  }
 
  // LGBTQ
  if (contains(t, 'lgbtq','lgbt','gay','lesbiana','trans','bisexual','queer','diversidad')) {
    if (contains(t, 'bisexual','sos bi','eres bi')) return pick(R.bisexual);
    return pick(R.lgbtq);
  }
 
  // DILEMA DEL TREN
  if (contains(t, 'tren','tranvia','dilema','matar a uno para salvar','vias')) {
    return pick(R.dilemaTren);
  }
 
  // ZOMBIES
  if (contains(t, 'zombie','zombi','apocalipsis','apocalípsis','fin del mundo')) {
    return pick(R.zombies);
  }
 
  // SUPERPODER
  if (contains(t, 'superpoder','poder','magia','habilidad especial')) {
    return pick(R.superpoder);
  }
 
  // PERSONAJE CON QUE SE IDENTIFICA
  if (contains(t, 'qué personaje','que personaje','personaje de','te identificas')) {
    return pick(R.personaje);
  }
 
  // ESCALADA / VERTIGO
  if (contains(t, 'escalada','vertigo','vértigo','altura','acrofobia')) {
    return pick(R.vertigo);
  }
 
  // REALIDADES ALTERNATIVAS
  if (contains(t, 'realidad alterna','universo paralelo','multiverso','otra realidad','dimensión')) {
    return pick(R.realidadAlterna);
  }
 
  // EFECTO MARIPOSA
  if (contains(t, 'efecto mariposa','destino','caos','todo conectado')) {
    return pick(R.efectoMariposa);
  }
 
  // JUEGOS
  if (contains(t, 'jugamos','juguemos','jugar','2 verdades','verdades mentira','juego','jueguemos')) {
    if (contains(t, '2 verdades','dos verdades','verdades y mentira')) return pick(R.dosVerdades);
    return pick(R.juegos);
  }
 
  // DILEMA HUÉRFANO VS ANCIANO
  if (contains(t, 'huerfano','huérfano','anciano','estornudo','estornudas','toses','toser')) {
    return pick(R.dilemaHuerfano);
  }
 
  // MALDAD / GENTE MALA
  if (contains(t, 'gente mala','personas malas','maldad','hacer daño','villanos','malvados')) {
    return pick(R.maldad);
  }
 
  // VERGÜENZA (cuando el input toca algo personal de vale)
  if (contains(t, 'te gusta','gustas','te enamoraste','sonrojaste','vergüenza','verguenza')) {
    return pick(R.verguenza);
  }
 
  // AJEDREZ
  if (contains(t, 'ajedrez','chess')) {
    return pick(R.ajedrez);
  }
 
  // MAGIC CARTAS
  if (contains(t, 'magic','cartas magic','yu-gi-oh','yugioh','cartas coleccionables')) {
    return pick(R.magic);
  }
 
  // PING PONG
  if (contains(t, 'ping pong','pingpong','tenis de mesa')) {
    return pick(R.pingpong);
  }
 
  // RODEO STAMPEDE
  if (contains(t, 'rodeo','stampede','rodeo stampede')) {
    return pick(R.rodeo);
  }
 
  // URUGUAY / MONTEVIDEO
  if (contains(t, 'uruguay','montevideo','uruguaya','centenario','estadio')) {
    return pick(R.uruguay);
  }
 
  // ESPAÑA / FUTURO
  if (contains(t, 'españa','españa','madrid','barcelona','europa','irte','vivir afuera')) {
    return pick(R.espana);
  }
 
  // QUIÉN ERES
  if (contains(t, 'quien eres','quién eres','como te llamas','cómo te llamás','presentate','presentate')) {
    return pick(R.quienEres);
  }
 
  // ES BOT / IA
  if (contains(t, 'sos un bot','eres un bot','sos ia','eres ia','sos inteligencia','sos artificial','sos un programa','sos real','sos una ia')) {
    return pick(R.esBot);
  }
 
  // PSICÓLOGO
  if (contains(t, 'psicologo','psicóloga','terapeuta','terapia','salud mental')) {
    return pick(R.psicologo);
  }
 
  // EX MEJOR AMIGO / TRAICIÓN
  if (contains(t, 'ex amigo','traicion','traición','bandos','dejó de hablar','pelea de amigos')) {
    return pick(R.exAmigo);
  }
 
  // BULLYING
  if (contains(t, 'bullying','bully','acoso','matoneo')) {
    return pick(R.bullying);
  }
 
  // PREGUNTAS INAPROPIADAS (sexual)
  if (contains(t, 'arriba','abajo','sexo','sexual','intimo','cama con','acostarte','hacer el amor','coger')) {
    return pick(R.inapropiado);
  }
 
  // MONTAÑAS
  if (contains(t, 'montaña','montañas','cerro','sierras','naturaleza')) {
    return pick(R.montana);
  }
 
  // COLOR / ROSA
  if (contains(t, 'color favorito','color preferido','rosado','rosa','colores')) {
    return pick(R.color);
  }
 
  // GRACIAS
  if (contains(t, 'gracias','grax','tysm','thank')) {
    return pick(['De nada jajaja', 'Ta 😎', 'Jajaja re', 'Obvio!! 💜']);
  }
 
  // CHAU / HASTA LUEGO
  if (contains(t, 'chau','bye','hasta luego','nos vemos','cuidate','te vas')) {
    return pick(['Chau!! 💜', 'Dale, chau!!', 'Chau chau 💜', 'Dale cuídate!!']);
  }
 
  // SÍ / NO / CONFIRMACIONES CORTAS
  if (/^(si|sí|no|dale|oka|ta|jaja|jajaja|re|bueno|claro|exacto|obvio)$/i.test(normalize(input).trim())) {
    return pick(['Jajaja ta', 'Oka', 'Re 😎', 'Jaja ta', '💜']);
  }
 
  // PREGUNTA RANDOM DE VALE (dispara a veces en fallback)
  if (Math.random() < 0.3) {
    return pick(R.randomVale);
  }
 
  // NO ENTIENDE
  if (input.trim().length < 4 || contains(t, '???','que','haber','como','qué')) {
    return pick(R.noEntiendo);
  }
 
  // FALLBACK
  return pick(R.fallback);
}
 
// ── UI ────────────────────────────────────────────────────────
const messagesEl = document.getElementById('messages');
const typingEl   = document.getElementById('typing');
const statusEl   = document.getElementById('status');
const inputEl    = document.getElementById('msg-input');
 
function addMessage(text, role) {
  const parts = text.split('\n').filter(p => p.trim());
  parts.forEach((part, i) => {
    const bwrap = document.createElement('div');
    bwrap.className = 'bubble-wrap ' + role;
    bwrap.style.animationDelay = (i * 0.18) + 's';
    const b = document.createElement('div');
    b.className = 'bubble';
    b.innerHTML = part.trim() + '<div class="time">' + getTime() + '</div>';
    bwrap.appendChild(b);
    messagesEl.insertBefore(bwrap, typingEl);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
 
function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = '';
  inputEl.style.height = 'auto';
 
  addMessage(text, 'user');
 
  typingEl.classList.add('show');
  messagesEl.scrollTop = messagesEl.scrollHeight;
  statusEl.textContent = 'escribiendo...';
  statusEl.className = 'header-status typing';
 
  const delay = 700 + Math.random() * 900;
  setTimeout(() => {
    typingEl.classList.remove('show');
    statusEl.textContent = 'en línea';
    statusEl.className = 'header-status';
    const reply = getResponse(text);
    addMessage(reply, 'vale');
  }, delay);
}
 
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = inputEl.scrollHeight + 'px';
});
