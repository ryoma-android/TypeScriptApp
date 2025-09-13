import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import TravelFormPage from './pages/TravelFormPage';
import TravelDetailPage from './pages/TravelDetailPage';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travels/new"
            element={
              <ProtectedRoute>
                <TravelFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travels/:id"
            element={
              <ProtectedRoute>
                <TravelDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/travels/:id/edit"
            element={
              <ProtectedRoute>
                <TravelFormPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
