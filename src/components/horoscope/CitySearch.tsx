import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { CityResult } from '../../lib/astro/types';

interface CitySearchProps {
  value: string;
  onChange: (city: CityResult) => void;
}

export default function CitySearch({ value, onChange }: CitySearchProps): JSX.Element {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CityResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en' },
      });
      const data = await res.json();
      const cities: CityResult[] = (data as Array<{
        display_name: string;
        lat: string;
        lon: string;
        address?: { country_code?: string };
      }>).map((item) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        countryCode: item.address?.country_code ?? '',
      }));
      setResults(cities);
      setOpen(cities.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(q), 300);
  }

  function selectCity(city: CityResult) {
    setQuery(city.displayName);
    setOpen(false);
    setResults([]);
    onChange(city);
  }

  return (
    <div className="city-search" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Type a city or place name..."
        autoComplete="off"
      />
      {open && (
        <div className="city-dropdown">
          {searching && <div className="city-searching">Searching...</div>}
          {results.map((city, i) => (
            <div
              key={i}
              className="city-item"
              onMouseDown={() => selectCity(city)}
            >
              {city.displayName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
