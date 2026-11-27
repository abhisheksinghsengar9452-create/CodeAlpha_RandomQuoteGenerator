/**
 * Curated curriculum data, vocabulary definitions, grammar modules,
 * and conversational roleplay dialogue trees by language code.
 */
const LANGUAGE_DATA = {
  es: {
    id: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    voiceCode: 'es-ES',
    specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'],
    description: 'Learn the second most spoken native language in the world, with vibrant expressions and clear phonetic pronunciation.',
    roleplayScenarios: [
      {
        id: 'es-rp-cafe',
        title: '☕ Ordering at a Café in Madrid',
        partner: 'Mateo (Barista)',
        avatar: '☕',
        description: 'Practice ordering your morning coffee, pastries, and asking for the bill in conversational Spanish.',
        initialMessage: {
          target: '¡Hola! Buenos días. Bienvenido a Café Sol. ¿Qué te gustaría tomar hoy?',
          translation: 'Hello! Good morning. Welcome to Café Sol. What would you like to drink today?'
        },
        suggestedReplies: [
          { target: 'Buenos días, un café con leche, por favor.', translation: 'Good morning, a latte please.' },
          { target: 'Hola, ¿tienen cruasanes o tostadas?', translation: 'Hello, do you have croissants or toast?' },
          { target: 'Quiero un café solo y un vaso de agua.', translation: 'I want an espresso and a glass of water.' }
        ],
        knowledgeBase: [
          {
            keywords: ['café', 'leche', 'solo', 'cortado'],
            replyTarget: '¡Excelente elección! ¿Lo prefieres con azúcar o sacarina? ¿Y quieres algo para comer?',
            replyTranslation: 'Excellent choice! Do you prefer sugar or sweetener? And would you like something to eat?',
            suggestedReplies: [
              { target: 'Con azúcar, y un cruasán por favor.', translation: 'With sugar, and a croissant please.' },
              { target: 'Sin azúcar, solo el café.', translation: 'Without sugar, just the coffee.' }
            ]
          },
          {
            keywords: ['cruasán', 'tostada', 'comer', 'pan'],
            replyTarget: 'Nuestros cruasanes están recién horneados hoy. Te los preparo enseguida.',
            replyTranslation: 'Our croissants are freshly baked today. I will prepare them right away.',
            suggestedReplies: [
              { target: 'Muchas gracias. ¿Cuánto es todo?', translation: 'Thank you very much. How much is everything?' },
              { target: 'Perfecto, para tomar aquí.', translation: 'Perfect, for here.' }
            ]
          },
          {
            keywords: ['cuenta', 'cuánto', 'pagar', 'tarjeta'],
            replyTarget: 'Son tres euros con cincuenta en total. ¿Pagas con tarjeta o en efectivo?',
            replyTranslation: 'That will be three euros and fifty in total. Are you paying by card or cash?',
            suggestedReplies: [
              { target: 'Pago con tarjeta, gracias.', translation: 'I will pay with card, thank you.' },
              { target: 'En efectivo. ¡Muchas gracias y buen día!', translation: 'In cash. Thank you very much and have a good day!' }
            ]
          }
        ]
      },
      {
        id: 'es-rp-hotel',
        title: '🏨 Hotel Check-In in Barcelona',
        partner: 'Sofía (Receptionist)',
        avatar: '🏨',
        description: 'Check into your hotel room, ask about breakfast hours, and confirm Wi-Fi details.',
        initialMessage: {
          target: '¡Buenas tardes! Bienvenido al Hotel Ramblas. ¿Tiene una reserva con nosotros?',
          translation: 'Good afternoon! Welcome to Hotel Ramblas. Do you have a reservation with us?'
        },
        suggestedReplies: [
          { target: 'Hola, sí, tengo una reserva a nombre de John.', translation: 'Hello, yes, I have a reservation under the name John.' },
          { target: 'Buenas tardes. ¿Tienen habitaciones libres?', translation: 'Good afternoon. Do you have free rooms available?' }
        ],
        knowledgeBase: [
          {
            keywords: ['reserva', 'nombre', 'habitación'],
            replyTarget: '¡Perfecto, aquí está! Su habitación es la 304 con vistas a la ciudad. Aquí tiene su llave.',
            replyTranslation: 'Perfect, here it is! Your room is 304 overlooking the city. Here is your key.',
            suggestedReplies: [
              { target: '¿A qué hora se sirve el desayuno?', translation: 'What time is breakfast served?' },
              { target: '¿Cuál es la contraseña del Wi-Fi?', translation: 'What is the Wi-Fi password?' }
            ]
          },
          {
            keywords: ['desayuno', 'hora'],
            replyTarget: 'El desayuno buffet se sirve de siete a diez y media en la planta baja.',
            replyTranslation: 'The breakfast buffet is served from 7:00 to 10:30 on the ground floor.',
            suggestedReplies: [
              { target: 'Estupendo. ¡Muchas gracias por su amabilidad!', translation: 'Wonderful. Thank you very much for your kindness!' }
            ]
          },
          {
            keywords: ['wifi', 'wi-fi', 'contraseña', 'internet'],
            replyTarget: 'La red es "Ramblas_Guest" y la contraseña es "bienvenido2026".',
            replyTranslation: 'The network is "Ramblas_Guest" and the password is "bienvenido2026".',
            suggestedReplies: [
              { target: 'Perfecto, muchas gracias Sofía. ¡Adiós!', translation: 'Perfect, thank you so much Sofia. Goodbye!' }
            ]
          }
        ]
      }
    ],
    grammarNotes: [
      {
        id: 'es-gram-1',
        title: 'Nouns and Gender (El & La)',
        category: 'grammar',
        summary: 'Spanish nouns are masculine or feminine. Words ending in -o are usually masculine, and -a feminine.',
        explanation: 'In Spanish, every noun has an inherent grammatical gender. Definite articles change based on gender and number:\n• Masculine singular: **el** (el libro - the book)\n• Feminine singular: **la** (la mesa - the table)\n• Masculine plural: **los** (los libros - the books)\n• Feminine plural: **las** (las mesas - the tables)',
        examples: [
          { target: 'El chico come una manzana.', translation: 'The boy eats an apple.', breakdown: 'El (Masc. Article) + chico (Boy) + come (eats) + una (Fem. Article) + manzana (apple)' },
          { target: 'La casa es muy bonita.', translation: 'The house is very pretty.', breakdown: 'La (Fem. Article) + casa (house) + es (is) + muy (very) + bonita (pretty)' }
        ],
        miniQuiz: {
          question: 'Which is the correct article for "manzana" (apple)?',
          options: ['El', 'La', 'Los', 'Unos'],
          answer: 1,
          hint: 'Words ending in -a are typically feminine.'
        }
      },
      {
        id: 'es-gram-2',
        title: 'Subject Pronoun Drop & Conjugation',
        category: 'grammar',
        summary: 'Because verb endings show who does the action, subject pronouns like "yo" or "tú" are often omitted.',
        explanation: 'Spanish verbs are conjugated by person. For regular -AR verbs in present tense (e.g., Hablar - to speak):\n• Yo hablo (I speak)\n• Tú hablas (You speak)\n• Él / Ella habla (He/She speaks)\n• Nosotros hablamos (We speak)\n• Ellos hablan (They speak)\n\nOften speakers simply say "Hablo español" instead of "Yo hablo español".',
        examples: [
          { target: '¿Hablas inglés?', translation: 'Do you speak English?', breakdown: 'Hablas (you speak - present) + inglés (English)' },
          { target: 'Vivimos en una ciudad grande.', translation: 'We live in a big city.', breakdown: 'Vivimos (we live - vivir) + en (in) + una ciudad (a city) + grande (big)' }
        ],
        miniQuiz: {
          question: 'How do you say "I speak" from "hablar"?',
          options: ['Hablas', 'Hablo', 'Habla', 'Hablamos'],
          answer: 1,
          hint: 'The first person singular (Yo) present ending is usually -o.'
        }
      },
      {
        id: 'es-gram-3',
        title: 'Ser vs. Estar (To Be)',
        category: 'grammar',
        summary: 'Spanish uses "Ser" for permanent qualities and "Estar" for temporary states or locations.',
        explanation: 'Remember the mnemonic DOCTOR for **Ser** (Description, Occupation, Characteristic, Time, Origin, Relationship) and PLACE for **Estar** (Position, Location, Action, Condition, Emotion).',
        examples: [
          { target: 'Soy estudiante.', translation: 'I am a student. (Permanent role/Ser)', breakdown: 'Soy (I am - Ser) + estudiante' },
          { target: 'Estoy cansado hoy.', translation: 'I am tired today. (Temporary feeling/Estar)', breakdown: 'Estoy (I am - Estar) + cansado (tired) + hoy (today)' }
        ],
        miniQuiz: {
          question: 'Which verb is used for "The coffee is hot right now"?',
          options: ['Es caliente', 'Está caliente', 'Son caliente', 'Estar caliente'],
          answer: 1,
          hint: 'Temperature right now is a temporary condition (Estar).'
        }
      }
    ],
    items: [
      {
        id: 'es-1',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Hola',
        phonetic: 'OH-lah',
        translation: 'Hello',
        exampleTarget: '¡Hola! ¿Cómo estás?',
        exampleTranslation: 'Hello! How are you?',
        notes: 'The letter "h" is always silent in Spanish.'
      },
      {
        id: 'es-2',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Buenos días',
        phonetic: 'BWEH-nos DEE-ahs',
        translation: 'Good morning',
        exampleTarget: 'Buenos días, señor Martínez.',
        exampleTranslation: 'Good morning, Mr. Martinez.',
        notes: 'Used until noon / lunchtime.'
      },
      {
        id: 'es-3',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Por favor',
        phonetic: 'por fah-VOR',
        translation: 'Please',
        exampleTarget: 'Un café, por favor.',
        exampleTranslation: 'A coffee, please.',
        notes: 'Essential polite phrase for everyday interactions.'
      },
      {
        id: 'es-4',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Gracias',
        phonetic: 'GRAH-syahs',
        translation: 'Thank you',
        exampleTarget: 'Muchas gracias por tu ayuda.',
        exampleTranslation: 'Thank you very much for your help.',
        notes: 'Respond with "De nada" (You are welcome).'
      },
      {
        id: 'es-5',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Adiós',
        phonetic: 'ah-DYOHS',
        translation: 'Goodbye',
        exampleTarget: 'Adiós, ¡hasta mañana!',
        exampleTranslation: 'Goodbye, see you tomorrow!',
        notes: '"Hasta luego" means see you later.'
      },
      {
        id: 'es-6',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'El agua',
        phonetic: 'el AH-gwah',
        translation: 'The water',
        exampleTarget: 'Quiero un vaso de agua sin gas.',
        exampleTranslation: 'I want a glass of still water.',
        notes: 'Agua is feminine, but takes "el" in singular to prevent awkward vowel sounds.'
      },
      {
        id: 'es-7',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'La comida',
        phonetic: 'lah koh-MEE-dah',
        translation: 'The food / meal',
        exampleTarget: 'La comida española es deliciosa.',
        exampleTranslation: 'Spanish food is delicious.',
        notes: 'Can mean food in general or lunch (in Spain).'
      },
      {
        id: 'es-8',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'La cuenta',
        phonetic: 'lah KWEHN-tah',
        translation: 'The bill / check',
        exampleTarget: '¿Nos trae la cuenta, por favor?',
        exampleTranslation: 'Can you bring us the bill, please?',
        notes: 'Standard phrase used at cafes and restaurants.'
      },
      {
        id: 'es-9',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Intermediate',
        target: 'Desayunar',
        phonetic: 'deh-sah-yoo-NAR',
        translation: 'To have breakfast',
        exampleTarget: 'Suelo desayunar pan tostado y café.',
        exampleTranslation: 'I usually have toast and coffee for breakfast.',
        notes: 'In Spanish, "desayunar", "almorzar", and "cenar" are dedicated verbs.'
      },
      {
        id: 'es-10',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: '¿Dónde está el baño?',
        phonetic: 'DOHN-deh ehs-TAH el BAH-nyo',
        translation: 'Where is the bathroom?',
        exampleTarget: 'Disculpe, ¿dónde está el baño más cercano?',
        exampleTranslation: 'Excuse me, where is the nearest bathroom?',
        notes: 'One of the most important travel sentences.'
      },
      {
        id: 'es-11',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: '¿Cuánto cuesta esto?',
        phonetic: 'KWAHN-toh KWEHS-tah EHS-toh',
        translation: 'How much does this cost?',
        exampleTarget: '¿Cuánto cuesta este billete de tren?',
        exampleTranslation: 'How much does this train ticket cost?',
        notes: '"Esto" is the neuter demonstrative pronoun for an unknown object.'
      },
      {
        id: 'es-12',
        category: 'phrases',
        topic: 'Conversational',
        level: 'Intermediate',
        target: 'No entiendo',
        phonetic: 'noh ehn-TYEHN-doh',
        translation: 'I do not understand',
        exampleTarget: 'Lo siento, hablo poco español y no entiendo.',
        exampleTranslation: 'I am sorry, I speak little Spanish and I do not understand.',
        notes: 'Follow with "¿Puede repetir más despacio?" (Can you repeat slower?).'
      },
      {
        id: 'es-13',
        category: 'phrases',
        topic: 'Conversational',
        level: 'Intermediate',
        target: 'Mucho gusto',
        phonetic: 'MOO-choh GOOS-toh',
        translation: 'Nice to meet you',
        exampleTarget: 'Me llamo Elena. — Mucho gusto, Elena.',
        exampleTranslation: 'My name is Elena. — Nice to meet you, Elena.',
        notes: 'Literally means "much pleasure".'
      },
      {
        id: 'es-14',
        category: 'sentences',
        topic: 'Daily Routine',
        level: 'Intermediate',
        target: 'Tengo que aprender nuevas palabras cada día.',
        phonetic: 'TEHN-goh keh ah-pren-DEHR NWEH-vahs pah-LAH-brahs KAH-dah DEE-ah',
        translation: 'I have to learn new words every day.',
        exampleTarget: 'Tengo que aprender nuevas palabras cada día para mejorar.',
        exampleTranslation: 'I have to learn new words every day to improve.',
        notes: '"Tener que + infinitive" indicates obligation (must / have to).'
      },
      {
        id: 'es-15',
        category: 'sentences',
        topic: 'Travel',
        level: 'Intermediate',
        target: 'El aeropuerto está a veinte minutos de aquí.',
        phonetic: 'el ah-eh-roh-PWEHR-toh ehs-TAH ah VEH-een-teh mee-NOO-tohs deh ah-KEE',
        translation: 'The airport is twenty minutes from here.',
        exampleTarget: 'El aeropuerto está a veinte minutos de aquí en taxi.',
        exampleTranslation: 'The airport is twenty minutes from here by taxi.',
        notes: 'Use "a [distance/time] de" to indicate distance.'
      }
    ],
    dialogue: {
      title: 'En una Cafetería (At a Coffee Shop)',
      lines: [
        { speaker: 'Camarero', target: '¡Hola! ¿Qué le pongo?', translation: 'Hello! What can I get for you?' },
        { speaker: 'Cliente', target: 'Hola, un café con leche y un cruasán, por favor.', translation: 'Hello, a latte and a croissant, please.' },
        { speaker: 'Camarero', target: '¿Para tomar aquí o para llevar?', translation: 'For here or to take away?' },
        { speaker: 'Cliente', target: 'Para tomar aquí, gracias.', translation: 'For here, thank you.' },
        { speaker: 'Camarero', target: 'Muy bien. Son tres euros.', translation: 'Very well. That will be three euros.' }
      ]
    }
  },

  fr: {
    id: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    voiceCode: 'fr-FR',
    specialChars: ['é', 'è', 'ê', 'ë', 'à', 'ç', 'ù', 'î', 'ï', 'ô', 'œ'],
    description: 'The language of diplomacy, gastronomy, and literature. Famous for smooth liaison and romantic cadence.',
    roleplayScenarios: [
      {
        id: 'fr-rp-boulangerie',
        title: '🥖 À la Boulangerie à Paris',
        partner: 'Camille (Boulangère)',
        avatar: '🥖',
        description: 'Order fresh baguettes, croissants, and inquire about prices politely in French.',
        initialMessage: {
          target: 'Bonjour ! Bienvenue à la boulangerie. Que désirez-vous aujourd\'hui ?',
          translation: 'Hello! Welcome to the bakery. What would you like today?'
        },
        suggestedReplies: [
          { target: 'Bonjour, une baguette tradition s\'il vous plaît.', translation: 'Hello, a traditional baguette please.' },
          { target: 'Je voudrais deux croissants au beurre.', translation: 'I would like two butter croissants.' }
        ],
        knowledgeBase: [
          {
            keywords: ['baguette', 'pain', 'tradition'],
            replyTarget: 'Très bien, voici une belle baguette bien dorée. Et avec ceci ?',
            replyTranslation: 'Very well, here is a nice golden baguette. And with this?',
            suggestedReplies: [
              { target: 'Un pain au chocolat aussi, s\'il vous plaît.', translation: 'A chocolate bread as well, please.' },
              { target: 'Ce sera tout, merci. Combien je vous dois ?', translation: 'That will be all, thank you. How much do I owe you?' }
            ]
          },
          {
            keywords: ['croissant', 'chocolat', 'pain au chocolat'],
            replyTarget: 'Parfait ! Ils sortent juste du four. Désirez-vous un sac ?',
            replyTranslation: 'Perfect! They just came out of the oven. Would you like a bag?',
            suggestedReplies: [
              { target: 'Non merci, j\'ai mon propre sac.', translation: 'No thanks, I have my own bag.' },
              { target: 'Oui, s\'il vous plaît.', translation: 'Yes, please.' }
            ]
          },
          {
            keywords: ['combien', 'prix', 'dois', 'payer', 'carte'],
            replyTarget: 'Ça fait deux euros cinquante. Vous pouvez payer par carte ou espèces.',
            replyTranslation: 'That comes to two euros fifty. You can pay by card or cash.',
            suggestedReplies: [
              { target: 'Par carte, s\'il vous plaît. Bonne journée !', translation: 'By card, please. Have a nice day!' }
            ]
          }
        ]
      }
    ],
    grammarNotes: [
      {
        id: 'fr-gram-1',
        title: 'Articles and Gender (Le, La, L\')',
        category: 'grammar',
        summary: 'French nouns are masculine or feminine, with definite articles le, la, and l\' before vowels.',
        explanation: 'Before a consonant:\n• Masculine: **le** (le pain - the bread)\n• Feminine: **la** (la pomme - the apple)\n\nBefore a vowel or silent h:\n• **l\'** (l\'eau - the water, l\'hôtel - the hotel)\n• Plural for both: **les** (les livres - the books)',
        examples: [
          { target: 'Le café est chaud.', translation: 'The coffee is hot.', breakdown: 'Le (Masc. article) + café (coffee) + est (is) + chaud (hot)' },
          { target: 'J\'aime la musique.', translation: 'I like music.', breakdown: 'J\'aime (I like) + la musique (music)' }
        ],
        miniQuiz: {
          question: 'What is the correct article for "ordinateur" (computer, masculine beginning with vowel)?',
          options: ['Le', 'La', "L'", 'Les'],
          answer: 2,
          hint: 'Before a vowel, le and la contract to l\'.'
        }
      },
      {
        id: 'fr-gram-2',
        title: 'Negation: Ne ... Pas',
        category: 'grammar',
        summary: 'In French, standard negation wraps around the conjugated verb like a sandwich: ne [verb] pas.',
        explanation: 'To make a sentence negative in French:\n• **ne** goes before the conjugated verb\n• **pas** goes right after it\n• Before a vowel, "ne" contracts to **n\'**\n\nExample: Je sais (I know) → Je **ne** sais **pas** (I do not know).',
        examples: [
          { target: 'Je ne parle pas espagnol.', translation: 'I do not speak Spanish.', breakdown: 'Je (I) + ne (not part 1) + parle (speak) + pas (not part 2) + espagnol' },
          { target: 'Il n\'aime pas le fromage.', translation: 'He does not like cheese.', breakdown: 'Il (he) + n\'aime (does not like) + pas + le fromage (cheese)' }
        ],
        miniQuiz: {
          question: 'How do you say "I do not understand"?',
          options: ['Je comprends pas', 'Je ne comprends pas', 'Pas je comprends', 'Je non comprends'],
          answer: 1,
          hint: 'Remember the ne... pas sandwich around the verb.'
        }
      }
    ],
    items: [
      {
        id: 'fr-1',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Bonjour',
        phonetic: 'bohn-ZHOOR',
        translation: 'Hello / Good day',
        exampleTarget: 'Bonjour, comment allez-vous ?',
        exampleTranslation: 'Hello, how are you? (formal)',
        notes: 'The universal polite greeting in France.'
      },
      {
        id: 'fr-2',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'S\'il vous plaît',
        phonetic: 'seel voo PLEH',
        translation: 'Please (formal/plural)',
        exampleTarget: 'L\'addition, s\'il vous plaît.',
        exampleTranslation: 'The bill, please.',
        notes: 'For casual contexts with friends, use "s\'il te plaît".'
      },
      {
        id: 'fr-3',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Merci beaucoup',
        phonetic: 'mehr-SEE boh-KOO',
        translation: 'Thank you very much',
        exampleTarget: 'Merci beaucoup pour votre aide.',
        exampleTranslation: 'Thank you very much for your help.',
        notes: '"De rien" is the standard response for "You\'re welcome".'
      },
      {
        id: 'fr-4',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'Le croissant',
        phonetic: 'luh kwah-SAHN',
        translation: 'The croissant',
        exampleTarget: 'Un café et un croissant, s\'il vous plaît.',
        exampleTranslation: 'A coffee and a croissant, please.',
        notes: 'A staple of traditional French breakfast.'
      },
      {
        id: 'fr-5',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'L\'eau',
        phonetic: 'LOH',
        translation: 'The water',
        exampleTarget: 'Une carafe d\'eau, s\'il vous plaît.',
        exampleTranslation: 'A jug of tap water, please.',
        notes: 'In French restaurants, "une carafe d\'eau" is complimentary.'
      },
      {
        id: 'fr-6',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: 'Où est la gare ?',
        phonetic: 'OO eh lah GAHR',
        translation: 'Where is the train station?',
        exampleTarget: 'Pardon, où est la gare la plus proche ?',
        exampleTranslation: 'Excuse me, where is the nearest train station?',
        notes: '"La gare" specifically denotes train stations in France.'
      },
      {
        id: 'fr-7',
        category: 'phrases',
        topic: 'Conversational',
        level: 'Intermediate',
        target: 'Enchanté de vous rencontrer',
        phonetic: 'ahn-shahn-TEH duh voo rahn-kohn-TREH',
        translation: 'Delighted to meet you',
        exampleTarget: 'Je m\'appelle Julien. — Enchanté de vous rencontrer.',
        exampleTranslation: 'My name is Julien. — Delighted to meet you.',
        notes: 'Shortened often to simply "Enchanté !"'
      },
      {
        id: 'fr-8',
        category: 'sentences',
        topic: 'Daily Routine',
        level: 'Intermediate',
        target: 'J\'apprends le français tous les matins.',
        phonetic: 'zhah-PRAHN luh frahn-SEH too lay mah-TAN',
        translation: 'I learn French every morning.',
        exampleTarget: 'J\'apprends le français tous les matins pendant trente minutes.',
        exampleTranslation: 'I learn French every morning for thirty minutes.',
        notes: '"Tous les matins" literally means all the mornings.'
      }
    ],
    dialogue: {
      title: 'À la Boulangerie (At the Bakery)',
      lines: [
        { speaker: 'Boulangère', target: 'Bonjour monsieur, vous désirez ?', translation: 'Hello sir, what would you like?' },
        { speaker: 'Client', target: 'Bonjour ! Une baguette tradition, s\'il vous plaît.', translation: 'Hello! One traditional baguette, please.' },
        { speaker: 'Boulangère', target: 'Et avec ceci ?', translation: 'And with this? (Anything else?)' },
        { speaker: 'Client', target: 'Deux éclairs au chocolat, ce sera tout.', translation: 'Two chocolate eclairs, that will be all.' },
        { speaker: 'Boulangère', target: 'Ça fera six euros cinquante.', translation: 'That will be six euros fifty.' }
      ]
    }
  },

  de: {
    id: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    voiceCode: 'de-DE',
    specialChars: ['ä', 'ö', 'ü', 'ß'],
    description: 'The powerhouse language of central Europe, known for compound words and logical grammar structure.',
    roleplayScenarios: [
      {
        id: 'de-rp-cafe',
        title: '☕ Im Café in Berlin',
        partner: 'Lukas (Kellner)',
        avatar: '☕',
        description: 'Order your favorite coffee and traditional German cake with courteous expressions.',
        initialMessage: {
          target: 'Guten Tag! Was darf ich Ihnen heute bringen?',
          translation: 'Good day! What can I bring you today?'
        },
        suggestedReplies: [
          { target: 'Guten Tag! Einen Kaffee und ein Stück Apfelkuchen, bitte.', translation: 'Good day! A coffee and a slice of apple pie, please.' },
          { target: 'Haben Sie einen Tisch für zwei Personen?', translation: 'Do you have a table for two people?' }
        ],
        knowledgeBase: [
          {
            keywords: ['kaffee', 'kuchen', 'apfelkuchen', 'bitte'],
            replyTarget: 'Sehr gerne! Mit Milch und Zucker? Unser Apfelkuchen ist heute ganz frisch.',
            replyTranslation: 'With pleasure! With milk and sugar? Our apple cake is very fresh today.',
            suggestedReplies: [
              { target: 'Mit Milch, bitte. Danke schön!', translation: 'With milk, please. Thank you very much!' },
              { target: 'Die Rechnung, bitte.', translation: 'The bill, please.' }
            ]
          },
          {
            keywords: ['rechnung', 'zahlen', 'kostet'],
            replyTarget: 'Das macht zusammen fünf Euro achtzig. Zahlen Sie bar oder mit Karte?',
            replyTranslation: 'That comes to five euros eighty together. Are you paying cash or by card?',
            suggestedReplies: [
              { target: 'Mit Karte, bitte. Schönen Tag noch!', translation: 'With card, please. Have a nice day!' }
            ]
          }
        ]
      }
    ],
    grammarNotes: [
      {
        id: 'de-gram-1',
        title: 'Three Genders: Der, Die, Das',
        category: 'grammar',
        summary: 'German nouns have three genders: Masculine (Der), Feminine (Die), and Neuter (Das). All nouns are capitalized!',
        explanation: 'Unlike English, all German nouns begin with a capital letter!\n• Masculine: **der** (der Apfel - the apple)\n• Feminine: **die** (die Sonne - the sun)\n• Neuter: **das** (das Buch - the book)\n• Plural: **die** (die Bücher - the books)',
        examples: [
          { target: 'Das Buch ist interessant.', translation: 'The book is interesting.', breakdown: 'Das (Neuter article) + Buch (Noun capitalized) + ist (is) + interessant' },
          { target: 'Der Hund spielt im Garten.', translation: 'The dog plays in the garden.', breakdown: 'Der (Masc. article) + Hund (dog) + spielt (plays) + im Garten' }
        ],
        miniQuiz: {
          question: 'Are all nouns capitalized in written German?',
          options: ['Yes, always', 'No, only proper names', 'Only at sentence start', 'Never'],
          answer: 0,
          hint: 'German is unique in capitalizing every single noun!'
        }
      }
    ],
    items: [
      {
        id: 'de-1',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Guten Tag',
        phonetic: 'GOO-ten TAHK',
        translation: 'Good day / Hello',
        exampleTarget: 'Guten Tag! Wie geht es Ihnen?',
        exampleTranslation: 'Good day! How are you? (formal)',
        notes: 'Classic polite German greeting.'
      },
      {
        id: 'de-2',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Bitte',
        phonetic: 'BIT-teh',
        translation: 'Please / You are welcome',
        exampleTarget: 'Ein Glas Wasser, bitte.',
        exampleTranslation: 'A glass of water, please.',
        notes: 'Can mean both "please" and "you\'re welcome" in reply to Danke.'
      },
      {
        id: 'de-3',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Danke schön',
        phonetic: 'DAHN-keh SHUHN',
        translation: 'Thank you very much',
        exampleTarget: 'Danke schön für Ihre Hilfe.',
        exampleTranslation: 'Thank you very much for your help.',
        notes: 'Contains the umlaut ö sound.'
      },
      {
        id: 'de-4',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'Das Frühstück',
        phonetic: 'dahs FRYOO-shtyook',
        translation: 'Breakfast',
        exampleTarget: 'Das Frühstück ist fertig!',
        exampleTranslation: 'Breakfast is ready!',
        notes: 'Literally "early piece" (früh + Stück).'
      },
      {
        id: 'de-5',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: 'Wo ist der Bahnhof?',
        phonetic: 'voh ist dehr BAHN-hohf',
        translation: 'Where is the train station?',
        exampleTarget: 'Entschuldigung, wo ist der Bahnhof?',
        exampleTranslation: 'Excuse me, where is the train station?',
        notes: 'German railway stations are designated as Bahnhof (HBF = Hauptbahnhof).'
      },
      {
        id: 'de-6',
        category: 'sentences',
        topic: 'Daily Routine',
        level: 'Intermediate',
        target: 'Ich lerne jeden Tag Deutsch.',
        phonetic: 'ikh LEHR-neh YEH-den tahk DOYTCH',
        translation: 'I learn German every day.',
        exampleTarget: 'Ich lerne jeden Tag Deutsch mit einer App.',
        exampleTranslation: 'Ich learn German every day with an app.',
        notes: 'Notice the verb "lerne" occupies position 2 in the main clause.'
      }
    ],
    dialogue: {
      title: 'Im Restaurant (In the Restaurant)',
      lines: [
        { speaker: 'Kellner', target: 'Guten Abend! Haben Sie reserviert?', translation: 'Good evening! Do you have a reservation?' },
        { speaker: 'Gast', target: 'Ja, ein Tisch für zwei Personen auf den Namen Schmidt.', translation: 'Yes, a table for two under the name Schmidt.' },
        { speaker: 'Kellner', target: 'Sehr gerne, folgen Sie mir bitte.', translation: 'With pleasure, follow me please.' }
      ]
    }
  },

  ja: {
    id: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    voiceCode: 'ja-JP',
    specialChars: ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'],
    description: 'Explore the fascinating language of Japan, blending Kanji, Hiragana, Katakana, and rich polite speech.',
    roleplayScenarios: [
      {
        id: 'ja-rp-ramen',
        title: '🍜 ラーメン屋で (At the Ramen Shop in Tokyo)',
        partner: '大将 健二 (Master Kenji)',
        avatar: '🍜',
        description: 'Order ramen, request extra toppings, and thank the chef respectfully.',
        initialMessage: {
          target: 'いらっしゃい！何名様ですか？食券はお持ちですか？',
          translation: 'Welcome! How many guests? Do you have your meal ticket?'
        },
        suggestedReplies: [
          { target: '一人です。おすすめのラーメンは何ですか？', translation: 'One person. What is your recommended ramen?' },
          { target: '豚骨ラーメンを一つお願いします。', translation: 'One tonkotsu ramen, please.' }
        ],
        knowledgeBase: [
          {
            keywords: ['おすすめ', '豚骨', 'ラーメン'],
            replyTarget: '自慢の特製豚骨ラーメンです！麺の硬さはどうしますか？',
            replyTranslation: 'Our pride is the special Tonkotsu ramen! How would you like your noodles cooked?',
            suggestedReplies: [
              { target: '硬めでお願いします。', translation: 'Firm, please.' },
              { target: '普通でお願いします。お水もください。', translation: 'Regular, please. Water too please.' }
            ]
          },
          {
            keywords: ['硬め', '普通', '水', '美味しい'],
            replyTarget: 'へい、お待ち！熱いのでお気をつけてどうぞ！',
            replyTranslation: 'Here you go! It is hot so please be careful!',
            suggestedReplies: [
              { target: 'ごちそうさまでした！とても美味しかったです。', translation: 'Thank you for the meal! It was delicious.' }
            ]
          }
        ]
      }
    ],
    grammarNotes: [
      {
        id: 'ja-gram-1',
        title: 'Word Order: SOV (Subject - Object - Verb)',
        category: 'grammar',
        summary: 'Japanese places the verb at the very end of the sentence, marked with grammatical particles.',
        explanation: 'In English, sentences follow SVO (I eat sushi). In Japanese, it follows SOV:\n• 私は (Watashi wa - As for me)\n• 寿司を (Sushi o - sushi [object])\n• 食べます (Tabemasu - eat [verb])\n\nParticles like は (topic) and を (direct object) clarify the role of each word.',
        examples: [
          { target: '猫が好きです。', translation: 'I like cats.', breakdown: '猫 (Neko - cat) + が (ga - subject particle) + 好きです (suki desu - like)' },
          { target: '水を飲みます。', translation: 'I drink water.', breakdown: '水 (Mizu - water) + を (o - object) + 飲みます (nomimasu - drink)' }
        ],
        miniQuiz: {
          question: 'Where does the main verb go in a Japanese sentence?',
          options: ['At the end', 'At the start', 'Between subject and object', 'Anywhere'],
          answer: 0,
          hint: 'Japanese is an SOV language: verbs appear at sentence conclusion.'
        }
      }
    ],
    items: [
      {
        id: 'ja-1',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'こんにちは',
        phonetic: 'Konnichiwa',
        translation: 'Hello / Good afternoon',
        exampleTarget: '皆さん、こんにちは！',
        exampleTranslation: 'Hello everyone!',
        notes: 'The final "wa" sound is written with the hiragana character は (ha).'
      },
      {
        id: 'ja-2',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'ありがとう ございます',
        phonetic: 'Arigatou gozaimasu',
        translation: 'Thank you very much (polite)',
        exampleTarget: 'ご親切にありがとうございます。',
        exampleTranslation: 'Thank you very much for your kindness.',
        notes: 'Between close friends, just "Arigatou" is used.'
      },
      {
        id: 'ja-3',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'すみません',
        phonetic: 'Sumimasen',
        translation: 'Excuse me / Sorry',
        exampleTarget: 'すみません、メニューをください。',
        exampleTranslation: 'Excuse me, please give me the menu.',
        notes: 'Extremely versatile: used to call waiters, apologize, or say light thank yous.'
      },
      {
        id: 'ja-4',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: '美味しい',
        phonetic: 'Oishii',
        translation: 'Delicious / Tasty',
        exampleTarget: 'このラーメンはとても美味しいです。',
        exampleTranslation: 'This ramen is very delicious.',
        notes: 'Can also be pronounced informally as "umai".'
      },
      {
        id: 'ja-5',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'お水',
        phonetic: 'Omizu',
        translation: 'Water (polite)',
        exampleTarget: 'お水を一杯お願いします。',
        exampleTranslation: 'One glass of water, please.',
        notes: 'The prefix "o-" adds politeness and respect.'
      },
      {
        id: 'ja-6',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: '駅はどこですか？',
        phonetic: 'Eki wa doko desu ka?',
        translation: 'Where is the train station?',
        exampleTarget: 'すみません、東京駅はどこですか？',
        exampleTranslation: 'Excuse me, where is Tokyo Station?',
        notes: 'The particle "ka" at the end marks a question.'
      },
      {
        id: 'ja-7',
        category: 'sentences',
        topic: 'Daily Routine',
        level: 'Intermediate',
        target: '毎日日本語を勉強しています。',
        phonetic: 'Mainichi nihongo o benkyou shite imasu.',
        translation: 'I am studying Japanese every day.',
        exampleTarget: '毎日アプリで日本語を勉強しています。',
        exampleTranslation: 'I am studying Japanese with an app every day.',
        notes: '"Benkyou shite imasu" denotes ongoing habitual study.'
      }
    ],
    dialogue: {
      title: 'コンビニで (At the Convenience Store)',
      lines: [
        { speaker: '店員', target: 'いらっしゃいませ！お弁当温めますか？', translation: 'Welcome! Would you like your bento heated up?' },
        { speaker: '客', target: 'はい、お願いします。', translation: 'Yes, please.' },
        { speaker: '店員', target: '袋はお付けしますか？', translation: 'Would you like a shopping bag?' },
        { speaker: '客', target: '大丈夫です、カバンに入ります。', translation: 'I am fine, it fits in my bag.' }
      ]
    }
  },

  it: {
    id: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    voiceCode: 'it-IT',
    specialChars: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
    description: 'The melodic romance language of art, opera, fashion, and culinary excellence.',
    roleplayScenarios: [
      {
        id: 'it-rp-pizzeria',
        title: '🍕 In Pizzeria a Napoli',
        partner: 'Marco (Pizzaiolo)',
        avatar: '🍕',
        description: 'Order authentic Neapolitan pizza, beverages, and express appreciation in Italian.',
        initialMessage: {
          target: 'Buonasera! Benvenuti a Napoli! Che pizza vi preparo stasera?',
          translation: 'Good evening! Welcome to Naples! What pizza can I make for you tonight?'
        },
        suggestedReplies: [
          { target: 'Buonasera! Una pizza Margherita con mozzarella di bufala, per favore.', translation: 'Good evening! A Margherita pizza with buffalo mozzarella, please.' },
          { target: 'Qual è la specialità della casa?', translation: 'What is the house specialty?' }
        ],
        knowledgeBase: [
          {
            keywords: ['margherita', 'pizza', 'bufala', 'specialità'],
            replyTarget: 'Ottima scelta! La nostra Margherita è patrimonio dell\'Unesco! Da bere cosa gradite?',
            replyTranslation: 'Great choice! Our Margherita is UNESCO heritage! What would you like to drink?',
            suggestedReplies: [
              { target: 'Una bottiglia d\'acqua naturale e una birra, grazie.', translation: 'A bottle of still water and a beer, thank you.' },
              { target: 'Il conto, per favore!', translation: 'The bill, please!' }
            ]
          },
          {
            keywords: ['conto', 'pagare', 'bere', 'acqua'],
            replyTarget: 'Subito! Sono dodici euro in tutto. Spero vi sia piaciuta!',
            replyTranslation: 'Right away! That is twelve euros in total. I hope you enjoyed it!',
            suggestedReplies: [
              { target: 'Era squisita! Grazie mille e arrivederci!', translation: 'It was exquisite! Thank you very much and goodbye!' }
            ]
          }
        ]
      }
    ],
    grammarNotes: [
      {
        id: 'it-gram-1',
        title: 'Vowel Endings and Plurals',
        category: 'grammar',
        summary: 'Italian words almost always end in vowels. Plurals change vowels rather than adding an "s".',
        explanation: 'In Italian:\n• Masculine singular **-o** becomes **-i** in plural (il gelato → i gelati)\n• Feminine singular **-a** becomes **-e** in plural (la pizza → le pizze)\n• Nouns ending in **-e** become **-i** (la notte → le notti)',
        examples: [
          { target: 'La pizza è deliziosa.', translation: 'The pizza is delicious.', breakdown: 'La (Fem.) + pizza + è (is) + deliziosa' },
          { target: 'Le pizze sono deliziose.', translation: 'The pizzas are delicious.', breakdown: 'Le (Plural Fem.) + pizze + sono (are) + deliziose' }
        ],
        miniQuiz: {
          question: 'What is the plural of "il ragazzo" (the boy)?',
          options: ['I ragazzi', 'Le ragazze', 'Il ragazzos', 'I ragazzo'],
          answer: 0,
          hint: 'Masculine -o changes to -i in plural.'
        }
      }
    ],
    items: [
      {
        id: 'it-1',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Ciao',
        phonetic: 'CHOW',
        translation: 'Hi / Bye (informal)',
        exampleTarget: 'Ciao! Come stai?',
        exampleTranslation: 'Hi! How are you?',
        notes: 'Used both for greeting and parting among friends.'
      },
      {
        id: 'it-2',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Per favore',
        phonetic: 'pehr fah-VOH-reh',
        translation: 'Please',
        exampleTarget: 'Un espresso, per favore.',
        exampleTranslation: 'An espresso, please.',
        notes: 'Also commonly expressed as "per piacere".'
      },
      {
        id: 'it-3',
        category: 'vocabulary',
        topic: 'Basics & Greetings',
        level: 'Beginner',
        target: 'Grazie mille',
        phonetic: 'GRAHT-syeh MEEL-leh',
        translation: 'A thousand thanks',
        exampleTarget: 'Grazie mille per il tuo aiuto!',
        exampleTranslation: 'A thousand thanks for your help!',
        notes: 'A warmer, emphatic version of grazie.'
      },
      {
        id: 'it-4',
        category: 'vocabulary',
        topic: 'Food & Dining',
        level: 'Beginner',
        target: 'Il conto',
        phonetic: 'eel KOHN-toh',
        translation: 'The bill / check',
        exampleTarget: 'Ci porta il conto, per favore?',
        exampleTranslation: 'Could you bring us the bill, please?',
        notes: 'Standard phrase in Italian trattorias.'
      },
      {
        id: 'it-5',
        category: 'phrases',
        topic: 'Travel & Directions',
        level: 'Beginner',
        target: 'Dov\'è il Colosseo?',
        phonetic: 'doh-VEH eel koh-lohs-SEH-oh',
        translation: 'Where is the Colosseum?',
        exampleTarget: 'Scusi, dov\'è la stazione centrale?',
        exampleTranslation: 'Excuse me, where is the central station?',
        notes: 'Dov\'è is a contraction of Dove + è.'
      },
      {
        id: 'it-6',
        category: 'sentences',
        topic: 'Daily Routine',
        level: 'Intermediate',
        target: 'Mi piace viaggiare in Italia in estate.',
        phonetic: 'mee PYAH-cheh vyahd-JAH-reh een ee-TAH-lyah een ehs-TAH-teh',
        translation: 'I like traveling to Italy in the summer.',
        exampleTarget: 'Mi piace viaggiare in Italia per scoprire la cultura.',
        exampleTranslation: 'I like traveling to Italy to discover the culture.',
        notes: '"Piacere" is structured literally as "Traveling pleases me".'
      }
    ],
    dialogue: {
      title: 'Al Bar (At the Italian Cafe/Bar)',
      lines: [
        { speaker: 'Barista', target: 'Buongiorno! Cosa vi porto?', translation: 'Good morning! What can I bring you?' },
        { speaker: 'Cliente', target: 'Buongiorno, un cappuccino e un cornetto alla crema.', translation: 'Good morning, a cappuccino and a cream croissant.' },
        { speaker: 'Barista', target: 'Al banco o al tavolo?', translation: 'At the counter or at a table?' },
        { speaker: 'Cliente', target: 'Al banco, grazie!', translation: 'At the counter, thank you!' }
      ]
    }
  }
};

// Structured progression tracks for daily study
const DAILY_LESSONS = {
  1: {
    day: 1,
    title: 'First Contact & Greetings',
    subtitle: 'Learn how to say hello, introduce yourself, and show gratitude.',
    targetCardCount: 5,
    xpReward: 50,
    category: 'vocabulary'
  },
  2: {
    day: 2,
    title: 'Cafe & Restaurant Ordering',
    subtitle: 'Confidently order water, coffee, and ask for the bill.',
    targetCardCount: 5,
    xpReward: 60,
    category: 'vocabulary'
  },
  3: {
    day: 3,
    title: 'Essential Grammar & Gender',
    subtitle: 'Understand articles, noun gender, and simple sentence structures.',
    targetCardCount: 4,
    xpReward: 70,
    category: 'grammar'
  },
  4: {
    day: 4,
    title: 'Getting Around & Asking Directions',
    subtitle: 'Navigate cities, train stations, and bathrooms with ease.',
    targetCardCount: 5,
    xpReward: 80,
    category: 'phrases'
  },
  5: {
    day: 5,
    title: 'Sentences & Daily Routines',
    subtitle: 'Build full natural sentences to describe your study and habits.',
    targetCardCount: 4,
    xpReward: 90,
    category: 'sentences'
  }
};
