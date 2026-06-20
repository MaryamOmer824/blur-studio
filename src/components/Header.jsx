import { Sparkles } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-vintage-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <h1 className="text-2xl font-bold text-vintage-800">
              Blur Studio Pro
            </h1>
            <span className="hidden sm:inline-block px-2 py-1 bg-vintage-100 text-vintage-600 text-xs rounded-full font-medium">
              Beta
            </span>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-vintage-400" />
            <span className="text-sm text-vintage-500 hidden sm:inline">
              Vintage Aesthetic
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header