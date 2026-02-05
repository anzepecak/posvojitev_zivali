import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  applicationsForAnimal,
  updateApplicationStatus,
} from '../api/applications';

export default function AdminAnimalApplicationsPage() {
  const { animalId } = useParams();
  const [apps, setApps] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await applicationsForAnimal(Number(animalId));
      setApps(data);
    } catch (e) {
      setErr(
        e?.response?.data?.message ?? 'Failed to load applications for animal',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalId]);

  async function setStatus(appId, status) {
    setErr('');
    setBusyId(appId);

    try {
      await updateApplicationStatus(appId, status);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message ?? 'Failed to update status');
    } finally {
      setBusyId(null);
    }
  }

  function statusBadge(statusRaw) {
    const status = (statusRaw ?? 'VLOGA_ODDANA').toString().toUpperCase();

    if (status === 'POSVOJENO') return 'bg-green-100 text-green-800';
    if (status === 'ZAVRNJENO') return 'bg-red-100 text-red-800';
    if (status === 'INTERVJU_OPRAVLJEN') return 'bg-blue-100 text-blue-800';
    return 'bg-amber-100 text-amber-800'; // VLOGA_ODDANA ali karkoli drugega
  }

  function statusLabel(statusRaw) {
    const status = (statusRaw ?? 'VLOGA_ODDANA').toString().toUpperCase();

    switch (status) {
      case 'VLOGA_ODDANA':
        return 'Submitted';
      case 'INTERVJU_OPRAVLJEN':
        return 'Interview done';
      case 'POSVOJENO':
        return 'Adopted';
      case 'ZAVRNJENO':
        return 'Rejected';
      default:
        return status;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin – Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Applications for animal{' '}
            <span className="font-semibold">#{animalId}</span>
          </p>
        </div>

        <Link
          to={`/animals/${animalId}`}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          ← Back to animal
        </Link>
      </div>

      {/* Error */}
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="text-sm font-semibold">Error</div>
          <div className="mt-1">{err}</div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-full">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-44 animate-pulse rounded bg-slate-100" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                </div>
              </div>
              <div className="mt-4 h-14 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && apps.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
          <div className="text-base font-semibold">No applications</div>
          <div className="mt-1 text-sm text-slate-600">
            No applications for this animal yet.
          </div>
        </div>
      )}

      {/* List */}
      {!loading && apps.length > 0 && (
        <div className="grid gap-4">
          {apps.map((a) => {
            const rawStatus = (a.status ?? 'VLOGA_ODDANA')
              .toString()
              .toUpperCase();

            return (
              <div
                key={a.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-extrabold text-slate-900">
                        Application #{a.id}
                      </div>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(
                          rawStatus,
                        )}`}
                        title={rawStatus}
                      >
                        {statusLabel(rawStatus)}
                      </span>

                      {/* pokaži originalni status (slovenski) v mini tagu */}
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                        {rawStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">
                        User ID: {a.userId}
                      </span>
                      {a.createdAt ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1">
                          Created: {a.createdAt}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Interview done */}
                    <button
                      onClick={() => setStatus(a.id, 'INTERVJU_OPRAVLJEN')}
                      disabled={busyId === a.id}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === a.id ? 'Saving…' : 'Interview done'}
                    </button>

                    {/* Approve -> POSVOJENO */}
                    <button
                      onClick={() => setStatus(a.id, 'POSVOJENO')}
                      disabled={busyId === a.id}
                      className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === a.id ? 'Saving…' : 'Approve'}
                    </button>

                    {/* Reject -> ZAVRNJENO */}
                    <button
                      onClick={() => setStatus(a.id, 'ZAVRNJENO')}
                      disabled={busyId === a.id}
                      className="rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === a.id ? 'Saving…' : 'Reject'}
                    </button>
                  </div>
                </div>

                {a.message ? (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-700">
                      Message
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                      {a.message}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
