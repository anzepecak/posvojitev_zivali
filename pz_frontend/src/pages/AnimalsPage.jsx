import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnimals } from '../api/animals';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setAnimals(await getAnimals());
      } catch (e) {
        setErr(e?.response?.data?.message ?? 'Failed to load animals');
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
      <h2>Animals</h2>
      {err && <div style={{ color: 'crimson' }}>{err}</div>}

      <div style={{ display: 'grid', gap: 12 }}>
        {animals.map((a) => (
          <div
            key={a.id}
            style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12 }}
          >
            <div style={{ fontWeight: 800, fontSize: 18 }}>{a.name}</div>
            <div style={{ opacity: 0.8 }}>
              {a.species} • {a.age} years
            </div>
            <div style={{ marginTop: 10 }}>
              <Link to={`/animals/${a.id}`}>Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
