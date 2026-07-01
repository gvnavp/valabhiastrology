import React from 'react';
import type { ChartData } from '../../lib/astro/types';
import { PLANET_ABBR } from '../../lib/astro/types';

/**
 * North Indian chart — house-fixed 4×4 grid with hollow centre 2×2.
 *
 *   (0,0)=H12  (0,1)=H1   (0,2)=H2   (0,3)=H3
 *   (1,0)=H11  [hollow]   [hollow]   (1,3)=H4
 *   (2,0)=H10  [hollow]   [hollow]   (2,3)=H5
 *   (3,0)=H9   (3,1)=H8   (3,2)=H7   (3,3)=H6
 */

const SIZE = 420;
const CELL = SIZE / 4;
const PAD  = 6;

const GRID_HOUSE: Array<[number, number, number]> = [
  [0, 0, 12], [0, 1, 1],  [0, 2, 2],  [0, 3, 3],
  [1, 0, 11],                           [1, 3, 4],
  [2, 0, 10],                           [2, 3, 5],
  [3, 0, 9],  [3, 1, 8],  [3, 2, 7],  [3, 3, 6],
];

interface Props { chart: ChartData; label: string; compact?: boolean }

export default function NorthIndianChart({ chart, label, compact = false }: Props): JSX.Element {
  const { planets, cusps, lagnaRasi } = chart;

  const byHouse: Record<number, typeof planets> = {};
  for (const p of planets) {
    const h = ((p.rasi - lagnaRasi + 12) % 12) + 1;
    if (!byHouse[h]) byHouse[h] = [];
    byHouse[h].push(p);
  }

  function cuspStr(house: number): string {
    const c = cusps.find((x) => x.house === house);
    if (!c) return '';
    return `${c.degreeInRasi}°${String(c.minutes).padStart(2, '0')}'`;
  }

  function renderCell(row: number, col: number, house: number) {
    const x = col * CELL;
    const y = row * CELL;
    const isLagna   = house === 1;
    const hPlanets  = byHouse[house] || [];
    const bhavaLabel = compact ? `${house}` : `${house}(${cuspStr(house)})`;

    return (
      <g key={`${row}-${col}`}>
        {/* Cell background */}
        <rect
          x={x + 0.5} y={y + 0.5}
          width={CELL - 1} height={CELL - 1}
          fill={isLagna ? 'rgba(180,120,0,0.35)' : 'rgba(45,0,15,0.9)'}
          stroke={isLagna ? '#f0cc55' : 'rgba(212,175,55,0.55)'}
          strokeWidth={isLagna ? 2 : 1}
        />

        {/* Bhava + cusp — top-left */}
        <text
          x={x + PAD} y={y + PAD + 11}
          fontSize={10} fill={isLagna ? '#fff700' : '#f0cc55'}
          fontFamily="Cinzel, serif" fontWeight="bold"
        >
          {bhavaLabel}
        </text>

        {/* Planets */}
        {hPlanets.map((p, i) => {
          const abbr = PLANET_ABBR[p.name];
          const deg  = `${p.degreeInRasi}°${String(p.minutes).padStart(2, '0')}'`;
          const top  = y + 28 + i * 14;
          return (
            <text key={i}
              x={x + CELL / 2} y={top}
              fontSize={10.5} fill={i === 0 ? '#ffffff' : '#ffe8a0'}
              textAnchor="middle" fontFamily="Georgia, serif" fontWeight="600"
            >
              {abbr}
              {p.isRetrograde && <tspan fontSize="8" fontWeight="300" fill="#ffdd88"> R</tspan>}
              {!compact && <tspan>{' '}{deg}</tspan>}
            </text>
          );
        })}
      </g>
    );
  }

  return (
    <div className="chart-wrap">
      <div className="chart-title">{label}</div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="chart-svg">

        {/* Solid dark base */}
        <rect x={0} y={0} width={SIZE} height={SIZE} fill="#100008" rx={4} />

        {/* Hollow centre */}
        <rect x={CELL} y={CELL} width={CELL * 2} height={CELL * 2}
          fill="#0a0005" stroke="rgba(212,175,55,0.35)" strokeWidth={1} />
        <text x={SIZE / 2} y={SIZE / 2 - 12} textAnchor="middle" fontSize={16}
          fill="rgba(212,175,55,0.7)" fontFamily="Cinzel Decorative, Cinzel, serif" letterSpacing="1">Valabhi</text>
        <text x={SIZE / 2} y={SIZE / 2 + 10} textAnchor="middle" fontSize={12}
          fill="rgba(212,175,55,0.55)" fontFamily="Cinzel, serif" letterSpacing="2">Astrology</text>

        {GRID_HOUSE.map(([row, col, house]) => renderCell(row, col, house))}
      </svg>
    </div>
  );
}
