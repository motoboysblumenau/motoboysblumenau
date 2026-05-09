import { MapPin, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { searchAddresses } from '../services/mapService';
import FormField, { inputClass } from './FormField';

export default function AddressAutocomplete({ label, value, onChange, onSelect, error, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const showSuggestions = useMemo(
    () => focused && (suggestions.length > 0 || value.length >= 3),
    [focused, suggestions.length, value.length],
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (value.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const result = await searchAddresses(value);
      if (active) {
        setSuggestions(result);
        setLoading(false);
      }
    }, 320);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <FormField label={label} error={error} hint="Digite como Rua D... para ver sugestões de Blumenau e região.">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3.5 text-zinc-400" size={18} />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder={placeholder}
          className={`${inputClass} pl-10`}
        />
        {showSuggestions ? (
          <div className="absolute z-[1200] mt-2 max-h-64 w-full overflow-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-panel">
            {loading ? <p className="px-3 py-2 text-sm text-zinc-500">Buscando endereços...</p> : null}
            {!loading && suggestions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-zinc-500">Continue digitando o endereço.</p>
            ) : null}
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={`${suggestion.label}-${suggestion.lat}`}
                onMouseDown={() => {
                  onChange(suggestion.label);
                  onSelect(suggestion);
                  setFocused(false);
                }}
                className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100"
              >
                <MapPin size={17} className="mt-0.5 shrink-0 text-express" />
                <span>{suggestion.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </FormField>
  );
}
