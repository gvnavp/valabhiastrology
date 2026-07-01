import type { AyanamsaType } from './types';

// Ayanamsa values at J2000.0 (Jan 1.5, 2000 = JD 2451545.0)
const AYANAMSA_J2000: Record<AyanamsaType, number> = {
  'Lahiri':   23.853139,
  'BV Raman': 22.460278,
  'KP':       23.861111,
  'KP New':   23.972222,
};

// Rate of precession in degrees per year
// 50.28 arcseconds per year = 50.28/3600 degrees/year
const RATE_DEG_PER_YEAR = 50.28 / 3600; // ≈ 0.013967 deg/yr

const J2000 = 2451545.0;
const DAYS_PER_YEAR = 365.25;

/**
 * Returns the ayanamsa in degrees for a given Julian Day Number.
 */
export function getAyanamsa(jd: number, type: AyanamsaType): number {
  const yearsSinceJ2000 = (jd - J2000) / DAYS_PER_YEAR;
  const base = AYANAMSA_J2000[type];
  return base + RATE_DEG_PER_YEAR * yearsSinceJ2000;
}
