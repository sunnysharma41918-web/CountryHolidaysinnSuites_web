import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Preloader from '../components/layout/Preloader'
import AppProviders from './AppProviders'
import AppRoutes from './routes'

function AppLayout() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')
  const isLandingPage = pathname === '/'

  // Dedicated clean viewport for Admin Panel (no public navbar/footer interference)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
        <AppRoutes />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbfdfa] text-slate-800 antialiased font-sans">
      <Preloader
        visible={isLandingPage}
        onlyOncePerSession={true}
        duration={2200}
      />
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

function GlobalInquiryRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleRedirectToContact = (e) => {
      const detail = e.detail || {}
      const subject = detail.destination || detail.title || 'General Enquiry'
      const code =
        detail.notes?.match(/Promo Code Applied:\s*([A-Z0-9]+)/i)?.[1] ||
        detail.notes?.match(/Festive Offer Applied:\s*([A-Z0-9]+)/i)?.[1] ||
        ''
      const url = `/contact?subject=${encodeURIComponent(subject)}${code ? `&code=${encodeURIComponent(code)}` : ''}`
      navigate(url)
    }

    window.addEventListener('open-booking-modal', handleRedirectToContact)
    return () => window.removeEventListener('open-booking-modal', handleRedirectToContact)
  }, [navigate])

  return null
}

export default function App() {
  return (
    <AppProviders>
      <GlobalInquiryRedirect />
      <AppLayout />
    </AppProviders>
  )
}
