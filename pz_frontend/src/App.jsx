import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AnimalsPage from './pages/AnimalsPage';
import AnimalDetailsPage from './pages/AnimalDetailsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
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
        <Link to="/login" style={{ marginLeft: 'auto' }}>
          Login
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/animals/:id" element={<AnimalDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
