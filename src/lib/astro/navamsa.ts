/**
 * Calculate the Navamsa (D9) rasi for a planet.
 *
 * Sign element groups:
 *   Fire  (starts from Aries=0):     Ari=0, Leo=4, Sag=8
 *   Earth (starts from Capricorn=9): Tau=1, Vir=5, Cap=9
 *   Air   (starts from Libra=6):     Gem=2, Lib=6, Aqu=10
 *   Water (starts from Cancer=3):    Can=3, Sco=7, Pis=11
 */
export function getNavamsaRasi(rasi: number, degreeInRasi: number, minutes: number): number {
  // Each navamsa covers 30/9 = 3°20' = 3.3333... degrees
  // pada: 0-8 based on position within the sign
  const posInSign = degreeInRasi + minutes / 60;
  const pada = Math.min(8, Math.floor(posInSign / (30 / 9)));

  // Determine element of the rasi
  if (rasi === 0 || rasi === 4 || rasi === 8) {
    // Fire signs — navamsa starts from Aries (0)
    return pada % 12;
  } else if (rasi === 1 || rasi === 5 || rasi === 9) {
    // Earth signs — navamsa starts from Capricorn (9)
    return (9 + pada) % 12;
  } else if (rasi === 2 || rasi === 6 || rasi === 10) {
    // Air signs — navamsa starts from Libra (6)
    return (6 + pada) % 12;
  } else {
    // Water signs (3, 7, 11) — navamsa starts from Cancer (3)
    return (3 + pada) % 12;
  }
}
