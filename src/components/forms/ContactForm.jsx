import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, CheckCircle2, Loader2, AlertCircle, Tag, User, Mail, Phone, MessageSquare } from 'lucide-react'
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
          : 'Unable to send message right now. Please call our holiday desk directly at 76697775335.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-varela text-[#0b1f12]">
      {/* Dynamic subject / promo code notification pill */}
      {subject && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-[#f3f8e6] border border-[#096c27]/25 p-3.5 text-xs text-[#063a2f] shadow-xs">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[#096c27] text-white">
            <Tag className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[10.5px] uppercase font-bold text-[#096c27] tracking-wider">Inquiring For</p>
            <p className="m-0 font-bold text-sm text-[#063a2f] truncate">{subject}</p>
          </div>
          {code && (
            <span className="shrink-0 rounded-full bg-[#096c27] px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-xs">
              {code}
            </span>
          )}
        </div>
      )}

      {/* Name and Email side by side on desktop */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-stone-200 bg-[#fbfdfa] pl-10 pr-4 py-2.5 text-stone-900 text-sm outline-none placeholder:text-stone-400 focus:border-[#096c27] focus:bg-white focus:ring-4 focus:ring-[#096c27]/10 transition shadow-xs"
              placeholder="e.g. John Doe"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <User className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-stone-200 bg-[#fbfdfa] pl-10 pr-4 py-2.5 text-stone-900 text-sm outline-none placeholder:text-stone-400 focus:border-[#096c27] focus:bg-white focus:ring-4 focus:ring-[#096c27]/10 transition shadow-xs"
              placeholder="e.g. you@example.com"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Mail className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Phone Number <span className="text-xs font-normal text-stone-400 lowercase">(optional)</span>
        </label>
        <div className="relative mt-1.5">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-200 bg-[#fbfdfa] pl-10 pr-4 py-2.5 text-stone-900 text-sm outline-none placeholder:text-stone-400 focus:border-[#096c27] focus:bg-white focus:ring-4 focus:ring-[#096c27]/10 transition shadow-xs"
            placeholder="e.g. +91 98765 43210"
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            <Phone className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Message / Travel Wishlist <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1.5">
          <textarea
            name="message"
            required
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-200 bg-[#fbfdfa] p-3.5 text-stone-900 text-sm outline-none placeholder:text-stone-400 focus:border-[#096c27] focus:bg-white focus:ring-4 focus:ring-[#096c27]/10 transition shadow-xs resize-y"
            placeholder="Tell us about your desired vacation, dates, group size or specific requests..."
          />
        </div>
      </div>

      {/* Status Alert if any */}
      {status && (
        <div
          className={`rounded-xl p-3.5 text-xs font-medium flex items-start gap-2.5 ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          )}
          <span className="leading-relaxed">{status}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#b3d565] hover:bg-[#a5cc4c] disabled:opacity-60 px-8 py-3.5 text-sm font-bold text-[#0b1f12] shadow-[0_8px_20px_-4px_rgba(179,213,101,0.65)] hover:shadow-[0_12px_24px_-4px_rgba(179,213,101,0.75)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0b1f12]" />
              <span>Sending Inquiry...</span>
            </>
          ) : (
            <>
              <span>Send Inquiry</span>
              <Send className="w-4 h-4 text-[#0b1f12] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
