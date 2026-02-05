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


export default function App() {
  const { isLoggedIn, user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div>
      <header
        style={{
          display: 'flex',
          gap: 12,
          padding: 12,
          borderBottom: '1px solid #eee',
        }}
      >
        <Link to="/" style={{ fontWeight: 800 }}>
          PZ Adoption
        </Link>
        <Link to="/">Animals</Link>

        {isLoggedIn && <Link to="/my-applications">My applications</Link>}

        {isLoggedIn && isAdmin && (
          <span style={{ opacity: 0.7 }}>(Admin enabled)</span>
        )}

        <div style={{ marginLeft: 'auto' }}>
          {isLoggedIn ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      <Routes>
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
    </div>
  );
}
