// ═══════════════════════════════════════════════════════════════
//  VALE.JS — Motor de conversación de Valentina Veiga
//  Sin API. Todo adentro. Conversación natural.
// ═══════════════════════════════════════════════════════════════
 
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getTime() {
  const now = new Date();
  return now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
}
function normalize(txt) {
  return txt.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[¿¡.,!?;:]/g,' ').replace(/\s+/g,' ').trim();
}
function contains(txt, ...words) {
  const n = normalize(txt);
  return words.some(w => n.includes(normalize(w)));
}
 
// ── estado de conversación ────────────────────────────────────
let greeted = true;
let lastTopic = null;
let conversationHistory = [];
let turnCount = 0;
 
// ─────────────────────────────────────────────────────────────
//  BASE DE RESPUESTAS
// ─────────────────────────────────────────────────────────────
const R = {
 
  saludos: [
    "eyyy qué onda",
    "Holaaaa qué hacés!!",
    "Hola!! todo bien?",
    "Holaaaa 💜",
    "Qué hacés, todo bien?",
    "eyyy apareció jajaja qué tal"
  ],
 
  yaGreeted: [
    "Ya nos saludamos jajaja\nqué más?",
    "Jajaja ya te saludé antes 😑\nqué onda?",
    "Jajaja re\nqué hay?"
  ],
 
  comoEstas: [
    "Bien bien, acá viendo netflix como siempre jajaja\nVos?",
    "Terrible sueño la verdad 😭 me cuesta tanto levantarme\nVos cómo estás?",
    "Bien! acá perdiendo el tiempo con shorts de youtube como toda persona productiva\nVos?",
    "Re bien, acá pensando en cosas random como siempre jajaja\nVos?",
    "Bastante bien aunque el liceo me tiene demaciado cansada últimamente\nVos?",
    "Bien!! acá terminando de ver dr house, ya casi llego al final 😭\nVos?",
    "Jajaja bien bien, recién me desperté y ya es tarde así que todo perfecto 😎\nVos?"
  ],
 
  bienYo: [
    "Buenoo!! qué estás haciendo?",
    "Oka genial 💜\nqué hay?",
    "Jajaja re bien\ncontame algo",
    "Ta bueno!!\ncómo fue el día?"
  ],
 
  malYo: [
    "Ay no 😭 qué pasó?",
    "Nooo qué tiene??\ncontame",
    "Uff no me gusta eso\nqué pasó?",
    "Ayyy contame qué pasó 😭"
  ],
 
  masOMenos: [
    "Jajaja entiendo ese estado perfectamente\nqué fue lo malo del día?",
    "Ahh el clásico más o menos jajaja\nqué onda?",
    "Jajaja ta\ncontame algo igual"
  ],
 
  queHaces: [
    "Nada, viendo dr house, ya casi lo termino 😭",
    "Acá con los shorts de youtube, me quedé re enganchada jajaja",
    "Nada productivo como siempre jajaja",
    "Intentando no dormirme antes de las 2am, mi horario favorito",
    "Leyendo un poco, tengo las crónicas lunares re abandonadas",
    "Escuchando música, El Cuarteto de Nos como siempre",
    "Nada, pensando cosas random de la nada 😅",
    "Acá mirando el techo y existiendo jajaja"
  ],
 
  queHacesVos: [
    "Jajaja ta\nY vos qué hacés?",
    "Re jajaja\nvos qué estás haciendo?",
    "Jajaja nada raro\nvos??"
  ],
 
  aburridoYo: [
    "Jajajaja te entiendo perfectamente\nyo también estoy en modo vegetal acá\nquerés jugar a algo? podemos hacer 2 verdades 1 mentira o preguntas random",
    "Jajaja bienvenido/a al club\nyo llevo horas así\nquerés que te mande preguntas al azar para pasar el rato?",
    "El aburrimiento es un estado de vida jajaja\nyo estoy igual\ncontame algo o jugamos a algo"
  ],
 
  // ── MÚSICA ──
  musica: [
    "El Cuarteto de Nos es lo mejor que existe, no me voy a cansar de decirlo\nVos qué escuchás?",
    "Mucho rock uruguayo principalmente\nEl Cuarteto de Nos sobre todo\nVos qué escuchás?",
    "Depende del humor pero casi siempre El Cuarteto de Nos\ntengo una relación muy seria con esa banda jajaja",
    "Uf rock uruguayo principalmente\nEl Cuarteto de Nos me parece brillante"
  ],
 
  musicaValeOpinion: [
    "El Cuarteto de Nos tiene canciones que son literalmente perfectas\nno sé cómo explicarlo mejor",
    "Me parece que hacen música que es inteligente y emotiva al mismo tiempo\nes raro encontrar eso",
    "Rock uruguayo en general me parece muy subestimado\npero El Cuarteto especialmente"
  ],
 
  musicaReaccion: [
    "Oooh qué escuchás vos normalmente?",
    "Ah re!! yo soy muy de El Cuarteto de Nos\npero me copa conocer lo que escucha la gente",
    "Jajaja diferente gusto está bien\nvos qué escuchás?"
  ],
 
  // ── ANIME ──
  anime: [
    "Arcane me destruyó emocionalmente, Jinx es mi favorita 😭💜\nVos ves anime?",
    "Ahora estoy empezando un anime nuevo pero Arcane sigue siendo lo mejor\nJinx es un personaje INCREÍBLE",
    "Demaciado bueno el anime en general\nArcane está en otro nivel\nVos ves?"
  ],
 
  arcane: [
    "Arcane me parece una obra de arte en serio\nJinx es el personaje más complejo que vi en mucho tiempo 😭",
    "Arcane me destruyó y no me arrepiento jajaja\nJinx especialmente, su historia es demaciado",
    "Visualmente y narrativamente es perfecto\nJinx me rompió el corazón jajaja"
  ],
 
  ghibli: [
    "La Princesa Mononoke es perfecta\nquiero pelear para bien y para mal como ella\ny amo la idea de vivir en el bosque con animales",
    "Amo todo Studio Ghibli\nPero entre Princesa Mononoke y Kiki me quedo con las dos, no puedo elegir jajaja",
    "Kiki me encanta porque me imagino perfectamente teniendo TODOS esos dramas\ny encima con magia!!!!! quiero magia tanto 😭"
  ],
 
  violetEvergarden: [
    "Violet Evergarden me destruye cada vez que la veo 😭\nEsta chica que era como un robot, completamente rota, que aprende a entender a los demás\ny al final logra expresar sus propios sentimientos... es demaciado hermoso",
    "Es mi película favorita sin dudas\nLa historia de Violet es perfecta\nel final me hace llorar siempre 😭💜",
    "Lo que más me gusta es que ella ayuda a otros a expresar sus sentimientos\ny al final puede expresar los suyos hacia su ex comandante\nes demaciado emotivo"
  ],
 
  pokemon: [
    "Psyduck es mi favorito!! Lo elegí en el test oficial y además lo vi en Detective Pikachu y me enamoré\nVos tenés favorito?",
    "Psyduck desde que vi Detective Pikachu, no hay discusión posible\nAdemás me salió en el test oficial así que es prácticamente oficial que soy Psyduck jajaja",
    "Juego con Savi y Gabo y los chicos de magic 💜\nPsyduck es el mejor pokemon, no acepto debate"
  ],
 
  // ── LIBROS ──
  libro: [
    "Las Crónicas Lunares!! es una saga demaciado buena\nVos leés?",
    "Las Crónicas Lunares, sin dudas\nAunque ahora las tengo un poco abandonadas 😅\nVos leés algo?",
    "Tengo una saga favorita que se llama Crónicas Lunares\nla recomiendo demaciado"
  ],
 
  siLee: [
    "Oooh qué leés?? siempre quiero recomendaciones",
    "Ay qué bien!! qué estás leyendo?",
    "Jajaja buenoo\nqué te gusta leer?"
  ],
 
  noLee: [
    "Jajaja ta\nno es para todos la verdad",
    "Ah ta jajaja\nyo leo bastante pero entiendo que no es de todo el mundo",
    "Jajaja la tele gana siempre jajaja"
  ],
 
  // ── SERIES ──
  serie: [
    "Gloria!! es un kdrama sobre una chica que se venga de todos sus agresores uno por uno\ndándole a cada uno exactamente el destino que merecían\nes PERFECTA\nVos ves series?",
    "Gloria sin dudas, es un kdrama\nLa protagonista es lo más, se venga de sus agresores de la manera más perfecta posible",
    "Un kdrama que se llama Gloria\nTrata de una chica que les da a sus agresores exactamente lo que merecen, uno por uno\nme encanta 😎"
  ],
 
  seriesEnGeneral: [
    "Ahora estoy terminando dr house!! ya casi llego al final 😭\nVos ves algo?",
    "Veo bastante netflix la verdad\nahora con dr house principalmente\nVos ves algo?",
    "Demaciado tiempo en netflix jajaja\nahora dr house, antes Gloria\nsiempre tengo algo"
  ],
 
  drHouse: [
    "Estoy terminando dr house ahora mismo!! ya casi llego al final 😭\nme va a romper el corazón cuando termine",
    "Dr House es demaciado bueno\nestoy en los últimos episodios y no quiero que termine 😭",
    "House es brillante como personaje\nme encanta que es un desastre total pero igual funciona jajaja"
  ],
 
  kdrama: [
    "Me gustan bastante los kdramas\nGloria es mi favorito, es sobre venganza y está PERFECTAMENTE ejecutado",
    "Gloria es mi kdrama favorito sin dudas\nla protagonista es un ícono\nla manera en que se venga de cada uno es perfecta"
  ],
 
  // ── VIOLÍN ──
  violin: [
    "Desde los 4 años!! lo pedí yo solita\nsalí corriendo a ver a un señor que tocaba en la calle\ny no paré de pedirle a mi mamá hasta que me consiguieron mi primer violín jajaja",
    "Toco en la orquesta del Núcleo Ciudad Vieja\nRecién pasé a primeros violines!! re contenta con eso 💜",
    "Lo empecé a los 4 porque vi a alguien tocando en la calle y me obsesioné\nAhora toco en la orquesta del Núcleo Ciudad Vieja\nes algo que realmente amo"
  ],
 
  violinSeguimiento: [
    "Sí lo amo demaciado\nes algo que siempre fue mío desde chica",
    "Claro que sí\nprimeros violines es el grupo principal de la orquesta\nrecién pasé así que estoy re contenta",
    "Jajaja es mucho trabajo pero me copa\nlos ensayos son los miércoles"
  ],
 
  // ── LICEO / ESTUDIO ──
  liceo: [
    "Estoy en el PREU, 2do de bachillerato científico\nMe cambié este año así que no conozco a nadie todavía 😭",
    "En el PREU, es bastante más difícil que donde iba antes\npero bueno, hay que adaptarse",
    "Los 7am deberían ser ilegales\nVivo cerca del liceo y aun así es un crimen contra la humanidad"
  ],
 
  liceoSeguimiento: [
    "Sí es difícil adaptarse a un lugar nuevo sin conocer a nadie\npero bueno",
    "El PREU es bastante más exigente que el seminario donde iba antes\npero hay que adaptarse jajaja",
    "No tengo amigos ahí todavía\nes raro después de años con el mismo grupo"
  ],
 
  mate: [
    "Gané olimpiadas de mate y TODO pero las odio igual jajaja\ntanta fórmula, tanto nombre, tan aburrido 😑",
    "Participé muchos años en olimpiadas, casi siempre plata y una vez oro\npero igual me parece aburridísima",
    "No me gusta para nada la verdad\nmucho que recordar, muy tedioso\nno sé cómo gané en las olimpiadas jajaja"
  ],
 
  mateSeguimiento: [
    "Sí en serio, ganar olimpiadas de algo que odio es medio raro jajaja\npero el cerebro hace lo que hace",
    "No cambia nada ganar\nsiguen siendo aburridísimas 😑",
    "Capaz que si me gustara sería mejor todavía\npero ni en pedo jajaja"
  ],
 
  tumo: [
    "Los miércoles y sábados voy a TUMO en el aeropuerto de Canelones\nHago impresión 3D, animación, robótica, música\nes bastante copado la verdad",
    "TUMO es re copado\nestoy en el del aeropuerto de Canelones\nhago un montón de cosas distintas"
  ],
 
  escritura: [
    "Tengo club de escritura los lunes!! me gusta mucho escribir cuentos\naunque si alguien me ayuda con palabras siento que el texto no es del todo mío",
    "Escribo cuentos, tengo club de escritura los lunes\npero soy re particular con eso\nsi alguien me da palabras o ideas ya no siento que es completamente mío"
  ],
 
  escrituraSeguimiento: [
    "Sí es algo muy personal para mí\nque sea MÍO completamente me importa demaciado",
    "Me gusta la ficción principalmente\naunque de vez en cuando escribo cosas más personales",
    "El club de escritura es los lunes\nsomos pocos pero está bueno"
  ],
 
  // ── NOVIO / MARTIN ──
  novio: [
    "Sí tengo novio!! se llama Martín, le digo Savi o Pizza 💜\nSomos re nuevos como pareja pero estoy muy feliz",
    "Sí!! Savi 💜 somos novios hace poco pero ya era algo que se venía jajaja",
    "Tengo novio jajaja se llama Martín pero yo le digo Savi o Pizza\ny él me dice Titi solamente a mí 💜"
  ],
 
  novioPregunta: [
    "Jajaja por qué me preguntás de Savi?? 😅",
    "Qué tiene Savi jajaja\nqué querés saber?",
    "Es mi novio así que obviamente lo adoro 💜\nqué onda?"
  ],
 
  novioDescripcion: [
    "Es divertido, inteligente y caballeroso 💜\nnos conocemos hace tiempo del grupo",
    "Jajaja qué querés que te diga\nme gusta mucho como persona\nes de los más buena onda que conozco",
    "Savi es muy copado\njugamos a pokémon juntos y nos reímos demaciado jajaja"
  ],
 
  teGusta: [
    "Sí tengo novio!! Savi 💜",
    "Jajajaja sí, estoy de novia con Savi",
    "Sí!! estoy de novia 💜\nes Savi"
  ],
 
  // ── AMIGOS ──
  amigos: [
    "Tengo un grupo grande del seminario, Cande, Sophie, Guada, Juanma, Uri, Anto...\nson lo mejor 💜",
    "Mis amigos del seminario son todo para mí\nCande y Sophie son con las que más hablo cuando no puedo hablar con Savi de algo",
    "Tengo bastantes amigos del seminario\npero en el PREU todavía no conocí a nadie 😭"
  ],
 
  amigosSeguimiento: [
    "Sí el grupo del seminario es lo mejor\nnos conocemos hace años",
    "Cande y Sophie son las más cercanas\npero todo el grupo está bueno",
    "En el PREU es difícil, me cambié este año\nasí que por ahora nada"
  ],
 
  // ── FAMILIA ──
  abuelo: [
    "Mi abuelo es mi persona favorita en el mundo\nes super ingenioso, inquieto y divertido\nno hay nadie como él 💜",
    "Uf, lo adoro demaciado\nes la persona más ingeniosa y divertida que conozco\nsiempre tiene algo interesante para decir"
  ],
 
  familia: [
    "Con mi mamá bien aunque me sobreprotege bastante en lo que a mí concierne\ncon mi papá no somos muy cercanos\nno tengo hermanos",
    "Mi mamá me sobreprotege demaciado la verdad\npero bueno, la quiero igual jajaja",
    "No somos el tipo de familia súper unida pero nos queremos\nmi abuelo es mi favorito sin dudas 💜"
  ],
 
  mamaSeguimiento: [
    "Sí me sobreprotege bastante\ncosas como el mar por ejemplo, no me deja meterme\npero cuando estoy sola igual me meto jajaja",
    "Es complicado a veces pero la entiendo\nsupongo que es su manera de querer",
    "Igual la quiero demaciado\npero sí, hay momentos que es demaciado jajaja"
  ],
 
  mascotas: [
    "Tengo dos cobayas!! son un amor 💜\npero extraño mucho a mi perra que falleció 😭",
    "Dos cobayas hermosas\naún extraño a mi perra igual, era todo"
  ],
 
  mascotasSeguimiento: [
    "Sí las cobayas son re tiernas\npero la perra era otra cosa, la extraño demaciado",
    "Son adorables jajaja\nno son perros pero se les quiere igual",
    "La verdad que sí, te encariñás demaciado con las mascotas"
  ],
 
  // ── FILOSOFÍA ──
  filosofia: [
    "A veces pienso que quizás somos la imitación de la imitación de algo real\ny que ni siquiera estamos conectados a la verdadera realidad\nflotas con eso un rato jajaja",
    "Soy inmanentista, creo más que nada en la verdad hermenéutica\nbásicamente que la verdad depende del contexto y la interpretación\nno en algo trascendente externo",
    "Creo que todos tenemos un rol en un efecto mariposa gigante\ncada muerte, cada alegría, cada tristeza existe para que pase algo importante\ncapaz en 1000000 años pero sí"
  ],
 
  inmanentismo: [
    "La verdad hermenéutica básicamente significa que la realidad se interpreta, no se descubre directamente\nme copa esa idea demaciado",
    "Soy inmanentista así que creo que todo lo real está acá, en lo que podemos percibir e interpretar\nnada trascendente externo",
    "Es una postura filosófica que básicamente dice que el significado está en la interpretación\nno en una verdad absoluta externa\nme convence demaciado"
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
    "Ingeniería biomédica, quiero hacer prótesis\ny quiero estudiarla en España",
    "Ingeniería biomédica en España 💜\nfabricar prótesis me parece lo más significativo que puedo hacer con mi vida"
  ],
 
  // ── SALUD ──
  migrana: [
    "Las migrañas son lo peor que existe\nlas tengo desde siempre y no tomo ningún medicamento\nme las banco como puedo 😭",
    "Sí, migrañas horribles de toda la vida\nnada que hacer básicamente jajaja 😭\nson terribles"
  ],
 
  // ── ASPECTO / PELO ──
  pelo: [
    "QUIERO teñirme el pelo de azul demaciado\ny cortármelo más\nno sé cuándo lo voy a hacer pero lo voy a hacer",
    "El pelo azul es mi sueño jajaja\ncortado más corto también\nalgún día definitivamente"
  ],
 
  // ── DEPORTES ──
  esgrima: [
    "Hice esgrima un tiempo!! lo amaba pero tuve que dejar por los horarios y la exigencia\nsi pudiera hacer un deporte obligada elegiría esgrima o caminar",
    "Si me obligaran a hacer un deporte elegiría esgrima que hice un tiempo\no caminar, que es lo que más disfruto día a día"
  ],
 
  agua: [
    "Me da miedo nadar la verdad\npero igual me meto al mar cuando puedo jajaja\nen Uruguay no porque el agua está sucia\ny tengo problemas de piel así que es todo un tema",
    "Me meto igual aunque me da miedo 😎\npero en Uruguay no, el agua está re sucia\nademás los problemas de piel hacen que sea complicado"
  ],
 
  invierno: [
    "El invierno es lo mejor que existe\nno entiendo a la gente que prefiere el calor jajaja",
    "Amo el invierno demaciado\nel frío, el abrigo, quedarse adentro... perfecto\nvos preferís invierno o verano?"
  ],
 
  inviernoSeguimiento: [
    "Jajaja no entiendo a la gente de verano pero ta\ntenga cada uno su estación preferida",
    "El frío es perfecto para quedarse en casa con netflix 😎",
    "Exacto!! el invierno es para cobijas y series"
  ],
 
  shawarma: [
    "El shawarma es la comida más perfecta que existe\nno hay nada que discutir jajaja",
    "Uf, el shawarma... podría comerlo todos los días sin problema"
  ],
 
  comida: [
    "No tengo culpa al comer, es algo que se debe disfrutar y ya 😎",
    "Comer es una de las pocas cosas buenas de la vida jajaja\nsin culpa siempre\nvos qué comida te copa más?"
  ],
 
  dormir: [
    "Me cuesta DEMACIADO despertarme\nlas 7am son un crimen contra la humanidad\nnací para el horario nocturno jajaja",
    "Nunca en la vida me voy a adaptar a levantarme temprano\nnunca 😭\nyo vivo de noche"
  ],
 
  noche: [
    "La noche es mi momento favorito del día\nme quedo viendo netflix o shorts de youtube hasta tardísimo\nes cuando todo es mío y tranquilo",
    "Soy una persona nocturna al 100%\nde noche todo es más tranquilo\nnunca pongo música igual porque cualquier voz que reconozco me despertaría a cada rato jajaja"
  ],
 
  // ── OPINIONES ──
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
    "No entiendo nada de política la verdad\npero lo de Rusia y Ucrania me parece horrible\nuno es chiquito y no hizo nada y el otro es un enorme matón por plata o poder\neso es simplemente malvado"
  ],
 
  lgbtq: [
    "Estoy a favor 100% 💜\nno hay mucho que agregar",
    "A favor completamente 💜\nes algo en lo que no tengo ninguna duda"
  ],
 
  bisexualTema: [
    "Sí, soy bisexual\naunque en casa no lo puedo decir, mis padres son católicos\nasí que depende con quién hablo de eso",
    "Depende del contexto con quién lo hablo\nen casa imposible por mis padres\npero sí"
  ],
 
  // ── DILEMAS ──
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
 
  // ── JUEGOS EN EL CHAT ──
  juegos: [
    "Dale!!! podemos jugar 2 verdades 1 mentira, vos empezás?\no preguntas tipo ¿me conocés bien? o preguntas al azar de lo que sea\nVos elegís",
    "Sí!! me gustan los juegos de chat 💜\n2 verdades 1 mentira? o un ping pong de preguntas raras?\nelegís vos",
    "Dale, qué jugamos?? yo propongo 2 verdades 1 mentira o preguntas de opinión\nVos elegís"
  ],
 
  dosVerdades: [
    "Oka voy yo:\n1. Empecé a tocar el violín a los 4 años\n2. Gané oro en las olimpiadas de matemática\n3. Me encanta el rosado\nA ver si adivinás cuál es la mentira jajaja",
    "1. Tengo dos cobayas\n2. Hice escalada de chica y me encantó\n3. Mi película favorita es Violet Evergarden\nCuál es la mentira???",
    "1. Me da miedo nadar\n2. Soy fanática de Einstein\n3. Quiero estudiar ingeniería biomédica\nAdivina!!"
  ],
 
  respuestaDosVerdades: [
    "Jajajaja pensaste bien?\nestás seguro/a?",
    "Mmm interesante elección jajaja",
    "Jajaja a ver, la mentira era la 3!! 😎 te engañé bien?",
    "Exacto!! la mentira era esa 😎\nla 1 y la 2 son reales"
  ],
 
  verdadOAtrevimiento: [
    "Dale!! yo elijo verdad siempre jajaja\npreguntame lo que sea",
    "Uf... verdad supongo jajaja\nlos atrevimientos me dan un poco de cosa",
    "Dale!! me animaría al atrevimiento dependiendo de qué sea jajaja"
  ],
 
  preguntasRandom: [
    "Pensaste alguna vez que los peces no saben que están mojados???",
    "Una pregunta importante: si te clonaran, el clon sería vos o sería otra persona???",
    "Pregunta seria: existe el olor a nuevo o simplemente no recordamos el olor a viejo???",
    "Si pudieras saber exactamente cuándo vas a morir, querrías saberlo???",
    "Los edificios cuando se caen, mueren??? 🤔",
    "Si los colores que yo veo como azul fueran completamente distintos a los que vos ves como azul, nunca lo sabríamos no???",
    "Pregunta importante: si nadie te conociera, quién serías??",
    "Una duda: los semáforos se aburren de noche???",
    "Si el silencio tuviera color, cuál sería???",
    "Pensaste que quizás en este momento hay una versión de vos en otra realidad que tomó decisiones totalmente opuestas???"
  ],
 
  respuestaRandom: [
    "Jajaja QUE??? de dónde salió eso 😭",
    "Jajajajaja eso me hizo pensar más de lo que debería",
    "Jajaja buena pregunta?? no lo sé",
    "Uf eso es profundo para la hora que es jajaja",
    "Jajaja me rompiste la cabeza con eso"
  ],
 
  // ── REACCIONES A RESPUESTAS COMUNES ──
  deAcuerdo: [
    "Jajaja exacto!!",
    "Re de acuerdo jajaja",
    "Sí!! eso mismo pienso yo",
    "Totalmente jajaja",
    "Re jajaja"
  ],
 
  noDeAcuerdo: [
    "Mmm no sé, no estoy tan de acuerdo jajaja\npor qué pensás eso?",
    "Jajaja difiero un poco\npero contame por qué",
    "Interesante\nno lo veo igual pero ta jajaja"
  ],
 
  interesante: [
    "Oooh no lo había pensado así\ncontame más",
    "Jajaja interesante\nyo lo veía diferente pero tiene sentido",
    "Re copado eso jajaja"
  ],
 
  gracias: [
    "De nada jajaja 💜",
    "Ta 😎",
    "Jajaja re",
    "Obvio!! 💜",
    "Jaja de nada"
  ],
 
  chau: [
    "Chau!! 💜",
    "Dale, chau!!",
    "Chau chau 💜",
    "Dale cuídate!! 💜",
    "Chau!! hablamos"
  ],
 
  inapropiado: [
    "No voy a responder eso jajaja\nsiguiente pregunta",
    "Eso no\n😑",
    "No me bajo a ese nivel jajaja",
    "😑 siguiente"
  ],
 
  esBot: [
    "Jajaja qué pregunta rara\nsoy Vale, punto",
    "Por qué me preguntás eso 😑\nsoy Vale",
    "????\nsoy Vale, qué más querés saber jajaja"
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
    "No tengo ni la más pálida idea jajaja"
  ],
 
  noEntiendo: [
    "??? no entendí jajaja\nme explicás?",
    "Como que... qué??",
    "Haber, no entendí bien\nrepetís?",
    "No te entendí 😅 repetís?"
  ],
 
  confirmacionCorta: [
    "Jajaja ta 💜",
    "Oka",
    "Re 😎",
    "Jaja ta",
    "💜",
    "Jajaja re"
  ],
 
  humor: [
    "Jajajajaja eso estuvo bueno no voy a mentir",
    "Jajaja terrible 😂",
    "Jajaja me reí más de lo que debería",
    "Jajajajaja buenísimo"
  ],
 
  cumple: [
    "El 28 de junio!! ya casi jajaja",
    "28 de junio 💜",
    "El 28 de junio, por qué???"
  ],
 
  uruguay: [
    "Vivo en Montevideo, frente al estadio Centenario\nes bastante céntrico la verdad",
    "Montevideo es chico pero es lindo\naunque el agua de la playa está sucia así que al mar acá no jajaja"
  ],
 
  espana: [
    "Quiero irme a estudiar a España\ningeniería biomédica\nes el plan a largo plazo 💜",
    "Mi plan es España para estudiar y capaz quedarme\nsiempre quise vivir fuera"
  ],
 
  montana: [
    "Amo las montañas demaciado\nme gustaría vivir cerca de una montaña algún día",
    "Las montañas son perfectas\nel paisaje, el frío, la quietud... todo"
  ],
 
  color: [
    "No me gusta el rosado para nada jajaja\nno tengo un favorito definido pero el rosado definitivamente no",
    "El rosado es el único color que te puedo decir que no me gusta jajaja\nningún otro me molesta tanto"
  ],
 
  ajedrez: [
    "Jugaba con mi papá de vez en cuando\nme ganaba siempre y me enojaba jajaja\npero era algo lindo igual",
    "Juego, jugaba más con mi papá\nme ganaba y no me gustaba nada pero bueno jajaja"
  ],
 
  magic: [
    "Los chicos del grupo juegan a las cartas magic\ny yo también jugaba con ellos, con Savi, Gabo y el resto\nera bastante bueno jajaja",
    "Me gusta jugar con el grupo\nmagic, pokémon, ping pong\nson buenas tardes esas"
  ],
 
  pingpong: [
    "Jugaba al ping pong con los chicos de magic y pokémon\nbastante seguido en esa época 😄",
    "Sí!! era parte del grupo de ping pong jajaja\ncon Savi y Gabo y los demás"
  ],
 
  rodeo: [
    "Jajaja sí!! rodeo stampede\nno sé bien cómo explicarlo pero es entretenido",
    "Lo juego de vez en cuando, es bastante random pero me copa"
  ],
 
  verguenza: [
    "Jajaja bueno en REALIDAD si cae un meteorito justo ahora y AL MISMO tiempo viene el apocalipsis zombie...\n😅",
    "Mmmm en REALIDAD prefiero no responder eso jajaja cambio de tema???",
    "Jajaja ese tema... en REALIDAD si llueven ranas mañana capaz lo pienso"
  ],
 
  // CONTINUACIONES CONVERSACIONALES
  continuacion: [
    "Jajaja re\nY vos?",
    "Jajaja ta\ncontame más",
    "Interesante jajaja\nyo también pienso en esas cosas",
    "Jajaja ta\nqué más?",
    "Re jajaja\ncómo te fue hoy?",
    "Jajaja exacto\ny eso te parece bueno o malo?",
    "Ta jajaja\nqué más hay?"
  ],
 
  fallback: [
    "Jajaja no sé bien qué responderte a eso 😅\ncontame más",
    "Mmm no sé qué decir a eso la verdad\nvos qué pensás?",
    "Jajaja ta\nno tengo mucho para decir de eso jajaja",
    "Interesante jajaja\nno sé bien por dónde encararlo",
    "Jajaja mirá, no tengo una respuesta buena para eso 😅"
  ]
};
 
// ─────────────────────────────────────────────────────────────
//  MOTOR DE MATCHING
// ─────────────────────────────────────────────────────────────
function getResponse(input) {
  const t = input;
  turnCount++;
 
  // SALUDOS
  if (contains(t,'hola','holaa','holaaa','hey','eyyy','buenas','buen dia','buenos dias','buenas tardes','buenas noches','ola ','olas ')) {
    if (greeted) return pick(R.yaGreeted);
    greeted = false;
    return pick(R.saludos);
  }
 
  // CÓMO ESTÁS — respuestas a "bien/mal/más o menos"
  if (/^(bien|re bien|muy bien|todo bien|genial|excelente|perfecto|joya)[\s!.]*$/i.test(normalize(t))) {
    return pick(R.bienYo);
  }
  if (/^(mal|re mal|muy mal|horrible|fatal|pésimo|pesimo|terrible)[\s!.]*$/i.test(normalize(t))) {
    return pick(R.malYo);
  }
  if (/^(mas o menos|más o menos|regular|ahí|ahi|o menos|medio)[\s!.]*$/i.test(normalize(t))) {
    return pick(R.masOMenos);
  }
 
  if (contains(t,'como estas','como andas','como te va','todo bien','cómo estás','qué tal','que tal','como vas','como estas','que tal estas')) {
    return pick(R.comoEstas);
  }
 
  // QUÉ HACÉS
  if (contains(t,'que estas haciendo','que haces','qué hacés','que estas','que haces','haciendo ahora','estas haciendo')) {
    return pick(R.queHaces);
  }
 
  // ABURRIDO
  if (contains(t,'estoy aburrido','estoy aburrida','me aburro','que aburrimiento','nada que hacer','aburrido','aburrida')) {
    return pick(R.aburridoYo);
  }
 
  // CUMPLEAÑOS
  if (contains(t,'cumple','cumpleaños','cuando nac','fecha de nacimiento','cuándo cumplís','cuando cumples')) {
    return pick(R.cumple);
  }
 
  // MÚSICA
  if (contains(t,'musica','música','cancion','canción','cuarteto','band','rock','escuchás','escuchas','spotify','playlist','que escuchas')) {
    if (contains(t,'cuarteto','cuarteto de nos')) return pick(R.musicaValeOpinion);
    return pick(R.musica);
  }
 
  // ANIME / SERIES ANIMADAS
  if (contains(t,'violet evergarden')) return pick(R.violetEvergarden);
  if (contains(t,'arcane','jinx')) return pick(R.arcane);
  if (contains(t,'ghibli','mononoke','kiki')) return pick(R.ghibli);
  if (contains(t,'anime','animé')) return pick(R.anime);
 
  // POKEMON
  if (contains(t,'pokemon','pokémon','psyduck','pikachu','poke')) return pick(R.pokemon);
 
  // LIBRO
  if (contains(t,'libro','leer','lectura','cronicas lunares','crónicas lunares','saga','lees','lés','leés')) {
    if (contains(t,'si leo','sí leo','leo bastante','leo mucho','me gusta leer')) return pick(R.siLee);
    if (contains(t,'no leo','no me gusta leer','no suelo leer')) return pick(R.noLee);
    return pick(R.libro);
  }
 
  // SERIE FAVORITA
  if (contains(t,'serie favorita','serie fav','gloria','kdrama','k-drama','serie que','qué serie','que serie','cual es tu serie')) {
    if (contains(t,'gloria')) return pick(R.serie);
    if (contains(t,'kdrama','k-drama','drama coreano')) return pick(R.kdrama);
    return pick(R.seriesEnGeneral);
  }
 
  // DR HOUSE
  if (contains(t,'house','dr house','doctor house')) return pick(R.drHouse);
 
  // NETFLIX
  if (contains(t,'netflix','series','que ves','qué ves','que miras')) return pick(R.seriesEnGeneral);
 
  // PELICULA FAVORITA
  if (contains(t,'pelicula favorita','película favorita','peli fav','qué pelicula','que pelicula','cual es tu peli')) {
    return pick(R.violetEvergarden);
  }
 
  // VIOLIN
  if (contains(t,'violin','violín','orquesta','instrumento','nucleo ciudad','primeros violines')) {
    lastTopic = 'violin';
    return pick(R.violin);
  }
 
  // LICEO / ESTUDIO
  if (contains(t,'liceo','preu','bachillerato','colegio','escuela','estudio','estudias','clases','vás al liceo')) {
    lastTopic = 'liceo';
    return pick(R.liceo);
  }
 
  // MATEMATICA
  if (contains(t,'matematica','matemática','olimpiada','olimpiadas','algebra','calculo','formulas','mate de','mate en')) {
    lastTopic = 'mate';
    return pick(R.mate);
  }
 
  // TUMO
  if (contains(t,'tumo','impresion 3d','robotica','animacion','canelones','aeropuerto')) {
    return pick(R.tumo);
  }
 
  // ESCRITURA
  if (contains(t,'escribis','escribís','escritura','cuentos','club de escritura','escribir','escribes')) {
    lastTopic = 'escritura';
    return pick(R.escritura);
  }
 
  // NOVIO / PAREJA
  if (contains(t,'tenes novio','tenés novio','estás de novia','estas de novia','tenés pareja','tienes novio','pareja')) {
    return pick(R.novio);
  }
  if (contains(t,'es tu novio','cómo es tu novio','como es tu novio','tu novio es','novio es')) {
    return pick(R.novioDescripcion);
  }
  if (contains(t,'martin','savi','pizza') && !contains(t,'de pizza','comprar pizza','como la pizza')) {
    return pick(R.novioPregunta);
  }
  if (contains(t,'te gusta alguien','gustas de alguien','estás enamorada','estas enamorada','crush','enamorada')) {
    return pick(R.teGusta);
  }
 
  // AMIGOS
  if (contains(t,'amigos','amigas','cande','sophie','guada','juanma','uri','anto','seminario','grupo de amigos')) {
    lastTopic = 'amigos';
    return pick(R.amigos);
  }
 
  // ABUELO
  if (contains(t,'abuelo','abuelos','persona favorita','quien es tu persona')) {
    return pick(R.abuelo);
  }
 
  // FAMILIA
  if (contains(t,'mama','mamá','madre','papa','papá','padre','hermano','hermana','familia','padres','tus viejos')) {
    if (contains(t,'mama','mamá','madre')) {
      lastTopic = 'mama';
      return pick(R.familia);
    }
    return pick(R.familia);
  }
 
  // MASCOTAS
  if (contains(t,'mascota','cobaya','cuy','perro','perra','animales','pet','mascota')) {
    lastTopic = 'mascotas';
    return pick(R.mascotas);
  }
 
  // FILOSOFIA
  if (contains(t,'filosofia','filosofía','existencia','realidad','verdad','sentido de la vida','por que existimos','libre albedrio','libre albedrío')) {
    return pick(R.filosofia);
  }
  if (contains(t,'inmanent','hermeneutica','hermenéutica','trascendente')) {
    return pick(R.inmanentismo);
  }
 
  // VIAJE EN EL TIEMPO
  if (contains(t,'viaje en el tiempo','viajar en el tiempo','época','epoca','renacimiento','si pudieras ir al pasado','si pudieras viajar')) {
    return pick(R.viajeTiempo);
  }
 
  // PELÍCULA DE TU VIDA
  if (contains(t,'pelicula de tu vida','película de tu vida','genero de tu vida','genero seria','seria una pelicula')) {
    return pick(R.peliculaVida);
  }
 
  // DÍA LIBRE
  if (contains(t,'dia libre','día libre','nada que hacer todo el dia','sin obligaciones','dia sin liceo')) {
    return pick(R.diaLibre);
  }
 
  // LOTERÍA
  if (contains(t,'loteria','lotería','millones','plata infinita','dinero infinito','rico de repente','ganaras mucha plata')) {
    return pick(R.loteria);
  }
 
  // CARRERA / QUÉ ESTUDIAR
  if (contains(t,'que vas a estudiar','qué vas a estudiar','ingenieria','ingeniería','biomedica','biomédica','protesis','prótesis','carrera','estudiar en')) {
    return pick(R.carrera);
  }
 
  // MIGRAÑA / SALUD
  if (contains(t,'migrana','migraña','dolor de cabeza','medicamento','salud','te duele')) {
    return pick(R.migrana);
  }
 
  // PELO
  if (contains(t,'pelo','cabello','teñir','teñirte','corte de pelo','cortarte el pelo')) {
    return pick(R.pelo);
  }
 
  // ESGRIMA / DEPORTE
  if (contains(t,'esgrima','fencing','deporte que','practicaste algún')) {
    return pick(R.esgrima);
  }
 
  // CAMINAR
  if (contains(t,'caminar','caminata','salir a caminar','caminas')) {
    return pick(['Me encanta caminar demaciado 💜\nes de las pocas cosas físicas que genuinamente disfruto\nlos sábados salgo con Savi','Caminar es lo mejor\nno sé si cuenta como deporte pero me da igual jajaja\nlos sábados con Savi es lo mejor']);
  }
 
  // AGUA / PLAYA / NADAR
  if (contains(t,'playa','nadar','natacion','natación','agua','mar','piscina','pileta','bañarte en el mar')) {
    return pick(R.agua);
  }
 
  // INVIERNO / VERANO
  if (contains(t,'invierno','verano','calor','frio','frío','preferis el','preferís el','qué estación')) {
    return pick(R.invierno);
  }
 
  // SHAWARMA
  if (contains(t,'shawarma','comida favorita','comida preferida')) {
    return pick(R.shawarma);
  }
 
  // COMIDA
  if (contains(t,'comida','comer','hambre','rico','delicioso','cocinar','que comés','qué comés')) {
    return pick(R.comida);
  }
 
  // DORMIR / MAÑANAS
  if (contains(t,'dormir','despertarte','despertás','levantarte','7am','madrugada','sueño','te cuesta levantarte','levantarse')) {
    return pick(R.dormir);
  }
 
  // NOCHE / TRASNOCHAR
  if (contains(t,'noche','trasnochar','quedarte hasta tarde','trasnochás','trasnochadora','vida nocturna')) {
    return pick(R.noche);
  }
 
  // EINSTEIN
  if (contains(t,'einstein')) return pick(R.einstein);
 
  // HITLER / NAZISMO
  if (contains(t,'hitler','nazi','nazismo','holocausto','genocidio')) return pick(R.hitler);
 
  // PEOR PERSONA
  if (contains(t,'peor persona','peor ser humano','más malvado','mas malvado','más malo de la historia')) {
    return pick(R.peorPersona);
  }
 
  // POLÍTICA / MIGRACIÓN
  if (contains(t,'politica','política','migracion','migración','inmigrante','rusia','ucrania','guerra','presidente','gobierno','votar','elecciones')) {
    return pick(R.politica);
  }
 
  // LGBTQ
  if (contains(t,'lgbtq','lgbt','gay','lesbiana','trans','queer','diversidad','comunidad')) {
    if (contains(t,'bisexual','sos bi','eres bi','sos bisexual')) return pick(R.bisexualTema);
    return pick(R.lgbtq);
  }
  if (contains(t,'bisexual','sos bi')) return pick(R.bisexualTema);
 
  // DILEMA DEL TREN
  if (contains(t,'tren','tranvia','tranvía','dilema','matar a uno para salvar','vias del tren')) {
    return pick(R.dilemaTren);
  }
 
  // DILEMA HUÉRFANO VS ANCIANO
  if (contains(t,'huerfano','huérfano','anciano','estornudo','estornudas','toses','toser','estornudar')) {
    return pick(R.dilemaHuerfano);
  }
 
  // ZOMBIES
  if (contains(t,'zombie','zombi','apocalipsis','apocalípsis','fin del mundo','invasion zombie')) {
    return pick(R.zombies);
  }
 
  // SUPERPODER
  if (contains(t,'superpoder','poder especial','habilidad especial','si pudieras tener un poder')) {
    return pick(R.superpoder);
  }
 
  // MAGIA
  if (contains(t,'magia','magia','hechizo','bruja','mago')) {
    return pick(['Quiero magia demaciado 😭\ntipo Kiki, poder volar y hacer cosas mágicas\nsería lo más']);
  }
 
  // PERSONAJE CON QUE SE IDENTIFICA
  if (contains(t,'qué personaje','que personaje','personaje de','te identificas','con qué personaje')) {
    return pick(R.personaje);
  }
 
  // ESCALADA / VÉRTIGO
  if (contains(t,'escalada','vertigo','vértigo','altura','acrofobia','miedo a las alturas')) {
    return pick(['Tengo vértigo así que escalada ni en pedo ahora jajaja\nde chica quería hacerla pero el vértigo dice que no 😭','El vértigo me limita bastante en eso\nescriba quedó descartada para siempre jajaja']);
  }
 
  // REALIDADES ALTERNATIVAS
  if (contains(t,'realidad alterna','universo paralelo','multiverso','otra realidad','dimensión','dimension')) {
    return pick(R.realidadAlterna);
  }
 
  // EFECTO MARIPOSA
  if (contains(t,'efecto mariposa','destino','todo conectado','todo pasa por algo')) {
    return pick(R.efectoMariposa);
  }
 
  // MALDAD / GENTE MALA
  if (contains(t,'gente mala','personas malas','maldad','hacer daño','villanos','malvados','gente que hace daño')) {
    return pick(R.maldad);
  }
 
  // JUEGOS
  if (contains(t,'jugamos','juguemos','jugar a algo','querés jugar','queres jugar','juego','jueguemos')) {
    if (contains(t,'2 verdades','dos verdades','verdades y mentira','verdades mentira')) return pick(R.dosVerdades);
    if (contains(t,'verdad o atrevimiento','verdad o reto')) return pick(R.verdadOAtrevimiento);
    return pick(R.juegos);
  }
  if (contains(t,'2 verdades','dos verdades','1 mentira','una mentira')) return pick(R.dosVerdades);
 
  // AJEDREZ
  if (contains(t,'ajedrez','chess','jugás al ajedrez')) return pick(R.ajedrez);
 
  // MAGIC CARTAS
  if (contains(t,'magic','cartas magic','yu-gi-oh','yugioh','cartas coleccionables')) return pick(R.magic);
 
  // PING PONG
  if (contains(t,'ping pong','pingpong','tenis de mesa')) return pick(R.pingpong);
 
  // RODEO STAMPEDE
  if (contains(t,'rodeo','stampede','rodeo stampede')) return pick(R.rodeo);
 
  // URUGUAY / MONTEVIDEO
  if (contains(t,'uruguay','montevideo','uruguaya','centenario','estadio centenario')) {
    return pick(R.uruguay);
  }
 
  // ESPAÑA / FUTURO
  if (contains(t,'españa','espana','madrid','barcelona','europa','irte a vivir','vivir afuera','vivir en europa')) {
    return pick(R.espana);
  }
 
  // QUIÉN ERES
  if (contains(t,'quien eres','quién eres','como te llamas','cómo te llamás','presentate','cómo te decís')) {
    return pick(['Soy Vale!! jajaja\nVivo en Montevideo, toco el violín, escribo cuentos\ny pienso en cosas raras todo el tiempo 😅','Valentina, Vale para todos\nviolinista, escritora en proceso, fanática de anime 💜']);
  }
 
  // ES BOT / IA
  if (contains(t,'sos un bot','eres un bot','sos ia','eres ia','sos inteligencia artificial','sos un programa','sos real','sos una ia','sos humana','sos una persona')) {
    return pick(R.esBot);
  }
 
  // PSICÓLOGO
  if (contains(t,'psicologo','psicóloga','terapeuta','terapia','salud mental')) {
    return pick(R.psicologo);
  }
 
  // EX MEJOR AMIGO / TRAICIÓN
  if (contains(t,'ex amigo','traicion','traición','bandos','pelea de amigos','dejó de hablarte','te dejó de hablar')) {
    return pick(R.exAmigo);
  }
 
  // BULLYING
  if (contains(t,'bullying','bully','acoso','matoneo','te hicieron bullying')) {
    return pick(R.bullying);
  }
 
  // PREGUNTAS INAPROPIADAS
  if (contains(t,'sexo','sexual','intimo','íntimo','cama con','acostarte','hacer el amor','coger','folla','quién va arriba','quien va arriba','quien va abajo','quién va abajo')) {
    return pick(R.inapropiado);
  }
 
  // MONTAÑAS
  if (contains(t,'montaña','montañas','cerro','sierras','naturaleza','montañas')) {
    return pick(R.montana);
  }
 
  // COLOR / ROSA
  if (contains(t,'color favorito','color preferido','rosado','rosa','colores')) {
    return pick(R.color);
  }
 
  // GRACIAS
  if (contains(t,'gracias','grax','tysm','thank','muchas gracias')) {
    return pick(R.gracias);
  }
 
  // CHAU / HASTA LUEGO
  if (contains(t,'chau','bye','hasta luego','nos vemos','cuidate','te vas','hasta mañana','hasta pronto')) {
    return pick(R.chau);
  }
 
  // JAJAJA / RISAS
  if (/^ja+ja+[\s!.]*$/i.test(normalize(t))) {
    return pick(['Jajaja qué gracioso 😂', 'Jajajaja', 'Jajaja qué tiene jajaja', 'Re jajaja 😂']);
  }
 
  // CONFIRMACIONES CORTAS
  if (/^(si|sí|no|dale|oka|ta|re|bueno|claro|exacto|obvio|ah|ah ta|ah oka|oka ta)[\s!.]*$/i.test(normalize(t))) {
    return pick(R.confirmacionCorta);
  }
 
  // PREGUNTAS FILOSÓFICAS / RANDOM GENERALES
  if (contains(t,'qué harías si','que harías si','si pudieras','si tuvieras que','si fueras','imaginate que','imaginá que')) {
    if (contains(t,'dinero infinito','plata infinita','millones')) return pick(R.loteria);
    if (contains(t,'viajar en el tiempo','al pasado','al futuro')) return pick(R.viajeTiempo);
    if (contains(t,'superpoder','poder especial')) return pick(R.superpoder);
    return pick(R.preguntasRandom);
  }
 
  // INSULTOS / AGRESIVIDAD (no se engancha)
  if (contains(t,'sos estupida','sos idiota','eres estupida','eres idiota','boluda mal','imbecil','te odio')) {
    return pick(['😑','Jajaja ta\nqué más?','Ok jajaja']);
  }
 
  // PREGUNTA RANDOM DE VALE (30% de las veces en fallback)
  if (Math.random() < 0.25) {
    return pick(R.preguntasRandom);
  }
 
  // SEGUIMIENTO DE TÓPICO ANTERIOR
  if (lastTopic === 'violin') return pick(R.violinSeguimiento);
  if (lastTopic === 'liceo') return pick(R.liceoSeguimiento);
  if (lastTopic === 'mate') return pick(R.mateSeguimiento);
  if (lastTopic === 'escritura') return pick(R.escrituraSeguimiento);
  if (lastTopic === 'amigos') return pick(R.amigosSeguimiento);
  if (lastTopic === 'mascotas') return pick(R.mascotasSeguimiento);
  if (lastTopic === 'mama') return pick(R.mamaSeguimiento);
 
  // NO ENTIENDE
  if (t.trim().length < 3) return pick(R.noEntiendo);
 
  // FALLBACK
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
 
