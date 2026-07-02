import type { ChartData, PlanetData } from './types';
import {
  RASI_ASC, HOUSE_KW, PLANET_IN_HOUSE,
  EXALT_RASI, DEBIL_RASI, SIGN_LORD,
  getNakLord, getNakName, getPlanetLordships, getPairTrait,
} from './knowledge';
import {
  RASI_ASC_TE, HOUSE_KW_TE, PLANET_IN_HOUSE_TE,
  EXALT_QUALITIES_TE, DEBIL_QUALITIES_TE,
  RETRO_TEXT_TE, COMBUST_TEXT_TE, NAKSHATRA_NAMES_TE, ORD_TE,
} from './knowledgeTe';

export interface DiscoverySection {
  heading: string;
  paragraphs: string[];
}

const ORD = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];

const ABBR: Record<string, string> = {
  Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me',
  Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke',
};

const COMBUST_ORB: Partial<Record<string, number>> = {
  Moon: 12, Mercury: 14, Venus: 10, Mars: 17, Jupiter: 11, Saturn: 15,
};

// ── When the ascendant lord is retrograde ────────────────────────────────────
const ASC_LORD_RETRO: Record<string, string> = {
  Mars:    'Though this ascendant naturally gives bold, direct self-expression and strong drive, with Mars retrograde that energy runs inward — you tend to carry much initiative and courage inside but hold back from expressing or acting on it outwardly. Others may not see your full strength until you feel truly safe to show it.',
  Mercury: 'Though this ascendant naturally gives a quick, expressive, and communicative personality, with Mercury retrograde the mind turns deeply reflective — many ideas and thoughts circulate within, yet they surface outwardly only when the moment feels exactly right. You are a deeper thinker than you appear.',
  Venus:   'Though this ascendant naturally gives charm, warmth, and graceful self-expression, with Venus retrograde that warmth runs inward — you feel and appreciate deeply but may not always express affection or beauty outwardly with ease. Genuine connection matters more to you than surface show.',
  Jupiter: 'Though this ascendant naturally gives optimism, wisdom, and an expansive personality, with Jupiter retrograde that wisdom is intensely inward — you question received beliefs, forge your own understanding, and may hold back your knowledge until you have truly tested it within yourself.',
  Saturn:  'Though this ascendant naturally gives a structured, disciplined personality, with Saturn retrograde that discipline is an intensely private inner experience — you hold yourself to high standards that others rarely see or appreciate, and your self-expression can feel contained by this weight.',
};

const ASC_LORD_RETRO_TE: Record<string, string> = {
  Mars:    'ఈ లగ్నం సహజంగా ధైర్యమైన, నేరుగా వ్యక్తమయ్యే స్వభావం ఇస్తుంది, కానీ కుజుడు వక్రగతిలో ఉన్నందున ఆ శక్తి లోపలికి మరలుతుంది — మీలో ధైర్యం మరియు శక్తి చాలా ఉంటాయి, కానీ వాటిని బయటకు చూపించడం తక్కువగా ఉంటుంది. మీ బలం అందరికీ అర్థమవడానికి సమయం పడుతుంది.',
  Mercury: 'ఈ లగ్నం సహజంగా వేగమైన ఆలోచన మరియు వ్యక్తీకరణ ఇస్తుంది, కానీ బుధుడు వక్రగతిలో ఉన్నందున మనస్సు లోపలికి మళ్ళుతుంది — ఆలోచనలు చాలా ఉంటాయి, సరైన సమయంలో మాత్రమే బయటకు వస్తాయి.',
  Venus:   'ఈ లగ్నం సహజంగా ఆకర్షణ మరియు ప్రేమపూర్వక వ్యక్తిత్వం ఇస్తుంది, కానీ శుక్రుడు వక్రగతిలో ఉన్నందున ఆ ఆప్యాయత లోపలికి నడుస్తుంది — మీ అనుభూతులు లోతుగా ఉంటాయి కానీ వ్యక్తపరచడం అంత సులభం కాదు.',
  Jupiter: 'ఈ లగ్నం సహజంగా విజ్ఞానం మరియు విస్తరణ ఇస్తుంది, కానీ గురుడు వక్రగతిలో ఉన్నందున ఆ జ్ఞానం లోపలి అన్వేషణ ద్వారా పెరుగుతుంది — మీరు స్వయంగా పరీక్షించినదే నమ్ముతారు.',
  Saturn:  'ఈ లగ్నం సహజంగా శిక్షణ మరియు నిర్మాణం ఇస్తుంది, కానీ శని వక్రగతిలో ఉన్నందున ఆ క్రమశిక్షణ తీవ్రంగా లోపలికి పని చేస్తుంది — మీరు మీ పై చాలా అంచనాలు పెట్టుకుంటారు, అవి ఇతరులకు కనపడవు.',
};

// ── Retrograde quality descriptions (one-liner per planet) ───────────────────
const RETRO_TEXT: Record<string, string> = {
  Mars:    'Drive and courage turn inward — you may hold back when bold action is called for, yet inner strength builds powerfully beneath the surface.',
  Mercury: 'Communication and thinking become deeply reflective — many ideas circulate within, expressed outwardly only when the moment feels precisely right.',
  Jupiter: 'Wisdom grows through inner contemplation rather than outward acceptance — you question received knowledge and forge your own understanding.',
  Venus:   'Relationships can feel intense or carry recurring stress — warmth and affection run deep within but are not always easily expressed outwardly.',
  Saturn:  'Discipline and responsibility feel like an inward weight — patterns replay until the lesson is truly owned from within, not merely endured.',
};

const EXALT_QUALITIES: Record<string, string> = {
  Sun:     'strong leadership, confidence, and natural authority',
  Moon:    'emotional balance, deep compassion, and mental peace',
  Mars:    'disciplined courage, strategic action, and controlled energy',
  Mercury: 'a sharp intellect, excellent communication, and an analytical mind',
  Jupiter: 'natural wisdom, strong ethics, prosperity, and spiritual growth',
  Venus:   'pure love, artistic talent, and the capacity for deeply harmonious relationships',
  Saturn:  'natural patience, discipline, responsibility, and perseverance',
  Rahu:    'a drive for innovation, worldly success, and unconventional achievements',
  Ketu:    'deep spiritual wisdom, natural detachment, and strong intuition',
};

const DEBIL_QUALITIES: Record<string, string> = {
  Sun:     'confidence and authority may sometimes waver — these are your greatest areas of inner development',
  Moon:    'emotional stability and consistency take effort — cultivating groundedness is your lifelong path',
  Mars:    'initiative and determination may require conscious effort — patience and consistency are your remedies',
  Mercury: 'clear thinking and decisive communication may feel challenged at times — mindfulness and structure are your tools',
  Jupiter: 'sound judgment and faith are tested — your inner wisdom deepens precisely by facing doubt',
  Venus:   'relationship ease and refinement may require extra care — discernment and self-worth are your teachers',
  Saturn:  'structure, motivation, and timely action may feel harder — yet each effort compounds more than you realise',
  Rahu:    'clarity of purpose and inner stability are your practice — grounding rituals bring out your best',
  Ketu:    'worldly direction and engagement may feel unclear — spiritual practices and community anchor you',
};

const COMBUST_TEXT: Record<string, string> = {
  Moon:    'Your emotional sensitivity and intuition may be less visible, working through quiet inner knowing.',
  Mars:    'Your courage and assertiveness may be less outwardly visible.',
  Mercury: 'Your communication and decision-making may feel challenged at times.',
  Jupiter: 'Your natural guidance and optimism may be less apparent to those around you.',
  Venus:   'Your affection and desire for comfort may be harder to express outwardly.',
  Saturn:  'Your discipline and responsibilities may feel more demanding than for others.',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function houseOf(p: PlanetData, lagnaRasi: number): number {
  return ((p.rasi - lagnaRasi + 12) % 12) + 1;
}

function nakNameOf(lon: number, lang: 'en' | 'te'): string {
  const idx = Math.floor(lon / (360 / 27)) % 27;
  return lang === 'te' ? (NAKSHATRA_NAMES_TE[idx] ?? getNakName(lon)) : getNakName(lon);
}

function isCombusted(planet: PlanetData, sun: PlanetData): boolean {
  const orb = COMBUST_ORB[planet.name];
  if (orb === undefined) return false;
  const diff = Math.abs(planet.longitude - sun.longitude);
  return (diff > 180 ? 360 - diff : diff) <= orb;
}

// Build a sentence describing retrograde impact on a specific house
function retroHouseImpact(houses: number[], ord: string[], hkw: typeof HOUSE_KW, te: boolean): string {
  const houseLabels = houses.map(h => `**${ord[h]} house** (${hkw[h].short})`).join(te ? ' మరియు ' : ' and ');
  if (te) {
    return `మీ ${houseLabels} అధిపతిగా, ఆ రంగాల విషయాలు లోపల పక్వత చెందిన తర్వాతే స్థిరపడతాయి — ఓర్పు మరియు లోపలి పని ఇక్కడ కీలకం.`;
  }
  return `As lord of your ${houseLabels}, matters in those areas tend to settle only after inner processing — patience and inner work are key here.`;
}

// ── Section 1: Ascendant ──────────────────────────────────────────────────────
function ascSection(d1: ChartData, lang: 'en' | 'te'): DiscoverySection {
  const te   = lang === 'te';
  const asc  = te ? RASI_ASC_TE[d1.lagnaRasi] : RASI_ASC[d1.lagnaRasi];
  const hkw  = te ? HOUSE_KW_TE : HOUSE_KW;
  const ord  = te ? ORD_TE : ORD;
  const nakName  = nakNameOf(d1.lagna, lang);
  const nakLord  = getNakLord(d1.lagna);
  const nakLordships = getPlanetLordships(nakLord, d1.lagnaRasi);
  const nakLordStr = nakLordships.length > 0
    ? te
      ? ` ${nakLord} మీ ${nakLordships.map(h => `${ord[h]} భావాన్ని`).join(' మరియు ')} పరిపాలిస్తుంది (${nakLordships.map(h => hkw[h].short).join(', ')}).`
      : ` ${nakLord} rules your ${nakLordships.map(h => `${ORD[h]} house`).join(' and ')} (${nakLordships.map(h => HOUSE_KW[h].short).join(', ')}).`
    : '';

  const heading = te
    ? `మీ లగ్నం: ${asc.name} (${asc.element} రాశి)`
    : `Your Ascendant: ${asc.name} (${asc.element} Sign)`;

  const intro = te
    ? `మీ లగ్నం ${asc.name}లో ఉంది, ${nakName} నక్షత్రంలో — దీని నక్షత్ర అధిపతి ${nakLord}.${nakLordStr}`
    : `Your ascendant rises in ${asc.name}, in the nakshatra of ${nakName} — whose star lord is ${nakLord}.${nakLordStr}`;

  const paragraphs: string[] = [intro, asc.desc];

  // Ascendant lord retrograde check
  const ascLordName = SIGN_LORD[d1.lagnaRasi];
  const ascLordPlanet = d1.planets.find(p => p.name === ascLordName);
  if (ascLordPlanet?.isRetrograde) {
    const retroMsg = te
      ? (ASC_LORD_RETRO_TE[ascLordName] ?? `**${ascLordName}** వక్రగతిలో ఉన్నారు — మీ లగ్నాధిపతి వక్రంగా ఉన్నందున, ఈ లగ్నం యొక్క సహజ శక్తి లోపలికి మళ్ళుతుంది. మీరు బయటకు చూపించేదానికంటే లోపల చాలా ఎక్కువగా అనుభవిస్తారు.`)
      : (ASC_LORD_RETRO[ascLordName] ?? `**${ascLordName}**, your ascendant lord, is retrograde — the natural energy of this ascendant turns inward. You experience and process far more than you outwardly express.`);
    paragraphs.push(te
      ? `**నోట్ — లగ్నాధిపతి వక్రగతి:** ${retroMsg}`
      : `**Note — Ascendant Lord Retrograde:** ${retroMsg}`
    );
  }

  return { heading, paragraphs };
}

// ── Section 2: Life Theme ─────────────────────────────────────────────────────
function lifeThemeSection(d1: ChartData, lang: 'en' | 'te'): DiscoverySection {
  const { planets, lagnaRasi, lagna: lagnaLon } = d1;
  const te  = lang === 'te';
  const hkw = te ? HOUSE_KW_TE : HOUSE_KW;
  const ord = te ? ORD_TE : ORD;

  const nakName        = nakNameOf(lagnaLon, lang);
  const nakLord        = getNakLord(lagnaLon);
  const nakLordPlanet  = planets.find(p => p.name === nakLord);
  const planetsInAsc   = planets.filter(p => p.rasi === lagnaRasi);

  const paragraphs: string[] = [];

  if (planetsInAsc.length > 0) {
    for (const p of planetsInAsc) {
      const lordships   = getPlanetLordships(p.name, lagnaRasi);
      const themeHouses = [...new Set([1, ...lordships])];
      const themeAreas  = themeHouses.map(h => hkw[h].short).join(te ? ' మరియు ' : ' and ');
      paragraphs.push(te
        ? `**${p.name} మీ లగ్నంలో ఉన్నారు** — ఇది మీ జీవిత థీమ్ను ${themeAreas} విషయాల చుట్టూ కేంద్రీకరిస్తుంది. ఈ శక్తులు మీ వ్యక్తిత్వం మరియు జీవిత పయనంలో నేరుగా అల్లుకుపోయాయి.`
        : `**${p.name} sits in your ascendant** — your life theme is centred around **${themeAreas}**. These forces are woven directly into your personality and the journey you are here to live.`
      );
    }
  }

  if (nakLordPlanet) {
    const slHouse     = houseOf(nakLordPlanet, lagnaRasi);
    const slLordships = getPlanetLordships(nakLord, lagnaRasi);
    const themeHouses = [...new Set([slHouse, ...slLordships])];
    const themeAreas  = themeHouses.map(h => hkw[h].short).join(', ');
    paragraphs.push(te
      ? `మీ ${nakName} నక్షత్ర అధిపతి **${nakLord}** మీ **${ord[slHouse]} భావంలో** ఉన్నారు. కాబట్టి మీ జీవిత థీమ్ ముఖ్యంగా **${themeAreas}** చుట్టూ తిరుగుతుంది.`
      : `Your ${nakName} star lord **${nakLord}** sits in your **${ord[slHouse]} house** — so your life theme is strongly centred around **${themeAreas}**.`
    );
  } else if (paragraphs.length === 0) {
    const node = planets.find(p => p.name === nakLord);
    if (node) {
      const slHouse = houseOf(node, lagnaRasi);
      paragraphs.push(te
        ? `మీ ${nakName} నక్షత్ర అధిపతి ${nakLord} మీ ${ord[slHouse]} భావం (${hkw[slHouse].short}) నుండి మీ జీవితాన్ని నడిపిస్తున్నారు.`
        : `Your ${nakName} star lord ${nakLord} operates from your ${ord[slHouse]} house — the domain of ${hkw[slHouse].long} — shaping your life's central direction.`
      );
    }
  }

  return { heading: te ? 'మీ జీవిత థీమ్' : 'Your Life Theme', paragraphs };
}

// ── Section 3: Your Unique Traits ─────────────────────────────────────────────
function uniqueTraitsSection(d1: ChartData, lang: 'en' | 'te'): DiscoverySection {
  const { planets, lagnaRasi } = d1;
  const te  = lang === 'te';
  const hkw = te ? HOUSE_KW_TE : HOUSE_KW;
  const pih = te ? PLANET_IN_HOUSE_TE : PLANET_IN_HOUSE;
  const ord = te ? ORD_TE : ORD;
  const paragraphs: string[] = [];

  // ── 1. Planetary Combinations ────────────────────────────────────────────
  paragraphs.push(te ? '**గ్రహ కలయికలు:**' : '**Planetary Combinations:**');

  const byHouse: Record<number, PlanetData[]> = {};
  for (const p of planets) {
    const h = houseOf(p, lagnaRasi);
    (byHouse[h] ??= []).push(p);
  }

  let hasCombo = false;
  for (const [hStr, grp] of Object.entries(byHouse)) {
    if (grp.length < 2) continue;
    const h     = parseInt(hStr);
    const hName = hkw[h].short;
    for (let i = 0; i < grp.length; i++) {
      for (let j = i + 1; j < grp.length; j++) {
        const trait = getPairTrait(ABBR[grp[i].name], ABBR[grp[j].name]);
        if (!trait) continue;
        hasCombo = true;
        paragraphs.push(te
          ? `**${grp[i].name} + ${grp[j].name}** మీ **${ord[h]} భావంలో** (${hName}) — ${trait.toLowerCase()} — ఈ కలయిక మీ ${hkw[h].long}ను నేరుగా ప్రభావితం చేస్తుంది.`
          : `**${grp[i].name} + ${grp[j].name}** in your **${ord[h]} house** (${hName}) — ${trait.toLowerCase()} — this energy colours ${hkw[h].long}.`
        );
      }
    }
  }

  if (!hasCombo) {
    paragraphs.push(te
      ? 'మీ గ్రహాలు వేర్వేరు భావాలలో వ్యాపించి ఉన్నాయి — ప్రతి గ్రహం స్వతంత్రంగా తన శక్తిని వ్యక్తపరుస్తుంది.'
      : 'Your planets are spread across different houses, each expressing its energy independently.'
    );
  }

  // ── 2. Individual Planet Positions ────────────────────────────────────────
  paragraphs.push(te ? '**గ్రహ స్థానాలు:**' : '**Planet Positions:**');

  let hasPlacement = false;
  for (const p of planets) {
    const house = houseOf(p, lagnaRasi);
    const desc  = pih[`${p.name}_${house}`] ?? '';
    if (desc) { paragraphs.push(desc); hasPlacement = true; }
  }

  if (!hasPlacement) {
    paragraphs.push(te
      ? 'మీ గ్రహ అమరిక జీవితంలోని అనేక రంగాలలో బహుముఖ వ్యక్తిత్వాన్ని రూపొందిస్తుంది.'
      : 'Your planetary configuration shapes a multifaceted personality across many domains of life.'
    );
  }

  return { heading: te ? 'మీ ప్రత్యేక లక్షణాలు' : 'Your Unique Traits', paragraphs };
}

// ── Section 4: Your Strengths & Weaknesses ───────────────────────────────────
function strengthsWeaknessSection(d1: ChartData, lang: 'en' | 'te'): DiscoverySection {
  const { planets, lagnaRasi } = d1;
  const te  = lang === 'te';
  const eqt = te ? EXALT_QUALITIES_TE : EXALT_QUALITIES;
  const dqt = te ? DEBIL_QUALITIES_TE : DEBIL_QUALITIES;
  const rtt = te ? RETRO_TEXT_TE : RETRO_TEXT;
  const cbt = te ? COMBUST_TEXT_TE : COMBUST_TEXT;
  const hkw = te ? HOUSE_KW_TE : HOUSE_KW;
  const ord = te ? ORD_TE : ORD;
  const sun = planets.find(p => p.name === 'Sun');

  const paragraphs: string[] = [];

  // ── Strengths (exalted planets) ─────────────────────────────────────────
  paragraphs.push(te ? '**బలాలు:**' : '**Strengths:**');

  let hasStrength = false;
  for (const p of planets) {
    if (EXALT_RASI[p.name] === p.rasi) {
      hasStrength = true;
      const q = eqt[p.name] ?? (te ? 'అసాధారణ సహజ వరాలు' : 'heightened natural gifts');
      paragraphs.push(te
        ? `**${p.name} ఉచ్చ స్థితిలో ఉన్నారు** — మీకు సహజంగా ${q} ఉంటాయి. ఇవి సులభంగా మీకు లభిస్తాయి మరియు మీ జీవితంలో అత్యుత్తమ సంపదలలో ఒకటి.`
        : `**${p.name} is exalted** — You naturally possess ${q}. These qualities flow to you with ease and form one of your greatest life assets.`
      );
    }
  }

  if (!hasStrength) {
    paragraphs.push(te
      ? 'మీ బలాలు ఉచ్చ స్థితి రకం కాదు — అవి అనుభవం మరియు పట్టుదల ద్వారా నిర్మించబడ్డాయి.'
      : 'Your strengths are not of the exalted kind — they have been built through experience and perseverance.'
    );
  }

  // ── Challenges (debilitated, retrograde, combust, Rahu/Ketu affliction) ──
  paragraphs.push(te ? '**సవాళ్లు & వృద్ధి రంగాలు:**' : '**Challenges & Growth Areas:**');

  let hasWeakness = false;

  for (const p of planets) {
    // Debilitated
    if (DEBIL_RASI[p.name] === p.rasi) {
      hasWeakness = true;
      const q = dqt[p.name] ?? (te ? 'ఈ గ్రహం పరిపాలించే విషయాలు ఎక్కువ ప్రయత్నం అవసరం' : 'the matters this planet governs may require more effort');
      paragraphs.push(te
        ? `**${p.name} నీచ స్థితిలో ఉన్నారు** — మీలో ${q}. ఇది పరిమితి కాదు — చాలా మందికంటే లోతుగా వృద్ధి చెందడానికి మీకు అత్యుత్తమ ఆహ్వానం.`
        : `**${p.name} is debilitated** — Your ${q}. This is not a limitation but an invitation to grow deeper than most.`
      );
    }

    // Retrograde (Rahu/Ketu always retrograde — skip them, no individual meaning to flag)
    if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
      hasWeakness = true;
      const generalText = rtt[p.name] ?? '';
      const lordships   = getPlanetLordships(p.name, lagnaRasi);
      const houseImpact = lordships.length > 0 ? retroHouseImpact(lordships, ord, hkw, te) : '';

      paragraphs.push(te
        ? `**${p.name} వక్రగతిలో ఉన్నారు** — ${generalText}${houseImpact ? ' ' + houseImpact : ''}`
        : `**${p.name} is retrograde** — ${generalText}${houseImpact ? ' ' + houseImpact : ''}`
      );
    }

    // Combust
    if (sun && p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu' && isCombusted(p, sun)) {
      const text = cbt[p.name];
      if (text) {
        hasWeakness = true;
        paragraphs.push(te
          ? `**${p.name} అస్తమానంలో ఉన్నారు** — ${text}`
          : `**${p.name} is combust** — ${text}`
        );
      }
    }
  }

  // Rahu/Ketu nakshatra-lord affliction (moved here from Unique Traits)
  const rahu       = planets.find(p => p.name === 'Rahu');
  const ketu       = planets.find(p => p.name === 'Ketu');
  const rahNakLord = rahu ? getNakLord(rahu.longitude) : null;
  const ketNakLord = ketu ? getNakLord(ketu.longitude) : null;

  for (const p of planets) {
    if (p.name === 'Rahu' || p.name === 'Ketu') continue;
    const pNakLord = getNakLord(p.longitude);
    let afflictedBy: 'Rahu' | 'Ketu' | null = null;
    if (rahNakLord && pNakLord === rahNakLord) afflictedBy = 'Rahu';
    else if (ketNakLord && pNakLord === ketNakLord) afflictedBy = 'Ketu';
    if (!afflictedBy) continue;

    const pLordships = getPlanetLordships(p.name, lagnaRasi);
    if (pLordships.length === 0) continue;

    hasWeakness = true;
    const pNak    = nakNameOf(p.longitude, lang);
    const nodeNak = afflictedBy === 'Rahu'
      ? (rahu ? nakNameOf(rahu.longitude, lang) : '')
      : (ketu ? nakNameOf(ketu.longitude, lang) : '');
    const houseList = pLordships.map(h => `**${ord[h]} house** (${hkw[h].short})`).join(te ? ' మరియు ' : ' and ');

    paragraphs.push(te
      ? `**${p.name}** ${pNak} నక్షత్రంలో ఉన్నారు; **${afflictedBy}** కూడా అదే నక్షత్ర అధిపతి (${pNakLord}) తో ${nodeNak}లో ఉన్నారు. ఈ నీడ ${p.name} శక్తిపై పడుతుంది — మీ ${houseList} విషయాలలో సవాళ్లు లేదా ఆలస్యాలు అనుభవించవచ్చు.`
      : `**${p.name}** is in ${pNak}; **${afflictedBy}** is also in ${nodeNak} — both share the same star lord (${pNakLord}). This casts ${afflictedBy}'s shadow over ${p.name}, bringing challenges or delays to your ${houseList}.`
    );
  }

  if (!hasWeakness) {
    paragraphs.push(te
      ? 'మీ జాతకంలో ముఖ్యమైన నీచ, అస్తమాన లేదా రాహు/కేతు ప్రభావిత గ్రహాలు లేవు — స్పష్టమైన గ్రహ వ్యక్తీకరణ యొక్క సంకేతం.'
      : 'Your chart shows no debilitated, combust, or Rahu/Ketu-afflicted planets — a sign of clear, direct planetary expression.'
    );
  }

  return { heading: te ? 'మీ బలాలు & బలహీనతలు' : 'Your Strengths & Weaknesses', paragraphs };
}

// ── Main export ───────────────────────────────────────────────────────────────
export function generateSelfDiscovery(d1: ChartData, lang: 'en' | 'te' = 'en'): DiscoverySection[] {
  return [
    ascSection(d1, lang),
    lifeThemeSection(d1, lang),
    uniqueTraitsSection(d1, lang),
    strengthsWeaknessSection(d1, lang),
  ];
}
