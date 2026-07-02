import React, { useState } from 'react';
import type { AyanamsaType, ChartStyle, CityResult, HoroscopeInput } from '../../lib/astro/types';
import CitySearch from './CitySearch';

interface HoroscopeFormProps {
  onSubmit: (input: HoroscopeInput, chartStyle: ChartStyle) => void;
  lang?: 'en' | 'te';
}

const AYANAMSA_OPTIONS: AyanamsaType[] = ['Lahiri', 'BV Raman', 'KP', 'KP New'];

export default function HoroscopeForm({ onSubmit, lang = 'en' }: HoroscopeFormProps): JSX.Element {
  const te = lang === 'te';
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
      setError(te ? 'దయచేసి డ్రాప్‌డౌన్ నుండి జన్మ స్థలాన్ని ఎంచుకోండి.' : 'Please select a place of birth from the dropdown.');
      return;
    }
    if (!dateStr) {
      setError(te ? 'దయచేసి జన్మ తేదీని నమోదు చేయండి.' : 'Please enter a date of birth.');
      return;
    }
    if (!timeStr) {
      setError(te ? 'దయచేసి జన్మ సమయాన్ని నమోదు చేయండి.' : 'Please enter a time of birth.');
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
          <label htmlFor="dob">{te ? 'జన్మ తేదీ' : 'Date of Birth'}</label>
          <input
            id="dob"
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tob">{te ? 'జన్మ సమయం' : 'Time of Birth'}</label>
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
          <label>{te ? 'జన్మ స్థలం' : 'Place of Birth'}</label>
          <CitySearch value="" onChange={handleCitySelect} placeholder={te ? 'నగరం పేరు టైప్ చేయండి...' : undefined} />
        </div>
      </div>

      {/* Row 3: UTC Offset */}
      <div className="form-row single">
        <div className="form-group">
          <label htmlFor="tz">{te ? 'UTC ఆఫ్సెట్ (ఉదా: IST కు +5.5, EST కు -5)' : 'UTC Offset (e.g. +5.5 for IST, -5 for EST)'}</label>
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
          <label>{te ? 'చార్ట్ శైలి' : 'Chart Style'}</label>
          <div className="toggle-group">
            {(['South Indian', 'North Indian'] as ChartStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                className={`toggle-btn${chartStyle === style ? ' active' : ''}`}
                onClick={() => setChartStyle(style)}
              >
                {te
                  ? (style === 'South Indian' ? 'దక్షిణ శైలి' : 'ఉత్తర శైలి')
                  : style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Ayanamsa */}
      <div className="form-row single">
        <div className="form-group">
          <label>{te ? 'అయనాంశం' : 'Ayanamsa'}</label>
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
        {te ? 'జాతకం తయారు చేయండి' : 'Generate My Horoscope'}
      </button>
    </form>
  );
}
