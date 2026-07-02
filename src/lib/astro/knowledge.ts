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
  Sun_1:'The Sun placed in the 1st house puts identity and self-expression at the very centre of life — the desire to be seen, to lead, and to leave a mark is not ego but a genuine soul-level calling. Confidence comes naturally, and others tend to look to you as a figure of warmth and authority.',
  Sun_2:'The Sun in the 2nd house ties personal identity to wealth, family reputation, and the quality of speech — financial standing matters deeply, not from greed but because resources feel connected to self-worth and dignity. Family pride and the desire to provide are strong driving forces.',
  Sun_3:'The Sun brightening the 3rd house makes communication your natural domain — courage in expressing yourself, curiosity that never fully settles, and meaningful sibling connections are all part of how you move through the world. Your words carry confidence, and learning is a lifelong pleasure.',
  Sun_4:'The Sun in the 4th house means home and family are not background scenery but a source of deep personal pride — emotional security, property, and a sense of belonging carry real importance. The desire to build something solid and lasting in the domestic world runs through everything.',
  Sun_5:'The Sun shining in the 5th house gives a creative, expressive, and playful energy — romance, children, and the act of creating something original are where you feel most alive. Intelligence is real and leadership comes naturally, but only when the heart is engaged.',
  Sun_6:'The Sun in the 6th house drives you toward service, excellence, and the satisfaction of work well done — hardworking, disciplined, and quietly competitive, you are most yourself when overcoming real challenges and making yourself genuinely useful in the world.',
  Sun_7:'The Sun in the 7th house means partnerships are where identity and self-worth are tested and refined — the right relationship brings out your best, and you seek a partner who matches your sense of dignity and purpose. Recognition through others is a recurring theme.',
  Sun_8:'The Sun placed in the 8th house draws your sense of self toward the hidden, the transformative, and the profound — mysteries, shared power, and the study of what lies beneath the surface feel like natural terrain. Life tends to teach through sudden shifts and deep reinventions.',
  Sun_9:'The Sun in the 9th house calls your identity toward wisdom, ethics, and the search for higher truth — philosophy, spirituality, and the love of learning are not hobbies but core to who you are. Long journeys and encounters with different worldviews shape you profoundly.',
  Sun_10:'The Sun at the midheaven in the 10th house is one of the clearest signatures of a career-centred life — recognition, authority, and leaving a professional legacy matter deeply. The public role and the inner identity are tightly intertwined.',
  Sun_11:'The Sun illuminating the 11th house means networks, friendships, and collective goals become pathways to purpose — you gain through social influence, and your sense of achievement is genuinely tied to contributing to something larger than yourself.',
  Sun_12:'The Sun in the 12th house draws the identity inward — spiritual growth, solitude, charitable work, and connections to what lies beyond the ordinary world are where the deeper self finds expression. Recognition may come quietly and from unexpected places.',

  Moon_1:'The Moon rising in the 1st house makes emotion and empathy your first language — highly sensitive to the mood around you, your compassionate and intuitive nature is immediately felt by others. The inner world is rich, and how you feel moment to moment shapes how you show up in life.',
  Moon_2:'The Moon in the 2nd house ties emotional security to family, wealth, and the power of words — fluctuations in finances or family harmony affect you more deeply than most. Nurturing others through resources and meaningful speech feels natural and fulfilling.',
  Moon_3:'The Moon in the 3rd house makes you a natural, emotionally expressive communicator — adaptable, courageous in conversation, and closely connected to siblings. The mind is quick and feeling-based, and you read the emotional temperature of a room with ease.',
  Moon_4:'The Moon in its own domain of the 4th house means home and mother are your emotional centre — peace in the domestic world is not a preference but a genuine inner necessity. When home life is settled, everything else flows more easily.',
  Moon_5:'The Moon in the 5th house brings a romantic, imaginative inner world — children, creative expression, and heartfelt emotion are your truest joys. The feelings are deep and the creativity is genuine; what you make comes directly from what you feel.',
  Moon_6:'The Moon in the 6th house binds emotional life to service and health — you feel most balanced when helping others, but are also prone to absorbing the stress of those around you. Learning to protect your inner world while caring for others is a key life lesson.',
  Moon_7:'The Moon in the 7th house places emotional fulfillment inside partnerships — close relationships genuinely nourish you, and the quality of your most important bonds has a direct and powerful effect on your sense of inner peace and wellbeing.',
  Moon_8:'The Moon moving through the 8th house brings intensity and depth to the emotional world — psychic sensitivity, a fascination with what is hidden, and powerful, complex feelings are part of the nature. Transformation, whether chosen or not, is a recurring theme.',
  Moon_9:'The Moon in the 9th house gives a faithful, spiritually alive mind — travel, learning, and the search for meaning feel emotionally necessary rather than optional. Encounters with other cultures, philosophies, and belief systems genuinely nourish and expand the inner life.',
  Moon_10:'The Moon at the midheaven in the 10th house means the emotional life and the professional life are closely linked — how you are seen publicly matters emotionally, and care for others often finds its expression through the work you do in the world.',
  Moon_11:'The Moon in the 11th house means friends and social connections genuinely nourish the spirit — your deepest aspirations are emotionally charged, and the fulfillment of those long-held hopes brings real, lasting satisfaction that goes far beyond material gain.',
  Moon_12:'The Moon resting in the 12th house gives a deeply intuitive, spiritually rich inner world — solitude restores you in a way that social life cannot. Compassion, inner healing, and the quieter dimensions of experience are where your truest emotional intelligence lives.',

  Mars_1:'Mars in the 1st house places drive, courage, and competitive energy right at the surface of the personality — action is instinctive, challenges are met directly, and the will to push through obstacles is simply part of who you are. The energy is high, the presence is felt.',
  Mars_2:'Mars in the 2nd house fires up the drive around earning and speaking — assertive about money, family, and values, the desire to build financial security is intense and the speech is direct, sometimes forceful, but always purposeful and clear.',
  Mars_3:'Mars in the 3rd house gives fearless, energetic communication and a strong competitive instinct in daily interactions — willpower and effort are the tools, and this same driven energy extends to sibling relationships and any pursuit that requires consistent courage.',
  Mars_4:'Mars in the 4th house brings protective, fiery energy to home and family — domestic matters are approached with serious determination, property is defended or built with real ambition, and the desire to create a secure base for loved ones runs deep.',
  Mars_5:'Mars igniting the 5th house brings passion and competitive fire to creative and romantic pursuits — driven in education, intense in love, and genuinely ambitious in everything you set your heart on. The creative output carries real heat and directness.',
  Mars_6:'Mars thriving in the 6th house makes you a natural overcomer — competition, conflict, and obstacles are where your energy comes alive. The harder the challenge, the more focused the effort; discipline in service and health matters leads to clear, satisfying victories.',
  Mars_7:'Mars in the 7th house gives partnerships a passionate, high-energy dynamic — a strong-willed partner is not just possible but likely, and the relationship requires mutual respect and genuine engagement to thrive. Intensity in love is both a strength and a call to grow.',
  Mars_8:'Mars placed in the 8th house brings intensity, resilience, and a genuine pull toward hidden knowledge and transformation — the deep workings of life, crisis moments, and the mysteries that most avoid are the very terrain where your energy finds its purpose.',
  Mars_9:'Mars in the 9th house gives an adventurous, fire-driven relationship with beliefs and philosophy — convictions run deep, learning is pursued with real passion, and the world is a place to be actively explored rather than passively observed from a distance.',
  Mars_10:'Mars driving through the 10th house gives ambitious, relentless career energy — leadership feels natural, and the drive to build something real and professionally significant pushes you forward even when the path is difficult. Authority is sought, and often earned.',
  Mars_11:'Mars in the 11th house directs energy into goals, teamwork, and network-building — determination combined with strategic alliances turns ambitious aspirations into real, tangible results. The drive is social as well as personal, and gains come through collective effort.',
  Mars_12:'Mars in the 12th house works behind the scenes with quiet but real intensity — discipline, spiritual practice, and effort in private spaces define the life, along with a recurring pull toward foreign lands, retreats, or working for something that serves a larger cause.',

  Mercury_1:'Mercury rising in the 1st house gives a sharp, witty, and adaptable personality — the mind is quick, communication flows easily, and the ability to think on your feet is immediately apparent to anyone who spends time with you. Ideas are your natural currency.',
  Mercury_2:'Mercury in the 2nd house sharpens the abilities around finance, business, and speech — managing wealth, negotiating deals, and finding exactly the right words come naturally and tend to be professionally and personally profitable over time.',
  Mercury_3:'Mercury at home in the 3rd house gives outstanding abilities in writing, communication, learning, and networking — ideas flow freely, the mind makes connections quickly, and your way with words opens more doors than most people realise is possible.',
  Mercury_4:'Mercury in the 4th house gives an analytical, curious mind that feels most at home when exploring roots, education, and domestic life — interest in family history, property, home-based learning, and the management of day-to-day practical affairs feels natural and satisfying.',
  Mercury_5:'Mercury in the 5th house makes learning and creative expression genuinely enjoyable — a quick, inventive mind that excels in academics, arts, and the communication of original ideas. The playful intellect is a real asset in romance and wherever originality is valued.',
  Mercury_6:'Mercury in the 6th house sharpens the capacity for structured analysis and practical problem-solving — logical, efficient, and excellent in service roles, research, and handling complex, detail-rich challenges that require both precision and endurance.',
  Mercury_7:'Mercury in the 7th house brings intelligence directly into the heart of partnerships — negotiation, business alliances, and the meeting of sharp minds make for stimulating and productive relationships. The right partner is someone you can think with as much as feel with.',
  Mercury_8:'Mercury exploring the 8th house gives a research-minded, psychologically curious nature — secrets, psychology, the hidden structures of power, and the deeper mechanics of life are genuinely interesting terrain, and the analytical mind goes deep rather than wide.',
  Mercury_9:'Mercury in the 9th house gives a genuine love of higher learning, philosophical inquiry, and long-distance exploration — teaching, writing, and expanding the mind through travel and cross-cultural encounters feel like calling rather than mere interest.',
  Mercury_10:'Mercury in the 10th house brings professional success through communication, technology, and sharp business thinking — the mind is the primary career asset, and fields that reward intelligence, clear expression, and strategic thinking tend to suit well.',
  Mercury_11:'Mercury in the 11th house turns communication and networking into reliable pathways to gain — intellectual connections, group thinking, business acumen within social circles, and the ability to convey ideas clearly all work in your favour over time.',
  Mercury_12:'Mercury in the 12th house gives a reflective, inwardly directed mind — research, spirituality, foreign connections, and the kind of deep thinking that happens best in solitude are where your intellect is most genuinely productive and most at peace.',

  Jupiter_1:'Jupiter blessing the 1st house brings wisdom, natural optimism, and a generosity of spirit that tends to attract both good fortune and the genuine respect of those around you — the presence is warm, the outlook is broad, and life usually provides more than it takes away.',
  Jupiter_2:'Jupiter in the 2nd house blesses wealth, family values, and the quality of speech — an abundance consciousness and a gift for uplifting others through well-chosen, meaningful words are both consistently present. Financial life tends to improve steadily over time.',
  Jupiter_3:'Jupiter expanding the 3rd house makes communication inspiring rather than merely informative — courage in expression, love of learning, and warm, supportive sibling relationships are gifts that those around you genuinely feel and benefit from.',
  Jupiter_4:'Jupiter in the 4th house brings a sense of abundance and warmth to home and family life — domestic happiness feels like a genuine inheritance, property tends to grow, and education pursued in or through the home environment often leads somewhere meaningful.',
  Jupiter_5:'Jupiter illuminating the 5th house blesses intelligence, creative ability, and spiritual depth — good fortune in education, children, and creative expression flows through this placement, and the inner life is rich enough to fuel many forms of meaningful output.',
  Jupiter_6:'Jupiter in the 6th house brings wisdom and a patient, philosophical approach to the work of service — obstacles are overcome with grace rather than force, health tends to be generally good, and the desire to be genuinely useful to others runs deep and consistently.',
  Jupiter_7:'Jupiter blessing the 7th house tends to attract a wise, generous, and philosophically inclined partner — partnerships are prosperous and expansive, and relationships carry a genuine sense that both people grow larger and better through the connection.',
  Jupiter_8:'Jupiter in the 8th house deepens interest in spirituality, hidden knowledge, and the transformative passages of existence — wisdom accumulates through what is concealed rather than obvious, and the understanding of life deepens significantly through its most challenging turning points.',
  Jupiter_9:'Jupiter in its own domain of the 9th house gives a deeply fortunate, ethical, and spiritually alive nature — wisdom, good teachers, meaningful philosophy, and a sense of being guided through life are the natural and sustaining inheritance of this placement.',
  Jupiter_10:'Jupiter at the peak of the chart in the 10th house brings respected, ethical leadership — success in teaching, public service, and career comes with a genuine sense of purpose, and the professional legacy tends to be one that others speak well of long after.',
  Jupiter_11:'Jupiter in the 11th house brings wealth, influential friendships, and the quiet, reliable fulfillment of long-term aspirations — gains accumulate naturally over time, and the social circle tends to be uplifting, knowledgeable, and genuinely supportive.',
  Jupiter_12:'Jupiter in the 12th house gives spiritual depth, a charitable heart, and a compassionate view of life — foreign connections, time spent in solitude, and engagement with the unseen dimensions of existence often bring unexpected grace and growth.',

  Venus_1:'Venus gracing the 1st house gives natural charm, physical attractiveness, and an artistic sensibility that others notice immediately — love and admiration come easily, beauty is something you both appreciate and seem to carry with you, and social environments tend to open warmly.',
  Venus_2:'Venus in the 2nd house brings a genuine enjoyment of wealth, luxury, and the pleasures of family life — pleasant speech, a strong aesthetic sense, and a natural desire for comfort and beauty in the home and personal environment are consistent and defining features.',
  Venus_3:'Venus in the 3rd house gives a creative, charming, and harmonious style of communication — natural talent in arts, writing, and the building of warm, enjoyable relationships flows easily and makes both personal and professional connections feel more like pleasure than effort.',
  Venus_4:'Venus in the 4th house means happiness is genuinely found at home — comfort, aesthetic beauty, and the warmth of a loving family environment are not optional extras but real emotional needs that, when met, allow everything else in life to flow more smoothly.',
  Venus_5:'Venus shining in the 5th house gives a romantic, creative heart that finds its fullest expression through love, children, and artistic work — the capacity for joy and beauty in these areas is real, deep, and consistently one of the most rewarding parts of life.',
  Venus_6:'Venus in the 6th house brings a diplomatic, harmony-seeking approach to work and service — skilled at easing conflict, bringing aesthetic improvement to practical environments, and making even difficult workplace dynamics more pleasant and workable.',
  Venus_7:'Venus in the 7th house — its natural domain — blesses partnerships with love, harmony, and mutual prosperity. Relationships have the potential to be genuinely beautiful and enriching, and the right partnership is one of the real sources of meaning in the life.',
  Venus_8:'Venus in the 8th house gives a magnetic, deeply feeling nature — drawn to mystery, emotional depth, and the kind of intimate bonds that go far beneath the surface of ordinary connection. Love here is transformative, sometimes intense, always meaningful.',
  Venus_9:'Venus in the 9th house combines love with learning and the spirit of philosophical exploration — travel, higher wisdom, and relationships that feel both romantic and somehow spiritually enriching are the natural terrain where the heart and mind meet most happily.',
  Venus_10:'Venus in the 10th house opens professional pathways in beauty, arts, luxury, public relations, or anything that values charm, aesthetic refinement, and the ability to make things appealing — professional life and personal taste support each other here in a real way.',
  Venus_11:'Venus in the 11th house draws gains through friendships, social warmth, and creative pursuits — social circles feel genuinely welcoming, and financial opportunities tend to arrive through people you like and enjoy spending time with.',
  Venus_12:'Venus in the 12th house gives a romantic, inward, and quietly spiritual experience of love and beauty — drawn to peaceful solitude, subtle aesthetic pleasures, and connections that carry a sense of the sacred or the otherworldly rather than the purely social.',

  Saturn_1:'Saturn in the 1st house shapes a serious, disciplined, and deeply responsible personality — maturity tends to come early in life, and the strength that develops is real and lasting, earned through genuine trials rather than handed over by circumstance.',
  Saturn_2:'Saturn in the 2nd house means wealth and financial security build slowly and deliberately — nothing is assumed or taken for granted, and the security that finally arrives is solid precisely because it was earned through consistent, patient effort over many years.',
  Saturn_3:'Saturn in the 3rd house gives a persistent, methodical approach to communication and daily effort — courage and effective expression develop not in a rush but through sustained practice and discipline, making the eventual mastery all the more genuine and durable.',
  Saturn_4:'Saturn in the 4th house means stability at home and with family comes through responsibility and patient effort — structure and duty with those closest to you lay a foundation that, though slow to build, tends to stand firm and support the life for a long time.',
  Saturn_5:'Saturn in the 5th house brings a serious, measured approach to creativity, education, and parenting — depth and quality are valued over speed and flash, and creative work or educational achievement that takes time to develop often turns out to be the most meaningful.',
  Saturn_6:'Saturn thriving in the 6th house gives exceptional capacity for hard, disciplined, service-oriented work — the ability to persist through difficulty, maintain health through structure, and overcome obstacles through sheer methodical effort is a defining and powerful strength.',
  Saturn_7:'Saturn in the 7th house calls for serious, committed partnerships built on loyalty and long-term trust — casual relationships rarely satisfy what is actually sought, and the most meaningful partnerships are those that deepen and stabilise steadily through the years.',
  Saturn_8:'Saturn in the 8th house means life teaches through transformation and the endurance of what cannot be predicted or controlled — each upheaval builds unusual resilience, and a genuine, earned understanding of what lies hidden beneath the surface of ordinary existence.',
  Saturn_9:'Saturn in the 9th house builds wisdom slowly and carefully through discipline, lived experience, and the serious study of ethics and higher learning — the philosophical view deepens authentically with every passing year, and the understanding that emerges is genuinely one\'s own.',
  Saturn_10:'Saturn in the 10th house — one of its most powerful placements — builds lasting career success through quiet, consistent dedication over many years. The reputation earned tends to be solid and real, and the professional achievements, when they arrive, are well-founded and durable.',
  Saturn_11:'Saturn in the 11th house means gains arrive deliberately and over time — reliable friendships, carefully pursued long-term goals, and a disciplined approach to ambition eventually bring significant reward that feels genuinely earned rather than accidentally obtained.',
  Saturn_12:'Saturn in the 12th house places discipline in the interior life — wisdom grows through periods of solitude, deep self-reflection, and the willingness to sit with the deeper truths that silence reveals. Spiritual practice, done consistently, becomes one of the real anchors of the life.',

  Rahu_1:'Rahu in the 1st house drives the creation of a unique, sometimes larger-than-life identity — the ambition to stand out, to be someone distinct and memorable, is powerful and persistent. The path taken is rarely conventional, and the personality carries an intriguing, sometimes unsettling magnetism.',
  Rahu_2:'Rahu in the 2nd house fuels a powerful, sometimes consuming appetite for wealth, status, and the social influence that comes with financial power — communication is a strategic tool, and the desire for abundance is genuine, intense, and a consistent motivating force in the life.',
  Rahu_3:'Rahu in the 3rd house gives fearless, innovative energy in communication, daily effort, and the pursuit of ideas — bold strategies, unconventional approaches, and a relentless work ethic drive real progress, and the courage to try what others won\'t is a genuine strength.',
  Rahu_4:'Rahu in the 4th house seeks comfort, luxury, and home experiences that go beyond what is conventional or expected — a restlessness in domestic life and a desire for something more unusual or elevated than the ordinary are constant and recurring undercurrents.',
  Rahu_5:'Rahu in the 5th house brings unconventional creative and romantic ambitions — original thinking, a fascination with non-traditional approaches to education, children, and love, and a strong, sometimes obsessive intellectual drive that seeks to break new ground.',
  Rahu_6:'Rahu in the 6th house gives a powerful advantage in competition, problem-solving, and the overcoming of obstacles — the intensity brought to challenges is real, and the ability to outmanoeuvre rivals, handle enemies, and resolve difficult situations is a genuine and consistent strength.',
  Rahu_7:'Rahu in the 7th house draws unusual, sometimes transformative relationships — partnerships become a primary path of growth and evolution, often unconventional in nature and always significant in the way they change who you are and how you understand yourself.',
  Rahu_8:'Rahu in the 8th house is intensely fascinated by the hidden, the mysterious, and the transformative dimensions of existence — research, occult knowledge, and life\'s deeper undercurrents hold a genuine and powerful pull that is not easily satisfied by surface-level engagement.',
  Rahu_9:'Rahu in the 9th house challenges established beliefs and drives the forging of an independent philosophical or spiritual path — received wisdom rarely satisfies, and the need to understand things through direct experience and personal inquiry is both persistent and productive.',
  Rahu_10:'Rahu in the 10th house drives intense, sometimes consuming career ambition — the desire for public recognition and professional success is powerful and often leads to unconventional achievements that others did not see coming. The career is a central stage of the life.',
  Rahu_11:'Rahu in the 11th house connects innovation, unconventional networking, and strategic ambition to large-scale gains — influential connections, unexpected pathways to wealth, and the ability to see opportunities where others see only uncertainty are consistent strengths.',
  Rahu_12:'Rahu in the 12th house draws you persistently toward what is foreign, hidden, and spiritually deep — inner transformation, time spent outside your native environment, and exploration of what lies beyond ordinary awareness are recurring and meaningful themes in the life.',

  Ketu_1:'Ketu in the 1st house brings a quality of detachment and spiritual depth to the personality — personal recognition holds little genuine appeal, and the inner life is felt to carry far more meaning than the outer one. Others may sense something untouchable or quietly extraordinary about you.',
  Ketu_2:'Ketu in the 2nd house brings a natural detachment from material wealth and family attachment — possessions come and go without grief, and there is a real and rare freedom from the compulsion to accumulate. What others grasp for, you tend to hold lightly.',
  Ketu_3:'Ketu in the 3rd house gives an independent, quietly courageous, and deeply intuitive nature — solitude is valued over constant company, inner guidance is trusted more than external advice, and the insights that arise from within tend to be more reliable than those that come from without.',
  Ketu_4:'Ketu in the 4th house means inner peace takes priority over material comfort and domestic security — the home may be impermanent or the emotional roots less fixed than others, but the spiritual home, the one cultivated within, becomes a real and sustaining source of stability.',
  Ketu_5:'Ketu in the 5th house brings spiritual inclination and deep intuitive gifts — detachment from the need for recognition in creative or romantic areas coexists with a genuine inner knowing that runs deeper than conventional feeling, making the creative output often quietly unusual and meaningful.',
  Ketu_6:'Ketu in the 6th house overcomes obstacles not through brute force but through inner strength, spiritual clarity, and a kind of quiet wisdom that sees through difficulty — the unseen, internalized effort is often more powerful in its effects than anything visible or outwardly dramatic.',
  Ketu_7:'Ketu in the 7th house gives a quality of spiritual detachment in close relationships — conventional partnership roles can feel limiting, and what the heart actually seeks is a connection that goes beyond the personal and the transactional, toward something with genuine depth and meaning.',
  Ketu_8:'Ketu in the 8th house is naturally at ease with mysticism, transformation, and the hidden layers of existence — the mysteries that unsettle others feel strangely familiar and even comforting, and an intuitive understanding of what lies beneath the visible surface is a real and consistent gift.',
  Ketu_9:'Ketu in the 9th house gives a deeply spiritual and philosophical nature, unbound by the form of any particular tradition — truth is pursued from within and through direct, personal experience rather than inherited doctrine, and the understanding that develops is genuinely one\'s own.',
  Ketu_10:'Ketu in the 10th house loosens the grip that status and public approval tend to hold over most people — purpose is found not in recognition or titles but in work that is genuinely meaningful and useful, and the career often serves something larger than personal ambition.',
  Ketu_11:'Ketu in the 11th house brings detachment from social approval, material gains, and the pressure of conventional ambition — freedom from the need to be validated by others or to measure success by what is gained becomes, in time, a source of real inner clarity and peace.',
  Ketu_12:'Ketu in the 12th house is in its spiritual home — highly intuitive, naturally inclined toward liberation, meditation, and the kind of sustained inner life that most people never access. Solitude is not loneliness here but a space where the deepest and truest self becomes known.',
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
