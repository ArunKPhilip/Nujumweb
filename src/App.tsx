import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppThemeProvider } from './theme';
import { Header, BottomNavigation, SOSButton } from './components/layout';
import './App.css';

// Placeholder components for main pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CarePage from './pages/CarePage';
import CommunityPage from './pages/CommunityPage';
import ProgramsPage from './pages/ProgramsPage';
import MarketplacePage from './pages/MarketplacePage';
import EducationPage from './pages/EducationPage';
import ServiceRequestPage from './pages/ServiceRequestPage';
import ProfilePage from './pages/ProfilePage';
import FindCarePage from './pages/FindCarePage';

// Layout wrapper component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    // TODO: Implement drawer/sidebar for larger screens
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
    // TODO: Implement search overlay
  };

  // Check if current page is an authentication page (login/signup)
  const isAuthPage = ['/login', '/signup'].includes(window.location.pathname);

  return (
    <>
      {/* Only show header on authenticated pages and landing page */}
      {!isAuthPage && (
        <Header
          onMenuClick={handleMenuClick}
          onSearchClick={handleSearchClick}
        />
      )}

      <main style={{
        paddingTop: isAuthPage ? '0px' : '64px', // No top padding on auth pages
        paddingBottom: state.isAuthenticated && !isAuthPage ? '80px' : '0', // Bottom nav only on authenticated pages
        minHeight: '100vh',
        backgroundColor: 'var(--mui-palette-background-default)',
      }}>
        {children}
      </main>

      {/* Bottom navigation only for authenticated users */}
      {state.isAuthenticated && !isAuthPage && <BottomNavigation />}

      {/* SOS button only for authenticated users (not on auth pages) */}
      {state.isAuthenticated && !isAuthPage && <SOSButton />}
    </>
  );
};

// Main App component
const AppContent: React.FC = () => {
  const { state } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          state.isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/care"
        element={
          state.isAuthenticated ? <CarePage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/community"
        element={
          state.isAuthenticated ? <CommunityPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/programs"
        element={
          state.isAuthenticated ? <ProgramsPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/marketplace"
        element={
          state.isAuthenticated ? <MarketplacePage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/education"
        element={
          state.isAuthenticated ? <EducationPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/services"
        element={
          state.isAuthenticated ? <ServiceRequestPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/profile"
        element={
          state.isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/find-care"
        element={
          state.isAuthenticated ? <FindCarePage /> : <Navigate to="/login" replace />
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Root App component with all providers
const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <AuthProvider>
        <AppThemeProvider>
          <Router>
            <AppLayout>
              <AppContent />
            </AppLayout>
          </Router>
        </AppThemeProvider>
      </AuthProvider>
    </React.Fragment>
  );
};

export default App;
