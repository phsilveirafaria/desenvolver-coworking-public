import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { CssBaseline } from '@mui/material';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';

const AppContent = () => {
  const { isAuthenticated, authenticate, showAuthModal } = useAuth();

  if (!isAuthenticated) {
    return <AuthModal onAuthenticate={authenticate} />;
  }

  return (
    <>
      {showAuthModal && <AuthModal onAuthenticate={authenticate} />}
      <BookingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BookingProvider>
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;