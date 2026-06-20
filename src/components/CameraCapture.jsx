import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, X, RefreshCw, Check, RotateCw } from 'lucide-react'

function CameraCapture({ onCapture, onClose }) {
  const webcamRef = useRef(null)
  const [image, setImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [isLoading, setIsLoading] = useState(true)

  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setImage(imageSrc)
    }
  }

  const retake = () => {
    setImage(null)
  }

  const confirm = () => {
    if (image) {
      onCapture(image)
    }
  }

  const toggleFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }

  const handleUserMedia = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    alert('❌ Camera access denied. Please allow camera permissions.')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden bg-black/90 shadow-2xl">
        {/* Camera/Image Container */}
        <div className="relative aspect-video">
          {isLoading && !image && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-vintage-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm">Starting camera...</p>
              </div>
            </div>
          )}

          {!image ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleError}
              className="w-full h-full object-cover"
              audio={false}
            />
          ) : (
            <img 
              src={image} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex justify-center items-center gap-4">
              {!image ? (
                <>
                  {/* Switch Camera Button */}
                  <button
                    onClick={toggleFacing}
                    className="
                      p-3 rounded-full bg-white/20 backdrop-blur-sm 
                      hover:bg-white/30 transition-all duration-300
                      text-white
                    "
                    title="Switch Camera"
                  >
                    <RotateCw className="w-6 h-6" />
                  </button>

                  {/* Capture Button */}
                  <button
                    onClick={capture}
                    className="
                      p-4 rounded-full bg-gradient-to-r from-vintage-500 to-vintage-600
                      hover:scale-110 hover:shadow-lg
                      transition-all duration-300
                      shadow-lg
                    "
                    title="Take Photo"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="
                      p-3 rounded-full bg-red-500/80 backdrop-blur-sm
                      hover:bg-red-600 transition-all duration-300
                      text-white
                    "
                    title="Close Camera"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <>
                  {/* Retake Button */}
                  <button
                    onClick={retake}
                    className="
                      p-3 rounded-full bg-white/20 backdrop-blur-sm
                      hover:bg-white/30 transition-all duration-300
                      text-white
                    "
                    title="Retake"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>

                  {/* Confirm Button */}
                  <button
                    onClick={confirm}
                    className="
                      p-4 rounded-full bg-gradient-to-r from-green-500 to-green-600
                      hover:scale-110 hover:shadow-lg
                      transition-all duration-300
                      shadow-lg
                    "
                    title="Use Photo"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="
                      p-3 rounded-full bg-red-500/80 backdrop-blur-sm
                      hover:bg-red-600 transition-all duration-300
                      text-white
                    "
                    title="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Camera Info */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
              📸 {facingMode === 'environment' ? 'Back' : 'Front'} Camera
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraCapture