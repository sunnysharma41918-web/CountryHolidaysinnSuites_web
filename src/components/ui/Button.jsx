import { Link } from 'react-router-dom'

export default function Button({ children, to, href, variant = 'primary', className = '', ...props }) {
  const classes = [
    'inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-medium tracking-[0.14em] uppercase transition-all duration-300',
    variant === 'primary'
      ? 'border-gold bg-gold text-midnight hover:bg-[#d6b57d]'
      : variant === 'secondary'
        ? 'border-white/30 bg-white/5 text-white hover:bg-white/10'
        : 'border-[#d1c3a4] bg-transparent text-midnight hover:border-midnight hover:bg-[#f4efe8]',
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
