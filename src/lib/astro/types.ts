export type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export type AyanamsaType = 'Lahiri' | 'BV Raman' | 'KP' | 'KP New';
export type ChartStyle = 'North Indian' | 'South Indian';

export const RASI_ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
export const RASI_FULL = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const PLANET_ABBR: Record<PlanetName, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke',
};

export interface PlanetData {
  name: PlanetName;
  longitude: number;       // sidereal 0-360
  rasi: number;            // 0-11
  degreeInRasi: number;    // 0-29 integer degrees
  minutes: number;         // 0-59
  isRetrograde: boolean;
  navamsaRasi: number;     // 0-11
}

export interface HouseCusp {
  house: number;           // 1-12
  longitude: number;       // sidereal 0-360
  rasi: number;
  degreeInRasi: number;
  minutes: number;
}

export interface ChartData {
  planets: PlanetData[];
  cusps: HouseCusp[];      // 12 cusps
  lagna: number;           // sidereal longitude of ASC
  lagnaRasi: number;
  laganaDegree: number;
  laganaMinutes: number;
  ayanamsaValue: number;
  ayanamsaType: AyanamsaType;
}

export interface HoroscopeInput {
  dateStr: string;         // 'YYYY-MM-DD'
  timeStr: string;         // 'HH:MM'
  latitude: number;
  longitude: number;
  timezoneOffset: number;  // hours from UTC (+5.5 for IST)
  ayanamsa: AyanamsaType;
  placeName: string;
}

export interface HoroscopeData {
  d1: ChartData;
  d9: ChartData;
  input: HoroscopeInput;
}

export interface CityResult {
  displayName: string;
  lat: number;
  lon: number;
  countryCode?: string;
}
