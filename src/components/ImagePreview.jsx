import { X, Download, Edit } from 'lucide-react'

function ImagePreview({ image, onRemove, onDownload, onEdit }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 glass border border-white/10">
        <img 
          src={image} 
          alt="Uploaded" 
          className="w-full h-auto max-h-[70vh] object-contain"
        />
        
        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={onEdit}
            className="
              p-3 bg-blue-600/90 hover:bg-blue-700
              text-white rounded-xl transition-all duration-300
              backdrop-blur-sm shadow-lg
            "
            title="Edit Image"
          >
            <Edit className="w-5 h-5" />
          </button>
          
          <button
            onClick={onDownload}
            className="
              p-3 bg-emerald-600/90 hover:bg-emerald-700
              text-white rounded-xl transition-all duration-300
              backdrop-blur-sm shadow-lg
            "
            title="Download HD"
          >
            <Download className="w-5 h-5" />
          </button>
          
          <button
            onClick={onRemove}
            className="
              p-3 bg-red-500/90 hover:bg-red-600
              text-white rounded-xl transition-all duration-300
              backdrop-blur-sm shadow-lg
            "
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs rounded-lg font-medium border border-white/10">
            🖼️ Ready to Edit
          </span>
        </div>
      </div>
    </div>
  )
}

export default ImagePreview