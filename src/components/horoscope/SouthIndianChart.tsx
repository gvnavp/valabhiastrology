import React from 'react';
import type { ChartData } from '../../lib/astro/types';
import { PLANET_ABBR } from '../../lib/astro/types';

/**
 * South Indian chart — sign-fixed 4×4 grid.
 *
 *   (0,0)=Pis(11)  (0,1)=Ari(0)   (0,2)=Tau(1)  (0,3)=Gem(2)
 *   (1,0)=Aqu(10)  [centre]        [centre]       (1,3)=Can(3)
 *   (2,0)=Cap(9)   [centre]        [centre]       (2,3)=Leo(4)
 *   (3,0)=Sag(8)   (3,1)=Sco(7)   (3,2)=Lib(6)  (3,3)=Vir(5)
 */

const SIZE = 420;
const CELL = SIZE / 4;
const PAD  = 6;

const GRID_RASI: Array<[number, number, number]> = [
  [0, 0, 11], [0, 1, 0], [0, 2, 1], [0, 3, 2],
  [1, 0, 10],                                   [1, 3, 3],
  [2, 0,  9],                                   [2, 3, 4],
  [3, 0,  8], [3, 1, 7], [3, 2, 6], [3, 3, 5],
];

function houseOfRasi(rasi: number, lagnaRasi: number): number {
  return ((rasi - lagnaRasi + 12) % 12) + 1;
}

interface Props { chart: ChartData; label: string; compact?: boolean }

export default function SouthIndianChart({ chart, label, compact = false }: Props): JSX.Element {
  const { planets, cusps, lagnaRasi } = chart;

  const byRasi: Record<number, typeof planets> = {};
  for (const p of planets) {
    if (!byRasi[p.rasi]) byRasi[p.rasi] = [];
    byRasi[p.rasi].push(p);
  }

  function cuspStrForRasi(rasi: number): string {
    const house = houseOfRasi(rasi, lagnaRasi);
    const c = cusps.find((x) => x.house === house);
    if (!c) return '';
    return `${c.degreeInRasi}°${String(c.minutes).padStart(2, '0')}'`;
  }

  function renderCell(row: number, col: number, rasi: number) {
    const x = col * CELL;
    const y = row * CELL;
    const isLagna   = rasi === lagnaRasi;
    const house     = houseOfRasi(rasi, lagnaRasi);
    const rasiPlanets = byRasi[rasi] || [];
    const bhavaLabel = compact ? `${house}` : `${house}(${cuspStrForRasi(rasi)})`;

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
        {rasiPlanets.map((p, i) => {
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

        {GRID_RASI.map(([row, col, rasi]) => renderCell(row, col, rasi))}
      </svg>
    </div>
  );
}
