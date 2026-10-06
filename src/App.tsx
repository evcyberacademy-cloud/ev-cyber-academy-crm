import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LeadsProvider } from './contexts/LeadsContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsListPage } from './pages/LeadsListPage';
import { AddLeadPage } from './pages/AddLeadPage';
import { LeadDetailPage } from './pages/LeadDetailPage';
import { FollowupsPage } from './pages/FollowupsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <LeadsProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout title="Dashboard" subtitle="Overview of lead conversion, follow-ups, and revenue">
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <Layout title="Leads Directory" subtitle="Search, filter, and manage student admissions">
                      <LeadsListPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leads/new"
                element={
                  <ProtectedRoute>
                    <Layout title="Add Lead" subtitle="Create a new student enquiry record">
                      <AddLeadPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/leads/:id"
                element={
                  <ProtectedRoute>
                    <Layout title="Candidate Profile" subtitle="Detailed information, payment history, and follow-ups">
                      <LeadDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/follow-ups"
                element={
                  <ProtectedRoute>
                    <Layout title="Follow-up Command Center" subtitle="Prioritize overdue, today's, and scheduled calls">
                      <FollowupsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout title="System Settings" subtitle="Preferences, backups, and Supabase Free Tier configuration">
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          </LeadsProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
