import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import { FACULTY_STYLES } from '@/lib/normalizeProgrammes';
import { UIProgramme } from '@/lib/types';

interface SearchEngineProps {
  programmes: UIProgramme[];
  onSelect: (programme: UIProgramme) => void;
}

export function SearchEngine({ programmes, onSelect }: SearchEngineProps) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(programmes, {
        keys: ['name', 'facultyLabel'],
        threshold: 0.35,
        includeScore: true,
      }),
    [programmes],
  );

  const results = useMemo(() => {
    if (!query.trim()) {
      return programmes;
    }

    return fuse.search(query).map((result) => result.item);
  }, [fuse, programmes, query]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-5 shadow-soft sm:p-8">
        <label htmlFor="programme-search" className="mb-2 block text-sm font-semibold text-bu-navy">
          Search your degree programme
        </label>

        <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:border-bu-navy focus-within:ring-2 focus-within:ring-bu-navy/20">
          <span aria-hidden="true" className="mr-2 text-bu-navy">
            🔎
          </span>
          <input
            id="programme-search"
            className="w-full bg-transparent text-base outline-none placeholder:text-slate-500"
            placeholder="Search your degree programme..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((programme) => {
          const style = FACULTY_STYLES[programme.faculty];

          return (
            <button
              key={programme.id}
              type="button"
              className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bu-navy"
              onClick={() => onSelect(programme)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-sora text-base font-semibold text-bu-navy">{programme.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{programme.facultyLabel}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${style.colorClass}`}>
                  {style.label}
                </span>
              </div>

              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-slate-500">
                Duration: {programme.durationYears} Year{programme.durationYears > 1 ? 's' : ''}
              </p>
            </button>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
          No matching programme found.
        </div>
      )}
    </section>
  );
}
