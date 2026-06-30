import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { blurEffects } from '../utils/blurEffects'
import { 
  Save, 
  Brush, 
  Zap, 
  Undo, 
  Redo, 
  RotateCcw,
  Maximize,
  Minimize,
  Palette,
  Download,
  History,
  Trash2,
  Eraser
} from 'lucide-react'
import Button from './UI/Button'
import Slider from './UI/Slider'
import Card from './UI/Card'

function CanvasEditor({ image, onImageUpdate }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('pixel')
  const [brushSize, setBrushSize] = useState(30)
  const [intensity, setIntensity] = useState(50)
  const [ctx, setCtx] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [tool, setTool] = useState('brush')
  const [isProcessing, setIsProcessing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
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

  // Save history state
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
      // Get container width
      const container = canvas.parentElement
      const containerWidth = container.clientWidth || 800
      const maxWidth = Math.min(containerWidth - 20, 800)
      const maxHeight = isMobile ? 350 : 500
      
      let width = img.width
      let height = img.height

      // Scale to fit container
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
      setCanvasSize({ width, height })
      context.drawImage(img, 0, 0, width, height)
      
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
      const radius = tool === 'circle' || tool === 'rect' ? brushSize * 2 : brushSize
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

  const handleReset = () => {
    if (ctx && history.length > 0) {
      const img = new Image()
      img.src = history[0]
      img.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(img, 0, 0)
        setHistoryIndex(0)
        setHistory([history[0]])
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

  const clearCanvas = () => {
    if (ctx && window.confirm('Are you sure you want to clear all edits?')) {
      const img = new Image()
      img.src = history[0]
      img.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(img, 0, 0)
        setHistory([history[0]])
        setHistoryIndex(0)
        onImageUpdate(ctx.canvas.toDataURL())
      }
    }
  }

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Canvas Container - Fixed Height */}
      <Card 
        variant="dark" 
        padding="none" 
        rounded="xl" 
        className="overflow-hidden relative"
        glow="blue"
      >
        <div className="relative w-full overflow-hidden" style={{ maxHeight: isMobile ? '400px' : '550px' }}>
          <div className="w-full overflow-auto" style={{ maxHeight: isMobile ? '400px' : '550px' }}>
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
              style={{ 
                touchAction: 'none',
                width: '100%',
                height: 'auto',
                maxHeight: isMobile ? '350px' : '500px',
              }}
            />
          </div>
          
          {/* Top Status Bar - Responsive */}
          <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-center pointer-events-none">
            <div className="flex gap-1 sm:gap-2 pointer-events-auto flex-wrap">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-sm text-white text-[8px] sm:text-xs rounded-full font-medium border border-white/10 flex items-center gap-1">
                <Brush className="w-2 h-2 sm:w-3 sm:h-3" /> {brushSize}px
              </span>
              <span className="px-2 py-0.5 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-sm text-white text-[8px] sm:text-xs rounded-full font-medium border border-white/10 flex items-center gap-1">
                <Zap className="w-2 h-2 sm:w-3 sm:h-3" /> {intensity}%
              </span>
            </div>
            <div className="pointer-events-auto">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-sm text-white text-[8px] sm:text-xs rounded-full font-medium border border-white/10">
                {effects.find(e => e.id === selectedEffect)?.label || 'No Effect'}
              </span>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="px-2 py-1 sm:px-4 sm:py-2 bg-black/80 backdrop-blur-sm text-white/70 text-[8px] sm:text-xs rounded-full font-medium border border-white/10 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
              <span className="w-1 h-1 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
              {isProcessing ? 'Processing...' : (isMobile ? 'Tap & drag' : 'Click & drag to apply effect')}
            </span>
          </div>
        </div>
      </Card>

      {/* Controls Panel - Scrollable on Mobile */}
      <div className="max-h-[60vh] overflow-y-auto pb-4">
        <Card variant="default" padding={isMobile ? 'sm' : 'lg'} rounded="xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Toolbar - Horizontal Scroll on Mobile */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-white/5 pb-3 sm:pb-4 overflow-x-auto">
              <span className="text-[10px] sm:text-sm font-medium text-white/40 mr-1 sm:mr-2">Tools:</span>
              {['brush', 'eraser'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  className={`
                    px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap
                    ${tool === t 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-transparent'
                    }
                  `}
                >
                  {t === 'brush' && <Brush className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1" />}
                  {t === 'eraser' && <Eraser className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Effects Grid - 3 columns on mobile */}
            <div>
              <label className="text-[10px] sm:text-sm font-semibold text-white/80 block mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4" /> Choose Effect
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
                {effects.map((effect) => (
                  <button
                    key={effect.id}
                    onClick={() => {
                      setSelectedEffect(effect.id)
                      setTool('brush')
                    }}
                    className={`
                      px-1.5 sm:px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[8px] sm:text-xs font-medium
                      transition-all duration-200 relative overflow-hidden
                      ${selectedEffect === effect.id
                        ? `bg-gradient-to-r ${effect.color} text-white shadow-md scale-[1.02]`
                        : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <span className="relative z-10 text-[8px] sm:text-xs whitespace-nowrap">{effect.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              <Slider
                label="Brush Size"
                value={brushSize}
                onChange={setBrushSize}
                min={5}
                max={80}
                icon={<Brush className="w-3 h-3 sm:w-4 sm:h-4" />}
                formatValue={(v) => `${v}px`}
                color="vintage"
                size={isMobile ? 'sm' : 'md'}
              />

              <Slider
                label="Intensity"
                value={intensity}
                onChange={setIntensity}
                min={10}
                max={100}
                icon={<Zap className="w-3 h-3 sm:w-4 sm:h-4" />}
                color="purple"
                size={isMobile ? 'sm' : 'md'}
              />
            </div>

            {/* Action Buttons - Wrap on mobile */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 pt-3 sm:pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-[10px] sm:text-xs font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <Undo className="w-3 h-3 sm:w-4 sm:h-4" /> Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white text-[10px] sm:text-xs font-medium border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <Redo className="w-3 h-3 sm:w-4 sm:h-4" /> Redo
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">Save</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-medium shadow-lg shadow-blue-500/25 flex items-center gap-1 sm:gap-2 hover:scale-105 transition-all"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" /> 
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default CanvasEditor