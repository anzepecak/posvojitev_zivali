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
    try {
      await updateApplicationStatus(appId, status);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message ?? 'Failed to update status');
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
      <h2>Admin – Applications for animal #{animalId}</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to={`/animals/${animalId}`}>← Back to animal</Link>
      </div>

      {err && <div style={{ color: 'crimson', marginBottom: 12 }}>{err}</div>}
      {loading && <div>Loading...</div>}

      <div style={{ display: 'grid', gap: 12 }}>
        {!loading && apps.length === 0 && (
          <div style={{ opacity: 0.7 }}>No applications for this animal.</div>
        )}

        {apps.map((a) => (
          <div
            key={a.id}
            style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 800 }}>Application #{a.id}</div>
                <div style={{ opacity: 0.8 }}>Status: {a.status}</div>
                <div style={{ opacity: 0.8 }}>User ID: {a.userId}</div>
                {a.createdAt && (
                  <div style={{ opacity: 0.7 }}>Created: {a.createdAt}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => setStatus(a.id, 'APPROVED')}>
                  Approve
                </button>
                <button onClick={() => setStatus(a.id, 'REJECTED')}>
                  Reject
                </button>
              </div>
            </div>

            {a.message && (
              <div style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>
                <b>Message:</b> {a.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
