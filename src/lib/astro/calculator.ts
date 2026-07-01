import type { HoroscopeInput, HoroscopeData, ChartData, HouseCusp, PlanetData } from './types';
import { normalize360 } from './math';
import { dateToJD } from './jd';
import { getAyanamsa } from './ayanamsa';
import { getPlanetPositions } from './planets';
import { getPlacidusHouses } from './houses';
import { getNavamsaRasi } from './navamsa';

function parseDate(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  return { year, month, day, hour, minute };
}

/**
 * Build D9 (Navamsa) chart from D1 data.
 *
 * For D9:
 * - Each planet's navamsa rasi is already stored in PlanetData.navamsaRasi
 * - We build navamsa-style planets (position within their navamsa rasi)
 * - Houses: equal house system from navamsa lagna
 */
function buildD9Chart(d1: ChartData): ChartData {
  // Navamsa lagna rasi
  const navamsaLagnaRasi = getNavamsaRasi(d1.lagnaRasi, d1.laganaDegree, d1.laganaMinutes);
  const navamsaLagnaLon = navamsaLagnaRasi * 30; // start of that rasi

  // D9 planets — place each planet at its navamsa rasi start (for display purposes)
  const d9Planets: PlanetData[] = d1.planets.map((p) => ({
    ...p,
    longitude: p.navamsaRasi * 30,
    rasi: p.navamsaRasi,
    degreeInRasi: 0,
    minutes: 0,
    navamsaRasi: getNavamsaRasi(p.navamsaRasi, 0, 0),
  }));

  // D9 cusps — equal house from navamsa lagna
  const d9Cusps: HouseCusp[] = Array.from({ length: 12 }, (_, i) => {
    const lon = normalize360(navamsaLagnaLon + i * 30);
    const rasi = Math.floor(lon / 30);
    return {
      house: i + 1,
      longitude: lon,
      rasi,
      degreeInRasi: 0,
      minutes: 0,
    };
  });

  return {
    planets: d9Planets,
    cusps: d9Cusps,
    lagna: navamsaLagnaLon,
    lagnaRasi: navamsaLagnaRasi,
    laganaDegree: 0,
    laganaMinutes: 0,
    ayanamsaValue: d1.ayanamsaValue,
    ayanamsaType: d1.ayanamsaType,
  };
}

export function calculateHoroscope(input: HoroscopeInput): HoroscopeData {
  const { year, month, day, hour, minute } = parseDate(input.dateStr, input.timeStr);

  const jd = dateToJD(year, month, day, hour, minute, input.timezoneOffset);
  const ayanamsaValue = getAyanamsa(jd, input.ayanamsa);

  const planets = getPlanetPositions(jd, ayanamsaValue);
  const cusps = getPlacidusHouses(jd, input.latitude, input.longitude, ayanamsaValue);

  const asc = cusps[0]; // House 1 = ASC
  const lagnaRasi = asc.rasi;
  const laganaDegree = asc.degreeInRasi;
  const laganaMinutes = asc.minutes;

  const d1: ChartData = {
    planets,
    cusps,
    lagna: asc.longitude,
    lagnaRasi,
    laganaDegree,
    laganaMinutes,
    ayanamsaValue,
    ayanamsaType: input.ayanamsa,
  };

  const d9 = buildD9Chart(d1);

  return { d1, d9, input };
}
