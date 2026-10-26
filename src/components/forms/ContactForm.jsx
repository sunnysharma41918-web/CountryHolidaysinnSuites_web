import { useState } from 'react'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { sendEmail } from '../../services/emailService'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
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

    setLoading(true)
    setStatus('Sending your inquiry...')

    const res = await sendEmail({
      name: trimmedName,
      from_name: trimmedName,
      email: trimmedEmail,
      from_email: trimmedEmail,
      reply_to: trimmedEmail,
      message: trimmedMessage,
    })

    setLoading(false)

    if (res.success) {
      setIsSuccess(true)
      setStatus('Thank you! Your inquiry has been sent to our travel experts.')
      setFormData({ name: '', email: '', message: '' })
    } else {
      setIsSuccess(false)
      setStatus(
        res.error
          ? `Notice: ${res.error}`
          : 'Unable to send message right now. Please call us at 8130701133.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-slate-700">
          Your Name
          <input
            type="text"
            name="name"
            required
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
            required
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
          required
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
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5938] hover:bg-[#e84a28] disabled:opacity-60 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-[#ff5938]/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Inquiry</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        {status && (
          <p
            className={`text-xs font-medium flex items-center gap-1.5 ${
              isSuccess ? 'text-emerald-600' : 'text-amber-600'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{status}</span>
          </p>
        )}
      </div>
    </form>
  )
}
