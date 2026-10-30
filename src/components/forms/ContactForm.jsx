import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, CheckCircle2, Loader2, AlertCircle, Tag, Phone } from 'lucide-react'
import { sendEmail } from '../../services/emailService'

export default function ContactForm() {
  const [searchParams] = useSearchParams()
  const subject =
    searchParams.get('subject') ||
    searchParams.get('destination') ||
    searchParams.get('offer') ||
    searchParams.get('plan') ||
    ''
  const code = searchParams.get('code') || ''

  const buildDefaultMessage = () => {
    if (!subject) return ''
    return `Inquiry regarding: ${subject}${code ? ` (Promo Code: ${code})` : ''}. Please share package availability, pricing and booking details.`
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: buildDefaultMessage(),
  })
  const [status, setStatus] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (subject) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message || buildDefaultMessage(),
      }))
    }
  }, [subject, code])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = formData.name.trim()
    const trimmedEmail = formData.email.trim()
    const trimmedPhone = formData.phone.trim()
    const trimmedMessage = formData.message.trim()

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('Please complete all required fields before sending your message.')
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
      phone: trimmedPhone || 'Not provided',
      message: `${trimmedMessage}${trimmedPhone ? `\n\nContact Phone: ${trimmedPhone}` : ''}`,
    })

    setLoading(false)

    if (res.success) {
      setIsSuccess(true)
      setStatus('Thank you! Your inquiry has been sent to our travel desk. We will connect with you shortly.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } else {
      setIsSuccess(false)
      setStatus(
        res.error
          ? `Notice: ${res.error}`
          : 'Unable to send message right now. Please call our holiday desk directly at 8130701133.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-varela">
      {subject && (
        <div className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
          <Tag className="h-3.5 w-3.5 text-[#b3d565]" />
          <span>Inquiry for: <strong>{subject}</strong></span>
          {code && (
            <span className="ml-auto rounded bg-[#b3d565] px-2 py-0.5 text-[10.5px] font-bold text-[#07241b]">
              Code: {code}
            </span>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-white/90">
          Your Name *
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/45 focus:border-[#b3d565] focus:bg-white/20 focus:ring-2 focus:ring-[#b3d565]/30 transition backdrop-blur-md"
            placeholder="John Doe"
          />
        </label>
        <label className="block text-xs font-semibold text-white/90">
          Email Address *
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/45 focus:border-[#b3d565] focus:bg-white/20 focus:ring-2 focus:ring-[#b3d565]/30 transition backdrop-blur-md"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block text-xs font-semibold text-white/90">
        Phone Number (Optional)
        <div className="relative mt-1.5">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/45 focus:border-[#b3d565] focus:bg-white/20 focus:ring-2 focus:ring-[#b3d565]/30 transition backdrop-blur-md"
            placeholder="+91 98765 43210"
          />
        </div>
      </label>

      <label className="block text-xs font-semibold text-white/90">
        Message / Travel Wishlist *
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/45 focus:border-[#b3d565] focus:bg-white/20 focus:ring-2 focus:ring-[#b3d565]/30 transition backdrop-blur-md"
          placeholder="Tell us about your desired vacation, dates, group size or specific requests..."
        />
      </label>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b3d565] hover:bg-white disabled:opacity-60 px-7 py-3 text-sm font-bold text-[#07241b] shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#07241b]" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Inquiry</span>
              <Send className="w-4 h-4 text-[#07241b]" />
            </>
          )}
        </button>

        {status && (
          <p
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              isSuccess ? 'text-[#b3d565]' : 'text-amber-200'
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-[#b3d565]" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />}
            <span>{status}</span>
          </p>
        )}
      </div>
    </form>
  )
}
