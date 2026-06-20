import { useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, X, RefreshCw, Check, RotateCw } from 'lucide-react'

function CameraCapture({ onCapture, onClose }) {
  const webcamRef = useRef(null)

  const [image, setImage] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')

  const videoConstraints = {
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }

  const capture = () => {
    const img = webcamRef.current?.getScreenshot()
    if (img) setImage(img)
  }

  const retake = () => setImage(null)

  const confirm = () => {
    if (image) onCapture(image)
  }

  const toggleFacing = () => {
    setFacingMode(prev =>
      prev === 'environment' ? 'user' : 'environment'
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-3xl bg-black shadow-2xl border border-white/10">

        <div className="relative w-full h-[520px]">

          {/* CAMERA FEED */}
          {!image ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              audio={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={image}
              className="absolute inset-0 w-full h-full object-cover"
              alt="capture"
            />
          )}

          {/* TOP HUD */}
          <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs border border-white/10">
            📷 {facingMode === 'environment' ? 'Back Camera' : 'Front Camera'}
          </div>

          {/* SCANNER FRAME */}
          <div className="absolute inset-12 border border-white/20 rounded-3xl pointer-events-none z-10" />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10" />

          {/* BOTTOM CONTROLS */}
          <div className="absolute bottom-0 left-0 right-0 z-30">

            <div className="flex items-end justify-between px-8 pb-6">

              {/* LEFT BUTTON */}
              {!image ? (
                <button
                  onClick={toggleFacing}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition"
                >
                  <RotateCw size={18} className="text-white" />
                </button>
              ) : (
                <button
                  onClick={retake}
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition"
                >
                  <RefreshCw size={18} className="text-white" />
                </button>
              )}

              {/* CENTER SHUTTER */}
              {!image ? (
                <button
                  onClick={capture}
                  className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl hover:scale-105 transition"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center">
                    <Camera className="w-8 h-8 text-black" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={confirm}
                  className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl hover:scale-105 transition"
                >
                  <Check className="w-10 h-10 text-white" />
                </button>
              )}

              {/* RIGHT CLOSE */}
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-600 transition"
              >
                <X size={18} className="text-white" />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CameraCapture