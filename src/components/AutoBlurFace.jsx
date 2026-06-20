import { useState } from 'react'
import FaceDetector from './FaceDetector'
import { blurEffects } from '../utils/blurEffects'

function AutoBlurFace({ image, onBlurApplied }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [faces, setFaces] = useState([])

  const handleFacesDetected = (detectedFaces) => {
    setFaces(detectedFaces)
  }

  const applyBlurToFaces = async () => {
    if (faces.length === 0) {
      alert('⚠️ No faces detected to blur!')
      return
    }

    setIsProcessing(true)

    // Create canvas to apply blur
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    img.src = image
    await new Promise((resolve) => {
      img.onload = resolve
    })

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // Apply blur to each face
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    faces.forEach(face => {
      const centerX = face.x + face.width / 2
      const centerY = face.y + face.height / 2
      const radius = Math.max(face.width, face.height) / 2
      
      // Apply pixel blur on face
      const result = blurEffects.pixel.apply(
        imageData, 
        centerX, 
        centerY, 
        radius * 0.8, 
        0.7
      )
      ctx.putImageData(result, 0, 0)
    })

    // Get processed image
    const processedImage = canvas.toDataURL('image/png')
    onBlurApplied(processedImage)
    setIsProcessing(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <FaceDetector 
        image={image} 
        onFacesDetected={handleFacesDetected} 
      />

      <button
        onClick={applyBlurToFaces}
        disabled={isProcessing || faces.length === 0}
        className={`
          w-full py-3 rounded-xl font-medium text-white
          transition-all duration-300
          ${isProcessing || faces.length === 0
            ? 'bg-vintage-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-vintage-500 to-vintage-600 hover:shadow-lg hover:scale-[1.02]'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Processing...
          </span>
        ) : (
          `🤖 Auto Blur ${faces.length} Face(s)`
        )}
      </button>

      {faces.length === 0 && !isProcessing && (
        <p className="text-center text-sm text-vintage-500">
          💡 Upload a clear face photo for auto blur
        </p>
      )}
    </div>
  )
}

export default AutoBlurFace