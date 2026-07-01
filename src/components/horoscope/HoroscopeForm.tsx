import React, { useState } from 'react';
import type { AyanamsaType, ChartStyle, CityResult, HoroscopeInput } from '../../lib/astro/types';
import CitySearch from './CitySearch';

interface HoroscopeFormProps {
  onSubmit: (input: HoroscopeInput, chartStyle: ChartStyle) => void;
}

const AYANAMSA_OPTIONS: AyanamsaType[] = ['Lahiri', 'BV Raman', 'KP', 'KP New'];

export default function HoroscopeForm({ onSubmit }: HoroscopeFormProps): JSX.Element {
  // Default date to today
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultOffset = -(new Date().getTimezoneOffset() / 60);

  const [dateStr, setDateStr] = useState(todayStr);
  const [timeStr, setTimeStr] = useState('12:00');
  const [city, setCity] = useState<CityResult | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('South Indian');
  const [ayanamsa, setAyanamsa] = useState<AyanamsaType>('Lahiri');
  const [tzOffset, setTzOffset] = useState<number>(defaultOffset);
  const [error, setError] = useState('');

  function handleCitySelect(c: CityResult) {
    setCity(c);
    if (c.countryCode === 'in') setTzOffset(5.5);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!city) {
      setError('Please select a place of birth from the dropdown.');
      return;
    }
    if (!dateStr) {
      setError('Please enter a date of birth.');
      return;
    }
    if (!timeStr) {
      setError('Please enter a time of birth.');
      return;
    }

    const input: HoroscopeInput = {
      dateStr,
      timeStr,
      latitude: city.lat,
      longitude: city.lon,
      timezoneOffset: tzOffset,
      ayanamsa,
      placeName: city.displayName,
    };

    onSubmit(input, chartStyle);
  }

  return (
    <form className="horoscope-form" onSubmit={handleSubmit}>
      {/* Row 1: Date + Time */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            id="dob"
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tob">Time of Birth</label>
          <input
            id="tob"
            type="time"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 2: Place of Birth */}
      <div className="form-row single">
        <div className="form-group">
          <label>Place of Birth</label>
          <CitySearch value="" onChange={handleCitySelect} />
        </div>
      </div>

      {/* Row 3: UTC Offset */}
      <div className="form-row single">
        <div className="form-group">
          <label htmlFor="tz">UTC Offset (e.g. +5.5 for IST, -5 for EST)</label>
          <input
            id="tz"
            type="number"
            step="0.5"
            min="-12"
            max="14"
            value={tzOffset}
            onChange={(e) => setTzOffset(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* Row 4: Chart Style */}
      <div className="form-row single">
        <div className="form-group">
          <label>Chart Style</label>
          <div className="toggle-group">
            {(['South Indian', 'North Indian'] as ChartStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                className={`toggle-btn${chartStyle === style ? ' active' : ''}`}
                onClick={() => setChartStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Ayanamsa */}
      <div className="form-row single">
        <div className="form-group">
          <label>Ayanamsa</label>
          <div className="radio-group">
            {AYANAMSA_OPTIONS.map((opt) => (
              <label key={opt} className="radio-label">
                <input
                  type="radio"
                  name="ayanamsa"
                  value={opt}
                  checked={ayanamsa === opt}
                  onChange={() => setAyanamsa(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p style={{ color: '#ff9aa0', fontSize: '0.88rem', margin: '0.5rem 0 0' }}>{error}</p>
      )}

      <button type="submit" className="btn-generate">
        Generate My Horoscope
      </button>
    </form>
  );
}
