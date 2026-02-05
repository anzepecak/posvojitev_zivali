import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setErr('Login failed');
    }
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden items-center justify-center bg-slate-900 text-white md:flex">
        <div>
          <h1 className="text-4xl font-extrabold">PZ Adoption</h1>
          <p className="mt-3 opacity-80">Find your new best friend 🐾</p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">Login</h2>

          <input
            className="w-full rounded-xl border p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              className="w-full rounded-xl border p-2 pr-10"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* SVG EYE */}
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 text-gray-700"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button className="w-full rounded-xl bg-slate-900 p-3 text-white">
            Sign in
          </button>

          {err && <div className="text-red-500">{err}</div>}

          <p className="text-sm">
            No account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ICONS */
function Eye() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 11s4-7 10-7 10 7 10 7-4 7-10 7S1 11 1 11z" />
      <circle cx="11" cy="11" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0111 19C5 19 1 11 1 11a21.77 21.77 0 015.06-6.94" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
