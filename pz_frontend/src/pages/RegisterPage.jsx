import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    await register(email, password, name);
    navigate('/login');
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      {/* LEFT PANEL DIFFERENT COLOR */}
      <div className="hidden items-center justify-center bg-emerald-600 text-white md:flex">
        <div>
          <h1 className="text-4xl font-extrabold">Join PZ Adoption</h1>
          <p className="mt-3 opacity-80">Give animals a loving home ❤️</p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold">Register</h2>

          <input
            className="w-full rounded-xl border p-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 text-gray-700"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button className="w-full rounded-xl bg-emerald-600 p-3 text-white">
            Register
          </button>

          <p className="text-sm">
            Already have account? <Link to="/login">Login</Link>
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
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
