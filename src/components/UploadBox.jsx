import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  FileImage, 
  X,
  Check,
  AlertCircle,
  File
} from 'lucide-react'
import { useCallback, useState } from 'react'
import Button from './UI/Button'

function UploadBox({ onImageUpload, onCameraOpen, isProcessing = false }) {
  const [fileInfo, setFileInfo] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      setError(error.message)
      setTimeout(() => setError(null), 3000)
      return
    }

    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('File size must be less than 20MB')
        setTimeout(() => setError(null), 3000)
        return
      }

      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
      })

      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg', '.bmp']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 20 * 1024 * 1024,
  })

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const clearFile = (e) => {
    e.stopPropagation()
    setFileInfo(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Dropzone Area */}
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 md:p-20 text-center
          transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/10 hover:border-blue-500/50 hover:bg-white/5'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          ${error ? 'border-red-500 bg-red-500/10' : ''}
          glass
          min-h-[400px] flex items-center justify-center
          overflow-hidden
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
        </div>

        {/* Error Overlay */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <div className="flex items-center gap-3 text-red-400 bg-red-500/20 px-6 py-3 rounded-xl border border-red-500/20">
                <AlertCircle className="w-6 h-6" />
                <span className="font-medium">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Icon with Animation */}
          <motion.div 
            className={`
              p-6 rounded-2xl transition-all duration-300
              ${isDragActive ? 'bg-blue-500/20' : 'bg-white/5'}
            `}
            animate={{ 
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0,
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {isProcessing ? (
              <motion.div 
                className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : fileInfo ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <FileImage className="w-20 h-20 text-emerald-400" />
                <motion.div 
                  className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  y: isDragActive ? -10 : 0,
                }}
                transition={{ 
                  y: { duration: 0.3, repeat: isDragActive ? Infinity : 0, repeatType: 'reverse' }
                }}
              >
                <Upload className={`w-20 h-20 ${isDragActive ? 'text-blue-400' : 'text-slate-500'}`} />
              </motion.div>
            )}
          </motion.div>
          
          {/* Text Content */}
          <div>
            {fileInfo ? (
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-white">
                  File Ready
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1.5">
                    <File className="w-4 h-4" />
                    {fileInfo.name}
                  </span>
                  <span className="w-px h-4 bg-white/10" />
                  <span>{formatFileSize(fileInfo.size)}</span>
                </div>
                <button
                  onClick={clearFile}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mx-auto"
                >
                  <X className="w-4 h-4" />
                  Change file
                </button>
              </div>
            ) : (
              <>
                <p className="text-2xl md:text-3xl font-semibold text-white">
                  {isDragActive ? 'Drop your image here' : 'Upload your image'}
                </p>
                <p className="text-slate-400 mt-2 text-base md:text-lg">
                  {isDragActive ? 'Release to upload' : 'Drag & drop or click to browse'}
                </p>
              </>
            )}
          </div>
          
          {/* File Types */}
          {!fileInfo && (
            <div className="flex flex-wrap gap-3 justify-center text-xs md:text-sm text-slate-500">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                <FileImage className="w-4 h-4" /> JPG, PNG
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                <ImageIcon className="w-4 h-4" /> WEBP, GIF
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                <Upload className="w-4 h-4" /> Max 20MB
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-slate-500 text-sm font-medium">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Camera Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={Camera}
          onClick={onCameraOpen}
          disabled={isProcessing}
          className="py-5 text-lg"
        >
          Open Camera
        </Button>
      </motion.div>
    </div>
  )
}

export default UploadBox