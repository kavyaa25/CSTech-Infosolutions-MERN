import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddAgent from './components/AddAgent';
import UploadList from './components/UploadList';
import AgentListView from './components/AgentListView';
import Header from './components/Header';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return admin ? children : <Navigate to="/login" />;
};

// Main App Routes
const AppRoutes = () => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {admin && <Header />}
      <Routes>
        <Route 
          path="/login" 
          element={admin ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-agent" 
          element={
            <ProtectedRoute>
              <AddAgent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload-list" 
          element={
            <ProtectedRoute>
              <UploadList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/view-distribution" 
          element={
            <ProtectedRoute>
              <AgentListView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to={admin ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;


