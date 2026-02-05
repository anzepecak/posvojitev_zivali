import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAnimal } from '../api/animals';
import { useAuth } from '../auth/AuthContext';

export default function CreateAnimalPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const canUse = isLoggedIn && isAdmin;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');

  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  const ageNumber = useMemo(() => {
    const n = Number(age);
    return Number.isFinite(n) ? n : NaN;
  }, [age]);

  function validate() {
    if (!name.trim()) return 'Name is required';
    if (!species.trim()) return 'Species is required';
    if (!Number.isFinite(ageNumber) || ageNumber < 0)
      return 'Age must be a valid number (0 or more)';
    if (description.trim().length > 1000)
      return 'Description is too long (max 1000)';
    return '';
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk('');

    if (!canUse) {
      setErr('Only admin can create animals.');
      return;
    }

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    try {
      const created = await createAnimal({
        name: name.trim(),
        species: species.trim(),
        age: ageNumber,
        description: description.trim(),
      });

      setOk('Animal created ✅');

      // če backend vrne id, te peljemo na details
      const createdId = created?.id;
      setTimeout(() => {
        if (createdId) navigate(`/animals/${createdId}`);
        else navigate('/');
      }, 700);
    } catch (e2) {
      setErr(e2?.response?.data?.message ?? 'Failed to create animal');
    } finally {
      setLoading(false);
    }
  }

  if (!canUse) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
        <div className="text-base font-semibold">Admin only</div>
        <div className="mt-1 text-sm text-slate-600">
          You don’t have permission to access this page.
        </div>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Back to animals
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Add animal</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a new animal entry for adoption.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          ← Back
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Rex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Species
              </label>
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option>Dog</option>
                <option>Cat</option>
                <option>Rabbit</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Age (years)
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 4"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-2 text-xs text-slate-500">
              {description.length}/1000
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create animal'}
          </button>

          {ok && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {ok}
            </div>
          )}

          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}
        </form>
      </div>

      <div className="text-xs text-slate-500">
        Tip: after creating the animal, you can upload images on the animal
        detail page (Admin).
      </div>
    </div>
  );
}
