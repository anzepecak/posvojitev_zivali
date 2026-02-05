import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { http } from '../api/http';
import { useAuth } from '../auth/AuthContext';
import { uploadAnimalImage } from '../api/files';
import { fileUrl } from '../utils/fileUrl';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [err, setErr] = useState('');
  const [uploadErr, setUploadErr] = useState('');
  const [uploadOk, setUploadOk] = useState('');
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      const n = Number(id);
      if (!Number.isFinite(n)) return;
      const { data } = await http.get(`/animals/${n}`);
      setAnimal(data);
    } catch (e) {
      setErr(e?.response?.data?.message ?? 'Failed to load animal');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadErr('');
    setUploadOk('');
    setUploading(true);

    try {
      await uploadAnimalImage(Number(id), file);
      setUploadOk('Uploaded ✅');
      await load();
    } catch (e2) {
      setUploadErr(
        e2?.response?.data?.message ??
          'Upload failed (verjetno drugačen upload endpoint na backendu)',
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const isAdmin = user?.role === 'ADMIN';
  const canUpload = isLoggedIn && isAdmin;

  const images = animal?.images ?? [];
  const heroImg = useMemo(() => {
    if (!images || images.length === 0) return '';
    return fileUrl(images[0]);
  }, [images]);

  if (err) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        <div className="text-sm font-semibold">Error</div>
        <div className="mt-1">{err}</div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          ← Back
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {isLoggedIn && (
            <Link
              to={`/apply/${animal.id}`}
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Apply for adoption
            </Link>
          )}

          {isLoggedIn && isAdmin && (
            <Link
              to={`/admin/animals/${animal.id}/applications`}
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Admin: applications
            </Link>
          )}
        </div>
      </div>

      {/* Hero + Info */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Hero image */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-72 w-full bg-slate-100 sm:h-96">
              {heroImg ? (
                <img
                  src={heroImg}
                  alt={animal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                  No images yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold tracking-tight">
                  {animal.name}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {animal.species} • {animal.age} years
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                ID {animal.id}
              </span>
            </div>

            {animal.description ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {animal.description}
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                No description provided.
              </p>
            )}

            <div className="mt-6 grid gap-2">
              {isLoggedIn ? (
                <Link
                  to={`/apply/${animal.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Apply for adoption
                </Link>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  Log in to apply for adoption.
                </div>
              )}
            </div>
          </div>

          {/* Admin upload */}
          {canUpload && (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold text-slate-900">
                Upload new image (Admin)
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Add images to improve adoption chances.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onUpload}
                  disabled={uploading}
                  className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 disabled:opacity-60"
                />

                {uploadOk && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {uploadOk}
                  </div>
                )}
                {uploadErr && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {uploadErr}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">Images</h2>
          <div className="text-sm text-slate-500">{images.length} total</div>
        </div>

        {images.length === 0 ? (
          <div className="mt-3 text-sm text-slate-600">No images yet.</div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => {
              const url = fileUrl(img);
              return (
                <a
                  key={img.id}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={url}
                    alt={img.filename ?? 'animal'}
                    className="h-44 w-full object-cover transition duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
