import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Image as ImageIcon } from 'lucide-react'
import Header from '../components/Header'
import ImagePreview from '../components/ImagePreview'
import CanvasEditor from '../components/CanvasEditor'
import CameraCapture from '../components/CameraCapture'

function Home() {
  const [image, setImage] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  const handleImageUpload = (imageData) => {
    setIsProcessing(true)
    setTimeout(() => {
      setImage(imageData)
      setShowEditor(false)
      setShowCamera(false)
      setIsProcessing(false)
    }, 500)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setShowEditor(false)
    setShowCamera(false)
  }

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a')
      link.download = `blur-studio-art-${Date.now()}.png`
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleImageUpload(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleImageUpload(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-main bg-grid-pattern">
      <Header />
      
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <motion.div 
          className="w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {showCamera ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <CameraCapture 
                  onCapture={handleImageUpload}
                  onClose={handleCameraClose}
                />
              </motion.div>
            ) : !image ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                {/* Heading */}
                <motion.div 
                  className="text-center space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-white"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  >
                    Create <span className="gradient-text">Professional</span> Blurs
                  </motion.h2>
                  <p className="text-white/40 text-sm md:text-base">
                    Upload an image or take a photo to get started
                  </p>
                </motion.div>

                {/* Upload Box - Blue with White Border */}
                <div 
                  className={`
                    w-full max-w-2xl relative 
                    border-2 rounded-3xl p-12 text-center 
                    transition-all duration-300
                    ${isDragActive 
                      ? 'border-white bg-blue-600/40 scale-[1.02]' 
                      : 'border-white/50 bg-blue-600/20 hover:border-white/80 hover:bg-blue-600/30'
                    }
                    backdrop-blur-sm
                    min-h-[300px] flex items-center justify-center 
                    overflow-hidden cursor-pointer
                    shadow-2xl shadow-blue-500/10
                  `}
                  onClick={() => document.getElementById('fileInput')?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Hidden File Input */}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Background Glow - Blue */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    {/* Upload Icon with Animation */}
                    <motion.div 
                      className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                      animate={{ 
                        scale: isDragActive ? 1.15 : [1, 1.05, 1],
                      }}
                      transition={{ 
                        scale: isDragActive ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      }}
                    >
                      {isProcessing ? (
                        <motion.div 
                          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <Upload className={`w-16 h-16 ${isDragActive ? 'text-white' : 'text-white/60'}`} />
                      )}
                    </motion.div>
                    
                    {/* Drag & Drop Text */}
                    <div>
                      <p className="text-2xl font-semibold text-white">
                        {isDragActive ? 'Drop your image here' : 'Drag & Drop'}
                      </p>
                      <p className="text-white/40 mt-1 text-sm">
                        {isDragActive ? 'Release to upload' : 'or click to browse'}
                      </p>
                    </div>
                    
                    {/* File Types */}
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-white/30">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <ImageIcon className="w-3.5 h-3.5" /> JPG, PNG
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <ImageIcon className="w-3.5 h-3.5" /> WEBP, GIF
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Upload className="w-3.5 h-3.5" /> Max 20MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Two Clean White Buttons */}
                <div className="flex items-center justify-center gap-4 w-full max-w-md">
                  
                  {/* Upload Picture Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('fileInput')?.click()}
                    className="
                      flex-1 px-6 py-4 rounded-2xl
                      bg-white text-slate-800 font-semibold text-base
                      shadow-lg shadow-white/20
                      hover:shadow-2xl hover:shadow-white/30
                      transition-all duration-300
                      flex items-center justify-center gap-3
                      border border-white/30
                      group
                      relative overflow-hidden
                    "
                  >
                    {/* Hover Shine Effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span>Upload Picture</span>
                  </motion.button>

                  {/* Take Picture Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCameraOpen}
                    className="
                      flex-1 px-6 py-4 rounded-2xl
                      bg-white text-slate-800 font-semibold text-base
                      shadow-lg shadow-white/20
                      hover:shadow-2xl hover:shadow-white/30
                      transition-all duration-300
                      flex items-center justify-center gap-3
                      border border-white/30
                      group
                      relative overflow-hidden
                    "
                  >
                    {/* Hover Shine Effect */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    
                    <Camera className="w-5 h-5 text-blue-600" />
                    <span>Take Picture</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                {!showEditor ? (
                  <>
                    <ImagePreview 
                      image={image} 
                      onRemove={handleRemoveImage}
                      onDownload={handleDownload}
                      onEdit={() => setShowEditor(true)}
                    />
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditor(true)}
                        className="
                          px-8 py-4 btn-primary
                          rounded-xl font-semibold text-lg
                          shadow-lg shadow-blue-500/25
                          flex items-center gap-2
                        "
                      >
                        🎨 Open Editor
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownload}
                        className="
                          px-6 py-4 btn-success
                          rounded-xl font-semibold text-lg
                          shadow-lg shadow-emerald-500/20
                          flex items-center gap-2
                        "
                      >
                        ⬇️ Download HD
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRemoveImage}
                        className="
                          px-6 py-4 btn-secondary
                          rounded-xl font-semibold text-lg
                        "
                      >
                        📤 Upload New
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <CanvasEditor 
                      image={image} 
                      onImageUpdate={handleImageUpdate}
                    />
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowEditor(false)}
                      className="
                        px-6 py-3 btn-secondary
                        rounded-xl font-semibold
                      "
                    >
                      ← Back to Preview
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-white/30 text-sm">
            Made with ❤️ using Vite + React + Canvas API
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home