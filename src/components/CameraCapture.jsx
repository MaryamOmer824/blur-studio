import { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  X, 
  RefreshCw, 
  Check, 
  RotateCw,
  AlertCircle
} from 'lucide-react'

function CameraCapture({ onCapture, onClose }) {
  const webcamRef = useRef(null)
  const [image, setImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: 4/3,
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const capture = () => {
    if (isCapturing || !isReady) return
    setIsCapturing(true)
    
    const img = webcamRef.current?.getScreenshot()
    if (img) {
      setImage(img)
      setIsCapturing(false)
    }
  }

  const retake = () => {
    setImage(null)
    setIsCapturing(false)
  }

  const confirm = () => {
    if (image) onCapture(image)
  }

  const toggleFacing = () => {
    setFacingMode(prev =>
      prev === 'environment' ? 'user' : 'environment'
    )
  }

  const handleError = (err) => {
    setError('Camera access denied. Please allow camera permissions.')
    console.error('Camera error:', err)
  }

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Box - White Border */}
      <div className="bg-blue-600/20 backdrop-blur-sm rounded-3xl border-2 border-white/50 overflow-hidden shadow-2xl shadow-blue-500/20 hover:border-white/80 transition-all duration-300">
        
        {/* Image/Camera Box */}
        <div className="relative w-full" style={{ height: '420px' }}>
          
          <AnimatePresence mode="wait">
            {!image ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full bg-black/40"
              >
                {error ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-white font-medium text-lg mb-2">Camera Access Denied</p>
                    <p className="text-white/50 text-sm">{error}</p>
                    <button 
                      className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                      onClick={() => {
                        setError(null)
                        setIsReady(false)
                        setTimeout(() => setIsReady(true), 500)
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      audio={false}
                      className="absolute inset-0 w-full h-full object-cover"
                      onUserMediaError={handleError}
                    />
                    
                    {!isReady && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <motion.div 
                          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    )}

                    {/* Camera Switch Button */}
                    <button
                      onClick={toggleFacing}
                      className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/60 transition-all z-10"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>

                    {/* Camera Label */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs border border-white/10 flex items-center gap-1.5 z-10">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      {facingMode === 'environment' ? 'Back Camera' : 'Front Camera'}
                    </div>

                    {/* Capture Frame */}
                    <div className="absolute inset-8 border-2 border-white/10 rounded-2xl pointer-events-none z-10" />
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="captured"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  alt="Captured"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Buttons - Premium White Style */}
        <div className="px-6 py-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent border-t border-white/10">
          
          <div className="flex items-center justify-center gap-4">
            
            {!image ? (
              // === CAPTURE MODE ===
              <>
                {/* Cancel Button - Premium White Outline */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="
                    px-6 py-3 rounded-xl
                    bg-white text-black/70
                    border-2 border-white/80
                    hover:bg-white/90 hover:border-white
                    hover:shadow-xl hover:shadow-white/20
                    transition-all duration-300 
                    flex items-center justify-center gap-2
                    font-medium text-sm
                  "
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>

                {/* Capture Button - Premium White Big */}
                <motion.button
                  onClick={capture}
                  disabled={!isReady || isCapturing}
                  className="
                    px-8 py-4 rounded-xl
                    bg-white text-black
                    border-2 border-white
                    shadow-lg shadow-white/30
                    hover:shadow-2xl hover:shadow-white/40
                    hover:scale-105
                    transition-all duration-300 
                    flex items-center justify-center gap-3
                    font-semibold text-base
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:scale-100
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </motion.button>

                {/* Spacer */}
                <div className="w-[88px]" />
              </>
            ) : (
              // === PREVIEW MODE ===
              <>
                {/* Retake Button - Premium White Outline */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={retake}
                  className="
                    px-6 py-3 rounded-xl
                    bg-white text-black/70
                    border-2 border-white/80
                    hover:bg-white/90 hover:border-white
                    hover:shadow-xl hover:shadow-white/20
                    transition-all duration-300 
                    flex items-center justify-center gap-2
                    font-medium text-sm
                  "
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </motion.button>

                {/* Confirm Button - Premium White Big */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirm}
                  className="
                    px-8 py-4 rounded-xl
                    bg-white text-emerald-600
                    border-2 border-emerald-400
                    shadow-lg shadow-emerald-300/30
                    hover:shadow-2xl hover:shadow-emerald-400/40
                    hover:scale-105
                    transition-all duration-300 
                    flex items-center justify-center gap-3
                    font-semibold text-base
                  "
                >
                  <Check className="w-5 h-5" />
                  Done
                </motion.button>

                {/* Cancel Button - Premium White Outline */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="
                    px-6 py-3 rounded-xl
                    bg-white text-black/70
                    border-2 border-white/80
                    hover:bg-red-50 hover:border-red-300 hover:text-red-500
                    hover:shadow-xl hover:shadow-red-100/20
                    transition-all duration-300 
                    flex items-center justify-center gap-2
                    font-medium text-sm
                  "
                >
                  <X className="w-4 h-4" />
                  Close
                </motion.button>
              </>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center mt-4">
            <span className="text-xs text-white/30 font-medium tracking-wider">
              {!image ? '📸  Tap Capture to take a photo' : '✓  Confirm or retake'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CameraCapture