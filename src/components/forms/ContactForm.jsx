import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedMessage = formData.message.trim()

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('Please complete all fields before sending your message.')
      setIsSuccess(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus('Please enter a valid email address.')
      setIsSuccess(false)
      return
    }

    setIsSuccess(true)
    setStatus('Thank you! Your inquiry has been sent to our travel experts.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-slate-700">
          Your Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm outline-none placeholder:text-slate-400 focus:border-[#ff5938] focus:bg-white focus:ring-2 focus:ring-[#ff5938]/20 transition"
            placeholder="John Doe"
          />
        </label>
        <label className="block text-xs font-semibold text-slate-700">
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm outline-none placeholder:text-slate-400 focus:border-[#ff5938] focus:bg-white focus:ring-2 focus:ring-[#ff5938]/20 transition"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block text-xs font-semibold text-slate-700">
        Message / Destination Wishlist
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm outline-none placeholder:text-slate-400 focus:border-[#ff5938] focus:bg-white focus:ring-2 focus:ring-[#ff5938]/20 transition"
          placeholder="Tell us about your desired mountain or lakeside trip..."
        />
      </label>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5938] hover:bg-[#e84a28] px-7 py-3 text-sm font-semibold text-white shadow-md shadow-[#ff5938]/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Send Inquiry</span>
          <Send className="w-4 h-4" />
        </button>

        {status && (
          <p
            className={`text-xs font-medium flex items-center gap-1.5 ${
              isSuccess ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4" />}
            {status}
          </p>
        )}
      </div>
    </form>
  )
}
