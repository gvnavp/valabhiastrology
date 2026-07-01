/**
 * Convert a Gregorian calendar date/time to Julian Day Number
 * Using Jean Meeus "Astronomical Algorithms" formula
 */
export function dateToJD(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  tzOffset: number, // hours from UTC
): number {
  // Convert local time to UT
  const utHour = hour - tzOffset;

  // Fractional day
  const dayFrac = day + utHour / 24 + minute / 1440;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const JD =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFrac +
    B -
    1524.5;

  return JD;
}
