import type { HouseCusp } from './types';
import { normalize360, DEG, RAD } from './math';

export function getPlacidusHouses(
  jd: number,
  lat: number,
  lng: number,
  ayanamsa: number,
): HouseCusp[] {
  const T = (jd - 2451545.0) / 36525;

  // ── GMST → RAMC ───────────────────────────────────────────────────────────
  const theta = normalize360(
    280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * T * T -
      (T * T * T) / 38710000,
  );
  const RAMC = normalize360(theta + lng);

  // ── Obliquity ──────────────────────────────────────────────────────────────
  const OB = 23.439291111 - 0.013004167 * T;

  // ── Midheaven (MC) ─────────────────────────────────────────────────────────
  let MC = Math.atan2(Math.sin(RAMC * DEG), Math.cos(RAMC * DEG) * Math.cos(OB * DEG)) * RAD;
  MC = normalize360(MC);
  const mcDiff = normalize360(MC - RAMC + 180) - 180;
  if (Math.abs(mcDiff) > 90) MC = normalize360(MC + 180);

  // ── Ascendant (ASC) ────────────────────────────────────────────────────────
  const ASC = normalize360(
    Math.atan2(
      Math.cos(RAMC * DEG),
      -(Math.sin(RAMC * DEG) * Math.cos(OB * DEG) + Math.tan(lat * DEG) * Math.sin(OB * DEG)),
    ) * RAD,
  );

  // ── Right Ascension of the ASC — needed for H2/H3 starting point ──────────
  // Bug fix: H2/H3 intermediate cusps start from RASC (not RAIC = RAMC+180).
  // In Placidus: RA(H2) = RASC + (1/3)×nocturnal_semi_arc
  //              RA(H3) = RASC + (2/3)×nocturnal_semi_arc
  const RASC = normalize360(
    Math.atan2(Math.sin(ASC * DEG) * Math.cos(OB * DEG), Math.cos(ASC * DEG)) * RAD,
  );

  // ── Placidus intermediate cusps (iterative) ───────────────────────────────
  function placidusIntermediate(house: number): number {
    let frac: number;
    let upper: boolean;
    if      (house === 11) { frac = 1 / 3; upper = true; }
    else if (house === 12) { frac = 2 / 3; upper = true; }
    else if (house === 2)  { frac = 1 / 3; upper = false; }
    else                   { frac = 2 / 3; upper = false; } // house 3

    // Initial ecliptic longitude guess
    // Upper (H11/H12): between MC and ASC — start from MC
    // Lower (H2/H3):   between ASC and IC — start from ASC
    let lambda = upper
      ? normalize360(MC  + (house - 10) * 30)  // MC+30 for H11, MC+60 for H12
      : normalize360(ASC + (house - 1)  * 30); // ASC+30 for H2, ASC+60 for H3

    for (let iter = 0; iter < 30; iter++) {
      const sinLam = Math.sin(lambda * DEG);
      const cosLam = Math.cos(lambda * DEG);
      const cosOB  = Math.cos(OB * DEG);
      const sinOB  = Math.sin(OB * DEG);

      // RA and declination of this ecliptic point
      const RA_lambda = normalize360(Math.atan2(sinLam * cosOB, cosLam) * RAD);
      const dec = Math.asin(Math.max(-1, Math.min(1, sinOB * sinLam))) * RAD;

      // Ascensional difference
      const sinAD = Math.max(-1, Math.min(1, Math.tan(lat * DEG) * Math.tan(dec * DEG)));
      const AD = Math.asin(sinAD) * RAD;

      // Semi-arc: diurnal (upper) or nocturnal (lower)
      const SA = upper ? 90 + AD : 90 - AD;

      // Expected RA:
      // Upper (H11/H12): count forward from RAMC
      // Lower (H2/H3):   count forward from RASC  ← key fix (was RAMC+180 = RAIC)
      const expectedRA = upper
        ? normalize360(RAMC + frac * SA)
        : normalize360(RASC + frac * SA);

      // Ecliptic longitude from RA
      const newLambda = normalize360(
        Math.atan2(Math.sin(expectedRA * DEG) / cosOB, Math.cos(expectedRA * DEG)) * RAD,
      );

      // Quadrant correction
      let candidate = newLambda;
      const testRA = normalize360(
        Math.atan2(Math.sin(candidate * DEG) * cosOB, Math.cos(candidate * DEG)) * RAD,
      );
      if (Math.abs(normalize360(testRA - expectedRA + 180) - 180) > 90) {
        candidate = normalize360(candidate + 180);
      }

      const diff = Math.abs(normalize360(candidate - lambda + 180) - 180);
      lambda = candidate;
      if (diff < 0.0001) break;
    }

    return lambda;
  }

  const IC  = normalize360(MC + 180);
  const DSC = normalize360(ASC + 180);
  const H11 = placidusIntermediate(11);
  const H12 = placidusIntermediate(12);
  const H2  = placidusIntermediate(2);
  const H3  = placidusIntermediate(3);

  // Opposite house pairs
  const H5 = normalize360(H11 + 180);
  const H6 = normalize360(H12 + 180);
  const H8 = normalize360(H2  + 180);
  const H9 = normalize360(H3  + 180);

  const tropicals = [ASC, H2, H3, IC, H5, H6, DSC, H8, H9, MC, H11, H12];

  return tropicals.map((lon, i) => {
    const sidereal     = normalize360(lon - ayanamsa);
    const rasi         = Math.floor(sidereal / 30);
    const posInSign    = sidereal - rasi * 30;
    const degreeInRasi = Math.floor(posInSign);
    const minutes      = Math.floor((posInSign - degreeInRasi) * 60);
    return { house: i + 1, longitude: sidereal, rasi, degreeInRasi, minutes };
  });
}
