import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Download, 
  Edit, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Share2,
  Heart,
  Maximize,
  Minimize,
  Check
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

function ImagePreview({ image, onRemove, onDownload, onEdit }) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const imgRef = useRef(null)

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200))
    setIsZoomed(true)
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 50))
    if (zoomLevel <= 70) setIsZoomed(false)
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setZoomLevel(100)
    setRotation(0)
    setIsZoomed(false)
  }

  const handleMouseMove = (e) => {
    if (isZoomed && zoomLevel > 100) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) })
    }
  }

  // Touch handler for mobile
  const handleTouchMove = (e) => {
    if (isZoomed && zoomLevel > 100) {
      const touch = e.touches[0]
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 100
      const y = ((touch.clientY - rect.top) / rect.height) * 100
      setMousePosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) })
    }
  }

  const handleImageClick = () => {
    setIsZoomed(!isZoomed)
    if (!isZoomed) {
      setZoomLevel(150)
    } else {
      setZoomLevel(100)
    }
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto px-2 sm:px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl shadow-black/30">
        
        {/* Image Container */}
        <div 
          className="relative w-full bg-black/30 overflow-hidden"
          style={{ minHeight: '300px', height: 'auto', maxHeight: '70vh' }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <motion.img 
              ref={imgRef}
              src={image} 
              alt="Uploaded image" 
              className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                cursor: 'pointer',
                touchAction: 'none',
              }}
              onClick={handleImageClick}
              animate={{
                scale: zoomLevel / 100,
                rotate: rotation,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              drag={isZoomed && zoomLevel > 100}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.2}
            />
          </div>

          {/* Zoom Indicator */}
          {isZoomed && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs sm:text-sm font-medium"
            >
              {zoomLevel}% • Tap to zoom out
            </motion.div>
          )}

          {/* Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <motion.span 
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-xs rounded-lg font-medium border border-white/10 flex items-center gap-1.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
              Ready to Edit
            </motion.span>
          </div>

          {/* Quick Actions - Mobile Friendly */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2 flex-wrap justify-end max-w-[60%]">
            {/* Favorite Button */}
            <button
              className="p-1.5 sm:p-2.5 bg-black/60 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/60" />
            </button>

            {/* Share Button */}
            <button
              className="p-1.5 sm:p-2.5 bg-black/60 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white/60" />
            </button>
          </div>

          {/* Mobile Zoom Hint */}
          <div className="absolute bottom-4 left-4 sm:hidden">
            <span className="text-[10px] text-white/30 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
              Tap to zoom
            </span>
          </div>
        </div>

        {/* Controls Panel - Responsive */}
        <motion.div 
          className="p-3 sm:p-4 glass-dark border-t border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Zoom Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 order-2 sm:order-1">
              <button
                onClick={handleZoomOut}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </button>
              
              <span className="text-xs sm:text-sm font-medium text-white min-w-[50px] sm:min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </button>

              <button
                onClick={handleRotate}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
              </button>

              <button
                onClick={handleReset}
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-[10px] sm:text-xs transition-all"
              >
                Reset
              </button>
            </div>

            {/* Main Actions - Mobile Stack */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <button
                onClick={onEdit}
                className="
                  px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl
                  bg-gradient-to-r from-blue-600 to-blue-500 text-white
                  text-xs sm:text-sm font-medium
                  shadow-lg shadow-blue-500/25
                  flex items-center gap-1.5 sm:gap-2
                  hover:scale-105 transition-all
                "
              >
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Edit</span>
              </button>

              <button
                onClick={onDownload}
                className="
                  px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl
                  bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                  text-xs sm:text-sm font-medium
                  shadow-lg shadow-emerald-500/20
                  flex items-center gap-1.5 sm:gap-2
                  hover:scale-105 transition-all
                "
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Save</span>
              </button>

              <button
                onClick={onRemove}
                className="
                  px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl
                  bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400
                  text-xs sm:text-sm font-medium
                  border border-white/10 hover:border-red-400/30
                  flex items-center gap-1.5 sm:gap-2
                  transition-all
                "
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ImagePreview