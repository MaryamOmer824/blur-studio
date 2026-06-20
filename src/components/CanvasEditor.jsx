import { useEffect, useRef, useState } from 'react'
import { blurEffects } from '../utils/blurEffects'
import { Save, Brush, Zap } from 'lucide-react'
// VERSION 2.0 - NO UNDO/REDO/RESET
function CanvasEditor({ image, onImageUpdate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('pixel')
  const [brushSize, setBrushSize] = useState(30)
  const [intensity, setIntensity] = useState(50)
  const [ctx, setCtx] = useState(null)

  const effects = [
    { id: 'watery', label: '💧 Watery', color: 'from-blue-400 to-cyan-400' },
    { id: 'scratch', label: '🧱 Scratch', color: 'from-orange-400 to-red-400' },
    { id: 'pixel', label: '🔲 Pixel', color: 'from-purple-400 to-pink-400' },
    { id: 'fog', label: '🌫 Fog', color: 'from-gray-400 to-slate-400' },
    { id: 'glass', label: '✨ Glass', color: 'from-emerald-400 to-teal-400' },
    { id: 'motion', label: '🌀 Motion', color: 'from-indigo-400 to-blue-400' }
  ]

  // Initialize Canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    setCtx(context)

    const img = new Image()
    img.onload = () => {
      const maxWidth = 800
      const maxHeight = 600
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height
      context.drawImage(img, 0, 0, width, height)
    }
    img.src = image
  }, [image])

  const getPosition = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX, clientY
    
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault()
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const applyBlur = (x, y) => {
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const effect = blurEffects[selectedEffect]
    
    if (effect) {
      const radius = brushSize
      const intensityValue = intensity / 100
      const result = effect.apply(imageData, x, y, radius, intensityValue)
      ctx.putImageData(result, 0, 0)
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const pos = getPosition(e)
    applyBlur(pos.x, pos.y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const pos = getPosition(e)
    applyBlur(pos.x, pos.y)
  }

  const stopDrawing = () => {
    if (isDrawing && ctx) {
      setIsDrawing(false)
      onImageUpdate(ctx.canvas.toDataURL())
    }
  }

  const handleSave = () => {
    if (ctx) {
      onImageUpdate(ctx.canvas.toDataURL())
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Canvas Container */}
      <div className="relative glass rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden border border-white/10">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair touch-none"
        />
        
        {/* Top Status Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs rounded-full font-medium border border-white/10 flex items-center gap-1.5">
              <Brush className="w-3 h-3" /> {brushSize}px
            </span>
            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs rounded-full font-medium border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> {intensity}%
            </span>
          </div>
          <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-xs rounded-full font-medium border border-white/10">
            {effects.find(e => e.id === selectedEffect)?.label}
          </span>
        </div>

        {/* Bottom Status */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white/70 text-xs rounded-full font-medium border border-white/10">
            🖌️ Click & drag to apply effect
          </span>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
        {/* Effects Grid */}
        <div>
          <label className="text-sm font-semibold text-slate-300 block mb-3">
            🎨 Choose Effect
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id)}
                className={`
                  px-3 py-2.5 rounded-xl text-xs font-medium
                  transition-all duration-200 relative overflow-hidden group
                  ${selectedEffect === effect.id
                    ? `bg-gradient-to-r ${effect.color} text-white shadow-md scale-[1.02]`
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <span className="relative z-10">{effect.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Brush & Intensity Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Brush className="w-4 h-4" /> Brush Size
              </label>
              <span className="text-sm font-semibold text-blue-400 bg-blue-500/20 px-3 py-0.5 rounded-full">
                {brushSize}px
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Intensity
              </label>
              <span className="text-sm font-semibold text-purple-400 bg-purple-500/20 px-3 py-0.5 rounded-full">
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Save Button Only */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            onClick={handleSave}
            className="
              px-8 py-3 btn-primary
              rounded-xl font-medium text-sm
              transition-all duration-200 flex items-center gap-2
              hover:scale-[1.02] hover:shadow-xl
            "
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default CanvasEditor