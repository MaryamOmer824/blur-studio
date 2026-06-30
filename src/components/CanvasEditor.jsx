import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { blurEffects } from '../utils/blurEffects'
import { 
  Save, 
  Brush, 
  Zap, 
  Undo, 
  Redo, 
  Palette,
  Download,
  Eraser
} from 'lucide-react'
import Slider from './UI/Slider'

function CanvasEditor({ image, onImageUpdate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('pixel')
  const [brushSize, setBrushSize] = useState(30)
  const [intensity, setIntensity] = useState(50)
  const [ctx, setCtx] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [tool, setTool] = useState('brush')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const effects = [
    { id: 'watery', label: '💧 Watery', color: 'from-blue-400 to-cyan-400' },
    { id: 'scratch', label: '🧱 Scratch', color: 'from-orange-400 to-red-400' },
    { id: 'pixel', label: '🔲 Pixel', color: 'from-purple-400 to-pink-400' },
    { id: 'fog', label: '🌫 Fog', color: 'from-gray-400 to-slate-400' },
    { id: 'glass', label: '✨ Glass', color: 'from-emerald-400 to-teal-400' },
    { id: 'motion', label: '🌀 Motion', color: 'from-indigo-400 to-blue-400' }
  ]

  // Save history
  const saveHistory = useCallback(() => {
    if (!ctx) return
    const imageData = ctx.canvas.toDataURL()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    if (newHistory.length > 50) {
      newHistory.shift()
      setHistoryIndex(prev => prev - 1)
      setHistory(newHistory)
    }
  }, [ctx, history, historyIndex])

  // Initialize Canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    setCtx(context)

    const img = new Image()
    img.onload = () => {
      // Get parent container width
      const parent = canvas.parentElement
      const parentWidth = parent.clientWidth - 16
      const maxWidth = Math.min(parentWidth, 400)
      const maxHeight = isMobile ? 200 : 280
      
      let width = img.width
      let height = img.height
      const aspectRatio = width / height

      // Fit image
      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      const initialData = canvas.toDataURL()
      setHistory([initialData])
      setHistoryIndex(0)
    }
    img.src = image
  }, [image, isMobile])

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
    if (!ctx || isProcessing) return

    setIsProcessing(true)
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    if (tool === 'eraser') {
      if (historyIndex > 0) {
        const prevImage = new Image()
        prevImage.src = history[historyIndex - 1]
        prevImage.onload = () => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          ctx.drawImage(prevImage, 0, 0)
          setIsProcessing(false)
        }
      }
      return
    }

    const effect = blurEffects[selectedEffect]
    if (effect) {
      const radius = brushSize
      const intensityValue = intensity / 100
      const result = effect.apply(imageData, x, y, radius, intensityValue)
      ctx.putImageData(result, 0, 0)
      
      setTimeout(() => {
        saveHistory()
        setIsProcessing(false)
      }, 100)
    } else {
      setIsProcessing(false)
    }
  }

  const startDrawing = (e) => {
    if (isProcessing) return
    setIsDrawing(true)
    const pos = getPosition(e)
    applyBlur(pos.x, pos.y)
  }

  const draw = (e) => {
    if (!isDrawing || isProcessing) return
    const pos = getPosition(e)
    applyBlur(pos.x, pos.y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0 && ctx) {
      setHistoryIndex(prev => prev - 1)
      const img = new Image()
      img.src = history[historyIndex - 1]
      img.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(img, 0, 0)
        onImageUpdate(ctx.canvas.toDataURL())
      }
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && ctx) {
      setHistoryIndex(prev => prev + 1)
      const img = new Image()
      img.src = history[historyIndex + 1]
      img.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(img, 0, 0)
        onImageUpdate(ctx.canvas.toDataURL())
      }
    }
  }

  const handleSave = () => {
    if (ctx) {
      onImageUpdate(ctx.canvas.toDataURL())
    }
  }

  const handleDownload = () => {
    if (ctx) {
      const link = document.createElement('a')
      link.download = `blur-studio-art-${Date.now()}.png`
      link.href = ctx.canvas.toDataURL('image/png', 1.0)
      link.click()
    }
  }

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto px-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Canvas Box - Fixed Height */}
      <div className="bg-blue-600/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-blue-500/10 p-3">
        
        {/* Image Container */}
        <div className="relative w-full flex items-center justify-center bg-black/30 rounded-xl" 
             style={{ height: isMobile ? '240px' : '320px' }}>
          
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair touch-none rounded-lg"
            style={{ 
              touchAction: 'none',
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
          
          {/* Top Status */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
            <div className="flex gap-1 pointer-events-auto flex-wrap">
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[8px] rounded-full border border-white/10 flex items-center gap-1">
                <Brush className="w-2.5 h-2.5" /> {brushSize}
              </span>
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[8px] rounded-full border border-white/10 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> {intensity}%
              </span>
            </div>
            <div className="pointer-events-auto">
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[8px] rounded-full border border-white/10">
                {effects.find(e => e.id === selectedEffect)?.label}
              </span>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white/50 text-[7px] rounded-full border border-white/10 flex items-center gap-1">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
              {isProcessing ? '...' : (isMobile ? '👆 Tap & drag' : '🖱 Click & drag')}
            </span>
          </div>
        </div>
      </div>

      {/* Controls - All Visible */}
      <div className="mt-3 space-y-2">
        
        {/* Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-medium text-white/40 mr-1">Tools:</span>
          {['brush', 'eraser'].map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`
                px-2 py-0.5 rounded-lg text-[8px] font-medium transition-all
                ${tool === t 
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30' 
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
                }
              `}
            >
              {t === 'brush' ? '🖌' : '🧹'} {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Effects */}
        <div>
          <label className="text-[9px] font-medium text-white/50 flex items-center gap-1">
            <Palette className="w-3 h-3" /> Effects
          </label>
          <div className="grid grid-cols-3 gap-1 mt-0.5">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => {
                  setSelectedEffect(effect.id)
                  setTool('brush')
                }}
                className={`
                  px-1 py-1 rounded-lg text-[8px] font-medium transition-all
                  ${selectedEffect === effect.id
                    ? `bg-gradient-to-r ${effect.color} text-white shadow-md`
                    : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-2">
          <Slider
            label="Size"
            value={brushSize}
            onChange={setBrushSize}
            min={5}
            max={80}
            formatValue={(v) => `${v}`}
            size="sm"
          />
          <Slider
            label="Intensity"
            value={intensity}
            onChange={setIntensity}
            min={10}
            max={100}
            formatValue={(v) => `${v}%`}
            size="sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 border-t border-white/5">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white text-[8px] font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-0.5"
          >
            <Undo className="w-2.5 h-2.5" /> Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white text-[8px] font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-0.5"
          >
            <Redo className="w-2.5 h-2.5" /> Redo
          </button>
          
          <button
            onClick={handleDownload}
            className="px-3 py-0.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg text-[8px] font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-1 hover:scale-105 transition-all"
          >
            <Download className="w-2.5 h-2.5" /> Save
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-0.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-[8px] font-medium shadow-lg shadow-blue-500/20 flex items-center gap-1 hover:scale-105 transition-all"
          >
            <Save className="w-2.5 h-2.5" /> Done
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CanvasEditor