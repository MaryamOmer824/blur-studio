import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  variant = 'default',
  padding = 'md',
  rounded = 'xl',
  border = true,
  animate = true,
  delay = 0,
  ...props 
}, ref) => {
  
  const variants = {
    default: 'bg-white/5 backdrop-blur-sm',
    dark: 'bg-black/40 backdrop-blur-md',
    light: 'bg-white/5 backdrop-blur-sm',
    gradient: 'bg-gradient-to-br from-blue-600/20 to-blue-500/10 backdrop-blur-sm',
    primary: 'bg-blue-600/20 backdrop-blur-sm border-blue-500/30',
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  }

  const cardClasses = `
    ${variants[variant]}
    ${paddings[padding]}
    ${roundedClasses[rounded]}
    ${border ? 'border border-white/10' : ''}
    ${glow ? 'shadow-2xl shadow-blue-500/10' : 'shadow-lg'}
    ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-500/30' : ''}
    relative overflow-hidden
    ${className}
  `

  const cardContent = (
    <div ref={ref} className={cardClasses} {...props}>
      {glow && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10 blur-2xl" />
        </div>
      )}

      {hover && (
        <div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay,
          type: 'spring',
          stiffness: 100,
          damping: 15
        }}
        whileHover={hover ? { y: -5 } : {}}
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
})

Card.displayName = 'Card'

export default Card