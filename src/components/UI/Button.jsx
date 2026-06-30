import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props 
}, ref) => {
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'bg-transparent hover:bg-white/5 text-white border-2 border-white/20 hover:border-blue-500',
    ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
    xl: 'px-10 py-5 text-xl gap-3',
  }

  const buttonContent = (
    <>
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="flex-shrink-0"
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      )}

      {Icon && iconPosition === 'left' && !isLoading && (
        <span className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </span>
      )}

      <span className="relative z-10 font-semibold tracking-wide">
        {children}
      </span>

      {Icon && iconPosition === 'right' && !isLoading && (
        <span className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </span>
      )}
    </>
  )

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        rounded-xl font-medium
        transition-all duration-300
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${className}
        group
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {buttonContent}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button