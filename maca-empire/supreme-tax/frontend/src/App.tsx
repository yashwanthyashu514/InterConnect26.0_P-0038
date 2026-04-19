import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Billing from './pages/Billing';
import DeveloperPortal from './pages/DeveloperPortal';

// Placeholder for other pages
function Reports() { return <div style={{ padding: 40 }}>Reports Content</div>; }
function Login() { return <div style={{ padding: 40 }}>Login Content</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/developer" element={<DeveloperPortal />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
