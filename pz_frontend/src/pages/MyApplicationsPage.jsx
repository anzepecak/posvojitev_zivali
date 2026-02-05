import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myApplications } from '../api/applications';

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await myApplications();
        setApps(data);
      } catch (e) {
        setErr(e?.response?.data?.message ?? 'Failed to load applications');
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
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            My applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track the status of your adoption requests.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Browse animals
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          Loading…
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-base font-semibold text-slate-900">
            No applications yet
          </div>
          <div className="mt-1 text-sm text-slate-600">
            When you apply for an animal, your applications will appear here.
          </div>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            View animals
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-200">
            {apps.map((a) => {
              // Poskusi ujeti različne oblike iz backenda
              const animalId = a.animalId ?? a.animal?.id;
              const animalName =
                a.animal?.name ??
                a.animalName ??
                (animalId ? `Animal #${animalId}` : 'Animal');

              const status = (a.status ?? 'PENDING').toString().toUpperCase();

              const badge =
                status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : status === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800';

              return (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {animalName}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        Application #{a.id}
                      </span>

                      {animalId ? (
                        <Link
                          to={`/animals/${animalId}`}
                          className="rounded-full bg-slate-100 px-2 py-1 hover:bg-slate-200"
                        >
                          View animal
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${badge}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
