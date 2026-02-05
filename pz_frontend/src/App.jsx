import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import AnimalsPage from './pages/AnimalsPage';
import AnimalDetailsPage from './pages/AnimalDetailsPage';
import LoginPage from './pages/LoginPage';
import ApplyPage from './pages/ApplyPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import AdminAnimalApplicationsPage from './pages/AdminAnimalApplicationsPage';
import RequireAuth from './auth/RequireAuth';
import RegisterPage from './pages/RegisterPage';
import CreateAnimalPage from './pages/CreateAnimalPage';

export default function App() {
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          {/* LOGO */}
          <Link to="/" className="text-lg font-extrabold tracking-tight">
            PZ Adoption
          </Link>

          {/* NAV LINKS */}
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/"
              className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              Animals
            </Link>

            {isLoggedIn && (
              <Link
                to="/my-applications"
                className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                My applications
              </Link>
            )}

            {/* ✅ ADD ANIMAL (ADMIN ONLY) */}
            {isLoggedIn && isAdmin && (
              <Link
                to="/admin/create-animal"
                className="rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Add animal
              </Link>
            )}

            {isLoggedIn && isAdmin && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                Admin enabled
              </span>
            )}
          </nav>

          {/* LOGIN / LOGOUT */}
          <div className="ml-auto">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* PAGE CONTAINER */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route
            path="/admin/create-animal"
            element={
              <RequireAuth>
                <CreateAnimalPage />
              </RequireAuth>
            }
          />

          <Route path="/" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/apply/:animalId"
            element={
              <RequireAuth>
                <ApplyPage />
              </RequireAuth>
            }
          />

          <Route
            path="/my-applications"
            element={
              <RequireAuth>
                <MyApplicationsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/admin/animals/:animalId/applications"
            element={
              <RequireAuth>
                <AdminAnimalApplicationsPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
