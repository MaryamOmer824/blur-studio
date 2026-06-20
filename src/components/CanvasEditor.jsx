import { useEffect, useRef, useState } from 'react'
import { blurEffects } from '../utils/blurEffects'

function CanvasEditor({ image, onImageUpdate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('pixel')
  const [brushSize, setBrushSize] = useState(30)
  const [intensity, setIntensity] = useState(50)
  const [ctx, setCtx] = useState(null)

  // Effects list
  const effects = [
    { id: 'watery', label: '💧 Watery' },
    { id: 'scratch', label: '🧱 Scratch' },
    { id: 'pixel', label: '🔲 Pixel' },
    { id: 'fog', label: '🌫 Fog' },
    { id: 'glass', label: '✨ Glass' },
    { id: 'motion', label: '🌀 Motion' }
  ]

  // Initialize canvas when image loads
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    setCtx(context)

    // Load image
    const img = new Image()
    img.onload = () => {
      // Set canvas size
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

      // Draw image
      context.drawImage(img, 0, 0, width, height)
    }
    img.src = image
  }, [image])

  // Get mouse/touch position on canvas
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

  // Apply blur effect
  const applyBlur = (x, y) => {
    if (!ctx) return

    // Get current image data
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Apply selected effect
    const effect = blurEffects[selectedEffect]
    if (effect) {
      const radius = brushSize
      const intensityValue = intensity / 100
      
      // Apply effect to the area
      const result = effect.apply(imageData, x, y, radius, intensityValue)
      
      // Put back on canvas
      ctx.putImageData(result, 0, 0)
    }
  }

  // Drawing handlers
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
    setIsDrawing(false)
    // Save current state
    if (ctx) {
      onImageUpdate(ctx.canvas.toDataURL())
    }
  }

  // Reset to original
  const resetImage = () => {
    if (!ctx || !image) return
    
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
      onImageUpdate(ctx.canvas.toDataURL())
    }
    img.src = image
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Canvas */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-vintage-200">
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
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
            🖌️ Draw on image to apply blur
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 space-y-6">
        {/* Effects Grid */}
        <div>
          <label className="text-sm font-medium text-vintage-700 block mb-3">
            Select Effect
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id)}
                className={`
                  px-3 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${selectedEffect === effect.id
                    ? 'bg-vintage-600 text-white shadow-md scale-[1.02]'
                    : 'bg-vintage-100 text-vintage-700 hover:bg-vintage-200'
                  }
                `}
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-vintage-700">
              🖊️ Brush Size
            </label>
            <span className="text-sm font-semibold text-vintage-600 bg-vintage-100 px-2 py-0.5 rounded-full">
              {brushSize}px
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-vintage-200 accent-vintage-600"
          />
        </div>

        {/* Intensity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-vintage-700">
              💪 Intensity
            </label>
            <span className="text-sm font-semibold text-vintage-600 bg-vintage-100 px-2 py-0.5 rounded-full">
              {intensity}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-vintage-200 accent-vintage-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={resetImage}
            className="px-4 py-2 bg-vintage-200 hover:bg-vintage-300 text-vintage-700 rounded-xl font-medium transition-all"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => {
              if (ctx) {
                onImageUpdate(ctx.canvas.toDataURL())
              }
            }}
            className="px-4 py-2 bg-vintage-600 hover:bg-vintage-700 text-white rounded-xl font-medium transition-all ml-auto"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default CanvasEditor