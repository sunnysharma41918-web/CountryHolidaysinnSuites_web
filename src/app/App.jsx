import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Preloader from '../components/layout/Preloader'
import BookingModal from '../components/forms/BookingModal'
import AppProviders from './AppProviders'
import AppRoutes from './routes'

export default function App() {
  const [loading, setLoading] = useState(false)
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
      <div className="min-h-screen bg-[#fbfbfe] text-slate-800 antialiased font-sans">
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
    </AppProviders>
  )
}
