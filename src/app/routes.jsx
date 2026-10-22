import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import ResortsPage from '../pages/ResortsPage'
import VacationPackagesPage from '../pages/VacationPackagesPage'
import ResortDetailsPage from '../pages/ResortDetailsPage'
import DestinationsPage from '../pages/DestinationsPage'
import DestinationPropertiesPage from '../pages/DestinationPropertiesPage'
import DestinationCategoryPage from '../pages/DestinationCategoryPage'
import ExperiencesPage from '../pages/ExperiencesPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/destinations" element={<DestinationsPage />} />
      <Route path="/destinations/category/:category" element={<DestinationCategoryPage />} />
      <Route path="/destinations/:slug" element={<DestinationPropertiesPage />} />
      <Route path="/vacation-packages" element={<VacationPackagesPage />} />
      <Route path="/activity" element={<ExperiencesPage />} />
      <Route path="/blog" element={<ExperiencesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/resorts" element={<ResortsPage />} />
      <Route path="/resorts/:slug" element={<ResortDetailsPage />} />
      <Route path="/tours" element={<ExperiencesPage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
