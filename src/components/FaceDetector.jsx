import { useEffect, useState } from 'react'
import * as faceDetection from '@tensorflow-models/face-detection'
import '@tensorflow/tfjs'

function FaceDetector({ image, onFacesDetected }) {
  const [isLoading, setIsLoading] = useState(true)
  const [faces, setFaces] = useState([])

  useEffect(() => {
    const detectFaces = async () => {
      if (!image) return

      try {
        setIsLoading(true)
        
        // Load face detection model
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector
        const detector = await faceDetection.createDetector(model, {
          runtime: 'tfjs',
          maxFaces: 5
        })

        // Create image element
        const img = new Image()
        img.src = image
        await new Promise((resolve) => {
          img.onload = resolve
        })

        // Detect faces
        const detections = await detector.estimateFaces(img)
        
        if (detections.length > 0) {
          const faceData = detections.map(face => ({
            x: face.box.xMin,
            y: face.box.yMin,
            width: face.box.width,
            height: face.box.height,
            confidence: face.confidence
          }))
          
          setFaces(faceData)
          onFacesDetected(faceData)
        } else {
          setFaces([])
          onFacesDetected([])
        }
      } catch (error) {
        console.error('Face detection error:', error)
        setFaces([])
        onFacesDetected([])
      } finally {
        setIsLoading(false)
      }
    }

    detectFaces()
  }, [image, onFacesDetected])

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-vintage-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm">Detecting faces...</p>
          </div>
        </div>
      )}
      
      {/* Face Detection Status */}
      {!isLoading && (
        <div className="mt-4 flex items-center gap-3 justify-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            faces.length > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {faces.length > 0 
              ? `✅ ${faces.length} face(s) detected` 
              : '⚠️ No faces detected'}
          </span>
        </div>
      )}
    </div>
  )
}

export default FaceDetector