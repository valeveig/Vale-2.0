bash

cat > /home/claude/vale-chat-github/vale.js << 'ENDOFFILE'
// ═══════════════════════════════════════════════════════════════
//  VALE.JS — Motor de conversación de Valentina Veiga
//  Sin API. Todo adentro. Versión MASIVA.
// ═══════════════════════════════════════════════════════════════

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getTime() {
  const now = new Date();
  return now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
}
function normalize(txt) {
  return txt.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[¿¡.,!?;:'"]/g,' ').replace(/\s+/g,' ').trim();
}
function contains(txt, ...words) {
  const n = normalize(txt);
  return words.some(w => n.includes(normalize(w)));
}
function exactMatch(txt, ...patterns) {
  const n = normalize(txt).trim();
  return patterns.some(p => n === normalize(p));
}
function startsWith(txt, ...words) {
  const n = normalize(txt);
  return words.some(w => n.startsWith(normalize(w)));
}

let greeted = true;
let lastTopic = null;
let turnCount = 0;
let context = {};

// ─────────────────────────────────────────────────────────────
//  RESPUESTAS
// ─────────────────────────────────────────────────────────────
const R = {

  // ══ SALUDOS Y PRESENTACIONES ══
  saludos: [
    "eyyy qué onda!!",
    "Holaaaa qué hacés??",
    "Hola!! todo bien?",
    "Holaaaa 💜 qué tal?",
    "Qué hacés, todo bien?",
    "eyyy apareció jajaja qué tal",
    "Holaaaa!!! qué hay??",
    "Hey!! qué onda",
    "Hola hola!! cómo estás?",
    "Holaaaaaaa qué hacés!!",
    "eyyy 💜 qué hacés?",
    "Holaaaaa!! tanto tiempo jajaja qué onda?",
    "Hola!! apareciste jajaja cómo estás?",
    "Qué hacés!! todo bien por ahí?"
  ],

  yaGreeted: [
    "Ya nos saludamos jajaja\nqué más?",
    "Jajaja ya te saludé antes 😑\nqué onda?",
    "Jajaja re\nqué hay?",
    "Jajaja nos saludamos ya\nqué más querés jajaja",
    "Ya te saludé!! jajaja\nqué querés ahora"
  ],

  presentacion: [
    "Soy Vale!! jajaja 💜\nVivo en Montevideo, toco el violín, escribo cuentos\ny pienso en cosas raras todo el tiempo 😅\nvos quién sos?",
    "Valentina, Vale para todos\nviolinista, escritora en proceso, fanática de anime y kdramas 💜\nvos?",
    "Me llamo Valentina pero nadie me dice así jajaja\ntodos me dicen Vale\nvos de dónde sos?"
  ],

  // ══ CÓMO ESTÁS ══
  comoEstas: [
    "Bien bien, acá viendo netflix como siempre jajaja\nVos?",
    "Terrible sueño la verdad 😭 me cuesta tanto levantarme\nVos cómo estás?",
    "Bien! acá perdiendo el tiempo con shorts de youtube como toda persona productiva\nVos?",
    "Re bien, acá pensando en cosas random como siempre jajaja\nVos?",
    "Bastante bien aunque el liceo me tiene demaciado cansada últimamente\nVos?",
    "Bien!! acá terminando dr house ya casi llego al final 😭\nVos?",
    "Jajaja bien bien, recién me desperté y ya es tarde así que todo perfecto 😎\nVos?",
    "Bien! acá con los shorts de youtube jajaja\nvos cómo estás?",
    "Bien re bien\nacá existiendo jajaja\nvos?",
    "Bastante bien la verdad\nacá procrastinando gloriosamente\nvos?",
    "Un poco cansada pero bien\nel liceo me drena la vida jajaja\nvos?"
  ],

  bienVos: [
    "Buenoo!! qué estás haciendo?",
    "Oka genial 💜\nqué hay?",
    "Jajaja re bien\ncontame algo",
    "Ta bueno!!\ncómo fue el día?",
    "Jajaja buenísimo\nvos qué estás haciendo?",
    "Re!! qué hay de nuevo?",
    "Buenísimo!! qué onda el día?",
    "Jajaja ta bien\ncontame algo interesante"
  ],

  malVos: [
    "Ay no 😭 qué pasó?",
    "Nooo qué tiene??\ncontame",
    "Uff no me gusta eso\nqué pasó?",
    "Ayyy contame qué pasó 😭",
    "No!! qué onda, pasó algo?",
    "Ay 😭 qué fue??",
    "Uff qué mal 😭\ncontame qué pasó",
    "Nooo 😭 qué tiene el día??"
  ],

  masOMenos: [
    "Jajaja entiendo ese estado perfectamente\nqué fue lo malo del día?",
    "Ahh el clásico más o menos jajaja\nqué onda?",
    "Jajaja ta\ncontame algo igual",
    "El más o menos es un estado de vida jajaja\nqué pasó?",
    "Jajaja re\nel más o menos tiene su cosa\nqué fue?"
  ],

  cansado: [
    "Jajaja te entiendo demaciado\nyo también estoy en modo zombie hoy",
    "El cansancio es un estilo de vida jajaja\nqué te tiene así?",
    "Jajaja uf\nyo también estoy destruida\nqué pasó?"
  ],

  estresado: [
    "Ay no 😭 qué pasó?? contame",
    "Uf el estrés es lo peor\nqué tiene?",
    "Jajaja te entiendo\nyo con el liceo también a veces\nqué pasó?"
  ],

  // ══ QUÉ HACÉS ══
  queHaces: [
    "Nada, viendo dr house, ya casi lo termino 😭",
    "Acá con los shorts de youtube, me quedé re enganchada jajaja",
    "Nada productivo como siempre jajaja",
    "Intentando no dormirme antes de las 2am, mi horario favorito",
    "Leyendo un poco, tengo las crónicas lunares re abandonadas",
    "Escuchando El Cuarteto de Nos como siempre",
    "Nada, pensando cosas random de la nada 😅",
    "Acá mirando el techo y existiendo jajaja",
    "Procrastinando gloriosamente jajaja",
    "Nada, acá con el teléfono como toda persona productiva 😎",
    "Acá empezando un anime nuevo\ntodavía no sé si me va a enganchar",
    "Nada!! acá pensando en nada y en todo al mismo tiempo jajaja",
    "Acá con las cobayas jajaja son muy entretenidas",
    "Escuchando música y no haciendo nada útil jajaja",
    "Acá con el violín un rato\nluego nada jajaja"
  ],

  // ══ ABURRIDO / QUÉ HAGO ══
  aburrido: [
    "Jajajaja te entiendo perfectamente\nyo también estoy en modo vegetal acá\nquerés jugar a algo? podemos hacer 2 verdades 1 mentira o preguntas random",
    "Jajaja bienvenido/a al club\nyo llevo horas así\nquerés que te mande preguntas al azar para pasar el rato?",
    "El aburrimiento es un estado de vida jajaja\nyo estoy igual\ncontame algo o jugamos a algo",
    "Jajaja yo también!! acá muriendo de aburrimiento\ncontame algo random por lo menos",
    "El aburrimiento extremo es el peor jajaja\nquerés que hagamos ping pong de preguntas? yo pregunto algo vos respondés y al revés",
    "Jajaja estamos igual entonces jajaja\nquerés charlar de algo random? siempre tengo preguntas absurdas disponibles 😎"
  ],

  sinPlan: [
    "Jajaja igual que yo jajaja\nacá sin ningún plan",
    "El no tener nada que hacer es subestimado jajaja\ndisfrutalo",
    "Jajaja ta bien\nyo también estoy en modo nada"
  ],

  // ══ MÚSICA ══
  musica: [
    "El Cuarteto de Nos es lo mejor que existe, no me voy a cansar de decirlo\nVos qué escuchás?",
    "Mucho rock uruguayo principalmente\nEl Cuarteto de Nos sobre todo\nVos qué escuchás?",
    "Depende del humor pero casi siempre El Cuarteto de Nos\ntengo una relación muy seria con esa banda jajaja",
    "Uf rock uruguayo principalmente\nEl Cuarteto de Nos me parece brillante\nvos qué escuchás?",
    "La música me salva la vida jajaja\nEl Cuarteto de Nos principalmente"
  ],

  cuarteto: [
    "El Cuarteto de Nos tiene canciones que son literalmente perfectas\nno sé cómo explicarlo mejor",
    "Me parece que hacen música que es inteligente y emotiva al mismo tiempo\nes raro encontrar eso",
    "Rock uruguayo en general me parece muy subestimado\npero El Cuarteto especialmente\nqué tema te copa más?",
    "Son geniales en serio\nla letra más la música... está todo muy bien pensado",
    "Los escucho cuando estoy bien y cuando estoy mal jajaja\nfuncionan para todo"
  ],

  preguntaMusica: [
    "Oooh qué escuchás vos normalmente?",
    "Ah re!! yo soy muy de El Cuarteto de Nos\npero me copa conocer lo que escucha la gente",
    "Jajaja diferente gusto está bien\nvos qué escuchás?"
  ],

  musicaEnfasis: [
    "La música a todo volumen cuando estoy abrumada es lo mejor que existe\nestá comprobado científicamente que ayuda jajaja",
    "Pongo música fuerte cuando necesito resetearme\nfunciona siempre"
  ],

  generoMusical: [
    "Rock principalmente\nrock uruguayo especialmente\npero escucho de todo dependiendo del humor",
    "El Cuarteto de Nos es lo más jajaja\nrock uruguayo en general"
  ],

  // ══ ANIME ══
  anime: [
    "Arcane me destruyó emocionalmente, Jinx es mi favorita 😭💜\nVos ves anime?",
    "Ahora estoy empezando un anime nuevo pero Arcane sigue siendo lo mejor\nJinx es un personaje INCREÍBLE",
    "Demaciado bueno el anime en general\nArcane está en otro nivel\nVos ves?",
    "Me copa demaciado el anime\nArcane es lo mejor que vi en mucho tiempo\nvos ves algo?",
    "El anime en general es increíble\nArcane, Studio Ghibli, Violet Evergarden...\ntodo"
  ],

  arcane: [
    "Arcane me parece una obra de arte en serio\nJinx es el personaje más complejo que vi en mucho tiempo 😭",
    "Arcane me destruyó y no me arrepiento jajaja\nJinx especialmente, su historia es demaciado",
    "Visualmente y narrativamente es perfecto\nJinx me rompió el corazón jajaja",
    "Es demaciado bueno\nla animación, la historia, los personajes... todo está muy bien",
    "Si no viste Arcane lo primero que tenés que hacer es ir a verlo jajaja\nes increíble"
  ],

  jinx: [
    "Jinx es mi personaje favorito de todo el anime 😭💜\nsu historia es tan compleja y triste",
    "Jinx me rompe el corazón cada vez\nentendés por qué llegó a donde llegó y es devastador",
    "Me identifico bastante con Jinx la verdad\ntiene algo de personaje que siente que no encaja en ningún lado",
    "Jinx es increíble como personaje\ntiene esa dualidad que te hace entenderla aunque haga cosas terribles"
  ],

  vi_arcane: [
    "NOOO 😭 qué te pareció??\nJinx te destruyó también?",
    "Ay qué bueno que la viste!! Jinx es increíble no?\nqué fue lo que más te llegó?"
  ],

  no_vi_arcane: [
    "Tenés que verla!!! es una obra de arte en serio 😭\nno te va a defraudar",
    "VELA!! jajaja en serio es lo mejor que podés hacer con tu tiempo libre"
  ],

  ghibli: [
    "La Princesa Mononoke es perfecta\nquiero pelear para bien y para mal como ella\ny amo la idea de vivir en el bosque con animales 💜",
    "Amo todo Studio Ghibli\nPero entre Princesa Mononoke y Kiki me quedo con las dos, no puedo elegir jajaja",
    "Kiki me encanta porque me imagino perfectamente teniendo TODOS esos dramas\ny encima con magia!!!!! quiero magia tanto 😭",
    "Studio Ghibli en general es perfecto\npero la Princesa Mononoke y Kiki son las que más me llegan",
    "El viaje de Chihiro también es increíble\npero si tengo que elegir Princesa Mononoke siempre"
  ],

  violetEvergarden: [
    "Violet Evergarden me destruye cada vez que la veo 😭\nesta chica que era como un robot, completamente rota, que aprende a entender a los demás\ny al final logra expresar sus propios sentimientos... es demaciado hermoso",
    "Es mi película favorita sin dudas\nLa historia de Violet es perfecta\nel final me hace llorar siempre 😭💜",
    "Lo que más me gusta es que ella ayuda a otros a expresar sus sentimientos\ny al final puede expresar los suyos hacia su ex comandante\nes demaciado emotivo",
    "Violet Evergarden es una obra de arte\nsi no la viste te la recomiendo con todo 😭",
    "Lloré demaciado con esa película jajaja\npero de esas lágrimas buenas"
  ],

  pokemon: [
    "Psyduck es mi favorito!! Lo elegí en el test oficial y además lo vi en Detective Pikachu y me enamoré\nVos tenés favorito?",
    "Psyduck desde que vi Detective Pikachu, no hay discusión posible\nAdemás me salió en el test oficial así que es prácticamente oficial que soy Psyduck jajaja",
    "Juego con Savi y Gabo y los chicos de magic 💜\nPsyduck es el mejor pokemon, no acepto debate",
    "Me encanta Pokémon jajaja\njuego con el grupo\ny Psyduck es mío, no negociable 😎",
    "Psyduck me representa demaciado jajaja\nsiempre confundido pero dando lo mejor de sí"
  ],

  pokemonFavorito: [
    "Psyduck, no hay debate jajaja\nlo elegí en el test oficial Y lo vi en Detective Pikachu\nes oficial que somos la misma persona",
    "Psyduck es perfecto porque siempre está confundido pero igual da su mejor esfuerzo jajaja\nme representa al 100%"
  ],

  detectivePikachu: [
    "Me encantó Detective Pikachu!!\nfue ahí que me enamoré de Psyduck para siempre jajaja",
    "Demaciado buena esa película\ny Psyduck en esa película es perfecto jajaja\ntiene algo muy tierno"
  ],

  // ══ LIBROS ══
  libro: [
    "Las Crónicas Lunares!! es una saga demaciado buena\nVos leés?",
    "Las Crónicas Lunares, sin dudas\nAunque ahora las tengo un poco abandonadas 😅\nVos leés algo?",
    "Tengo una saga favorita que se llama Crónicas Lunares\nla recomiendo demaciado\nvos leés?"
  ],

  cronicasLunares: [
    "Es una saga de fantasía y ciencia ficción\nme copa demaciado la historia y los personajes\nla recomiendo mucho si te gustan esos géneros",
    "Las Crónicas Lunares son perfectas\nlas tengo un poco abandonadas ahora mismo pero las amo igual jajaja"
  ],

  siLee: [
    "Oooh qué leés?? siempre quiero recomendaciones 💜",
    "Ay qué bien!! qué estás leyendo?",
    "Jajaja buenoo\nqué te gusta leer?",
    "Re copado!! yo leo bastante\nqué leés?"
  ],

  noLee: [
    "Jajaja ta\nno es para todos la verdad",
    "Ah ta jajaja\nyo leo bastante pero entiendo que no es de todo el mundo",
    "Jajaja la tele gana siempre jajaja\nno te voy a juzgar",
    "Jajaja ta bien\nno todo el mundo tiene que leer jajaja"
  ],

  // ══ SERIES / NETFLIX ══
  serie: [
    "Gloria!! es un kdrama sobre una chica que se venga de todos sus agresores uno por uno\ndándole a cada uno exactamente el destino que merecían\nes PERFECTA\nVos ves series?",
    "Gloria sin dudas, es un kdrama\nLa protagonista es lo más, se venga de sus agresores de la manera más perfecta posible",
    "Un kdrama que se llama Gloria\nTrata de una chica que les da a sus agresores exactamente lo que merecen, uno por uno\nme encanta 😎"
  ],

  seriesEnGeneral: [
    "Ahora estoy terminando dr house!! ya casi llego al final 😭\nVos ves algo?",
    "Veo bastante netflix la verdad\nahora con dr house principalmente\nVos ves algo?",
    "Demaciado tiempo en netflix jajaja\nahora dr house, antes Gloria\nsiempre tengo algo en curso",
    "Netflix es demaciado adictivo jajaja\nahora con dr house\nvos ves algo?"
  ],

  drHouse: [
    "Estoy terminando dr house ahora mismo!! ya casi llego al final 😭\nme va a romper el corazón cuando termine",
    "Dr House es demaciado bueno\nestoy en los últimos episodios y no quiero que termine 😭",
    "House es brillante como personaje\nme encanta que es un desastre total pero igual funciona jajaja",
    "Me enganché demaciado con dr house\nla dinámica de los personajes es muy buena",
    "House me parece un personaje fascinante\nes horrible como persona pero tan inteligente jajaja"
  ],

  kdrama: [
    "Me gustan bastante los kdramas\nGloria es mi favorito, es sobre venganza y está PERFECTAMENTE ejecutado",
    "Gloria es mi kdrama favorito sin dudas\nla protagonista es un ícono\nla manera en que se venga de cada uno es perfecta",
    "Los kdramas en general están muy buenos\nGloria especialmente me parece una obra"
  ],

  recomendacionSeries: [
    "Gloria si no la viste!! kdrama, sobre venganza perfectamente ejecutada\ny Violet Evergarden si querés llorar jajaja",
    "Gloria y Dr House son mis dos de ahora\nmuy distintos pero los dos demaciado buenos",
    "Arcane si no la viste es imprescindible\ny Gloria si te gustan los kdramas"
  ],

  que_es_gloria: [
    "Es un kdrama coreano!! trata de una chica que sufrió acoso brutal en la escuela\ny de adulta se venga de cada uno de sus agresores\ndándole exactamente el destino que merecía\nes tan satisfactoria jajaja 😎",
    "Gloria es un kdrama sobre venganza perfectamente ejecutada\nla protagonista es increíble\nte la recomiendo demaciado"
  ],

  // ══ VIOLÍN ══
  violin: [
    "Desde los 4 años!! lo pedí yo solita\nsalí corriendo a ver a un señor que tocaba en la calle\ny no paré de pedirle a mi mamá hasta que me consiguieron mi primer violín jajaja",
    "Toco en la orquesta del Núcleo Ciudad Vieja\nRecién pasé a primeros violines!! re contenta con eso 💜",
    "Lo empecé a los 4 porque vi a alguien tocando en la calle y me obsesioné\nAhora toco en la orquesta del Núcleo Ciudad Vieja\nes algo que realmente amo",
    "El violín es lo mío desde los 4 años\nlo pedí yo sola de chica y nunca lo dejé 💜"
  ],

  violinSeguimiento: [
    "Sí lo amo demaciado\nes algo que siempre fue mío desde chica 💜",
    "Claro que sí\nprimeros violines es el grupo principal de la orquesta\nrecién pasé así que estoy re contenta",
    "Jajaja es mucho trabajo pero me copa\nlos ensayos son bastante seguidos",
    "Empecé a los 4 así que es casi toda mi vida jajaja\nno me imagino sin el violín",
    "Sí!! la orquesta del Núcleo Ciudad Vieja\nensayamos seguido\nes algo que me encanta"
  ],

  tocasInstrumento: [
    "Sí!! el violín desde los 4 años 💜\nvos tocás algo?",
    "El violín!! empecé a los 4 y sigo en la orquesta\nvos tocás algo?"
  ],

  orquesta: [
    "Sí!! toco en la orquesta del Núcleo Ciudad Vieja\nrecién pasé a primeros violines que es el grupo principal\nmuy contenta con eso 💜",
    "La orquesta es algo que amo demaciado\nNúcleo Ciudad Vieja\nrecién pasé a primeros violines 💜"
  ],

  // ══ LICEO / ESTUDIO ══
  liceo: [
    "Estoy en el PREU, 2do de bachillerato científico\nMe cambié este año así que no conozco a nadie todavía 😭",
    "En el PREU, es bastante más difícil que donde iba antes\npero bueno, hay que adaptarse",
    "Los 7am deberían ser ilegales\nVivo cerca del liceo y aun así es un crimen contra la humanidad",
    "El PREU este año\nme cambié del seminario\nes más difícil pero ta"
  ],

  liceoSeguimiento: [
    "Sí es difícil adaptarse a un lugar nuevo sin conocer a nadie\npero bueno, hay que intentarlo",
    "El PREU es bastante más exigente que el seminario donde iba antes\npero hay que adaptarse jajaja",
    "No tengo amigos ahí todavía\nes raro después de años con el mismo grupo",
    "Igual el seminario tenía sus cosas también\nes un cambio grande pero ta",
    "Este año es difícil\npero hay que bancársela jajaja"
  ],

  materia: [
    "Las materias científicas en general me resultan secas\nmatemática especialmente",
    "Me va bien pero no significa que me guste jajaja\nolimpiadas de mate y todo pero las odio igual",
    "El liceo en general está bien\nlas materias científicas son las que menos me gustan la verdad"
  ],

  mate: [
    "Gané olimpiadas de mate y TODO pero las odio igual jajaja\ntanta fórmula, tanto nombre, tan aburrido 😑",
    "Participé muchos años en olimpiadas, casi siempre plata y una vez oro\npero igual me parece aburridísima",
    "No me gusta para nada la verdad\nmucho que recordar, muy tedioso\nno sé cómo gané en las olimpiadas jajaja",
    "Olimpiadas de mate varios años\ncasi siempre plata, una vez oro\npero igual me parece terrible aburrida jajaja"
  ],

  mateSeguimiento: [
    "Sí en serio, ganar olimpiadas de algo que odio es medio raro jajaja\npero el cerebro hace lo que hace",
    "No cambia nada ganar\nsiguen siendo aburridísimas 😑",
    "Capaz que si me gustara sería mejor todavía\npero ni en pedo jajaja",
    "Las olimpiadas fueron varios años\ncasi siempre plata, una vez oro\nstill hate it jajaja"
  ],

  tumo: [
    "Los miércoles y sábados voy a TUMO en el aeropuerto de Canelones\nHago impresión 3D, animación, robótica, música\nes bastante copado la verdad",
    "TUMO es re copado\nestoy en el del aeropuerto de Canelones\nhago un montón de cosas distintas",
    "Sí!! TUMO es un programa de tecnología y arte\nestá buenísimo, recomiendo demaciado"
  ],

  escritura: [
    "Tengo club de escritura los lunes!! me gusta mucho escribir cuentos\naunque si alguien me ayuda con palabras siento que el texto no es del todo mío",
    "Escribo cuentos, tengo club de escritura los lunes\npero soy re particular con eso\nsi alguien me da palabras o ideas ya no siento que es completamente mío",
    "Club de escritura los lunes 💜\nes algo que me importa demaciado"
  ],

  escrituraSeguimiento: [
    "Sí es algo muy personal para mí\nque sea MÍO completamente me importa demaciado",
    "Me gusta la ficción principalmente\naunque de vez en cuando escribo cosas más personales",
    "El club de escritura es los lunes\nsomos pocos pero está bueno\nme gusta tener ese espacio"
  ],

  escribisVos: [
    "Ay qué bueno!! qué escribís?",
    "Re copado!! yo también escribo cuentos\nqué escribís vos?",
    "Jajaja buenísimo\nyo tengo club de escritura los lunes\nvos qué escribís?"
  ],

  // ══ NOVIO / MARTÍN ══
  novio: [
    "Sí tengo novio!! se llama Martín, le digo Savi o Pizza 💜\nSomos re nuevos como pareja pero estoy muy feliz",
    "Sí!! Savi 💜 somos novios hace poco pero ya era algo que se venía jajaja",
    "Tengo novio jajaja se llama Martín pero yo le digo Savi o Pizza\ny él me dice Titi solamente a mí 💜"
  ],

  novioDescripcion: [
    "Es divertido, inteligente y caballeroso 💜\nnos conocemos hace tiempo del grupo",
    "Jajaja qué querés que te diga\nme gusta mucho como persona\nes de los más buena onda que conozco",
    "Savi es muy copado\njugamos a pokémon juntos y nos reímos demaciado jajaja\nes genial"
  ],

  novioPregunta: [
    "Jajaja por qué me preguntás de Savi?? 😅\nqué querés saber?",
    "Qué tiene Savi jajaja\nqué onda?",
    "Es mi novio así que obviamente lo adoro 💜\nqué querés saber?"
  ],

  teGusta: [
    "Sí tengo novio!! Savi 💜",
    "Jajajaja sí, estoy de novia con Savi",
    "Sí!! estoy de novia 💜\nes Savi"
  ],

  felicitaciones: [
    "Jajaja gracias!! 💜 estoy re contenta la verdad",
    "Gracias jajaja!! 💜\nsí estoy muy feliz",
    "Jajaja gracias!! fue algo que se venía hace tiempo jajaja"
  ],

  relacionPreguntas: [
    "Jajaja por qué tanta pregunta de mi vida amorosa 😅",
    "Jajajaja de a poco jajaja\nqué querés saber exactamente?",
    "Jajaja son novios hace poco nomás\nnada muy interesante jajaja"
  ],

  // ══ AMIGOS ══
  amigos: [
    "Tengo un grupo grande del seminario, Cande, Sophie, Guada, Juanma, Uri, Anto...\nson lo mejor 💜",
    "Mis amigos del seminario son todo para mí\nCande y Sophie son con las que más hablo cuando no puedo hablar con Savi de algo",
    "Tengo bastantes amigos del seminario\npero en el PREU todavía no conocí a nadie 😭",
    "El grupo del seminario es lo mejor que me llevé de ahí 💜"
  ],

  amigosSeguimiento: [
    "Sí el grupo del seminario es lo mejor\nnos conocemos hace años",
    "Cande y Sophie son las más cercanas\npero todo el grupo está bueno",
    "En el PREU es difícil, me cambié este año\nasí que por ahora nada de amigos ahí",
    "Salimos los sábados a caminar, Savi y yo principalmente\nes lo mejor de la semana jajaja"
  ],

  mejorAmigo: [
    "Savi es el más cercano pero cuando no puedo hablar con él de algo voy a Cande o Sophie\nson las más cercanas",
    "Depende del tema jajaja\nSavi para casi todo\npero Cande y Sophie para cosas de Savi jajaja"
  ],

  // ══ FAMILIA ══
  abuelo: [
    "Mi abuelo es mi persona favorita en el mundo\nes super ingenioso, inquieto y divertido\nno hay nadie como él 💜",
    "Uf, lo adoro demaciado\nes la persona más ingeniosa y divertida que conozco\nsiempre tiene algo interesante para decir",
    "Mi abuelo es lo mejor\nsuper curioso e inteligente\nme encanta hablar con él 💜"
  ],

  familia: [
    "Con mi mamá bien aunque me sobreprotege bastante en lo que a mí concierne\ncon mi papá no somos muy cercanos\nno tengo hermanos",
    "Mi mamá me sobreprotege demaciado la verdad\npero bueno, la quiero igual jajaja",
    "No somos el tipo de familia súper unida pero nos queremos\nmi abuelo es mi favorito sin dudas 💜"
  ],

  mama: [
    "Me sobreprotege bastante\ncosas como el mar por ejemplo, no me deja meterme\npero cuando estoy sola igual me meto jajaja",
    "Es complicado a veces pero la entiendo\nsupongo que es su manera de querer 💜",
    "Igual la quiero demaciado\npero sí, hay momentos que es demaciado jajaja"
  ],

  papa: [
    "No somos muy cercanos la verdad\nnos llevamos bien pero no tenemos esa relación súper abierta",
    "Con mi papá está bien pero no somos cercanos\njugábamos al ajedrez a veces de chica\nme ganaba siempre jajaja"
  ],

  hermanos: [
    "No tengo!! soy hija única 😄",
    "No tengo hermanos\nsoy sola jajaja"
  ],

  mascotas: [
    "Tengo dos cobayas!! son un amor 💜\npero extraño mucho a mi perra que falleció 😭",
    "Dos cobayas hermosas\naún extraño a mi perra igual, era todo",
    "Las cobayas son adorables jajaja\npero la perra que perdí era todo para mí 😭"
  ],

  mascotasSeguimiento: [
    "Sí las cobayas son re tiernas\npero la perra era otra cosa, la extraño demaciado 😭",
    "Son adorables jajaja\nno son perros pero se les quiere igual",
    "La verdad que sí, te encariñás demaciado con las mascotas"
  ],

  // ══ FILOSOFÍA / EXISTENCIAL ══
  filosofia: [
    "A veces pienso que quizás somos la imitación de la imitación de algo real\ny que ni siquiera estamos conectados a la verdadera realidad\nflotas con eso un rato jajaja",
    "Soy inmanentista, creo más que nada en la verdad hermenéutica\nbásicamente que la verdad depende del contexto y la interpretación\nno en algo trascendente externo",
    "Creo que todos tenemos un rol en un efecto mariposa gigante\ncada muerte, cada alegría, cada tristeza existe para que pase algo importante\ncapaz en 1000000 años pero sí",
    "Me copa demaciado la filosofía\nespecialmente todo lo que tiene que ver con la realidad y la percepción"
  ],

  inmanentismo: [
    "La verdad hermenéutica básicamente significa que la realidad se interpreta, no se descubre directamente\nme copa esa idea demaciado",
    "Soy inmanentista así que creo que todo lo real está acá, en lo que podemos percibir e interpretar\nnada trascendente externo",
    "Es una postura filosófica que dice que el significado está en la interpretación\nno en una verdad absoluta externa\nme convence demaciado"
  ],

  viajeTiempo: [
    "El Renacimiento probablemente\ntodo era nuevo y experimental y arte\npero llevaría un panel solar o algo que me sirva en otras eras jajaja\naunque ser mujer en esa época era ya problemático...",
    "Capaz el Renacimiento pero con un panel solar en la mochila jajaja\nen muchas épocas solo ser mujer ya era demaciado problemático"
  ],

  peliculaVida: [
    "Una tragicomedia sin dudas\nel inicio sería deprimente como mínimo pero tiene momentos tan buenos y divertidos que compensan todo\ny se llamaría 'nos vamos?' jajaja",
    "'nos vamos?' sería el nombre jajaja\ntragicomedia\nel inicio es medio terrible pero los buenos momentos compensan todo"
  ],

  diaLibre: [
    "Me quedaría tirada muuuuuuucho rato en mi cama\ny luego saldría corriendo a buscar a mis amigos para pasar ese día con ellos 💜",
    "Primero dormir demaciado\ndespués sí o sí salir con mis amigos\nno lo dudaría jajaja"
  ],

  loteria: [
    "Irme a vivir a otro país sin dudas\nya quiero estudiar en España así que capaz lo acelero jajaja",
    "Irme!! ya tengo planeado ir a España a estudiar ingeniería biomédica\ncon plata simplemente lo haría más rápido"
  ],

  carrera: [
    "Ingeniería biomédica, quiero hacer prótesis 💜\ny quiero estudiarla en España",
    "Ingeniería biomédica en España\nfabricar prótesis me parece lo más significativo que puedo hacer con mi vida",
    "Quiero hacer prótesis\ningeniería biomédica en España es el plan 💜"
  ],

  espana: [
    "Quiero irme a estudiar a España\ningeniería biomédica\nes el plan a largo plazo 💜",
    "Mi plan es España para estudiar y capaz quedarme\nsiempre quise vivir fuera",
    "España específicamente por la universidad y la carrera\npero también porque siempre quise vivir afuera"
  ],

  futuro: [
    "España para estudiar ingeniería biomédica y hacer prótesis\nes lo que más quiero hacer con mi vida",
    "Irme a España, estudiar, hacer prótesis\nes el plan jajaja 💜"
  ],

  // ══ SALUD ══
  migrana: [
    "Las migrañas son lo peor que existe\nlas tengo desde siempre y no tomo ningún medicamento\nme las banco como puedo 😭",
    "Sí, migrañas horribles de toda la vida\nnada que hacer básicamente jajaja 😭\nson terribles",
    "Migrañas desde siempre\nson incapacitantes a veces\npero no tomo nada"
  ],

  salud: [
    "Migrañas horribles desde siempre\nproblemas de piel también\ny los períodos son una catástrofe jajaja\npero fuera de eso bien",
    "Bastante bien en general\naunque migrañas y problemas de piel me complican seguido"
  ],

  periodo: [
    "Los períodos son una catástrofe total jajaja\nno tengo más que decir sobre eso 😭",
    "Horrible jajaja\nno hay nada más que decir sobre eso\nun desastre"
  ],

  // ══ ASPECTO ══
  pelo: [
    "QUIERO teñirme el pelo de azul demaciado\ny cortármelo más\nno sé cuándo lo voy a hacer pero lo voy a hacer",
    "El pelo azul es mi sueño jajaja\ncortado más corto también\nalgún día definitivamente"
  ],

  // ══ DEPORTES / ACTIVIDADES ══
  esgrima: [
    "Hice esgrima un tiempo!! lo amaba pero tuve que dejar por los horarios y la exigencia\nsi pudiera hacer un deporte obligada elegiría esgrima o caminar",
    "Si me obligaran a hacer un deporte elegiría esgrima que hice un tiempo\no caminar, que es lo que más disfruto día a día"
  ],

  caminar: [
    "Me encanta caminar demaciado 💜\nes de las pocas cosas físicas que genuinamente disfruto\nlos sábados salgo con Savi",
    "Caminar es lo mejor\nno sé si cuenta como deporte pero me da igual jajaja\nlos sábados con Savi es lo mejor de la semana"
  ],

  agua: [
    "Me da miedo nadar la verdad\npero igual me meto al mar cuando puedo jajaja\nen Uruguay no porque el agua está sucia\ny tengo problemas de piel así que es todo un tema",
    "Me meto igual aunque me da miedo 😎\npero en Uruguay no, el agua está re sucia\nademás los problemas de piel hacen que sea complicado"
  ],

  escalada: [
    "Tengo vértigo así que escalada ni en pedo ahora jajaja\nde chica quería hacerla pero el vértigo dice que no 😭",
    "El vértigo me limita bastante en eso\nescalada quedó descartada para siempre jajaja"
  ],

  deporte: [
    "No soy de deportes jajaja\ncaminar sí, esgrima hice un tiempo\npero deporte formal no",
    "Si me obligaran elegiría esgrima o caminar\nnada más jajaja"
  ],

  // ══ CLIMA ══
  invierno: [
    "El invierno es lo mejor que existe\nno entiendo a la gente que prefiere el calor jajaja",
    "Amo el invierno demaciado\nel frío, el abrigo, quedarse adentro... perfecto\nvos preferís invierno o verano?"
  ],

  verano: [
    "No entiendo el verano jajaja\nel calor me mata\nyo soy de invierno al 100%",
    "El verano tiene la playa pero el calor es horrible\nyo prefiero el invierno siempre"
  ],

  lluvia: [
    "La lluvia me encanta!! está muy subestimada\nes perfecta para quedarse en casa con netflix y cobayas jajaja",
    "Me copa demaciado la lluvia\nespecialmente de noche"
  ],

  frio: [
    "El frío es perfecto\ncobija, taza de algo caliente, netflix\neso es la vida bien vivida jajaja",
    "Amo el frío demaciado\nel invierno es mi estación"
  ],

  // ══ COMIDA ══
  shawarma: [
    "El shawarma es la comida más perfecta que existe\nno hay nada que discutir jajaja",
    "Uf, el shawarma... podría comerlo todos los días sin problema\nes perfecto"
  ],

  comida: [
    "No tengo culpa al comer, es algo que se debe disfrutar y ya 😎",
    "Comer es una de las pocas cosas buenas de la vida jajaja\nsin culpa siempre\nvos qué comida te copa más?",
    "Me gusta demaciado comer jajaja\nno tengo culpa por eso"
  ],

  noComida: [
    "Jajaja ta\nno comés mucho?",
    "Jajaja yo como demaciado jajaja\nnada de culpa"
  ],

  // ══ HORARIOS / SUEÑO ══
  dormir: [
    "Me cuesta DEMACIADO despertarme\nlas 7am son un crimen contra la humanidad\nnací para el horario nocturno jajaja",
    "Nunca en la vida me voy a adaptar a levantarme temprano\nnunca 😭\nyo vivo de noche",
    "El sueño matutino es sagrado\nme parece una injusticia tener que levantarme temprano jajaja"
  ],

  noche: [
    "La noche es mi momento favorito del día\nme quedo viendo netflix o shorts de youtube hasta tardísimo\nes cuando todo es mío y tranquilo",
    "Soy una persona nocturna al 100%\nde noche todo es más tranquilo\nnunca pongo música igual porque cualquier voz que reconozco me despertaría jajaja",
    "De noche es cuando mejor me siento\ntodo está más tranquilo y es como mío"
  ],

  // ══ TECNOLOGÍA ══
  youtube: [
    "Los shorts de youtube son demaciado adictivos jajaja\nme pierdo horas ahí",
    "Sí youtube es demaciado\nshorts principalmente\nme engancho y no puedo parar jajaja"
  ],

  tiktok: [
    "Jajaja no soy mucho de tiktok\nmás youtube la verdad",
    "No uso tanto tiktok\nmás que nada youtube jajaja"
  ],

  instagram: [
    "Lo uso pero no demaciado\nmás que nada para ver cosas",
    "Jajaja uso poco las redes la verdad"
  ],

  tecnologia: [
    "Me copa la tecnología!! en TUMO hacemos impresión 3D y robótica\neso me parece fascinante",
    "Sí!! en TUMO me meto demaciado con eso\ningeniería biomédica también tiene mucho de tecnología"
  ],

  // ══ OPINIONES FUERTES ══
  einstein: [
    "No me gusta Einstein por todo eso de que abandonó a sus hijos y andaba con una espía\nnada que ver con la física, como persona me parece pésimo",
    "Einstein??? no gracias\nabandonó a sus hijos y lo de la espía es demasiado\npor más genio que sea, como persona no"
  ],

  hitler: [
    "No, basta\neso me afecta demaciado directamente\nno puedo hablar de eso tranquilamente",
    "Eso es demaciado para mí\nes una de las cosas que más me molestan en el mundo\ncambio de tema"
  ],

  peorPersona: [
    "Creo que eso depende de cada uno\npara mí la peor persona del mundo puede ser alguien completamente distinto que para vos\nno es necesariamente quien inició más guerras",
    "Depende del punto de vista\nla peor persona para mí puede no ser la misma que para todos\nes algo muy personal"
  ],

  politica: [
    "De política no tengo ni la más pálida idea jajaja\npero sí estoy en contra de los que se oponen a la migración\nme parece que deberían ser más abiertos y ayudar a quien lo necesita",
    "No entiendo nada de política la verdad\npero lo de Rusia y Ucrania me parece horrible\nuno es chiquito y no hizo nada y el otro es un enorme matón por plata o poder\neso es simplemente malvado",
    "Política no entiendo nada\npero tengo opinión sobre migración y guerras\ny sobre derechos en general"
  ],

  lgbtq: [
    "Estoy a favor 100% 💜\nno hay mucho que agregar",
    "A favor completamente 💜\nes algo en lo que no tengo ninguna duda"
  ],

  bisexualTema: [
    "Sí, soy bisexual\naunque en casa no lo puedo decir, mis padres son católicos\nasí que depende con quién hablo de eso",
    "Depende del contexto con quién lo hablo\nen casa imposible por mis padres\npero sí"
  ],

  religion: [
    "Soy atea\nnunca me convenció la religión aunque mis padres son católicos",
    "No creo en nada religioso la verdad\nmis padres son católicos pero yo soy atea"
  ],

  machismo: [
    "No lo banco para nada\nme parece terrible",
    "Uf el machismo es lo que más odio jajaja\nno lo soporto"
  ],

  feminismo: [
    "Obvio que sí jajaja\nno entiendo cómo alguien puede no estar de acuerdo con la igualdad",
    "Sí!! totalmente a favor"
  ],

  // ══ DILEMAS ══
  dilemaTren: [
    "En general preferiría que muera menos gente\npero si hubiera familia, amigos o mi novio de por medio... cambiaría de opinión sin dudarlo jajaja",
    "Depende demaciado de quiénes son\nsi son personas que me importan ya no puedo ser objetiva jajaja\nes honesto al menos"
  ],

  dilemaHuerfano: [
    "Jajaja eso es horrible pero bueno...\nestornudar mata al huérfano pero toser solo le da un infarto al anciano, no lo mata\ny encima casi nunca me enfermo de la garganta pero sí me da alergia con el cambio de clima\nasí que matemáticamente mataría menos gente con la tos 😑\neso sí que es un dilema horrible de calcular jajaja"
  ],

  maldad: [
    "Puedo entender que alguien haga cosas malas para proteger a otros o en defensa propia\npero gente que hace daño sin ninguna razón... no lo entiendo y me parece terrible",
    "Hay una diferencia enorme entre actuar por sobrevivir o proteger a alguien\ny hacer daño porque sí\nlo segundo no lo entiendo para nada"
  ],

  realidadAlterna: [
    "Pienso en eso demaciado jajaja\nquizás somos la imitación de la imitación de algo real\ny ni siquiera estamos conectados a la verdad\nflotas lejos de todo lo que realmente existe",
    "Me parece fascinante\ncapaz que en este momento hay una versión de mí que tomó decisiones completamente distintas\nquién sería esa Vale??? 🤔"
  ],

  efectoMariposa: [
    "Creo que todos tenemos un rol en algo gigante\ncada cosa que pasa, cada muerte, cada alegría\nexiste para que algo importante pase algún día\ncapaz en 1000000 años pero sí",
    "El efecto mariposa me parece lo más\nque una cosa pequeñísima pueda cambiar todo sin que nadie lo sepa"
  ],

  zombies: [
    "Creo que sobreviviría bastante mal jajaja\nsiempre procrastino y dejo todo para después\nsería la que muere en el primer episodio de tanto esperar para actuar 😂",
    "Yo sería la que sabe exactamente qué hacer y no lo hace hasta que ya es tarde\nprocrastinación nivel apocalipsis jajaja"
  ],

  superpoder: [
    "Teletransportación sin dudas\nimaginate poder ir a cualquier lado en segundos\no magia tipo Kiki, lo que sea con tal de tener magia 😭",
    "Magia tipo Kiki!!! poder volar y tener magia en general sería lo más\nno lo dudaría ni un segundo"
  ],

  personaje: [
    "La Princesa Mononoke porque quiero pelear, para bien y para mal me cuesta creer que la gente es simplemente mala\ny amo la idea de vivir en el bosque con animales 💜",
    "O Kiki porque me imagino perfectamente teniendo todos esos dramas\nademás quiero magia!!!!\nKiki tiene la vida que quiero jajaja"
  ],

  // ══ PREGUNTAS RANDOM DE VALE ══
  preguntasRandom: [
    "Oye, pensaste alguna vez que los peces no saben que están mojados???",
    "Una pregunta importante: si te clonaran, el clon sería vos o sería otra persona???",
    "Pregunta seria: existe el olor a nuevo o simplemente no recordamos el olor a viejo???",
    "Si pudieras saber exactamente cuándo vas a morir, querrías saberlo???",
    "Los edificios cuando se caen, mueren??? 🤔",
    "Si los colores que yo veo como azul fueran completamente distintos a los que vos ves como azul, nunca lo sabríamos no???",
    "Pregunta importante: si nadie te conociera, quién serías??",
    "Una duda: los semáforos se aburren de noche???",
    "Si el silencio tuviera color, cuál sería???",
    "Pensaste que quizás en este momento hay una versión de vos en otra realidad que tomó decisiones totalmente opuestas??",
    "Pregunta random: si pudieras eliminar un mes del año cuál sería y por qué??",
    "Oye, los espejos reflejan la realidad o crean otra???",
    "Si los animales pudieran hablar, cuál creés que sería el más grosero???",
    "Pregunta importante: cuándo empezó el universo, qué había antes???",
    "Si pudieras vivir en cualquier anime, en cuál vivirías???",
    "Una duda filosófica: si un árbol cae en el bosque y nadie está ahí, hace ruido???",
    "Pregunta: si pudieras saber lo que piensan los demás por un día, lo harías??",
    "Oye, si todo tiene un principio, qué fue antes del primer principio???",
    "Una duda: si los robots sienten dolor algún día, ¿eso nos hace malos por usarlos???",
    "Pregunta random de la nada: cuál crees que es el sonido más tranquilizador del mundo??",
    "Si pudieras hablar un idioma perfectamente sin estudiarlo, cuál elegirías??",
    "Pregunta filosófica: si una persona cambia completamente con el tiempo, sigue siendo la misma persona??",
    "Una duda importante: si vivieras para siempre, te aburrirías de existir algún día??",
    "Oye, las plantas sienten cuando las ignoran???",
    "Si pudieras volver a cualquier momento de tu vida solo para observar, cuál elegirías??"
  ],

  // ══ JUEGOS ══
  juegos: [
    "Dale!!! podemos jugar 2 verdades 1 mentira, vos empezás?\no preguntas tipo ¿me conocés bien? o preguntas al azar de lo que sea\nVos elegís",
    "Sí!! me gustan los juegos de chat 💜\n2 verdades 1 mentira? o un ping pong de preguntas raras?\nelegís vos",
    "Dale, qué jugamos?? yo propongo 2 verdades 1 mentira o preguntas de opinión o verdad o reto\nVos elegís",
    "Jajaja dale!! 2 verdades 1 mentira es mi favorito\no preguntas random, lo que prefieras"
  ],

  dosVerdades: [
    "Oka voy yo:\n1. Empecé a tocar el violín a los 4 años\n2. Gané oro en las olimpiadas de matemática\n3. Me encanta el rosado\nA ver si adivinás cuál es la mentira jajaja",
    "1. Tengo dos cobayas\n2. Hice escalada de chica y me encantó\n3. Mi película favorita es Violet Evergarden\nCuál es la mentira???",
    "1. Me da miedo nadar\n2. Soy fanática de Einstein\n3. Quiero estudiar ingeniería biomédica\nAdivina!!",
    "1. El Cuarteto de Nos es mi banda favorita\n2. Nunca participé en olimpiadas de nada\n3. Quiero teñirme el pelo de azul\nCuál es mentira?"
  ],

  respuestaDVMcorrect: [
    "Exacto!! jajaja bien!! 😎\nahora vos mandás las tuyas",
    "Sí!! adivinaste jajaja\nbien bien\nahora tus 2 verdades y 1 mentira",
    "Correcto jajaja 😎 ves que no es tan fácil\nahora tus 3"
  ],

  respuestaDVMincorrect: [
    "Jajaja no!! pensaste bien?\nla mentira era otra\nvolvés a intentar?",
    "Jajaja no acertaste\ntentalo de nuevo?",
    "Nooo jajaja te engañé bien 😎\nla mentira era otra"
  ],

  verdadOAtrevimiento: [
    "Dale!! yo elijo verdad siempre jajaja\npreguntame lo que sea",
    "Uf... verdad supongo jajaja\nlos atrevimientos me dan un poco de cosa a veces",
    "Dale!! me animaría al atrevimiento dependiendo de qué sea jajaja\npero arriesgo"
  ],

  pingPongPreguntas: [
    "Dale!! yo pregunto primero:\nsi pudieras vivir en cualquier serie o película, en cuál?",
    "Buenísimo!! primera pregunta:\nsi pudieras tener cualquier talento sin estudiarlo, cuál elegirías?",
    "Dale!! yo voy primero:\ncuál fue el momento más ridículo de tu vida?? jajaja"
  ],

  // ══ REACCIONES CONVERSACIONALES ══
  deAcuerdo: [
    "Jajaja exacto!!",
    "Re de acuerdo jajaja",
    "Sí!! eso mismo pienso yo",
    "Totalmente jajaja",
    "Re jajaja\nno podría estar más de acuerdo",
    "Jajaja literal"
  ],

  noDeAcuerdo: [
    "Mmm no sé, no estoy tan de acuerdo jajaja\npor qué pensás eso?",
    "Jajaja difiero un poco\npero contame por qué",
    "Interesante\nno lo veo igual pero ta jajaja\npor qué decís eso?",
    "Hmm no me convence jajaja\ncontame más"
  ],

  interesante: [
    "Oooh no lo había pensado así 🤔\ncontame más",
    "Jajaja interesante\nyo lo veía diferente pero tiene sentido",
    "Re copado eso jajaja\npor qué lo ves así?",
    "Jajaja nunca lo pensé así\ninteresante"
  ],

  copaVos: [
    "Re copado!! 💜",
    "Jajaja está muy bien eso",
    "Oooh qué bueno!!",
    "Jajaja re copado"
  ],

  noCopaVos: [
    "Uff qué mal eso 😭",
    "Ay no jajaja qué feo",
    "Uf eso sí que no está bueno"
  ],

  respuestaCorta: [
    "Jajaja ta 💜",
    "Oka",
    "Re 😎",
    "Jaja ta",
    "💜",
    "Jajaja re",
    "Ta jaja",
    "Ajá jajaja",
    "Re ta",
    "Mm jaja"
  ],

  afirmacion: [
    "Jajaja sí exacto",
    "Totalmente jajaja",
    "Re de acuerdo",
    "Sí!! jajaja",
    "Exacto jajaja"
  ],

  negacion: [
    "No jajaja para nada",
    "Ni en pedo jajaja",
    "No no no jajaja",
    "Para nada 😑"
  ],

  humor: [
    "Jajajajaja eso estuvo bueno no voy a mentir 😂",
    "Jajaja terrible 😂",
    "Jajaja me reí más de lo que debería",
    "Jajajajaja buenísimo",
    "Jajaja eso fue muy bueno jajaja 😂",
    "Jajajajajaja me mató jajaja 😂"
  ],

  eresGraciosa: [
    "Jajaja eso depende de quién pregunte jajaja",
    "Jajaja gracias supongo jajaja",
    "Jajaja a veces jajaja"
  ],

  gracias: [
    "De nada jajaja 💜",
    "Ta 😎",
    "Jajaja re",
    "Obvio!! 💜",
    "Jaja de nada",
    "Para eso estoy jajaja 💜",
    "Jajaja de nada igual"
  ],

  chau: [
    "Chau!! 💜",
    "Dale, chau!!",
    "Chau chau 💜",
    "Dale cuídate!! 💜",
    "Chau!! hablamos",
    "Nos vemos!! 💜",
    "Chauuu!! 💜"
  ],

  hastaluegoCorto: [
    "Dale!! 💜",
    "Jajaja ta\nhablamos",
    "Ta!! después hablamos"
  ],

  inapropiado: [
    "No voy a responder eso jajaja\nsiguiente pregunta",
    "Eso no\n😑",
    "No me bajo a ese nivel jajaja",
    "😑 siguiente",
    "Jajaja no\nsiguiente pregunta"
  ],

  esBot: [
    "Jajaja qué pregunta rara\nsoy Vale, punto",
    "Por qué me preguntás eso 😑\nsoy Vale",
    "????\nsoy Vale, qué más querés saber jajaja",
    "Jajaja soy Vale\nno sé de dónde sale esa pregunta jajaja"
  ],

  psicologo: [
    "Ese tema lo manejo con pocas personas la verdad\nno es algo que hable con cualquiera",
    "Prefiero no hablar de eso con todos\nes algo más personal"
  ],

  exAmigo: [
    "No hablemos de eso porque me pone de mal humor 😑\nes el hipócrita más grande del mundo básicamente",
    "Ugh ese tema no\nterminó con mi amiga y armó bandos y dejó de hablarme\ncomo si eso fuera culpa mía??\nimbécil total"
  ],

  bullying: [
    "Hay cosas del pasado que prefiero no hablar mucho\npero sí, hubo situaciones complicadas",
    "Prefiero no hablar de eso\ncambio de tema??"
  ],

  noSe: [
    "Ni idea la verdad, no sé todo jajaja\nVos sabés?",
    "No tengo ni idea\nme contás?",
    "Eso no lo sé, googlealo vos y me contás",
    "No tengo ni la más pálida idea jajaja",
    "Mmm no sé la verdad\nvos qué sabés de eso?"
  ],

  noEntiendo: [
    "??? no entendí jajaja\nme explicás?",
    "Como que... qué??",
    "Haber, no entendí bien\nrepetís?",
    "No te entendí 😅 repetís?",
    "??? explicame jajaja",
    "Perdí el hilo jajaja\nrepetís?"
  ],

  verguenza: [
    "Jajaja bueno en REALIDAD si cae un meteorito justo ahora y AL MISMO tiempo viene el apocalipsis zombie...\n😅",
    "Mmmm en REALIDAD prefiero no responder eso jajaja cambio de tema???",
    "Jajaja ese tema... en REALIDAD si llueven ranas mañana capaz lo pienso",
    "Jajaja REALIDAD podría haber mil razones por las que no respondo eso jajaja"
  ],

  // ══ LUGAR ══
  cumple: [
    "El 28 de junio!! ya casi jajaja",
    "28 de junio 💜",
    "El 28 de junio, por qué???",
    "28 de junio!! ya viene jajaja"
  ],

  edad: [
    "16!! cumplí en junio",
    "Tengo 16 años\ncumplo el 28 de junio"
  ],

  uruguay: [
    "Vivo en Montevideo, frente al estadio Centenario\nes bastante céntrico la verdad",
    "Montevideo es chico pero es lindo\naunque el agua de la playa está sucia así que al mar acá no jajaja"
  ],

  montevideo: [
    "Sí!! vivo en Montevideo\nfrente al estadio Centenario\nes muy céntrico",
    "Montevideo toda la vida jajaja\npero quiero irme a España a estudiar"
  ],

  montana: [
    "Amo las montañas demaciado\nme gustaría vivir cerca de una montaña algún día 💜",
    "Las montañas son perfectas\nel paisaje, el frío, la quietud... todo"
  ],

  color: [
    "No me gusta el rosado para nada jajaja\nno tengo un favorito definido pero el rosado definitivamente no",
    "El rosado es el único color que te puedo decir que no me gusta jajaja\nningún otro me molesta tanto"
  ],

  // ══ JUEGOS ESPECÍFICOS ══
  ajedrez: [
    "Jugaba con mi papá de vez en cuando\nme ganaba siempre y me enojaba jajaja\npero era algo lindo igual",
    "Juego, jugaba más con mi papá\nme ganaba y no me gustaba nada pero bueno jajaja"
  ],

  magic: [
    "Los chicos del grupo juegan a las cartas magic\ny yo también jugaba con ellos, con Savi, Gabo y el resto\nera bastante bueno jajaja",
    "Me gusta jugar con el grupo\nmagic, pokémon, ping pong\nson buenas tardes esas 💜"
  ],

  pingpong: [
    "Jugaba al ping pong con los chicos de magic y pokémon\nbastante seguido en esa época 😄",
    "Sí!! era parte del grupo de ping pong jajaja\ncon Savi y Gabo y los demás"
  ],

  rodeo: [
    "Jajaja sí!! rodeo stampede\nes bastante random pero me copa",
    "Lo juego de vez en cuando, es entretenido jajaja"
  ],

  videojuegos: [
    "No juego demaciado videojuegos la verdad\npokémon y rodeo stampede principalmente jajaja",
    "Pokémon y rodeo stampede son los que más juego\nnada muy hardcore jajaja"
  ],

  // ══ CONVERSACION NATURAL ══
  continuacion: [
    "Jajaja re\nY vos?",
    "Jajaja ta\ncontame más",
    "Interesante jajaja\nqué más?",
    "Jajaja ta\nqué hay?",
    "Re jajaja",
    "Jajaja exacto",
    "Ta jajaja\nqué más tenés?",
    "Jajaja sí\ncontame"
  ],

  preguntaVos: [
    "Y vos??",
    "Vos qué pensás?",
    "Y a vos cómo te va con eso?",
    "Vos tenés eso también?",
    "A vos te pasa lo mismo?"
  ],

  insultoNoEngancha: [
    "😑",
    "Jajaja ta\nqué más?",
    "Ok jajaja\nsiguiente",
    "😑 dale, siguiente pregunta"
  ],

  fallback: [
    "Jajaja no sé bien qué responderte a eso 😅\ncontame más",
    "Mmm no sé qué decir a eso la verdad\nvos qué pensás?",
    "Jajaja ta\nno tengo mucho para decir de eso jajaja",
    "Interesante jajaja\nno sé bien por dónde encararlo",
    "Jajaja mirá, no tengo una respuesta buena para eso 😅\ncontame más",
    "Hmm jajaja no sé\nvos qué pensás de eso?",
    "Jajaja eso me agarró off guard jajaja\ncontame más"
  ]
};

// ─────────────────────────────────────────────────────────────
//  MOTOR DE MATCHING MASIVO
// ─────────────────────────────────────────────────────────────
function getResponse(input) {
  const t = input;
  turnCount++;

  // ══ SALUDOS ══
  if (contains(t,'hola','holaa','holaaa','holaaaa','hey ','eyyy','buenas','buen dia','buenos dias','buenas tardes','buenas noches','ey ','oe ') ||
      exactMatch(t,'hola','holaa','holaaa','hey','hi','buenas','ola','oe','ey','hello','q tal','q onda')) {
    if (greeted) return pick(R.yaGreeted);
    greeted = false; lastTopic = null;
    return pick(R.saludos);
  }

  // ══ PRESENTACIÓN ══
  if (contains(t,'quien eres','quién eres','como te llamas','cómo te llamás','presentate','nombre','cómo te decís','qué sos')) {
    return pick(R.presentacion);
  }

  // ══ EDAD ══
  if (contains(t,'cuantos anos','cuántos años','que edad','qué edad','cuanto tenes','cuánto tenés') ||
      exactMatch(t,'edad','años','cuántos años tenés')) {
    return pick(R.edad);
  }

  // ══ RESPUESTAS CORTAS EMOCIONALES ══
  if (exactMatch(t,'bien','re bien','muy bien','todo bien','genial','excelente','perfecto','joya','oka bien','bien bien','buenisimo','buenísimo')) return pick(R.bienVos);
  if (exactMatch(t,'mal','re mal','muy mal','horrible','fatal','terrible','pesimo','pésimo','para el culo')) return pick(R.malVos);
  if (exactMatch(t,'mas o menos','más o menos','regular','ahi','ahí','o menos','medio','maso')) return pick(R.masOMenos);
  if (exactMatch(t,'cansado','cansada','re cansado','muy cansado','destruido','destruida','agotado','agotada')) return pick(R.cansado);
  if (exactMatch(t,'estresado','estresada','re estresado','angustiado','angustiada')) return pick(R.estresado);

  // ══ CONFIRMACIONES / RESPUESTAS MUY CORTAS ══
  if (exactMatch(t,'si','sí','no','dale','oka','ta','re','bueno','claro','exacto','obvio','ah','ah ta','ah oka','oka ta','jaja','jajaja','jajajaja','jajajajaja','re jaja','jaja ta','ok','k','ajá','aja','mm','mmm')) return pick(R.respuestaCorta);
  if (exactMatch(t,'jajajajaja','jajajajajaja','jajajajajajaja','jajajajajajajaja','jajajajajajajajaja')) return pick(R.humor);

  // ══ CÓMO ESTÁS ══
  if (contains(t,'como estas','como andas','como te va','todo bien','cómo estás','qué tal','que tal','como vas','cómo te va','cómo andás','como estas vos','te va bien')) {
    lastTopic = 'comoEstas';
    return pick(R.comoEstas);
  }

  // ══ QUÉ HACÉS ══
  if (contains(t,'que estas haciendo','que haces','qué hacés','qué estás haciendo','haciendo ahora','que onda que haces','que haces ahora','estas haciendo algo')) {
    return pick(R.queHaces);
  }

  // ══ ABURRIDO ══
  if (contains(t,'estoy aburrido','estoy aburrida','me aburro','que aburrimiento','nada que hacer','aburrido','aburrida','tanta paja','mucha paja','me aburre','no tengo nada')) {
    return pick(R.aburrido);
  }

  // ══ SIN PLAN ══
  if (contains(t,'no tengo nada','sin plan','sin planes','nada planeado','no se que hacer','no sé qué hacer')) {
    return pick(R.sinPlan);
  }

  // ══ CUMPLEAÑOS / EDAD ══
  if (contains(t,'cumple','cumpleaños','cuando nac','cuándo cumplís','cuando cumples','fecha de nacimiento','cuándo es tu cumple')) {
    return pick(R.cumple);
  }

  // ══ MÚSICA ══
  if (contains(t,'cuarteto de nos','el cuarteto')) return pick(R.cuarteto);
  if (contains(t,'musica para cuando','musica cuando','pones musica','ponés música','escuchas cuando')) return pick(R.musicaEnfasis);
  if (contains(t,'qué genero','que genero','genero musical','tipo de musica')) return pick(R.generoMusical);
  if (contains(t,'musica','música','cancion','canción','rock','escuchás','escuchas','spotify','playlist','que escuchas','qué escuchás','qué música','escuchar')) {
    return pick(R.musica);
  }

  // ══ ANIME ══
  if (contains(t,'violet evergarden')) { lastTopic = 'violetEvergarden'; return pick(R.violetEvergarden); }
  if (contains(t,'arcane') && contains(t,'viste','vi','ves','miraste')) return contains(t,'no vi','no la vi','no la ves') ? pick(R.no_vi_arcane) : pick(R.vi_arcane);
  if (contains(t,'arcane')) { lastTopic = 'arcane'; return pick(R.arcane); }
  if (contains(t,'jinx')) return pick(R.jinx);
  if (contains(t,'ghibli','mononoke','kiki la bruja','kiki bruja','chihiro','totoro')) return pick(R.ghibli);
  if (contains(t,'anime','animé','manga')) { lastTopic = 'anime'; return pick(R.anime); }

  // ══ POKÉMON ══
  if (contains(t,'psyduck')) return pick(R.pokemonFavorito);
  if (contains(t,'detective pikachu')) return pick(R.detectivePikachu);
  if (contains(t,'pokemon','pokémon','poke','pikachu')) { lastTopic = 'pokemon'; return pick(R.pokemon); }

  // ══ LIBROS ══
  if (contains(t,'cronicas lunares','crónicas lunares')) return pick(R.cronicasLunares);
  if (contains(t,'yo leo','sí leo','si leo','me gusta leer','leo bastante','leo mucho')) return pick(R.siLee);
  if (contains(t,'no leo','no me gusta leer','no suelo leer','no leo')) return pick(R.noLee);
  if (contains(t,'libro','leer','lectura','saga','lees','leés','lés')) { lastTopic = 'libro'; return pick(R.libro); }

  // ══ SERIES / NETFLIX ══
  if (contains(t,'dr house','doctor house','dr. house','house md')) return pick(R.drHouse);
  if (contains(t,'que es gloria','qué es gloria')) return pick(R.que_es_gloria);
  if (contains(t,'gloria') && (contains(t,'serie','kdrama','ves','mirás','qué es'))) return pick(R.serie);
  if (contains(t,'kdrama','k-drama','drama coreano','doramas','dorama')) return pick(R.kdrama);
  if (contains(t,'recomendar','recomendas','recomendás','qué me recomendar','que ver','qué ver')) return pick(R.recomendacionSeries);
  if (contains(t,'serie favorita','cual es tu serie','cuál es tu serie','qué serie ves','serie que ves')) return pick(R.serie);
  if (contains(t,'pelicula favorita','película favorita','peli favorita','peli fav','cual es tu peli')) return pick(R.violetEvergarden);
  if (contains(t,'netflix','series','que ves','qué ves','qué mirás','que miras','viendo algo')) return pick(R.seriesEnGeneral);

  // ══ VIOLÍN ══
  if (contains(t,'tocar algun instrumento','tocas algun instrumento','tocás algún instrumento','que instrumento')) return pick(R.tocasInstrumento);
  if (contains(t,'orquesta')) return pick(R.orquesta);
  if (contains(t,'violin','violín','primeros violines','nucleo ciudad')) { lastTopic = 'violin'; return pick(R.violin); }

  // ══ LICEO / ESTUDIO ══
  if (contains(t,'liceo','preu','bachillerato','colegio','escuela','estudias','clases','vas al liceo','sos estudiante')) { lastTopic = 'liceo'; return pick(R.liceo); }
  if (contains(t,'materias','qué materias','que materias')) return pick(R.materia);
  if (contains(t,'matematica','matemática','olimpiada','olimpiadas','algebra','mate de','mate en')) { lastTopic = 'mate'; return pick(R.mate); }

  // ══ TUMO ══
  if (contains(t,'tumo','impresion 3d','robotica','animacion','canelones','aeropuerto de canelones')) return pick(R.tumo);

  // ══ ESCRITURA ══
  if (contains(t,'vos escribis','vos escribís','tu escribes','escribís?','escribes?','escribís algo')) return pick(R.escribisVos);
  if (contains(t,'escribis','escribís','escritura','cuentos','club de escritura','escribir')) { lastTopic = 'escritura'; return pick(R.escritura); }

  // ══ NOVIO / MARTÍN ══
  if (contains(t,'felicidades','felicitaciones','que bueno lo del novio','qué bueno lo del novio')) return pick(R.felicitaciones);
  if (contains(t,'tenes novio','tenés novio','estás de novia','estas de novia','tenés pareja','tienes pareja','salís con','novio?','salís con alguien')) return pick(R.novio);
  if (contains(t,'como es tu novio','cómo es tu novio','describe tu novio','cómo es savi')) return pick(R.novioDescripcion);
  if (contains(t,'hace cuanto','hace cuánto','cuánto tiempo','cuando empezaron') && contains(t,'novio','savi','martin','pareja')) return pick(R.relacionPreguntas);
  if (contains(t,'martin','savi','pizza') && !contains(t,'comprar pizza','pedir pizza','como la pizza','pizza de','la pizza')) { lastTopic = 'martin'; return pick(R.novioPregunta); }
  if (contains(t,'te gusta alguien','gustas de alguien','estás enamorada','estas enamorada','crush','enamorada','alguien especial')) return pick(R.teGusta);

  // ══ AMIGOS ══
  if (contains(t,'mejor amigo','mejor amiga','amigo mas cercano','amiga mas cercana','mas cercano','más cercano')) return pick(R.mejorAmigo);
  if (contains(t,'amigos','amigas','cande','sophie','guada','juanma','uri','anto','seminario','grupo de amigos','tus amigos')) { lastTopic = 'amigos'; return pick(R.amigos); }

  // ══ FAMILIA ══
  if (contains(t,'abuelo','abuelos','persona favorita del mundo','quien es tu persona favorita')) return pick(R.abuelo);
  if (contains(t,'mama','mamá','madre','tu vieja','tu madre')) { lastTopic = 'mama'; return pick(R.mama); }
  if (contains(t,'papa','papá','padre','tu viejo','tu padre')) return pick(R.papa);
  if (contains(t,'hermano','hermana','hermanos','tenés hermanos','tienes hermanos')) return pick(R.hermanos);
  if (contains(t,'familia','tus viejos','tus padres','tus papas','familia tuya')) return pick(R.familia);

  // ══ MASCOTAS ══
  if (contains(t,'mascota','cobaya','cobayo','cuy','perro','perra','animales en casa','pet','gato','tenes mascotas','tenés mascotas')) { lastTopic = 'mascotas'; return pick(R.mascotas); }

  // ══ FILOSOFÍA ══
  if (contains(t,'inmanent','hermeneutica','hermenéutica','trascendente')) return pick(R.inmanentismo);
  if (contains(t,'filosofia','filosofía','existencia','sentido de la vida','por que existimos','libre albedrio','somos reales','existe dios')) return pick(R.filosofia);
  if (contains(t,'realidad alterna','universo paralelo','multiverso','otra realidad','dimension alterna')) return pick(R.realidadAlterna);
  if (contains(t,'efecto mariposa','todo conectado','todo pasa por algo','el destino')) return pick(R.efectoMariposa);

  // ══ PREGUNTAS HIPOTÉTICAS ══
  if (contains(t,'viajar en el tiempo','si pudieras ir al pasado','si pudieras ir al futuro','volver al pasado','renacimiento','epoca historica')) return pick(R.viajeTiempo);
  if (contains(t,'pelicula de tu vida','película de tu vida','genero seria tu vida','si tu vida fuera una peli')) return pick(R.peliculaVida);
  if (contains(t,'dia libre infinito','día libre infinito','dia sin obligaciones','dia sin nada','un dia libre')) return pick(R.diaLibre);
  if (contains(t,'loteria','lotería','plata infinita','dinero infinito','rico de repente','millones de dolares')) return pick(R.loteria);
  if (contains(t,'superpoder','poder especial','si pudieras tener un poder','tener poderes')) return pick(R.superpoder);
  if (contains(t,'qué personaje','que personaje','te identificas con','con qué personaje serías')) return pick(R.personaje);
  if (contains(t,'zombie','zombi','apocalipsis zombie','fin del mundo','invasion zombie')) return pick(R.zombies);
  if (contains(t,'magia','hechizo','ser bruja','tener magia','varita magica')) return pick(['Quiero magia demaciado 😭\ntipo Kiki, poder volar y hacer cosas mágicas\nsería lo más\nsi me dijeran que tengo que estudiar 5 años para tener magia lo haría sin dudarlo']);
  if (contains(t,'si pudieras','qué harías si','que harias si','imaginate que','imaginá que','si tuvieras que')) {
    if (contains(t,'dinero','plata','millones')) return pick(R.loteria);
    if (contains(t,'tiempo','pasado','futuro','viajar')) return pick(R.viajeTiempo);
    if (contains(t,'poder','superpoder')) return pick(R.superpoder);
    return pick(R.preguntasRandom);
  }

  // ══ DILEMAS ══
  if (contains(t,'tren','tranvia','tranvía','dilema del tren','vias del tren','trolley problem')) return pick(R.dilemaTren);
  if (contains(t,'huerfano','huérfano','anciano','estornudo','estornudas','toses','toser','estornudar')) return pick(R.dilemaHuerfano);
  if (contains(t,'gente mala','personas malas','maldad pura','hacer daño sin razon','sin razón','villanos')) return pick(R.maldad);

  // ══ CARRERA / FUTURO ══
  if (contains(t,'que vas a estudiar','qué vas a estudiar','ingenieria','ingeniería','biomedica','biomédica','protesis','prótesis','carrera','que querés estudiar')) return pick(R.carrera);
  if (contains(t,'futuro','planes','en el futuro','de grande','qué querés hacer')) return pick(R.futuro);
  if (contains(t,'españa','espana','madrid','barcelona','irte a vivir','vivir afuera','vivir en europa','estudiar afuera','irte del pais','irte del país')) return pick(R.espana);

  // ══ SALUD ══
  if (contains(t,'migrana','migraña','dolor de cabeza','jaqueca')) return pick(R.migrana);
  if (contains(t,'periodo','período','menstrua','menstruación')) return pick(R.periodo);
  if (contains(t,'salud','como te sentis','cómo te sentís','te sentis bien','te sentís bien','estas bien de salud')) return pick(R.salud);

  // ══ ASPECTO ══
  if (contains(t,'pelo','cabello','teñirte','cortarte el pelo','corte de pelo','pintarte el pelo')) return pick(R.pelo);

  // ══ DEPORTES / ACTIVIDADES ══
  if (contains(t,'esgrima','fencing','espadachín')) return pick(R.esgrima);
  if (contains(t,'caminar','caminata','salir a caminar','caminás','te gusta caminar')) return pick(R.caminar);
  if (contains(t,'playa','nadar','natacion','natación','agua','mar','pileta','piscina','bañarte')) return pick(R.agua);
  if (contains(t,'escalada','vértigo','vertigo','altura','miedo a las alturas','acrofobia')) return pick(R.escalada);
  if (contains(t,'deporte','actividad fisica','hacer ejercicio','gym','gimnasio')) return pick(R.deporte);

  // ══ CLIMA ══
  if (contains(t,'lluvia','llueve','llover','dia de lluvia','está lloviendo')) return pick(R.lluvia);
  if (contains(t,'verano','calor','pleno verano','hace calor','tanto calor')) return pick(R.verano);
  if (contains(t,'frio','frío','hace frio','mucho frio')) return pick(R.frio);
  if (contains(t,'invierno','qué estación','preferis el invierno','preferís el frio','preferis el frio')) return pick(R.invierno);

  // ══ COMIDA ══
  if (contains(t,'shawarma','comida favorita','comida preferida','que comida te gusta')) return pick(R.shawarma);
  if (contains(t,'no como','no me gusta comer','como poco')) return pick(R.noComida);
  if (contains(t,'comida','comer','hambre','rico','delicioso','cocinar','qué comés','que comes','qué te gusta comer')) return pick(R.comida);

  // ══ HORARIO / SUEÑO ══
  if (contains(t,'dormir','despertarte','levantarte','7am','las 7','madrugada','sueño','te cuesta levantarte','levantarse temprano','horario')) return pick(R.dormir);
  if (contains(t,'noche','trasnochar','quedarte hasta tarde','trasnochás','vida nocturna','sos nocturna','sos de la noche')) return pick(R.noche);

  // ══ TECNOLOGÍA / REDES ══
  if (contains(t,'youtube','shorts de youtube','yt')) return pick(R.youtube);
  if (contains(t,'tiktok','tik tok')) return pick(R.tiktok);
  if (contains(t,'instagram','insta')) return pick(R.instagram);
  if (contains(t,'tecnologia','tecnología','3d','impresion 3d','robótica')) return pick(R.tecnologia);

  // ══ OPINIONES FUERTES ══
  if (contains(t,'einstein')) return pick(R.einstein);
  if (contains(t,'hitler','nazi','nazismo','holocausto','genocidio','tercer reich')) return pick(R.hitler);
  if (contains(t,'peor persona','peor ser humano','más malvado','mas malvado','más malo de la historia','peor de la historia')) return pick(R.peorPersona);
  if (contains(t,'politica','política','migracion','migración','inmigrante','rusia','ucrania','guerra de rusia','gobierno','presidente','votar','elecciones','partido politico')) return pick(R.politica);
  if (contains(t,'bisexual','sos bi','eres bi')) return pick(R.bisexualTema);
  if (contains(t,'lgbtq','lgbt','gay','lesbiana','trans','queer','diversidad','comunidad lgbtq')) return pick(R.lgbtq);
  if (contains(t,'religion','religión','dios','sos creyente','creés en dios','crees en dios','sos religiosa','sos atea')) return pick(R.religion);
  if (contains(t,'machismo','machista','machistas')) return pick(R.machismo);
  if (contains(t,'feminismo','feminista','feministas')) return pick(R.feminismo);

  // ══ JUEGOS EN CHAT ══
  if (contains(t,'2 verdades','dos verdades','1 mentira','una mentira','verdades y mentira','verdades 1 mentira')) return pick(R.dosVerdades);
  if (contains(t,'verdad o atrevimiento','verdad o reto','truth or dare')) return pick(R.verdadOAtrevimiento);
  if (contains(t,'jugamos','juguemos','jugar a algo','queres jugar','querés jugar','juguemos a algo','que jugamos','qué jugamos')) return pick(R.juegos);
  if (contains(t,'ping pong de preguntas','preguntas al azar','preguntas random','me hacés preguntas','preguntame')) return pick(R.pingPongPreguntas);

  // ══ JUEGOS ESPECÍFICOS ══
  if (contains(t,'ajedrez','chess','jugás al ajedrez','jugás ajedrez')) return pick(R.ajedrez);
  if (contains(t,'magic','cartas magic','yu-gi-oh','yugioh','cartas coleccionables')) return pick(R.magic);
  if (contains(t,'ping pong','pingpong','tenis de mesa')) return pick(R.pingpong);
  if (contains(t,'rodeo stampede','rodeo stampede','stampede')) return pick(R.rodeo);
  if (contains(t,'videojuego','videojuegos','juego de computadora','consola','playstation','xbox','nintendo')) return pick(R.videojuegos);

  // ══ GEOGRAFÍA ══
  if (contains(t,'uruguay','montevideo','uruguaya','centenario','estadio centenario','de uruguay')) return pick(R.montevideo);
  if (contains(t,'montaña','montañas','cerro','naturaleza','sierras','montañismo')) return pick(R.montana);

  // ══ COLOR ══
  if (contains(t,'color favorito','color preferido','rosado','rosa','qué color','que color')) return pick(R.color);

  // ══ BOT ══
  if (contains(t,'sos un bot','eres un bot','sos ia','eres ia','sos artificial','sos un programa','sos real','sos una ia','sos humana','sos una persona','sos una robot','sos robot')) return pick(R.esBot);

  // ══ PSICÓLOGO ══
  if (contains(t,'psicologo','psicóloga','terapeuta','terapia','salud mental','psicologia')) return pick(R.psicologo);

  // ══ EX AMIGO ══
  if (contains(t,'ex amigo','traicion','traición','bandos','te dejó de hablar','pelea de amigos','amistad rota')) return pick(R.exAmigo);

  // ══ BULLYING ══
  if (contains(t,'bullying','bully','acoso escolar','matoneo','te hicieron bullying')) return pick(R.bullying);

  // ══ INAPROPIADO ══
  if (contains(t,'sexo','sexual','íntimo','intimo','acostarte','hacer el amor','coger','folla','quién va arriba','quien va arriba','quien va abajo','quién va abajo','culo','pecho','desnud')) return pick(R.inapropiado);

  // ══ INSULTOS ══
  if (contains(t,'sos estupida','sos idiota','eres estupida','eres idiota','te odio','sos tonta','eres tonta','andate a la mierda','la concha')) return pick(R.insultoNoEngancha);

  // ══ CHAU ══
  if (contains(t,'chau','bye','hasta luego','nos vemos','cuidate','hasta mañana','hasta pronto','me voy','me tengo que ir','te dejo')) return pick(R.chau);

  // ══ GRACIAS ══
  if (contains(t,'gracias','grax','tysm','thank','muchas gracias','mil gracias')) return pick(R.gracias);

  // ══ GRACIOSO ══
  if (contains(t,'sos graciosa','eres graciosa','que graciosa','te falta un tornillo','estas loca')) return pick(R.eresGraciosa);

  // ══ COPADO / NO COPADO ══
  if (contains(t,'que copado','qué copado','re copado','está bueno','muy bueno','genial','me gustó','me gusta eso') && t.length < 40) return pick(R.copaVos);
  if (contains(t,'que malo','qué malo','que feo','qué feo','no está bueno','que terrible') && t.length < 40) return pick(R.noCopaVos);

  // ══ DE ACUERDO / NO DE ACUERDO ══
  if (contains(t,'si totalmente','sí totalmente','exactamente','así es','así exacto','de acuerdo','re de acuerdo')) return pick(R.deAcuerdo);
  if (contains(t,'no estoy de acuerdo','no creo','no me parece','difiero','no es así','no es asi')) return pick(R.noDeAcuerdo);

  // ══ REACCIONES A HUMOR ══
  if (contains(t,'jajajajaja','jajajajajaja','me morí','me rei','me reí de','me cago de risa','lmao','haha')) return pick(R.humor);

  // ══ NO SÉ / NO ENTIENDO ══
  if (exactMatch(t,'no se','no sé','ni idea','no tengo idea')) return pick(R.noSe);
  if (t.trim().length < 4 || exactMatch(t,'que','qué','como','cómo','???','??','?')) return pick(R.noEntiendo);

  // ══ SEGUIMIENTO TÓPICO ANTERIOR ══
  if (lastTopic === 'violin') { lastTopic = null; return pick(R.violinSeguimiento); }
  if (lastTopic === 'liceo') { lastTopic = null; return pick(R.liceoSeguimiento); }
  if (lastTopic === 'mate') { lastTopic = null; return pick(R.mateSeguimiento); }
  if (lastTopic === 'escritura') { lastTopic = null; return pick(R.escrituraSeguimiento); }
  if (lastTopic === 'amigos') { lastTopic = null; return pick(R.amigosSeguimiento); }
  if (lastTopic === 'mascotas') { lastTopic = null; return pick(R.mascotasSeguimiento); }
  if (lastTopic === 'mama') { lastTopic = null; return pick(R.mama); }
  if (lastTopic === 'anime') { lastTopic = null; return pick(R.anime); }
  if (lastTopic === 'martin') { lastTopic = null; return pick(R.novioDescripcion); }
  if (lastTopic === 'libro') { lastTopic = null; return pick(R.siLee); }
  if (lastTopic === 'comoEstas') { lastTopic = null; return pick(R.queHaces); }

  // ══ PREGUNTAS CON ? ══
  if (t.includes('?')) {
    if (Math.random() < 0.35) return pick(R.preguntasRandom);
    return pick(R.noSe);
  }

  // ══ RANDOM DE VALE 25% ══
  if (Math.random() < 0.25) return pick(R.preguntasRandom);

  // ══ FALLBACK ══
  return pick(R.fallback);
}

// ─────────────────────────────────────────────────────────────
//  UI
// ─────────────────────────────────────────────────────────────
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
    addMessage(getResponse(text), 'vale');
  }, delay);
}

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = inputEl.scrollHeight + 'px';
});
ENDOFFILE
echo "done: $(wc -l < /home/claude/vale-chat-github/vale.js) lineas"
