import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import VisitorEntryForm from './pages/VisitorEntryForm';
import GatekeeperPage from './pages/GatekeeperPage';
import VisitorLogs from './pages/VisitorLogs';
import SignIn from './pages/SignIn';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Add Navbar component */}
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/visitor_pass" element={<Navigate to="/signin" replace />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <VisitorEntryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gatekeeper"
            element={
              <ProtectedRoute>
                <GatekeeperPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <VisitorLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;