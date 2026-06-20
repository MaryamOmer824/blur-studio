import { X, Download } from 'lucide-react'

function ImagePreview({ image, onRemove, onDownload }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-vintage-200">
        <img 
          src={image} 
          alt="Uploaded" 
          className="w-full h-auto max-h-[70vh] object-contain"
        />
        
        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Download Button */}
          {onDownload && (
            <button
              onClick={onDownload}
              className="
                p-2 bg-vintage-600/80 hover:bg-vintage-700
                text-white rounded-full transition-all duration-300
                backdrop-blur-sm
              "
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          
          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="
              p-2 bg-red-500/80 hover:bg-red-600
              text-white rounded-full transition-all duration-300
              backdrop-blur-sm
            "
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
            🖼️ Image Ready
          </span>
        </div>
      </div>
    </div>
  )
}

export default ImagePreview