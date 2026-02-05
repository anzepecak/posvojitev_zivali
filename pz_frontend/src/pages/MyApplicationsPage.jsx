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
      }, 600);
    } catch (e2) {
      setErr(e2?.response?.data?.message ?? 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '30px auto', padding: 12 }}>
      <h2>Apply for adoption</h2>

      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <textarea
          rows={6}
          placeholder="Write why you want to adopt this animal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? 'Submitting...' : 'Submit application'}
        </button>

        {ok && <div style={{ color: 'green' }}>{ok}</div>}
        {err && <div style={{ color: 'crimson' }}>{err}</div>}
      </form>
    </div>
  );
}
