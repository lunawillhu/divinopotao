// DICCIONARIO DE TEXTOS: inglés (Sweet Tape) → español (Skala).
// Para cambiar un texto de la página, cambiá el valor de la derecha y volvé a correr:
//   node herramientas/skala/aplicar.js
// La clave de la izquierda tiene que ser EXACTAMENTE el texto original (mayúsculas, comas y apóstrofos ’ incluidos).
//
// Equivalencias de productos (la dirección de cada página no cambia):
//   /products/cloth       → #Mais Cachos         (rulos)                — antes "The Fixer"
//   /products/masking     → Divino Potão         (transición capilar)   — antes "The Creative"
//   /products/double      → Hidro-Nutritivo Plus (hidratación)          — antes "The Trusty"
//   /products/opp         → Raízes do Morro      (fuerza y crecimiento) — antes "The Reliable"
//   /products/opp-quiet   → Crespinho Divino     (crespos, sin frizz)   — antes "The Silent"
//   /products/stationery  → #Mais Cachinhos      (para chicos)          — antes "The Buddy"
'use strict';

const MARCA = 'Skala';

const frases = {
  // ───────── Generales / menú / pie ─────────
  'SweetTape': MARCA,
  'SweetTape.': MARCA + '.',
  'Sweet Tape': MARCA,
  'STICK BY YOU': 'TU PELO, TU MUNDO',
  'BY YOU': 'TU MUNDO',
  'OUR FAMILY': 'PRODUCTOS',
  'ABOUT': 'NOSOTROS',
  'NEWS': 'NOVEDADES',
  'CONTACT': 'CONTACTO',
  'EXPLORE': 'VER MÁS',
  'Skip to content': 'Ir al contenido',
  'Footer': 'Pie de página',
  'Copyright © 2026. SB Tape Group Sdn Bhd': 'Copyright © 2026. Sitio educativo EPET 20 — no oficial de Skala',
  'Back home': 'Volver al inicio',
  'Page not found': 'Página no encontrada',
  '404: This page could not be found.': '404: no encontramos esta página.',
  'This page could not be found.': 'No encontramos esta página.',
  'nothing here.': 'acá no hay nada.',
  'nothing here. the links below still work': 'acá no hay nada. los links de abajo funcionan',
  'the links below': 'los links de abajo',
  'still work': 'funcionan',
  'FOUND': 'ENCONTRADA',

  // ───────── Metadatos (pestaña del navegador / Google) ─────────
  'SweetTape — Stick By You | Cloth, Masking & OPP Tapes': 'Skala — Tu pelo, tu mundo | Cremas de tratamiento 2 en 1',
  'Six tapes made in Malaysia, one for every job — cloth, masking, stationery, double-sided and more. Three generations of tape; meet the one who sticks.':
    'Seis cremas Skala, una para cada tipo de pelo: rulos, crespos, transición, hidratación, fuerza y para los más chicos. Veganas y libres de crueldad animal.',
  'Our Family — Six Tapes, One for Every Job | SweetTape': 'Productos — Seis cremas, una para cada pelo | Skala',
  'Pick your player: cloth for strength, masking for clean lines, stationery for the desk, double-sided for the invisible fix. Six tapes, one family.':
    'Elegí tu crema: rulos definidos, transición sin drama, hidratación profunda, fuerza desde la raíz. Seis cremas, una familia.',
  'About SweetTape — Three Generations of Tape, One Face': 'Sobre Skala — Cremas veganas para todo tipo de pelo',
  'Three generations of tape. We wanted to be clearer, easier to choose, recognisable and more human — the same tape as always, finally with a face.':
    'Cremas de tratamiento 2 en 1, veganas y libres de crueldad animal. Más fáciles de elegir, reconocibles y humanas.',
  'What’s Rolling — News, Events & Stories from SweetTape': 'Novedades — Lanzamientos e historias de Skala',
  'Launches, store shelves and stories from the SweetTape family — what’s rolling right now, where to find us, and what we’re sticking together next.':
    'Lanzamientos, dónde encontrarnos y novedades de la familia Skala.',
  'Contact — SweetTape': 'Contacto — Skala',
  'Get in touch with SweetTape — SB Tape Group Sdn Bhd': 'Escribile a Skala (sitio educativo EPET 20)',
  'Cloth tape — SweetTape': '#Mais Cachos — Skala',
  'Masking tape — SweetTape': 'Divino Potão — Skala',
  'Double-sided tissue tape — SweetTape': 'Hidro-Nutritivo Plus — Skala',
  'OPP tape — SweetTape': 'Raízes do Morro — Skala',
  'OPP tape, low noise — SweetTape': 'Crespinho Divino — Skala',
  'Stationery tape — SweetTape': '#Mais Cachinhos — Skala',
  'Built for the jobs that fight back. Tough weave, firm grip, tears clean by hand.': 'Para rulos con personalidad: define, hidrata y controla el frizz.',

  // ───────── Inicio ─────────
  'STICK WITH YOU THROUGH THREE GENERATIONS': 'CUIDAMOS TU PELO TODOS LOS DÍAS',
  'STICK WITH YOU THROUGH': 'CUIDAMOS TU PELO',
  'THREE GENERATIONS': 'TODOS LOS DÍAS',
  'THREE GENERATION': 'TODOS LOS DÍAS',
  "WE'RE HERE TO": 'ESTAMOS PARA',
  'HERE TO': 'PARA',
  "WE'RE": 'ESTAMOS',
  'DIY FAIL, MOVING DAY CHAOS, SCHOOL PROJECT EMERGENCY,LAST-MINUTES FIXES. WE ALWAYS STICK BY YOU.':
    'DÍAS DE HUMEDAD, PELO REBELDE, FRIZZ DE ÚLTIMO MOMENTO. SKALA SIEMPRE ESTÁ CON VOS.',
  'we built for everyday moments. not industrial—just real life.': 'cremas para todos los días. sin vueltas, para la vida real.',
  'WE BUILT FOR EVERYDAY MOMENTS. NOT INDUSTRIAL—JUST REAL LIFE.': 'CREMAS PARA TODOS LOS DÍAS. SIN VUELTAS, PARA LA VIDA REAL.',
  'WE BUILT FOR EVERYDAY MOMENTS.': 'CREMAS PARA TODOS LOS DÍAS.',
  'NOT INDUSTRIAL—JUST REAL LIFE.': 'SIN VUELTAS, PARA LA VIDA REAL.',
  'we built for': 'cremas para',
  'WE BUILT FOR': 'CREMAS PARA',
  'everyday moments.': 'todos los días.',
  'EVERYDAY MOMENTS.': 'TODOS LOS DÍAS.',
  'not industrial—just': 'sin vueltas, para',
  'NOT INDUSTRIAL—JUST': 'SIN VUELTAS, PARA',
  'real life.': 'la vida real.',
  'REAL LIFE.': 'LA VIDA REAL.',
  'WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   WHEN LIFE GETS MESSY,      SOMETHING HAS TO HOLD   ':
    'CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   CUANDO EL PELO SE REBELA,      SKALA LO CUIDA   ',
  'WHEN LIFE GETS MESSY,': 'CUANDO EL PELO SE REBELA,',
  'SOMETHING HAS TO HOLD': 'SKALA LO CUIDA',
  'MEET THE ONE WHO STICKS': 'CONOCÉ TU CREMA',
  'ROLL IT!': '¡PROBALA!',
  'LABELING': 'DEFINE',
  'PAINT WORK': 'HIDRATA',
  'BUNDLING': 'NUTRE',
  'LABELINGPAINT WORKBUNDLING': 'DEFINEHIDRATANUTRE',
  'Always ready for school projects, quick labels, and weekend crafts. Easygoing. Comes off clean. No drama.':
    'Lista para la transición capilar: une las dos texturas, hidrata y nutre. Fácil de usar. Sin enjuague. Sin drama.',
  // Carrusel del inicio (atributos data-tags y data-copy de cada producto)
  'LABELING|PAINT WORK|BUNDLING': 'DEFINE|HIDRATA|NUTRE',
  'INVISIBLE HOLDING|SMOOTH MOUNTING|QUICK PATCHING': 'HIDRATACIÓN|NUTRICIÓN|SUAVIDAD',
  'SMALL REPAIRS|STICK & GO|DESK DRAWER ESSENTIAL': 'SIN TIRONES|SIN LÁGRIMAS|PARA CHICOS',
  'QUICK FIX|STRONG REPAIRS|BUNDLING': 'RULOS DEFINIDOS|ANTI FRIZZ|BRILLO',
  'SEALING|PACKAGING|WRAPPING': 'FUERZA|CRECIMIENTO|RAÍZ FUERTE',
  'CHILL BUNDLING|QUIET LABELING|SOFT PACKING': 'CRESPOS|SUAVIDAD|SIN FRIZZ',
  'The kind of tape that commits. Strong hold on both sides, easy to use, hard to let go.':
    'La crema que se compromete. Hidrata por dentro y por fuera, fácil de usar, difícil de dejar.',
  'From broken corners to last-minute projects. Easy to tear. Easy to use. Weirdly reliable.':
    'Para los rulitos de los más chicos. Desenreda fácil. Sin lágrimas. Increíblemente suave.',
  'Doesn’t talk much. Just holds everything together. Rain or shine.':
    'No habla mucho. Solo define cada rulo. Con lluvia o con sol.',
  'Moving house? Packing chaos? This one shows up every time.':
    '¿Pelo que se quiebra? ¿Crece lento? Esta aparece siempre.',
  'Perfect for calm packers, quiet workers, and people who tape at 2AM. Soft roll. Strong stick.':
    'Perfecta para crespos con personalidad. Suaviza sin endurecer. Definición que dura.',
  'WE’RE HERE FOR THE EVERYDAY MOMENTS.': 'ESTAMOS EN CADA DÍA DE TU PELO.',
  'WE’RE HERE': 'ESTAMOS',
  'FOR THE EVERYDAY': 'EN CADA DÍA',
  'MOMENTS.': 'DE TU PELO.',
  'TO CREATE': 'PARA DEFINIR',
  'TO FIX': 'PARA REPARAR',
  'TO PROTECT': 'PARA PROTEGER',
  'CREATE': 'DEFINIR',
  'PROTECT': 'PROTEGER',
  'LET’S MAKE IT STICK!': '¡QUE TU PELO BRILLE!',
  'LET’S': '¡QUE TU',
  'MAKE IT': 'PELO',
  'STICK!': 'BRILLE!',
  'For everything that matters.': 'Para todo tipo de pelo.',
  'every masterpiece': 'cada peinado',
  'starts held': 'empieza con',
  'in place.': 'una buena crema.',
  'every masterpiecestarts heldin place.': 'cada peinadoempieza conuna buena crema.',
  'from our hands': 'de nuestras manos',
  'to theirs,': 'a las tuyas,',
  'arriving whole.': 'con todo el cuidado.',
  'the quick fix': 'la crema rápida',
  'that outlasts': 'que dura más',
  'the thing it fixed.': 'que el mal día.',
  'Six rolls of SweetTape held in someone’s arms — stationery, OPP, cloth, masking and double-sided tissue tape.':
    'Seis potes de crema Skala en los brazos de alguien.',
  'THE CREATIVE': 'LA CREATIVA',
  'WHY WE EXIST': 'POR QUÉ EXISTIMOS',

  // ───────── Productos (familia) ─────────
  'PICK YOUR PLAYER': 'ELEGÍ TU CREMA',
  'PICK YOUR': 'ELEGÍ TU',
  'PLAYER': 'CREMA',
  'clickme!': 'tocame!',
  'click': 'tocame',
  'me!': '¡ya!',
  'MEET THE NEXT FAMILY': 'CONOCÉ LA SIGUIENTE',
  'NEXT UP': 'LA QUE SIGUE',
  'Next tape': 'Siguiente crema',
  'Previous tape': 'Crema anterior',
  'Next up: Cloth tape': 'Sigue: #Mais Cachos',
  'Next up: Masking tape': 'Sigue: Divino Potão',
  'Next up: Double-sided tissue tape': 'Sigue: Hidro-Nutritivo Plus',
  'Next up: OPP tape': 'Sigue: Raízes do Morro',
  'Next up: OPP tape, low noise': 'Sigue: Crespinho Divino',
  'Next up: Stationery tape': 'Sigue: #Mais Cachinhos',
  'Cloth tape': '#Mais Cachos',
  'Cloth tape at work': '#Mais Cachos en acción',
  'Cloth Tape Normal': '#Mais Cachos 1 kg',
  'Cloth Tape Strong.Black': '#Mais Cachos 250 g',
  'Masking tape': 'Divino Potão',
  'Masking tape at work': 'Divino Potão en acción',
  'masking tape normal': 'Divino Potão 1 kg',
  'masking tape strong': 'Divino Potão 250 g',
  'Double-sided tissue tape': 'Hidro-Nutritivo Plus',
  'Double-sided tissue tape at work': 'Hidro-Nutritivo Plus en acción',
  'OPP tape': 'Raízes do Morro',
  'OPP tape at work': 'Raízes do Morro en acción',
  'opp tape normal': 'Raízes do Morro 1 kg',
  'opp tape strong': 'Raízes do Morro 250 g',
  'opp tape extra strong': 'Raízes do Morro shampoo',
  'OPP tape, low noise': 'Crespinho Divino',
  'OPP tape, low noise at work': 'Crespinho Divino en acción',
  'Stationery tape': '#Mais Cachinhos',
  'Stationery tape at work': '#Mais Cachinhos en acción',
  'stationary tape cello': '#Mais Cachinhos 250 g',
  'stationary tape normal': '#Mais Cachinhos 1 kg',
  'OPP': 'RAÍZES',
  'Tape': 'Crema',
  'COLOURS': 'TAMAÑOS',
  'ORIGIN': 'ORIGEN',
  'SUPER POWERS': 'SÚPER PODERES',
  'SUPER': 'SÚPER',
  'POWERS': 'PODERES',
  'THE SIBLINGS': 'LA FAMILIA',
  'THE FIXER': 'LA DIOSA',
  'THE TRUSTY': 'LA SERENA',
  'THE RELIABLE': 'LA PODEROSA',
  'THE SILENT': 'LA SEDOSA',
  'THE BUDDY': 'LA PEQUE',

  // Cloth → #Mais Cachos
  'Practical, no-drama, and quietly heroic. Doesn\'t need a plan, only five seconds.':
    'Práctica, sin drama y heroína silenciosa. No necesita plan: solo cinco minutos.',
  'Steady. No-nonsense. The strong heroic type who lets his grip do the talking.':
    'Firme y sin vueltas. Define cada rulo y deja que el brillo hable por ella.',
  'steady, no-nonsense. the strong heroic type who lets his grip do the talking.':
    'firme y sin vueltas. define cada rulo y deja que el brillo hable por ella.',
  'Frank didn\'t choose the problem-solver life. The problem-solver life chose him. He\'s been the guy people call in a panic ever since, and he\'s never once said no.':
    'Mais Cachos no eligió ser la crema de los rulos: los rulos la eligieron a ella. Desde entonces es la que todos buscan en un día de frizz, y nunca dijo que no.',
  'The repair that bought you just enough time, and in some cases, held on for a lifetime.':
    'Los rulos que aguantan todo el día, y en algunos casos, hasta el día siguiente.',
  'HEAVY DUTY': 'RULOS DEFINIDOS',
  'ROUGH READY': 'ANTI FRIZZ',
  'SECURE BUNDLING': 'HIDRATACIÓN',
  'QUICK FIX': 'SIN SULFATOS',
  'Built for heavy loads and long hauls': 'Define rulos y ondas sin dejarlos duros',
  'Grips rough and uneven surfaces with ease': 'Controla el frizz incluso con humedad',
  'Bundling cables, pipes, or anything awkward': 'Hidrata con manteca de karité y aceite de ricino',
  'Quick fixes that somehow end up being permanent ones': 'Sin sulfatos, parabenos, siliconas ni aceite mineral',

  // Masking → Divino Potão
  'Adaptable, dependable, and always ready for the next job. The one who never complains, no matter what you throw at him.':
    'Adaptable, confiable y siempre lista para la transición. La que nunca se queja, sin importar qué textura le toque.',
  'Handy Andy is the jack of all trades. Painting, labelling, bundling, light sealing, whatever the job, he shows up ready and gets it done without breaking a sweat.':
    'Divino Potão sirve para todo: tratar, peinar, definir y nutrir. Sea cual sea el día, aparece lista y lo resuelve sin despeinarse.',
  'The day you only needed one tape, and it handled everything.': 'El día que necesitaste una sola crema, y resolvió todo.',
  'CLEAN HOLD': 'TRANSICIÓN',
  'CRAFT READY': '2 EN 1',
  'GENTLE HOLD': 'SUAVIDAD',
  'TRACE FREE': 'SIN ENJUAGUE',
  'Strong enough for a light carton, clean enough for a paint job': 'Une las dos texturas del pelo en transición',
  'Perfect for delicate materials': 'Perfecta para pelo frágil o con química',
  '⁠Leaves no trace: removable, residue-free, every time': 'No deja el pelo pesado ni pegajoso',

  // Double → Hidro-Nutritivo Plus
  'Reserved, precise, and completely unbothered by the lack of recognition. He knows what he did.':
    'Reservada, precisa y tranquila aunque nadie la note. Ella sabe lo que hizo.',
  'Sam realised early on that the best work is the kind nobody notices. While everyone else wanted the spotlight, he chose the background and quietly became the most indispensable one in the room.':
    'Hidro-Nutritivo entendió temprano que el mejor trabajo es el que no se nota. Mientras las demás querían brillar, ella eligió hidratar en silencio y se volvió imprescindible.',
  'A display so seamless, nobody thinks to ask how you pulled it off.': 'Un pelo tan suave que nadie pregunta cómo lo lograste.',
  'INVISIBLE SEAL': 'HIDRATACIÓN',
  'NEAT SEAL': 'NUTRICIÓN',
  'Invisible on paper: clean and seamless': 'Hidratación profunda desde la primera vez',
  'Zero visibility: holds without a trace': 'Nutre sin apelmazar',
  'Seals so clean it looks professional': 'Suavidad de peluquería en casa',
  'Makes your gift wrapping look suspiciously professional': 'Deja el pelo sospechosamente perfecto',

  // OPP → Raízes do Morro / OPP quiet → Crespinho Divino
  'Built for the big leagues. BIG BARRY Hold showed up the day someone taped a fragile box with the wrong tape and watched it arrive in pieces. Never again.':
    'Hecha para pelo que quiere crecer fuerte. Raízes do Morro apareció el día que alguien vio su pelo quebrarse con la crema equivocada. Nunca más.',
  'Your parcel arriving exactly the way you packed it': 'Tu pelo fuerte, de la raíz a las puntas',
  'Your parcel arriving exactly the way you packed it.': 'Tu pelo suave, de la raíz a las puntas.',
  'The box\'s bodyguard. Strong hold, smooth pull, and seals that last the whole journey.':
    'La guardaespaldas de tu pelo. Fortalece, suaviza y protege todo el día.',
  'All the hold, none of the screech. Unrolls quiet, seals tight, and never announces itself.':
    'Toda la definición, nada de frizz. Suaviza los crespos y nunca los deja duros.',
  'BOX SEALER': 'FUERZA',
  'TRUSTED PRO': 'CRECIMIENTO',
  'CLEAN STRENGTH': 'RAÍZ FUERTE',
  'GIFT PERFECT': 'CRESPOS',
  'GIFT MASTERY': 'SIN FRIZZ',
  'Reliable across the board, whatever the task throws at him': 'Fortalece el pelo desde la raíz',
  'Works beautifully on paper, fabric, and décor': 'Funciona en todo tipo de pelo, incluso con química',
  'Seals boxes so well, they arrive looking like you personally escorted them.':
    'Fortalece tanto que tu pelo parece recién salido de la peluquería.',
  'Makes gift wrapping look like you actually tried': 'Peina sin tirones y deja los rulitos suaves',
  // ayuda de los tamaños ("pasá el mouse / tocá para ver los tamaños")
  'hover': 'pasá el mouse',
  'tap': 'tocá',
  'to explore': 'para ver',
  'the colours.': 'los tamaños.',

  // Stationery → #Mais Cachinhos
  'Light, neat, and effortlessly charming. Small but never underestimated. The one who makes everything look intentional.':
    'Liviana, suave y encantadora. Pequeña pero nunca subestimada. Desenreda sin lágrimas.',
  'Lucy showed up on a gift-wrapping table one December and never really left. She realised pretty quickly that the finishing touch is the one, people actually remember.':
    'Mais Cachinhos llegó al baño de casa un verano y nunca más se fue. Entendió rápido que el peinado sin tirones es el que los chicos recuerdan.',
  'A gift that looks like it was wrapped with actual love.': 'Rulitos peinados con amor de verdad.',
  'Light,': 'Liviana,',

  // ───────── Nosotros ─────────
  'MADE FOR A REASON': 'HECHAS CON UN PROPÓSITO',
  'THAT\'S WHY SWEET TAPE EXISTS.': 'POR ESO EXISTE SKALA.',
  'ONE SHARED BELIEF': 'UNA MISMA IDEA',
  'We believe the world is better with': 'Creemos que el mundo es mejor con',
  // "THAT'S WHY SWEET [GOOD THINGS STICK] TAPE EXISTS." (título con palabras que giran)
  "THAT'S WHY": 'POR ESO',
  'SWEET': 'EXISTE',
  'GOODTHINGSSTICK': 'BUEN PELO SIEMPRE',
  'TAPE': 'SKALA',
  'EXISTS.': '♥',
  'TO REIMAGINE AN EVERYDAY ESSENTIAL AS SOMETHING MORE THOUGHTFUL, EXPRESSIVE AND FULL OF HEART.':
    'CUIDAR EL PELO DE TODOS LOS DÍAS CON PRODUCTOS VEGANOS, ALEGRES Y LLENOS DE CORAZÓN.',
  'we’ve believed that even the simplest products deserve thoughtful design.': 'creemos que hasta la crema más simple merece un buen diseño.',
  "we've believed that even the simplest products deserve thoughtful design.": 'creemos que hasta la crema más simple merece un buen diseño.',
  'we’ve believed that': 'creemos que',
  "we've believed that": 'creemos que',
  'even the simplest': 'hasta la crema más simple',
  'products deserve': 'merece un',
  'thoughtful design.': 'buen diseño.',
  'ROWS OF': 'FILAS DE',
  'PRODUCTS.': 'POTES.',
  'ROWS OFPRODUCTS.': 'FILAS DEPOTES.',
  'SAME PLAIN': 'MISMOS',
  'PACKAGING.': 'ENVASES.',
  'SAME PLAINPACKAGING.': 'MISMOSENVASES.',
  'ENDLESS CHOICES THAT': 'MILES DE OPCIONES QUE',
  'SOMEHOW ALL BLUR TOGETHER.': 'TERMINAN PARECIENDO IGUALES.',
  'Very few stood out.': 'Muy pocas se destacaban.',
  'Even fewer felt memorable.': 'Menos todavía se recordaban.',
  'same material. same roll. same routine.': 'mismo pote. misma crema. misma rutina.',
  'same material.same roll.same routine.': 'mismo pote.misma crema.misma rutina.',
  'same material.': 'mismo pote.',
  'same roll.': 'misma crema.',
  'same routine.': 'misma rutina.',
  'WE DIDN’T WANT TO BE LOUDER. WE WANTED TO BE': 'NO QUERÍAMOS HACER MÁS RUIDO. QUERÍAMOS SER',
  'CLEARER': 'MÁS CLARAS',
  'EASY TO CHOOSE': 'FÁCILES DE ELEGIR',
  'RECOGNISABLE': 'RECONOCIBLES',
  'MORE HUMAN': 'MÁS HUMANAS',
  'MORE COLOUR, MORE HEART, AND YES — BETTER TAPE.': 'MÁS COLOR, MÁS CORAZÓN Y SÍ: MEJOR CREMA.',
  'If you have bought tape from us before, the roll in your hand has not changed. What has changed is everything around it.':
    'Si ya usaste Skala, la crema en tu mano no cambió. Lo que cambió es todo lo que la rodea.',
  'LET’S STICK TOGETHER': 'CUIDEMOS JUNTOS TU PELO',
  'A roll of SweetTape': 'Un pote de crema Skala',
  'A roll of SweetTape double-sided tissue tape on a checkerboard cutout': 'Un pote de crema Skala sobre un recorte a cuadros',
  'A roll of SweetTape masking tape on a watercolour painting in progress': 'Un pote de crema Skala sobre una acuarela a medio pintar',
  'A roll of masking tape with a length of it pulled out flat.': 'Un pote de crema abierto.',
  'A sheet of graph paper, opened out': 'Una hoja cuadriculada abierta',

  // ───────── Novedades ─────────
  'WHAT’S ROLLING': 'NOVEDADES',
  'catch the latest update, events of sweettape': 'enterate de lo último de skala',
  'catch the latest': 'enterate de',
  'update, events': 'lo último',
  'of sweettape': 'de skala',
  'HIGHLIGHT': 'DESTACADO',
  'EVENT': 'EVENTO',
  'NEWS, 01 stories': 'NOVEDADES, 01 notas',
  'EVENT, 01 stories': 'EVENTO, 01 notas',
  'ALL, 02 stories': 'TODAS, 02 notas',
  'JUL 2026': 'JUL 2026',
  'SEP 2026': 'SEP 2026',
  '1 min read': '1 min de lectura',
  'Back to all': 'Volver a todas',
  'BACK TO ALL': 'VOLVER A TODAS',
  'RELATED NEWS': 'OTRAS NOTAS',
  'Share this story': 'Compartí esta nota',
  'A glowing digital doorway on a dark background': 'Un pote de crema iluminado sobre fondo oscuro',
  'A scarred race car driving through the dark': 'Potes de crema Skala en una góndola',
  'Same Tape. Three Generations of It. Finally, a Face.': 'Las mismas cremas. Ahora, con cara nueva.',
  'Same Tape. Three Generations of It. Finally, a Face. — SweetTape': 'Las mismas cremas. Ahora, con cara nueva. — Skala',
  'Need to Stick? Get It Quick. SweetTape Is Now at MR. D.I.Y': '¿Necesitás tu crema? Skala ya está en tu farmacia',
  'Need to Stick? Get It Quick. SweetTape Is Now at MR. D.I.Y — SweetTape': '¿Necesitás tu crema? Skala ya está en tu farmacia — Skala',
  'Sweet Tape is rolling closer to you. From today, the full family is on the shelf at selected MR. D.I.Y stores.':
    'Skala está cada vez más cerca. Desde hoy, toda la familia está en farmacias y perfumerías seleccionadas.',
  'From today, you do not have to go looking for us. SweetTape is on the shelf at selected MR. D.I.Y stores across Malaysia, next to everything else you grab when something needs fixing, packing or making.':
    'Desde hoy no tenés que salir a buscarnos. Skala está en farmacias y perfumerías de todo el país, al lado de todo lo que usás para cuidarte.',
  'From today, you do not have to go looking for us. SweetTape is on the shelf at selected MR. D.I.Y stores across Malaysia, next to everything else you grab…':
    'Desde hoy no tenés que salir a buscarnos. Skala está en farmacias y perfumerías de todo el país…',
  'The whole family is there: cloth tape for the heavy jobs, masking tape for the paint work, stationery tape for the quick fixes, double-sided tissue tape for the gifts and the craft, and OPP tape, in normal and low-noise, for the box that has to survive the trip. Each one has its own colour, so you can pick out the right roll from across the aisle.':
    'Está toda la familia: Mais Cachos para los rulos, Divino Potão para la transición, Mais Cachinhos para los chicos, Hidro-Nutritivo Plus para hidratar, y Raízes do Morro y Crespinho Divino para fortalecer y suavizar. Cada una tiene su color, así encontrás la tuya desde la otra punta de la góndola.',
  'Look for the lime-green rolls in the tape section. If your nearest MR. D.I.Y does not have them yet, ask at the counter, or write to us and we will point you to the closest one that does. Whatever you are sticking, we stick by you.':
    'Buscá los potes de colores en la sección de cuidado capilar. Si en tu farmacia todavía no están, preguntá en el mostrador o escribinos. Sea cual sea tu pelo, Skala está con vos.',
  'If you have bought tape from us before, the roll in your hand has not changed. The film, the adhesive, the core, the people who make it: all the same. What has changed is everything around it.':
    'Si ya usaste Skala, la crema en tu mano no cambió. La fórmula, los ingredientes, la gente que la hace: todo igual. Lo que cambió es todo lo que la rodea.',
  'If you have bought tape from us before, the roll in your hand has not changed. The film, the adhesive, the core, the people who make it: all the same.…':
    'Si ya usaste Skala, la crema en tu mano no cambió. La fórmula, los ingredientes, la gente que la hace: todo igual.…',
  'For three generations SB Tape Group has made tape in Malaysia, and for most of that time it sat on the shelf looking like every other roll. Same plain packaging, same routine. We wanted tape you could pick out from across the shop, that told you what it was for before you read the label, and that felt like it belonged in the everyday moments it turns up in. The DIY fail. Moving day. The school project due tomorrow.':
    'Skala nació en Brasil haciendo cremas para todo tipo de pelo, y durante mucho tiempo estuvo en la góndola como cualquier otro pote. Queríamos una crema que reconocieras de lejos, que te dijera para qué sirve antes de leer la etiqueta y que se sintiera parte de tu día. El día de humedad. La transición. El rulo que no se deja.',
  'So meet SweetTape. Six tapes, each with its own colour and its own job, and one belief behind all of them: good tape should stick by you. Look for the new rolls at selected MR. D.I.Y stores, and if your usual shop does not have them yet, tell them to write to us.':
    'Así que conocé Skala. Seis cremas, cada una con su color y su tarea, y una misma idea detrás: una buena crema tiene que estar con vos. Buscalas en tu farmacia, y si todavía no las tienen, deciles que nos escriban.',

  // ───────── Contacto ─────────
  'GET IN TOUCH': 'ESCRIBINOS',
  'DROP US A MESSAGE': 'DEJANOS UN MENSAJE',
  'DROP US A': 'DEJANOS UN',
  'MESSAGE': 'MENSAJE',
  'NAME': 'NOMBRE',
  'EMAIL': 'EMAIL',
  'PHONE NUMBER': 'TELÉFONO',
  'COMPANY': 'EMPRESA',
  'SEND': 'ENVIAR',
  '+603 8946 3600': '+54 11 0000-0000',
  'SALES@SBGROUP.COM.MY': 'CONTACTO@EJEMPLO.COM',
};

// Reemplazos "sueltos" dentro de cualquier texto (se aplican después del diccionario)
const marcas = [
  [/SweetTape/g, MARCA],
  [/Sweet Tape/g, MARCA],
  [/SWEET TAPE/g, 'SKALA'],
  [/sweettape/g, 'skala'],
  [/SB Tape Group Sdn Bhd/g, 'Skala (sitio educativo EPET 20)'],
  [/SB Tape Group/g, 'Skala'],
  [/MR\. D\.I\.Y/g, 'farmacias'],
  [/Malaysia/g, 'Argentina'],
];

// Textos que arma el JavaScript del sitio (se buscan tal cual dentro de los .js)
const javascript = [
  // título del carrusel del inicio: "THE " + palabra → nombre de la personalidad en español
  [
    'b.textContent=`THE ${t.toUpperCase()}`',
    'b.textContent=({fixer:"LA DIOSA",creative:"LA CREATIVA",trusty:"LA SERENA",reliable:"LA PODEROSA",silent:"LA SEDOSA",buddy:"LA PEQUE"})[t]||t.toUpperCase()',
  ],
  // título del inicio que anima el JavaScript
  ['let a=["STICK WITH YOU THROUGH","THREE GENERATIONS"]', 'let a=["CUIDAMOS TU PELO","TODOS LOS DÍAS"]'],
  // menú
  ['"PULL ME"', '"TIRÁ DE ACÁ"'],
  ['label:"HOME"', 'label:"INICIO"'],
  ['"SweetTape — home"', '"Skala — inicio"'],
  ['"aria-label":"Sound"', '"aria-label":"Sonido"'],
  // botones para compartir una nota
  ['children:"SHARE"', 'children:"COMPARTIR"'],
  ['"Share this story by email"', '"Compartir esta nota por email"'],
  ['"Share this story on LinkedIn"', '"Compartir esta nota en LinkedIn"'],
  ['"Share this story on Facebook"', '"Compartir esta nota en Facebook"'],
  ['i?"Link copied":"Copy a link to this story"', 'i?"Link copiado":"Copiar el link de esta nota"'],
  // formulario de contacto
  ['"SENT — WE’LL BE IN TOUCH"', '"ENVIADO — TE RESPONDEMOS PRONTO"'],
  [String.raw`"COULDN’T SEND —\nEMAIL US\nINSTEAD"`, String.raw`"NO SE PUDO ENVIAR —\nESCRIBINOS\nPOR MAIL"`],
  ['"WRITE A MESSAGE FIRST"', '"PRIMERO ESCRIBÍ UN MENSAJE"'],
  ['"ADD AN EMAIL FIRST"', '"PRIMERO PONÉ TU EMAIL"'],
];

module.exports = { frases, marcas, javascript, MARCA };
