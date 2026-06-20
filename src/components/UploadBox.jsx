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
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-20 text-center
          transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-700 hover:border-blue-500 hover:bg-white/5'
          }
          glass
          min-h-[400px] flex items-center justify-center
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-6">
          <div className={`
            p-6 rounded-2xl transition-all duration-300
            ${isDragActive ? 'bg-blue-500/20' : 'bg-white/5'}
          `}>
            <Upload className={`w-20 h-20 ${isDragActive ? 'text-blue-400' : 'text-slate-500'}`} />
          </div>
          
          <div>
            <p className="text-2xl font-semibold text-white">
              {isDragActive ? 'Drop your image here' : 'Upload your image'}
            </p>
            <p className="text-slate-400 mt-2 text-lg">
              Drag & drop or click to browse
            </p>
          </div>
          
          <div className="flex gap-6 text-sm text-slate-500">
            <span>📸 JPG, PNG</span>
            <span>🎨 WEBP, GIF</span>
            <span>📏 Max 20MB</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-slate-700"></div>
        <span className="text-slate-500 text-sm font-medium">or</span>
        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      <button
        onClick={onCameraOpen}
        className="
          w-full py-5 btn-primary
          rounded-2xl font-medium text-lg
          flex items-center justify-center gap-3
          shadow-lg shadow-blue-500/20
        "
      >
        <Camera className="w-6 h-6" />
        Open Camera
      </button>
    </div>
  )
}

export default UploadBox