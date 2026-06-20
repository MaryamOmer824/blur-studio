import { useDropzone } from 'react-dropzone'
import { Upload, Camera } from 'lucide-react'
import { useCallback } from 'react'

function UploadBox({ onImageUpload, onCameraOpen }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
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
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    multiple: false
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center
          transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-vintage-500 bg-vintage-50 scale-[1.02]' 
            : 'border-vintage-300 hover:border-vintage-400 hover:bg-vintage-50/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragActive ? 'bg-vintage-200' : 'bg-vintage-100'}
          `}>
            <Upload className={`w-12 h-12 ${isDragActive ? 'text-vintage-600' : 'text-vintage-400'}`} />
          </div>
          
          <div>
            <p className="text-xl font-semibold text-vintage-800">
              {isDragActive ? 'Drop your image here' : 'Upload your image'}
            </p>
            <p className="text-sm text-vintage-500 mt-1">
              Drag & drop or click to browse
            </p>
          </div>
          
          <div className="flex gap-4 text-xs text-vintage-400">
            <span>📸 JPG, PNG</span>
            <span>🎨 WEBP, GIF</span>
            <span>📏 Max 20MB</span>
          </div>
        </div>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-vintage-200"></div>
        <span className="text-vintage-400 text-sm font-medium">or</span>
        <div className="flex-1 h-px bg-vintage-200"></div>
      </div>

      {/* Camera Button */}
      <button
        onClick={onCameraOpen}
        className="
          w-full py-4 bg-gradient-to-r from-vintage-500 to-vintage-600
          text-white rounded-2xl font-medium
          hover:shadow-lg hover:scale-[1.02]
          transition-all duration-300
          flex items-center justify-center gap-3
        "
      >
        <Camera className="w-5 h-5" />
        Open Camera
      </button>
    </div>
  )
}

export default UploadBox