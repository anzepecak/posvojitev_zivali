import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createApplication } from '../api/applications';

export default function ApplyPage() {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');
    setLoading(true);

    try {
      await createApplication(Number(animalId), message);
      setOk('Application submitted ✅');

      setTimeout(() => {
        navigate('/my-applications');
      }, 800);
    } catch (e2) {
      setErr(e2?.response?.data?.message ?? 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Apply for adoption
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tell us why you want to adopt this animal.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          {/* Textarea */}
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Your message
            </label>

            <textarea
              rows={6}
              placeholder="Write why you want to adopt this animal..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit application'}
          </button>

          {/* Success */}
          {ok && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {ok}
            </div>
          )}

          {/* Error */}
          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
