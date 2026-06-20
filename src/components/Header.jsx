function Header() {
  return (
    <header className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Blur<span className="text-blue-400">Studio</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/20">
              ✨ Pro
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header