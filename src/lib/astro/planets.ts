import type { PlanetData, PlanetName } from './types';
import { normalize360, DEG, RAD, sinDeg, cosDeg } from './math';
import { getNavamsaRasi } from './navamsa';

// ─────────────────────────────────────────────────────────────────────────────
// SUN (Meeus Ch.25)
// ─────────────────────────────────────────────────────────────────────────────
function getSunLongitude(T: number): number {
  const L0 = normalize360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normalize360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinDeg(M) +
    (0.019993 - 0.000101 * T) * sinDeg(2 * M) +
    0.000289 * sinDeg(3 * M);
  const Omega = 125.04 - 1934.136 * T;
  const lambda = L0 + C - 0.00569 - 0.00478 * sinDeg(Omega);
  return normalize360(lambda);
}

// ─────────────────────────────────────────────────────────────────────────────
// MOON (Meeus Ch.47, truncated ELP)
// ─────────────────────────────────────────────────────────────────────────────
const MOON_TERMS: Array<[number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602],
  [2, -1, -2, 0, 2390],
];

function getMoonLongitude(T: number): number {
  const D = normalize360(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868 -
      (T * T * T * T) / 113065000,
  );
  const M = normalize360(
    357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000,
  );
  const Mp = normalize360(
    134.9633964 +
      477198.8676313 * T +
      0.008997 * T * T +
      (T * T * T) / 69699 -
      (T * T * T * T) / 14712000,
  );
  const F = normalize360(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000 +
      (T * T * T * T) / 863310000,
  );
  const A1 = normalize360(119.75 + 131.849 * T);
  const A2 = normalize360(53.09 + 479264.29 * T);
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const Lp = normalize360(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841 -
      (T * T * T * T) / 65194000,
  );

  let sigmaL = 0;
  for (const [dc, mc, mpc, fc, lcoef] of MOON_TERMS) {
    const arg = dc * D + mc * M + mpc * Mp + fc * F;
    let term = lcoef * sinDeg(arg);
    const absM = Math.abs(mc);
    if (absM === 1) term *= E;
    else if (absM === 2) term *= E * E;
    sigmaL += term;
  }

  sigmaL += 3958 * sinDeg(A1) + 1962 * sinDeg(Lp - F) + 318 * sinDeg(A2);

  return normalize360(Lp + sigmaL / 1000000);
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANETS (NASA JPL Keplerian elements, valid 1800-2050)
// ─────────────────────────────────────────────────────────────────────────────

interface KepElements {
  a: number; da: number;
  e: number; de: number;
  I: number; dI: number;
  L: number; dL: number;
  lp: number; dlp: number; // longitude of perihelion (ϖ)
  Om: number; dOm: number; // longitude of ascending node (Ω)
}

const KEP: Record<string, KepElements> = {
  Mercury: {
    a: 0.38709927, da: 0.00000037,
    e: 0.20563593, de: 0.00001906,
    I: 7.00497902, dI: -0.00594749,
    L: 252.25032350, dL: 149472.67411175,
    lp: 77.45779628, dlp: 0.16047689,
    Om: 48.33076593, dOm: -0.12534081,
  },
  Venus: {
    a: 0.72333566, da: 0.00000390,
    e: 0.00677672, de: -0.00004107,
    I: 3.39467605, dI: -0.00078890,
    L: 181.97909950, dL: 58517.81538729,
    lp: 131.60246718, dlp: 0.00268329,
    Om: 76.67984255, dOm: -0.27769418,
  },
  Earth: {
    a: 1.00000261, da: 0.00000562,
    e: 0.01671123, de: -0.00004392,
    I: -0.00001531, dI: -0.01294668,
    L: 100.46457166, dL: 35999.37244981,
    lp: 102.93768193, dlp: 0.32327364,
    Om: 0, dOm: 0,
  },
  Mars: {
    a: 1.52371034, da: 0.00001847,
    e: 0.09339410, de: 0.00007882,
    I: 1.84969142, dI: -0.00813131,
    L: -4.55343205, dL: 19140.30268499,
    lp: -23.94362959, dlp: 0.44441088,
    Om: 49.55953891, dOm: -0.29257343,
  },
  Jupiter: {
    a: 5.20288700, da: -0.00011607,
    e: 0.04838624, de: -0.00013253,
    I: 1.30439695, dI: -0.00183714,
    L: 34.39644051, dL: 3034.74612775,
    lp: 14.72847983, dlp: 0.21252668,
    Om: 100.47390909, dOm: 0.20469106,
  },
  Saturn: {
    a: 9.53667594, da: -0.00125060,
    e: 0.05386179, de: -0.00050991,
    I: 2.48599187, dI: 0.00193609,
    L: 49.95424423, dL: 1222.49362201,
    lp: 92.59887831, dlp: -0.41897216,
    Om: 113.66242448, dOm: -0.28867794,
  },
};

interface XYZ { x: number; y: number; z: number }

function computeHelioXYZ(name: string, T: number): XYZ {
  const el = KEP[name];

  const a   = el.a  + el.da  * T;
  const e   = el.e  + el.de  * T;
  const I   = el.I  + el.dI  * T;
  const L   = normalize360(el.L  + el.dL  * T);
  const lp  = el.lp + el.dlp * T;
  const Om  = el.Om + el.dOm * T;

  const omega = lp - Om; // argument of perihelion
  const M_deg = normalize360(L - lp); // mean anomaly
  const M_rad = M_deg * DEG;

  // Solve Kepler's equation iteratively
  let E = M_rad;
  for (let i = 0; i < 10; i++) {
    E = M_rad + e * Math.sin(E);
  }

  // True anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2),
  );

  // Radius
  const r = a * (1 - e * Math.cos(E));

  // Heliocentric ecliptic coordinates
  const omega_rad = omega * DEG;
  const Om_rad = Om * DEG;
  const I_rad = I * DEG;

  const cosOm = Math.cos(Om_rad);
  const sinOm = Math.sin(Om_rad);
  const cosI  = Math.cos(I_rad);
  const sinI  = Math.sin(I_rad);
  const cosOm2 = Math.cos(omega_rad);
  const sinOm2 = Math.sin(omega_rad);

  const cosNu = Math.cos(nu);
  const sinNu = Math.sin(nu);

  const x_orb = r * cosNu;
  const y_orb = r * sinNu;

  const x = x_orb * (cosOm2 * cosOm - sinOm2 * sinOm * cosI) -
            y_orb * (sinOm2 * cosOm + cosOm2 * sinOm * cosI);
  const y = x_orb * (cosOm2 * sinOm + sinOm2 * cosOm * cosI) +
            y_orb * (-sinOm2 * sinOm + cosOm2 * cosOm * cosI);
  const z = x_orb * (sinOm2 * sinI) + y_orb * (cosOm2 * sinI);

  return { x, y, z };
}

function getGeocentricLongitude(name: string, T: number, earth: XYZ): number {
  const h = computeHelioXYZ(name, T);
  const dx = h.x - earth.x;
  const dy = h.y - earth.y;
  // dz not needed for ecliptic longitude
  return normalize360(Math.atan2(dy, dx) * RAD);
}

// ─────────────────────────────────────────────────────────────────────────────
// RAHU / KETU (Mean Lunar Nodes)
// ─────────────────────────────────────────────────────────────────────────────
function getRahuLongitude(T: number): number {
  return normalize360(
    125.0445479 -
      1934.1362608 * T +
      0.0020754 * T * T +
      (T * T * T) / 467441,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RETROGRADE DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function isRetrograde(
  name: string,
  jd: number,
  getLon: (jdx: number) => number,
): boolean {
  const lon1 = getLon(jd - 1);
  const lon2 = getLon(jd + 1);
  // Correct for 360° wrap
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD PlanetData
// ─────────────────────────────────────────────────────────────────────────────
function makePlanetData(
  name: PlanetName,
  tropicalLon: number,
  ayanamsa: number,
  retro: boolean,
): PlanetData {
  const sidereal = normalize360(tropicalLon - ayanamsa);
  const rasi = Math.floor(sidereal / 30);
  const posInSign = sidereal - rasi * 30;
  const degreeInRasi = Math.floor(posInSign);
  const minutes = Math.floor((posInSign - degreeInRasi) * 60);
  const navamsaRasi = getNavamsaRasi(rasi, degreeInRasi, minutes);

  return { name, longitude: sidereal, rasi, degreeInRasi, minutes, isRetrograde: retro, navamsaRasi };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function getPlanetPositions(jd: number, ayanamsa: number): PlanetData[] {
  const T = (jd - 2451545) / 36525;

  // Earth heliocentric
  const earth = computeHelioXYZ('Earth', T);

  // Helper: tropical longitude at arbitrary JD
  const lonAt = (name: string, jdx: number): number => {
    const Tx = (jdx - 2451545) / 36525;
    const ex = computeHelioXYZ('Earth', Tx);
    return getGeocentricLongitude(name, Tx, ex);
  };

  const moonLonAt = (jdx: number): number => {
    const Tx = (jdx - 2451545) / 36525;
    return getMoonLongitude(Tx);
  };

  const rahuLonAt = (jdx: number): number => {
    const Tx = (jdx - 2451545) / 36525;
    return getRahuLongitude(Tx);
  };

  // Sun
  const sunLon = getSunLongitude(T);
  const sunRetro = false; // Sun is never retrograde

  // Moon
  const moonLon = getMoonLongitude(T);
  const moonRetro = false; // geocentric Moon never retrograde

  // Inner/outer planets
  const planetNames: Array<[PlanetName, string]> = [
    ['Mercury', 'Mercury'],
    ['Venus',   'Venus'],
    ['Mars',    'Mars'],
    ['Jupiter', 'Jupiter'],
    ['Saturn',  'Saturn'],
  ];

  const planets: PlanetData[] = [
    makePlanetData('Sun',  sunLon,  ayanamsa, sunRetro),
    makePlanetData('Moon', moonLon, ayanamsa, moonRetro),
  ];

  for (const [pname, kepName] of planetNames) {
    const lon = getGeocentricLongitude(kepName, T, earth);
    const retro = isRetrograde(kepName, jd, (jdx) => lonAt(kepName, jdx));
    planets.push(makePlanetData(pname, lon, ayanamsa, retro));
  }

  // Rahu (North Node) — always retrograde
  const rahuTropical = getRahuLongitude(T);
  const rahuRetro = true;
  planets.push(makePlanetData('Rahu', rahuTropical, ayanamsa, rahuRetro));

  // Ketu (South Node) — always retrograde, 180° from Rahu
  const ketuTropical = normalize360(rahuTropical + 180);
  planets.push(makePlanetData('Ketu', ketuTropical, ayanamsa, true));

  return planets;
}
