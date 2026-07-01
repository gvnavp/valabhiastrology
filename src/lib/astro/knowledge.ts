// ── Sign lords ────────────────────────────────────────────────────────────────
export const SIGN_LORD: Record<number, string> = {
  0:'Mars', 1:'Venus', 2:'Mercury', 3:'Moon', 4:'Sun', 5:'Mercury',
  6:'Venus', 7:'Mars', 8:'Jupiter', 9:'Saturn', 10:'Saturn', 11:'Jupiter',
};

export const RASI_NAMES = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces',
];

// ── House keywords ────────────────────────────────────────────────────────────
export const HOUSE_KW: Record<number, { short: string; long: string }> = {
  1:  { short: 'self & identity',         long: 'your personality, body, attitude, and how the world first sees you' },
  2:  { short: 'wealth & family',         long: 'your finances, family bonds, speech, values, and accumulated resources' },
  3:  { short: 'communication & courage', long: 'your siblings, communication, willpower, effort, and skills' },
  4:  { short: 'home & mother',           long: 'your home environment, mother, emotional comfort, and property' },
  5:  { short: 'creativity & children',   long: 'your intelligence, creative expression, romance, children, and past karma' },
  6:  { short: 'health & service',        long: 'your work routines, health, competition, debts, and service to others' },
  7:  { short: 'partnerships & marriage', long: 'your spouse, business partners, public dealings, and one-on-one relationships' },
  8:  { short: 'transformation & hidden', long: 'longevity, sudden changes, hidden matters, inheritance, and occult knowledge' },
  9:  { short: 'dharma & fortune',        long: 'your luck, father, guru, higher learning, religion, and long-distance travel' },
  10: { short: 'career & status',         long: 'your profession, reputation, authority, and public standing' },
  11: { short: 'gains & aspirations',     long: 'your income, social network, elder siblings, and long-term goals' },
  12: { short: 'liberation & foreign',    long: 'spiritual growth, foreign lands, expenses, solitude, and inner liberation' },
};

// ── Ascendant rasi descriptions ───────────────────────────────────────────────
export const RASI_ASC: Record<number, { name: string; element: string; desc: string }> = {
  0:  { name:'Aries',       element:'Fire',  desc: 'You carry the spirit of a pioneer — bold, energetic, and naturally assertive. You lead from instinct, and your courage opens doors for others. Patience and follow-through are the lifelong lessons that deepen your enormous potential.' },
  1:  { name:'Taurus',      element:'Earth', desc: 'Grounded, sensual, and deeply loyal, you build your world with care and precision. Beauty, comfort, and stability are your foundations. Your steadiness is a gift to everyone around you; your stubbornness is your greatest teacher.' },
  2:  { name:'Gemini',      element:'Air',   desc: 'Your mind moves fast and connects everything. Curious, versatile, and socially gifted, you thrive on variety and conversation. The deepest growth comes when you choose depth over breadth — and stay long enough to see things through.' },
  3:  { name:'Cancer',      element:'Water', desc: 'You are the nurturer — fiercely protective, deeply intuitive, and emotionally intelligent. Home and family define your inner world. Your superpower is empathy; your growth edge is learning to receive care as openly as you give it.' },
  4:  { name:'Leo',         element:'Fire',  desc: 'You were born to shine. Generous, creative, and magnetic, you carry natural authority. People follow your lead instinctively. Your journey is moving from needing admiration to being the kind of leader who lifts others up.' },
  5:  { name:'Virgo',       element:'Earth', desc: 'Precise, analytical, and quietly powerful, you notice what others miss. You turn disorder into order with ease. Service and improvement are your calling. The invitation is to extend the same compassion to yourself that you give so freely to others.' },
  6:  { name:'Libra',       element:'Air',   desc: 'You are the diplomat — graceful, fair-minded, and relationship-oriented. You seek balance and beauty in everything. Your deepest growth comes from learning that real harmony sometimes requires taking a clear, decisive stand.' },
  7:  { name:'Scorpio',     element:'Water', desc: 'Intense, magnetic, and perceptive beyond measure — you see beneath every surface. Transformation is your nature. Trust — giving it and earning it — is your most important and most challenging work.' },
  8:  { name:'Sagittarius', element:'Fire',  desc: 'Freedom, philosophy, and expansion define your soul. You are the seeker — restless, optimistic, and inspiring. Others catch fire from your vision. The invitation is to stay committed long enough to harvest what you plant.' },
  9:  { name:'Capricorn',   element:'Earth', desc: 'You carry the discipline of an old soul. Ambitious, patient, and quietly strategic, you build things that last. You earn everything the hard way — which is precisely why your achievements are real and enduring.' },
  10: { name:'Aquarius',    element:'Air',   desc: 'A visionary and humanitarian, you think in systems and futures. Independent, unconventional, and quietly brilliant, you see what society needs before it knows itself. The growth edge is staying present with the people immediately in front of you.' },
  11: { name:'Pisces',      element:'Water', desc: 'Your inner life is an ocean — boundless, empathetic, and spiritually attuned. You feel everything. Creative and compassionate, your growth path is anchoring your gifts through healthy boundaries and discernment in the world.' },
};

// ── Nakshatra names and lord cycle ────────────────────────────────────────────
export const NAKSHATRA_NAMES_KB = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
];
// Ketu-Venus-Sun-Moon-Mars-Rahu-Jupiter-Saturn-Mercury, repeating 3×
export const NAK_LORD_CYCLE = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

export function getNakLord(longitude: number): string {
  return NAK_LORD_CYCLE[Math.floor(longitude / (360 / 27)) % 9];
}
export function getNakName(longitude: number): string {
  return NAKSHATRA_NAMES_KB[Math.floor(longitude / (360 / 27)) % 27];
}

// ── Planet lordship helper ────────────────────────────────────────────────────
export function getPlanetLordships(planetName: string, lagnaRasi: number): number[] {
  const houses: number[] = [];
  for (let rasi = 0; rasi < 12; rasi++) {
    if (SIGN_LORD[rasi] === planetName) {
      houses.push(((rasi - lagnaRasi + 12) % 12) + 1);
    }
  }
  return houses.sort((a, b) => a - b);
}

// ── Exaltation / Debilitation rasi indices ────────────────────────────────────
export const EXALT_RASI: Record<string, number> = {
  Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6, Rahu:2, Ketu:8,
};
export const DEBIL_RASI: Record<string, number> = {
  Sun:6, Moon:7, Mars:3, Mercury:11, Jupiter:9, Venus:5, Saturn:0, Rahu:8, Ketu:2,
};

// ── Planet in house descriptions — written in second-person "You..." format ───
export const PLANET_IN_HOUSE: Record<string, string> = {
  Sun_1:'You have a strong personality with natural confidence, leadership ability, and a drive for recognition.',
  Sun_2:'You focus on wealth, family values, self-worth, and financial stability.',
  Sun_3:'You have excellent communication skills, natural courage, curiosity, and strong sibling connections.',
  Sun_4:'You take pride in your home, family, property, and emotional security.',
  Sun_5:'You are creative, intelligent, expressive, and enjoy romance and children.',
  Sun_6:'You are hardworking, disciplined, service-oriented, and overcome competition with ease.',
  Sun_7:'You gain through partnerships and seek respect and authority in relationships.',
  Sun_8:'You have a deep interest in mysteries, transformation, hidden knowledge, and sudden changes.',
  Sun_9:'You have strong ethics, deep spirituality, a love of higher learning, and respect for traditions.',
  Sun_10:'You are drawn toward career success, leadership, public recognition, and professional authority.',
  Sun_11:'You gain through networks, friendships, ambitious pursuits, and social influence.',
  Sun_12:'You experience spiritual growth, benefit from foreign connections, and carry an introspective and charitable nature.',

  Moon_1:'You are emotional, compassionate, intuitive, and highly sensitive to your surroundings.',
  Moon_2:'You have an emotional attachment to family, wealth, speech, and financial security.',
  Moon_3:'You are a creative communicator — adaptable, courageous, and close to your siblings.',
  Moon_4:'You have a strong bond with home, mother, comfort, and emotional stability.',
  Moon_5:'You are imaginative, romantic, nurturing, and emotionally connected to children.',
  Moon_6:'You are emotionally driven to serve others and are sensitive to stress and health matters.',
  Moon_7:'You seek emotional fulfillment through relationships and harmonious partnerships.',
  Moon_8:'You have deep emotions, psychic intuition, and a strong interest in mysteries and transformation.',
  Moon_9:'You are faithful, compassionate, spiritually inclined, and love learning and travel.',
  Moon_10:'You are a caring professional, respected publicly, and emotionally invested in your career.',
  Moon_11:'You gain through friends, social circles, and the fulfillment of your deepest aspirations.',
  Moon_12:'You are highly intuitive, spiritual, compassionate, and drawn to solitude and healing.',

  Mars_1:'You are bold, energetic, courageous, and naturally competitive.',
  Mars_2:'You are assertive about wealth, family, and finances, and your speech can be direct.',
  Mars_3:'You are a fearless communicator with strong willpower who excels through effort.',
  Mars_4:'You are protective of home and family and energetic in property matters.',
  Mars_5:'You are passionate, creative, competitive, and driven in education and romance.',
  Mars_6:'You excel at overcoming enemies, competition, and workplace challenges.',
  Mars_7:'You have passionate partnerships with a strong-willed spouse and dynamic relationships.',
  Mars_8:'You are intense, resilient, and drawn to hidden knowledge and transformation.',
  Mars_9:'You are adventurous, action-oriented, and passionate about beliefs and higher learning.',
  Mars_10:'You are an ambitious leader with a strong drive for career success and authority.',
  Mars_11:'You achieve your goals through determination, teamwork, and influential networks.',
  Mars_12:'You are energetic behind the scenes and practice spiritual discipline with a pull toward foreign connections.',

  Mercury_1:'You are intelligent, witty, adaptable, and an excellent communicator.',
  Mercury_2:'You are skilled in finance, business, speech, and wealth management.',
  Mercury_3:'You have outstanding communication, writing, learning, and networking abilities.',
  Mercury_4:'You have an analytical mind with interest in education, home, and property.',
  Mercury_5:'You are a creative thinker, quick learner, and talented in academics and arts.',
  Mercury_6:'You are a logical problem-solver who excels in analysis, service, and competition.',
  Mercury_7:'You are an intelligent partner with strong negotiation skills and successful business alliances.',
  Mercury_8:'You are a curious researcher with interest in secrets, psychology, and the occult.',
  Mercury_9:'You love higher learning, philosophy, teaching, and long-distance travel.',
  Mercury_10:'You are successful in business, communication, technology, and professional life.',
  Mercury_11:'You gain through networking, communication, business, and intellectual pursuits.',
  Mercury_12:'You are a reflective thinker with interest in spirituality, research, and foreign lands.',

  Jupiter_1:'You are wise, optimistic, generous, and naturally attract respect and good fortune.',
  Jupiter_2:'You are blessed with wealth, wisdom, family values, and pleasant speech.',
  Jupiter_3:'You are an inspiring communicator with courage, a love of learning, and supportive siblings.',
  Jupiter_4:'You bring happiness through home, education, property, and family life.',
  Jupiter_5:'You are highly intelligent, spiritual, and fortunate in education, children, and creativity.',
  Jupiter_6:'You succeed through service, wisdom, and overcoming obstacles with patience.',
  Jupiter_7:'You are blessed with a wise spouse and harmonious, prosperous partnerships.',
  Jupiter_8:'You have a deep interest in spirituality, hidden knowledge, and personal transformation.',
  Jupiter_9:'You are highly spiritual, fortunate, ethical, and devoted to higher wisdom.',
  Jupiter_10:'You are a respected leader with success in career, teaching, and public service.',
  Jupiter_11:'You gain wealth, influential friends, and fulfill your long-term aspirations.',
  Jupiter_12:'You are spiritually evolved, charitable, compassionate, and benefit from foreign connections.',

  Venus_1:'You are charming, attractive, artistic, and naturally draw love and admiration.',
  Venus_2:'You enjoy wealth, luxury, pleasant speech, and strong family values.',
  Venus_3:'You are a creative communicator with talent in arts, writing, and relationships.',
  Venus_4:'You find happiness through home, comfort, beauty, and family life.',
  Venus_5:'You are romantic, creative, and fortunate in love, children, and artistic pursuits.',
  Venus_6:'You are diplomatic in conflicts, enjoy serving others, and value harmonious work relationships.',
  Venus_7:'You are blessed with a loving partner and harmonious, successful relationships.',
  Venus_8:'You are passionate, magnetic, and attracted to mystery and deep emotional bonds.',
  Venus_9:'You love travel, learning, and spirituality, and find fortune through relationships.',
  Venus_10:'You are successful in careers involving beauty, arts, luxury, or public relations.',
  Venus_11:'You gain through friendships, social circles, creativity, and financial opportunities.',
  Venus_12:'You are romantic, compassionate, spiritual, and enjoy luxury, travel, and peaceful solitude.',

  Saturn_1:"You are disciplined, responsible, patient, and mature through life's challenges.",
  Saturn_2:'You build wealth slowly through hard work and value financial security.',
  Saturn_3:'You are a persistent, hardworking communicator with courage developed over time.',
  Saturn_4:'You find stability through responsibility toward home, family, and property.',
  Saturn_5:'You are serious about education, creativity, and responsibilities toward children.',
  Saturn_6:'You excel through discipline, service, perseverance, and overcoming obstacles.',
  Saturn_7:'You seek committed, stable relationships and value loyalty in partnerships.',
  Saturn_8:"You endure life's transformations with resilience and a deep interest in hidden truths.",
  Saturn_9:'You learn wisdom through discipline, ethics, higher education, and lived experience.',
  Saturn_10:'You achieve lasting career success through dedication, patience, and hard work.',
  Saturn_11:'You gain steadily through perseverance, long-term goals, and reliable friendships.',
  Saturn_12:'You are spiritually disciplined, introspective, and learn through solitude and self-reflection.',

  Rahu_1:'You are ambitious, charismatic, and driven to create a unique identity.',
  Rahu_2:'You have a strong desire for wealth, status, and powerful communication skills.',
  Rahu_3:'You are fearless, innovative, and succeed through bold communication and effort.',
  Rahu_4:'You seek comfort, luxury, and unconventional experiences in home life.',
  Rahu_5:'You are a creative, unconventional thinker with strong ambitions in education and romance.',
  Rahu_6:'You excel in competition, problem-solving, and overcoming enemies or obstacles.',
  Rahu_7:'You attract unusual partnerships and seek growth through relationships.',
  Rahu_8:'You are fascinated by mysteries, transformation, research, and hidden knowledge.',
  Rahu_9:'You challenge traditional beliefs and seek unique spiritual or philosophical paths.',
  Rahu_10:'You are highly ambitious, career-focused, and strive for public recognition and success.',
  Rahu_11:'You gain through networking, innovation, influential friends, and big ambitions.',
  Rahu_12:'You are drawn to spirituality, foreign lands, hidden realms, and inner transformation.',

  Ketu_1:'You are detached, spiritual, introspective, and less focused on personal recognition.',
  Ketu_2:'You are detached from material wealth, family attachments, and worldly possessions.',
  Ketu_3:'You are independent, intuitive, and courageous with a preference for solitude.',
  Ketu_4:'You seek inner peace over material comforts and emotional security.',
  Ketu_5:'You are spiritually inclined, intuitive, and detached from romance and recognition.',
  Ketu_6:'You overcome obstacles through inner strength, discipline, and spiritual wisdom.',
  Ketu_7:'You are detached in relationships and seek deeper spiritual connections.',
  Ketu_8:'You are naturally drawn to mysticism, transformation, and hidden knowledge.',
  Ketu_9:'You are deeply spiritual, philosophical, and detached from rigid religious beliefs.',
  Ketu_10:'You are less attached to status and find purpose through meaningful work and service.',
  Ketu_11:'You are detached from social approval, gains, and material ambitions.',
  Ketu_12:'You are highly spiritual, intuitive, and naturally inclined toward liberation and meditation.',
};

// ── Planet pair combinations (35 pairs, Venus's rules) ───────────────────────
const P_ORD = ['Su','Mo','Ma','Me','Ju','Ve','Sa','Ra','Ke'];

export const PLANET_PAIRS_KB: Record<string, string> = {
  Su_Mo:'Mood & Soul, Decision Wavering',
  Su_Ma:'Command / Aggressive',
  Su_Me:'Right Mathematical',
  Su_Ju:'Great teaching, Good with money',
  Su_Ve:'Expects tasty food, Stylish',
  Su_Sa:'Hardworking, Sharp and Straightforward, Tough',
  Su_Ra:'Ego, Opportunity Losing',
  Su_Ke:'Sceptical, Identity, Leading to Spiritual',
  Mo_Ma:'Emotional, Rewriting Destiny',
  Mo_Me:'Creative at Writing, Art, Good at Communication',
  Mo_Ju:'Reachable Goals, Soft, Positive',
  Mo_Ve:'Creative at Painting, Art, Good at Signing, Dancing',
  Mo_Sa:'Want to do everything quick, but everything is late',
  Mo_Ra:'Materialistic nature; Worried mind, no one can get out of it',
  Mo_Ke:'Detachment',
  Ma_Me:'Fickle mind, diversions, analytical, criticism',
  Ma_Ju:'Logical, Problem solvers',
  Ma_Ve:'Attraction, Passion, Desire, Creative, Chemical',
  Ma_Sa:'Aggressive, Tough, Extreme energy',
  Ma_Ra:'Testing, Investigative, Research',
  Ma_Ke:'All of sudden, unexpected',
  Me_Ju:'Good at speech, Teaching, Training, Counselling',
  Me_Ve:'Bondage, Strategic, Ideas',
  Me_Sa:'Analytical, Manipulative Mathematics',
  Me_Ra:'Gambling, Overthinking',
  Me_Ke:'Decision Making, Educational obstacles, past life karma (good at maths)',
  Ju_Ve:'Great knowledge, good at education, comfortable',
  Ju_Sa:'Practical understanding of knowledge',
  Ju_Ra:'Stuck in situation, Litigation',
  Ju_Ke:'Spiritual',
  Ve_Sa:'Dissatisfied, Extreme of Specifications',
  Ve_Ra:'Fantasy, Extreme of Imagination, Creative',
  Ve_Ke:'Disappointment in Comforts & Desires',
  Sa_Ra:'Extreme Ideology, Unconventional Thinking, Dark World',
  Sa_Ke:'Detached, Spiritual, Late of Late',
};

export function getPairTrait(a1: string, a2: string): string | null {
  const i1 = P_ORD.indexOf(a1);
  const i2 = P_ORD.indexOf(a2);
  if (i1 < 0 || i2 < 0) return null;
  const key = i1 < i2 ? `${a1}_${a2}` : `${a2}_${a1}`;
  return PLANET_PAIRS_KB[key] ?? null;
}

// ── Retrograde traits ─────────────────────────────────────────────────────────
export const RETRO_TRAITS_KB: Record<string, { general: string; tip: string }> = {
  Mars:    { general: 'Mood swings, uncontrollable rage, and reluctant to act decisively.',             tip: 'Go to the gym regularly and avoid unnecessary risks.' },
  Mercury: { general: 'Intuition dominates over logic; affects education, communication, and siblings.', tip: 'Write something regularly and drive carefully.' },
  Jupiter: { general: 'Oscillates between deep religiosity and complete rejection of God or gurus.',    tip: 'Visit a temple, read books, stay active, try something new.' },
  Venus:   { general: 'Extremes in relationships — intense unions, affairs, or complete renunciation.',  tip: 'Stay active in financial dealings and practice art regularly.' },
  Saturn:  { general: 'Persistent underlying fear; either workaholic or strangely fearless. Inferiority complex and dejection possible.', tip: 'Mingle socially, attend gatherings, stay in touch with family.' },
};
