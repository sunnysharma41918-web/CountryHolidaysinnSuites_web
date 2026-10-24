import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Preloader from '../components/layout/Preloader'
import BookingModal from '../components/forms/BookingModal'
import AppProviders from './AppProviders'
import AppRoutes from './routes'

function AppLayout({ bookingModalOpen, setBookingModalOpen, modalData, setModalData }) {
  const { pathname } = useLocation()
  const isLandingPage = pathname === '/'
  const [loading, setLoading] = useState(isLandingPage)

  useEffect(() => {
    if (!isLandingPage) {
      setLoading(false)
      return undefined
    }

    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 1600)
    return () => window.clearTimeout(timer)
  }, [isLandingPage, pathname])

  return (
    <div className="min-h-screen bg-[#f3f8e6] text-slate-800 antialiased font-sans">
      <Preloader visible={loading} />
      <Navbar
        onBookNow={() => {
          setModalData({
            destination: 'Poland, Tatra Mountains',
            persons: '2 Persons',
            days: '3 Nights 2 Days',
          })
          setBookingModalOpen(true)
        }}
      />
      <main>
        <AppRoutes />
      </main>
      <Footer />

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialData={modalData}
      />
    </div>
  )
}

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [modalData, setModalData] = useState({})

  useEffect(() => {
    const handleOpenModal = (e) => {
      if (e.detail) {
        setModalData(e.detail)
      } else {
        setModalData({
          destination: 'Poland, Tatra Mountains',
          persons: '2 Persons',
          days: '3 Nights 2 Days',
        })
      }
      setBookingModalOpen(true)
    }

    window.addEventListener('open-booking-modal', handleOpenModal)
    return () => window.removeEventListener('open-booking-modal', handleOpenModal)
  }, [])

  return (
    <AppProviders>
      <AppLayout
        bookingModalOpen={bookingModalOpen}
        setBookingModalOpen={setBookingModalOpen}
        modalData={modalData}
        setModalData={setModalData}
      />
    </AppProviders>
  )
}
