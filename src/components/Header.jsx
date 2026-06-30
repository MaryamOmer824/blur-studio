import { motion } from 'framer-motion'

function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 0.6, 
        type: 'spring', 
        stiffness: 100
      }}
      className="glass border-b border-white/5 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 md:h-20">
          
          {/* Logo - Centered */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                <span className="text-white font-bold text-xl md:text-2xl">B</span>
              </div>
              <motion.div 
                className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
            
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                Blur<span className="gradient-text">Studio</span>
              </h1>
              <p className="text-[10px] md:text-xs text-white/40 font-medium tracking-[0.2em] uppercase">
                Image Editor
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header