import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setErr('');
    setOk('');
    setLoading(true);

    try {
      await register(email, password, name);

      setOk('Registration successful ✅');

      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (e2) {
      setErr(e2?.response?.data?.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Register</h2>

      <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {ok && <div style={{ color: 'green' }}>{ok}</div>}
        {err && <div style={{ color: 'crimson' }}>{err}</div>}
      </form>

      <div style={{ marginTop: 12 }}>
        Already have account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
