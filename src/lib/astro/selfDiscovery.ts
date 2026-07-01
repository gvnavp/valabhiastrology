import type { ChartData, PlanetData } from './types';
import {
  RASI_ASC, HOUSE_KW, PLANET_IN_HOUSE,
  EXALT_RASI, DEBIL_RASI,
  getNakLord, getNakName, getPlanetLordships, getPairTrait,
} from './knowledge';

export interface DiscoverySection {
  heading: string;
  paragraphs: string[];
}

const ORD = ['','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];

const ABBR: Record<string, string> = {
  Sun:'Su', Moon:'Mo', Mars:'Ma', Mercury:'Me',
  Jupiter:'Ju', Venus:'Ve', Saturn:'Sa', Rahu:'Ra', Ketu:'Ke',
};

// ── Combustion orbs (degrees from Sun) ───────────────────────────────────────
const COMBUST_ORB: Partial<Record<string, number>> = {
  Moon: 12, Mercury: 14, Venus: 10, Mars: 17, Jupiter: 11, Saturn: 15,
};

// ── Exalted/Debilitated quality descriptions (from user's reference table) ───
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

// ── Retrograde and combust descriptions ──────────────────────────────────────
const RETRO_TEXT: Record<string, string> = {
  Mars:    'Your energy becomes internal, requiring patience before action.',
  Mercury: 'You tend toward deep reflection in thinking and communication.',
  Jupiter: 'Your wisdom grows through inner reflection rather than outward guidance.',
  Venus:   'You deeply reassess love, values, and relationships from within.',
  Saturn:  'Your life lessons are learned through introspection and self-discipline.',
  Rahu:    'Your unconventional thinking and karmic desires are intensified. (Rahu is considered naturally retrograde in Vedic astrology.)',
  Ketu:    'Your spiritual insight and natural detachment are deeply heightened. (Ketu is considered naturally retrograde in Vedic astrology.)',
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

function isCombusted(planet: PlanetData, sun: PlanetData): boolean {
  const orb = COMBUST_ORB[planet.name];
  if (orb === undefined) return false;
  const diff = Math.abs(planet.longitude - sun.longitude);
  return (diff > 180 ? 360 - diff : diff) <= orb;
}

// ── Section 1: Ascendant ──────────────────────────────────────────────────────
function ascSection(d1: ChartData): DiscoverySection {
  const asc = RASI_ASC[d1.lagnaRasi];
  const nakName = getNakName(d1.lagna);
  const nakLord = getNakLord(d1.lagna);
  const nakLordLordships = getPlanetLordships(nakLord, d1.lagnaRasi);
  const nakLordStr = nakLordLordships.length > 0
    ? ` ${nakLord} rules your ${nakLordLordships.map(h => `${ORD[h]} house`).join(' and ')} (${nakLordLordships.map(h => HOUSE_KW[h].short).join(', ')}).`
    : '';

  return {
    heading: `Your Ascendant: ${asc.name} (${asc.element} Sign)`,
    paragraphs: [
      `Your ascendant rises in ${asc.name}, in the nakshatra of ${nakName} — whose star lord is ${nakLord}.${nakLordStr}`,
      asc.desc,
    ],
  };
}

// ── Section 2: Life Theme ─────────────────────────────────────────────────────
function lifeThemeSection(d1: ChartData): DiscoverySection {
  const { planets, lagnaRasi, lagna: lagnaLon } = d1;

  const ascNak      = getNakName(lagnaLon);
  const ascNakLord  = getNakLord(lagnaLon);
  const ascNakLordPlanet = planets.find(p => p.name === ascNakLord);
  const planetsInAsc = planets.filter(p => p.rasi === lagnaRasi);

  const paragraphs: string[] = [];

  if (planetsInAsc.length === 0 && ascNakLordPlanet) {
    const slHouse       = houseOf(ascNakLordPlanet, lagnaRasi);
    const slLordships   = getPlanetLordships(ascNakLord, lagnaRasi);
    const slLordshipStr = slLordships.map(h => `${ORD[h]} house (${HOUSE_KW[h].short})`).join(' and ');

    paragraphs.push(
      `Your ascendant falls in ${ascNak} nakshatra with no planet occupying the lagna. ` +
      `The ascendant's star lord is ${ascNakLord}, who rules your ${slLordshipStr}. ` +
      `${ascNakLord} is placed in your ${ORD[slHouse]} house — the domain of ${HOUSE_KW[slHouse].long}.`
    );

    const l2NakLord = getNakLord(ascNakLordPlanet.longitude);
    const l2Planet  = planets.find(p => p.name === l2NakLord);
    if (l2Planet) {
      const l2House     = houseOf(l2Planet, lagnaRasi);
      const l2Lordships = getPlanetLordships(l2NakLord, lagnaRasi);
      const l2Str       = l2Lordships.length > 0
        ? ` (${l2NakLord} rules your ${l2Lordships.map(h => ORD[h]).join('/')} house)`
        : '';

      paragraphs.push(
        `Going one level deeper, ${ascNakLord}'s own star lord is ${l2NakLord}${l2Str}, ` +
        `placed in your ${ORD[l2House]} house (${HOUSE_KW[l2House].long}).`
      );

      const themeHouses = [...new Set([...slLordships, slHouse, l2House])];
      paragraphs.push(`Your life theme therefore weaves together: ${themeHouses.map(h => HOUSE_KW[h].short).join(', ')}.`);
    } else {
      const themeHouses = [...new Set([...slLordships, slHouse])];
      paragraphs.push(`Your life theme revolves around: ${themeHouses.map(h => HOUSE_KW[h].short).join(', ')}.`);
    }

    const difficult = [3, 6, 8, 12];
    if (difficult.includes(slHouse) && !slLordships.includes(slHouse)) {
      paragraphs.push(
        `The ascendant's star lord connects to the ${ORD[slHouse]} house — this signals that significant life challenges serve as your most important teachers.`
      );
    }
  } else {
    for (const p of planetsInAsc) {
      const lordships    = getPlanetLordships(p.name, lagnaRasi);
      const lordshipText = lordships.length > 0
        ? `, ruling your ${lordships.map(h => `${ORD[h]} house`).join(' and ')} (${lordships.map(h => HOUSE_KW[h].short).join(', ')})`
        : '';

      const starLord          = getNakLord(p.longitude);
      const starLordPlanet    = planets.find(pl => pl.name === starLord);
      const starLordHouse     = starLordPlanet ? houseOf(starLordPlanet, lagnaRasi) : null;
      const starLordLordships = getPlanetLordships(starLord, lagnaRasi);

      paragraphs.push(
        `${p.name} sits in your ascendant${lordshipText}. ` +
        `The themes of ${lordships.map(h => HOUSE_KW[h].short).join(' and ')} are woven directly into your personality and self-expression.`
      );

      if (starLordHouse) {
        const slLordStr = starLordLordships.length > 0
          ? ` (${starLordLordships.map(h => ORD[h]).join('/')} lord)`
          : '';
        paragraphs.push(
          `${p.name}'s star lord is ${starLord}${slLordStr}, placed in your ${ORD[starLordHouse]} house — ` +
          `connecting your core identity to the themes of ${HOUSE_KW[starLordHouse].long}.`
        );
      }
    }
  }

  return { heading: 'Your Life Theme', paragraphs };
}

// ── Section 3: Your Unique Traits ─────────────────────────────────────────────
function uniqueTraitsSection(d1: ChartData): DiscoverySection {
  const { planets, lagnaRasi } = d1;
  const paragraphs: string[] = [];

  // ── Para 1: planet placement narrative ───────────────────────────────────
  const sentences: string[] = [];
  for (const p of planets) {
    const house = houseOf(p, lagnaRasi);
    const desc  = PLANET_IN_HOUSE[`${p.name}_${house}`] ?? '';
    if (desc) sentences.push(desc);
  }
  paragraphs.push(
    sentences.length > 0
      ? sentences.join(' ')
      : 'Your planetary configuration shapes a multifaceted personality with depth across many domains of life.'
  );

  // ── Para 2: conjunctions — planets in the same sign ───────────────────────
  const conjParts: string[] = [];
  const byRasi: Record<number, PlanetData[]> = {};
  for (const p of planets) (byRasi[p.rasi] ??= []).push(p);

  for (const grp of Object.values(byRasi)) {
    if (grp.length < 2) continue;
    const h = houseOf(grp[0], lagnaRasi);
    for (let i = 0; i < grp.length; i++) {
      for (let j = i + 1; j < grp.length; j++) {
        const trait = getPairTrait(ABBR[grp[i].name], ABBR[grp[j].name]);
        if (!trait) continue;
        const t = trait.charAt(0).toLowerCase() + trait.slice(1);
        conjParts.push(
          `${grp[i].name} and ${grp[j].name} are conjunct in your ${ORD[h]} house — ${t} ` +
          `This union intensifies both energies in the same arena, which can be powerfully productive when channeled with awareness, and demanding when left unchecked.`
        );
      }
    }
  }
  paragraphs.push(
    conjParts.length > 0
      ? conjParts.join(' ')
      : 'Your planets are spread across different signs, each expressing its energy independently. ' +
        'This gives you a well-rounded character with a broad range of abilities rather than one overwhelmingly dominant theme.'
  );

  // ── Para 3: trines — 5th or 9th sign apart ───────────────────────────────
  const trineParts: string[] = [];
  const pList = [...planets];
  for (let i = 0; i < pList.length; i++) {
    for (let j = i + 1; j < pList.length; j++) {
      const ha   = houseOf(pList[i], lagnaRasi);
      const hb   = houseOf(pList[j], lagnaRasi);
      if (ha === hb) continue;
      const dist = Math.min(Math.abs(hb - ha), 12 - Math.abs(hb - ha));
      if (dist !== 4 && dist !== 8) continue;
      const trait = getPairTrait(ABBR[pList[i].name], ABBR[pList[j].name]);
      if (!trait) continue;
      const t = trait.charAt(0).toLowerCase() + trait.slice(1);
      trineParts.push(
        `**${pList[i].name} and ${pList[j].name} form a natural trine** — a positive, harmonious flow of energy. ${t.charAt(0).toUpperCase() + t.slice(1)} ` +
        `This is one of your genuine blessings — a natural gift that flows effortlessly and enriches your life without effort.`
      );
    }
  }
  paragraphs.push(
    trineParts.length > 0
      ? trineParts.join(' ')
      : 'Your chart is one where gifts emerge through effort and conscious intention rather than effortless flow. ' +
        'Every achievement carries the deep satisfaction of something truly earned and integrated.'
  );

  return { heading: 'Your Unique Traits', paragraphs };
}

// ── Section 4: Your Strengths & Weaknesses ───────────────────────────────────
function strengthsWeaknessSection(d1: ChartData): DiscoverySection {
  const { planets } = d1;
  const sun = planets.find(p => p.name === 'Sun');

  const strengthLines: string[] = [];
  const weaknessLines: string[] = [];

  for (const p of planets) {
    // Strength: exalted
    if (EXALT_RASI[p.name] === p.rasi) {
      const q = EXALT_QUALITIES[p.name] ?? 'heightened natural gifts';
      strengthLines.push(
        `**${p.name} is exalted** — You naturally possess ${q}. These flow to you with ease and form one of your greatest life assets.`
      );
    }

    // Weakness: debilitated
    if (DEBIL_RASI[p.name] === p.rasi) {
      const q = DEBIL_QUALITIES[p.name] ?? 'the matters this planet governs may require more effort';
      weaknessLines.push(
        `**${p.name} is debilitated** — Your ${q}. This is not a limitation but your greatest invitation to grow deeper than most.`
      );
    }

    // Weakness: retrograde (Rahu & Ketu always move retrograde — include them)
    if (p.isRetrograde) {
      const text = RETRO_TEXT[p.name];
      if (text) weaknessLines.push(`**${p.name} is retrograde** — ${text}`);
    }

    // Weakness: combust (too close to the Sun)
    if (sun && p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu') {
      if (isCombusted(p, sun)) {
        const text = COMBUST_TEXT[p.name];
        if (text) weaknessLines.push(`**${p.name} is combust** — ${text}`);
      }
    }
  }

  const paragraphs: string[] = [];

  paragraphs.push(
    strengthLines.length > 0
      ? strengthLines.join(' ')
      : 'Your strengths are not of the exalted kind — they have been built through experience and perseverance. ' +
        'The qualities cultivated through effort are more deeply integrated than gifts that arrive effortlessly.'
  );

  paragraphs.push(
    weaknessLines.length > 0
      ? weaknessLines.join(' ')
      : 'Your chart shows no significant retrograde, debilitated, or combust planets at birth — a sign of clear planetary expression. ' +
        'The energies you carry act through you with directness and clarity.'
  );

  return { heading: 'Your Strengths & Weaknesses', paragraphs };
}

// ── Main export ───────────────────────────────────────────────────────────────
export function generateSelfDiscovery(d1: ChartData): DiscoverySection[] {
  return [
    ascSection(d1),
    lifeThemeSection(d1),
    uniqueTraitsSection(d1),
    strengthsWeaknessSection(d1),
  ];
}
