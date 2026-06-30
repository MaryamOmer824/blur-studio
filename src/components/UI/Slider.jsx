import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function Slider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  icon,
  showValue = true,
  formatValue = (v) => `${v}%`,
  className = '',
  disabled = false,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="text-blue-400">
              {icon}
            </span>
          )}
          <label className="font-medium text-white/80 text-sm">
            {label}
          </label>
        </div>
        
        {showValue && (
          <AnimatePresence mode="wait">
            <motion.span
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="
                text-sm font-semibold
                bg-gradient-to-r from-blue-600 to-blue-500
                text-white px-3 py-1 rounded-full
                shadow-lg shadow-blue-500/20
              "
            >
              {formatValue(value)}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="w-full h-2 rounded-full bg-white/10" />
          
          <motion.div 
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
            style={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="
              absolute top-0 left-0 w-full h-full
              opacity-0 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          
          <motion.div 
            className="
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              w-5 h-5 rounded-full bg-white
              shadow-lg shadow-blue-500/30
              border-2 border-blue-500
              pointer-events-none
            "
            style={{ left: `${percentage}%` }}
            animate={{ 
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          />
        </div>
      </div>
    </div>
  )
}

export default Slider