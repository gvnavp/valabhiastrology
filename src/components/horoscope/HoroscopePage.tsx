import React, { useState, useCallback } from 'react';
import './horoscope.css';
import type { HoroscopeData, ChartStyle, HoroscopeInput, PlanetData } from '../../lib/astro/types';
import { RASI_ABBR, PLANET_ABBR } from '../../lib/astro/types';
import { calculateHoroscope } from '../../lib/astro/calculator';
import { generateSelfDiscovery } from '../../lib/astro/selfDiscovery';
import HoroscopeForm from './HoroscopeForm';
import LoadingOverlay from './LoadingOverlay';
import NorthIndianChart from './NorthIndianChart';
import SouthIndianChart from './SouthIndianChart';

// ── Nakshatra data ────────────────────────────────────────────────────────────
const NAKSHATRA_NAMES = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha',
  'Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati',
];

// Ketu,Venus,Sun,Moon,Mars,Rahu,Jupiter,Saturn,Mercury cycling 3×
const NAKSHATRA_LORDS = [
  'Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me',
  'Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me',
  'Ke','Ve','Su','Mo','Ma','Ra','Ju','Sa','Me',
];

const TITHI_NAMES = [
  'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima/Amavasya',
];

const YOGA_NAMES = [
  'Vishkambha','Preeti','Ayushman','Saubhagya','Shobhana',
  'Atiganda','Sukarma','Dhriti','Shoola','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra',
  'Siddhi','Vyatipata','Variyan','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma',
  'Mahendra','Vaidhriti',
];

const KARANA_NAMES = [
  'Kimstughna','Bava','Balava','Kaulava','Taitila',
  'Gara','Vanija','Vishti','Bava','Balava','Kaulava',
  'Taitila','Gara','Vanija','Vishti','Bava','Balava',
  'Kaulava','Taitila','Gara','Vanija','Vishti','Bava',
  'Balava','Kaulava','Taitila','Gara','Vanija','Vishti',
  'Shakuni','Chatushpada','Naga','Kimstughna',
];

const VARA_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getNakshatra(lon: number) {
  const idx  = Math.floor(lon / (360 / 27));
  const pada = Math.floor((lon % (360 / 27)) / (360 / 108)) + 1;
  return { name: NAKSHATRA_NAMES[idx] ?? '', lord: NAKSHATRA_LORDS[idx] ?? '', pada };
}

function normalize360(x: number) { return ((x % 360) + 360) % 360; }

// ── Tab types ─────────────────────────────────────────────────────────────────
type TabId = 'panchangam' | 'planetary' | 'self' | 'pillars' | 'timeline' | 'remedies';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'panchangam',  label: 'Panchangam' },
  { id: 'planetary',   label: 'Planetary Details' },
  { id: 'self',        label: 'Self Discovery' },
  { id: 'pillars',     label: 'Life Pillars' },
  { id: 'timeline',    label: 'Your Time Line' },
  { id: 'remedies',    label: 'Remedies' },
];

type Step = 'form' | 'loading' | 'result';

// ── Self Discovery tab ────────────────────────────────────────────────────────
function bold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function SelfDiscoveryTab({ data, lang }: { data: HoroscopeData; lang: 'en' | 'te' }) {
  const sections = generateSelfDiscovery(data.d1, lang);
  return (
    <div className="tab-data-section">
      {sections.map((sec, i) => (
        <div key={i} className="sd-section">
          <h3 className="sd-heading">{sec.heading}</h3>
          {sec.paragraphs.map((para, j) => (
            <p key={j} className="sd-para" dangerouslySetInnerHTML={{ __html: bold(para) }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Panchangam tab ────────────────────────────────────────────────────────────
function PanchangamTab({ data }: { data: HoroscopeData }) {
  const { d1, input } = data;
  const sun  = d1.planets.find((p) => p.name === 'Sun')!;
  const moon = d1.planets.find((p) => p.name === 'Moon')!;

  const moonSunDiff = normalize360(moon.longitude - sun.longitude);
  const tithiIndex  = Math.floor(moonSunDiff / 12);           // 0-29
  const tithiName   = TITHI_NAMES[tithiIndex % 15] ?? '';
  const paksha      = tithiIndex < 15 ? 'Shukla (Waxing)' : 'Krishna (Waning)';

  const nak      = getNakshatra(moon.longitude);
  const yogaIdx  = Math.floor(normalize360(sun.longitude + moon.longitude) / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIdx % 27] ?? '';

  const karanaIdx  = Math.floor(moonSunDiff / 6);
  const karanaName = KARANA_NAMES[karanaIdx % 60] ?? '';

  const dateObj = new Date(input.dateStr + 'T12:00:00');
  const vara    = VARA_NAMES[dateObj.getDay()];

  const rows = [
    { label: 'Vara (Day)',     value: vara },
    { label: 'Tithi',         value: `${tithiName} — ${paksha} (${tithiIndex + 1})` },
    { label: 'Nakshatra',     value: `${nak.name} (lord: ${nak.lord}, pada ${nak.pada})` },
    { label: 'Yoga',          value: `${yogaName} (${yogaIdx + 1})` },
    { label: 'Karana',        value: `${karanaName} (${karanaIdx + 1})` },
    { label: 'Moon longitude', value: `${RASI_ABBR[moon.rasi]} ${moon.degreeInRasi}°${String(moon.minutes).padStart(2, '0')}'` },
    { label: 'Sun longitude',  value: `${RASI_ABBR[sun.rasi]} ${sun.degreeInRasi}°${String(sun.minutes).padStart(2, '0')}'` },
  ];

  return (
    <div className="tab-data-section">
      <h3 className="tab-section-heading">Panchangam</h3>
      <p className="tab-section-sub">Five limbs of Vedic timekeeping for {input.dateStr}</p>
      <table className="panchang-table">
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label}>
              <td className="panchang-label">{label}</td>
              <td className="panchang-value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Planetary Details tab ─────────────────────────────────────────────────────
function PlanetaryDetailsTab({ data }: { data: HoroscopeData }) {
  const { d1 } = data;

  function houseOfPlanet(p: PlanetData): number {
    return ((p.rasi - d1.lagnaRasi + 12) % 12) + 1;
  }

  return (
    <div className="tab-data-section">
      <h3 className="tab-section-heading">Planetary Details</h3>
      <div className="planet-table-wrap">
        <table className="planet-table">
          <thead>
            <tr>
              <th>Planet</th>
              <th>Sign</th>
              <th>Degree</th>
              <th>House</th>
              <th>Nakshatra</th>
              <th>Pada</th>
              <th>Nak Lord</th>
              <th>R</th>
            </tr>
          </thead>
          <tbody>
            {d1.planets.map((p) => {
              const nak   = getNakshatra(p.longitude);
              const house = houseOfPlanet(p);
              return (
                <tr key={p.name}>
                  <td className="pl-name">
                    {PLANET_ABBR[p.name]}{' '}
                    <span className="pl-fullname">{p.name}</span>
                  </td>
                  <td>{RASI_ABBR[p.rasi]}</td>
                  <td>{p.degreeInRasi}°{String(p.minutes).padStart(2, '0')}'</td>
                  <td>{house}</td>
                  <td>{nak.name}</td>
                  <td>{nak.pada}</td>
                  <td>{nak.lord}</td>
                  <td>{p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu' ? '(R)' : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HoroscopePage(): JSX.Element {
  const [step, setStep]             = useState<Step>('form');
  const [horoscopeData, setData]    = useState<HoroscopeData | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('South Indian');
  const [activeTab, setActiveTab]   = useState<TabId>('panchangam');
  const [calcError, setCalcError]   = useState('');
  const [lang, setLang]             = useState<'en' | 'te'>('en');

  function handleFormSubmit(input: HoroscopeInput, style: ChartStyle) {
    setChartStyle(style);
    setCalcError('');
    try {
      const d = calculateHoroscope(input);
      setData(d);
      setStep('loading');
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : 'Calculation error. Please check your input.');
    }
  }

  const handleLoadingComplete = useCallback(() => setStep('result'), []);

  function resetForm() {
    setStep('form');
    setData(null);
    setCalcError('');
    setActiveTab('panchangam');
  }

  const ChartComponent = chartStyle === 'South Indian' ? SouthIndianChart : NorthIndianChart;

  return (
    <div className={`horoscope-page${step === 'result' ? ' horoscope-page--result' : ''}`}>

      {/* Language toggle — visible in both form and result steps */}
      {step !== 'loading' && (
        <div className="lang-toggle-bar">
          <button
            className={`lang-toggle-btn${lang === 'en' ? ' active' : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            className={`lang-toggle-btn${lang === 'te' ? ' active' : ''}`}
            onClick={() => setLang('te')}
          >తె</button>
        </div>
      )}

      {step === 'loading' && <LoadingOverlay onComplete={handleLoadingComplete} />}

      {step === 'form' && (
        <>
          <h1>{lang === 'te' ? 'మీ జాతకం' : 'Your Horoscope'}</h1>
          <p className="page-subtitle">
            {lang === 'te'
              ? 'వేద జ్యోతిష ద్వారా మీ ప్రత్యేక గ్రహ వివరాలు తెలుసుకోండి'
              : 'Discover your unique celestial blueprint through Vedic Jyotish'}
          </p>
          <HoroscopeForm onSubmit={handleFormSubmit} lang={lang} />
          {calcError && (
            <p style={{ textAlign: 'center', color: '#ff9aa0', fontSize: '0.9rem', marginTop: '1rem' }}>
              {calcError}
            </p>
          )}
        </>
      )}

      {step === 'result' && horoscopeData && (
        <div className="horoscope-result">
          <div className="result-header">
            <span className="result-name">Celestial Blueprint</span>
            <span className="result-meta">
              {horoscopeData.input.dateStr} · {horoscopeData.input.timeStr} ·{' '}
              {horoscopeData.input.placeName.split(',').slice(0, 2).join(',')} ·{' '}
              {horoscopeData.input.ayanamsa}
            </span>
            <button className="btn-reset-inline" onClick={resetForm} title="New chart">↩ New</button>
          </div>

          <div className="charts-grid">
            <ChartComponent chart={horoscopeData.d1} label="D1 — Rasi Chart" />
            <ChartComponent chart={horoscopeData.d9} label="D9 — Navamsa Chart" compact />
          </div>

          <div className="tabs-section">
            <nav className="tabs-nav">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="tab-content">
              {(activeTab === 'pillars' || activeTab === 'timeline' || activeTab === 'remedies') && (
                <p style={{ margin: 0, opacity: 0.75, fontStyle: 'italic' }}>
                  Analysis coming soon — stay tuned.
                </p>
              )}
              {activeTab === 'self'       && <SelfDiscoveryTab data={horoscopeData} lang={lang} />}
              {activeTab === 'panchangam' && <PanchangamTab data={horoscopeData} />}
              {activeTab === 'planetary'  && <PlanetaryDetailsTab data={horoscopeData} />}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
