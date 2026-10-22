import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div key={item.question} className="overflow-hidden rounded-2xl border border-[#d9d1c3] bg-[#fefcf8]">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-midnight">{item.question}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-charcoal/80">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
