import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { http } from '../api/http';
import { fileUrl } from '../utils/fileUrl';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get('/animals');
        setAnimals(data);
      } catch (e) {
        setErr(e?.response?.data?.message ?? 'Failed to load animals');
      }
    })();
  }, []);

  if (err) {
    return <div style={{ color: 'crimson', padding: 20 }}>{err}</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
      <h2>Animals</h2>

      <div style={{ display: 'grid', gap: 12 }}>
        {animals.map((a) => {
          const thumb = a.images?.[0] ? fileUrl(a.images[0]) : '';

          return (
            <div
              key={a.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 12,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 80,
                  borderRadius: 12,
                  overflow: 'hidden',
                  background: '#f3f3f3',
                  flex: '0 0 auto',
                }}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={a.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : null}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>{a.name}</div>
                <div style={{ opacity: 0.8 }}>
                  {a.species} • {a.age} years
                </div>
                <Link to={`/animals/${a.id}`}>Details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
