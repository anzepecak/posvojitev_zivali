import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { fileUrl } from '../utils/fileUrl';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get('/animals');
        setAnimals(data);
      } catch (e) {
        setErr(e?.response?.data?.message ?? 'Failed to load animals');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (err) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        <div className="text-sm font-semibold">Error</div>
        <div className="mt-1">{err}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Animals</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse animals available for adoption.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {loading ? 'Loading…' : `${animals.length} result(s)`}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-44 w-full animate-pulse bg-slate-100" />
              <div className="p-4">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <>
          {animals.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
              <div className="text-base font-semibold">No animals found</div>
              <div className="mt-1 text-sm text-slate-600">
                There are no animals available right now.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {animals.map((a) => {
                const thumb = a.images?.[0] ? fileUrl(a.images[0]) : '';

                return (
                  <div
                    key={a.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Image */}
                    <div className="h-44 w-full overflow-hidden bg-slate-100">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={a.name}
                          className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-lg font-extrabold">
                            {a.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-600">
                            {a.species} • {a.age} years
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          ID {a.id}
                        </span>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/animals/${a.id}`}
                          className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
