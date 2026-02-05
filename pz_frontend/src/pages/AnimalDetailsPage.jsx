import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimal } from '../api/animals';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setAnimal(await getAnimal(Number(id)));
      } catch (e) {
        setErr(e?.response?.data?.message ?? 'Failed to load animal');
      }
    })();
  }, [id]);

  if (err)
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
  if (!animal)
    return (
      <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
        Loading...
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 12 }}>
      <h2>{animal.name}</h2>
      <div style={{ opacity: 0.8 }}>
        {animal.species} • {animal.age} years
      </div>
      {animal.description && <p>{animal.description}</p>}
      <Link to="/">← Back</Link>
    </div>
  );
}
