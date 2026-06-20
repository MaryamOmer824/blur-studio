import { useState } from 'react'
import Header from '../components/Header'
import UploadBox from '../components/UploadBox'
import ImagePreview from '../components/ImagePreview'
import CanvasEditor from '../components/CanvasEditor'
import CameraCapture from '../components/CameraCapture'

function Home() {
  const [image, setImage] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const handleImageUpload = (imageData) => {
    setImage(imageData)
    setShowEditor(false)
    setShowCamera(false)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setShowEditor(false)
    setShowCamera(false)
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

  return (
    <div className="min-h-screen bg-gradient-main">
      <Header />
      
      <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="w-full">
          {showCamera ? (
            <CameraCapture 
              onCapture={handleImageUpload}
              onClose={handleCameraClose}
            />
          ) : !image ? (
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Create <span className="gradient-text">Professional</span> Blurs
                </h2>
                <p className="text-slate-400 text-lg">
                  Upload an image or take a photo to get started
                </p>
              </div>
              <UploadBox 
                onImageUpload={handleImageUpload}
                onCameraOpen={handleCameraOpen}
              />
            </div>
          ) : (
            <>
              {!showEditor ? (
                <div className="flex flex-col items-center gap-8 w-full">
                  <ImagePreview 
                    image={image} 
                    onRemove={handleRemoveImage}
                    onDownload={handleDownload}
                    onEdit={() => setShowEditor(true)}
                  />
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button 
                      onClick={() => setShowEditor(true)}
                      className="
                        px-8 py-4 btn-primary
                        rounded-xl font-medium text-lg
                        shadow-lg shadow-blue-500/25
                        flex items-center gap-2
                      "
                    >
                      🎨 Open Editor
                    </button>
                    
                    <button 
                      onClick={handleDownload}
                      className="
                        px-6 py-4 bg-emerald-600 hover:bg-emerald-700
                        text-white rounded-xl font-medium text-lg
                        transition-all duration-300 shadow-lg shadow-emerald-500/20
                        hover:shadow-xl hover:scale-[1.02]
                      "
                    >
                      ⬇️ Download HD
                    </button>
                    
                    <button 
                      onClick={handleRemoveImage}
                      className="
                        px-6 py-4 btn-secondary
                        rounded-xl font-medium text-lg
                      "
                    >
                      📤 Upload New
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 w-full">
                  <CanvasEditor 
                    image={image} 
                    onImageUpdate={handleImageUpdate}
                  />
                  
                  <button 
                    onClick={() => setShowEditor(false)}
                    className="
                      px-6 py-3 btn-secondary
                      rounded-xl font-medium
                    "
                  >
                    ← Back to Preview
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-slate-500 text-sm">
            Made with ❤️ using Vite + React + Canvas API
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home