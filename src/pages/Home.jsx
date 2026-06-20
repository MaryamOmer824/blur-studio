import { useState } from 'react'
import Header from '../components/Header'
import UploadBox from '../components/UploadBox'
import ImagePreview from '../components/ImagePreview'
import CanvasEditor from '../components/CanvasEditor'
import CameraCapture from '../components/CameraCapture'
import AutoBlurFace from '../components/AutoBlurFace'

function Home() {
  const [image, setImage] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showAutoBlur, setShowAutoBlur] = useState(false)

  const handleImageUpload = (imageData) => {
    setImage(imageData)
    setShowEditor(false)
    setShowCamera(false)
    setShowAutoBlur(false)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setShowEditor(false)
    setShowCamera(false)
    setShowAutoBlur(false)
  }

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a')
      link.download = 'blur-studio-art.png'
      link.href = image
      link.click()
    }
  }

  const handleCameraOpen = () => {
    setShowCamera(true)
  }

  const handleCameraClose = () => {
    setShowCamera(false)
  }

  const handleImageUpdate = (newImageData) => {
    setImage(newImageData)
  }

  const handleAutoBlurApply = (blurredImage) => {
    setImage(blurredImage)
    setShowAutoBlur(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-50 via-vintage-100/50 to-vintage-200/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {showCamera ? (
            <CameraCapture 
              onCapture={handleImageUpload}
              onClose={handleCameraClose}
            />
          ) : !image ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-vintage-800">
                  Create Aesthetic Blurs
                </h2>
                <p className="text-vintage-500 mt-2">
                  Upload an image or take a photo to get started
                </p>
              </div>
              <UploadBox 
                onImageUpload={handleImageUpload}
                onCameraOpen={handleCameraOpen}
              />
            </>
          ) : (
            <>
              {!showEditor && !showAutoBlur ? (
                <>
                  <ImagePreview 
                    image={image} 
                    onRemove={handleRemoveImage}
                    onDownload={handleDownload}
                  />
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button 
                      onClick={() => setShowEditor(true)}
                      className="
                        px-8 py-4 bg-gradient-to-r from-vintage-500 to-vintage-600
                        text-white rounded-xl font-medium text-lg
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        hover:scale-[1.02]
                      "
                    >
                      🎨 Open Editor
                    </button>
                    
                    <button 
                      onClick={() => setShowAutoBlur(true)}
                      className="
                        px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500
                        text-white rounded-xl font-medium text-lg
                        transition-all duration-300 shadow-lg hover:shadow-xl
                        hover:scale-[1.02]
                      "
                    >
                      🤖 Auto Blur Face
                    </button>
                    
                    <button 
                      onClick={handleDownload}
                      className="
                        px-6 py-3 bg-green-600 hover:bg-green-700
                        text-white rounded-xl font-medium
                        transition-all duration-300 shadow-md hover:shadow-lg
                      "
                    >
                      ⬇️ Download HD
                    </button>
                    
                    <button 
                      onClick={handleRemoveImage}
                      className="
                        px-6 py-3 bg-vintage-200 hover:bg-vintage-300
                        text-vintage-700 rounded-xl font-medium
                        transition-all duration-300
                      "
                    >
                      📤 Upload New
                    </button>
                  </div>
                </>
              ) : showAutoBlur ? (
                <>
                  <AutoBlurFace 
                    image={image} 
                    onBlurApplied={handleAutoBlurApply}
                  />
                  <button 
                    onClick={() => setShowAutoBlur(false)}
                    className="
                      px-6 py-3 bg-vintage-200 hover:bg-vintage-300
                      text-vintage-700 rounded-xl font-medium
                      transition-all duration-300
                    "
                  >
                    ← Back
                  </button>
                </>
              ) : (
                <>
                  <CanvasEditor 
                    image={image} 
                    onImageUpdate={handleImageUpdate}
                  />
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowEditor(false)}
                      className="
                        px-6 py-3 bg-vintage-200 hover:bg-vintage-300
                        text-vintage-700 rounded-xl font-medium
                        transition-all duration-300
                      "
                    >
                      ← Back to Preview
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-vintage-200 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-vintage-400 text-sm">
            Made with ❤️ using Vite + React + TensorFlow.js
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home