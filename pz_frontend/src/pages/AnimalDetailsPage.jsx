import React, { useEffect, useState } from 'react';
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
      await load(); // reload da dobiš novo sliko v animal.images
    } catch (e2) {
      setUploadErr(
        e2?.response?.data?.message ??
          'Upload failed (verjetno drugačen upload endpoint na backendu)',
      );
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  }

  if (err) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: '30px auto',
          padding: 12,
          color: 'crimson',
        }}
      >
        {err}
      </div>
    );
  }

  if (!animal) {
    return (
      <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
        Loading...
      </div>
    );
  }

  const isAdmin = user?.role === 'ADMIN';
  const canUpload = isLoggedIn && isAdmin; // za začetek samo admin (lahko razširimo)

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
      <h2>{animal.name}</h2>
      <div style={{ opacity: 0.8 }}>
        {animal.species} • {animal.age} years
      </div>

      {animal.description && <p>{animal.description}</p>}

      {/* GALERIJA */}
      <h3>Images</h3>
      {(!animal.images || animal.images.length === 0) && (
        <div style={{ opacity: 0.7 }}>No images yet.</div>
      )}

      {animal.images && animal.images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
        >
          {animal.images.map((img) => (
            <a
              key={img.id}
              href={fileUrl(img)}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={fileUrl(img)}
                alt={img.filename ?? 'animal'}
                style={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 12,
                }}
              />
            </a>
          ))}
        </div>
      )}

      {/* UPLOAD */}
      {canUpload && (
        <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
          <label style={{ fontWeight: 700 }}>Upload new image (Admin)</label>
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            disabled={uploading}
          />
          {uploadOk && <div style={{ color: 'green' }}>{uploadOk}</div>}
          {uploadErr && <div style={{ color: 'crimson' }}>{uploadErr}</div>}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Link to="/">Back</Link>
        {isLoggedIn && (
          <Link to={`/apply/${animal.id}`}>Apply for adoption</Link>
        )}
        {isLoggedIn && isAdmin && (
          <Link to={`/admin/animals/${animal.id}/applications`}>
            Admin: view applications
          </Link>
        )}
      </div>
    </div>
  );
}
