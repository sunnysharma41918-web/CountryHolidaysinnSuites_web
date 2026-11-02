import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import ResortsPage from '../pages/ResortsPage'
import VacationPackagesPage from '../pages/VacationPackagesPage'
import ResortDetailsPage from '../pages/ResortDetailsPage'
import DestinationsPage from '../pages/DestinationsPage'
import DestinationPropertiesPage from '../pages/DestinationPropertiesPage'
import DestinationCategoryPage from '../pages/DestinationCategoryPage'
import ExperiencesPage from '../pages/ExperiencesPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import BlogPage from '../pages/BlogPage'

// Admin Components
import AdminLayout from '../components/admin/AdminLayout'
import ProtectedRoute from '../components/admin/ProtectedRoute'
import AdminLoginPage from '../pages/admin/AdminLoginPage'
import AdminForgotPasswordPage from '../pages/admin/AdminForgotPasswordPage'
import AdminResetPasswordPage from '../pages/admin/AdminResetPasswordPage'
import Dashboard from '../components/admin/Dashboard'
import AdminPropertiesPage from '../pages/admin/AdminPropertiesPage'
import AdminPropertyFormPage from '../pages/admin/AdminPropertyFormPage'
import AdminOffersPage from '../pages/admin/AdminOffersPage'
import AdminAuditLogsPage from '../pages/admin/AdminAuditLogsPage'
import AdminSystemPage from '../pages/admin/AdminSystemPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ROUTES ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/destinations/category/:category" element={<DestinationCategoryPage />} />
      <Route path="/destinations/alleppe" element={<Navigate to="/destinations/alleppey" replace />} />
      <Route path="/destinations/:slug" element={<DestinationPropertiesPage />} />
      <Route path="/vacation-packages" element={<VacationPackagesPage />} />
      <Route path="/activity" element={<ExperiencesPage />} />
      <Route path="/blog" element={<Navigate to="/about" replace />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/resorts" element={<ResortsPage />} />
      <Route path="/resorts/:slug" element={<ResortDetailsPage />} />
      <Route path="/tours" element={<ExperiencesPage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />

      {/* ================= ADMIN AUTHENTICATION ROUTES ================= */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/reset-password" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/reset-password/:token" element={<Navigate to="/admin/login" replace />} />

      {/* ================= PROTECTED ADMIN PORTAL ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin', 'editor']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="properties/new" element={<AdminPropertyFormPage />} />
        <Route path="properties/:id/edit" element={<AdminPropertyFormPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="system" element={<AdminSystemPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
