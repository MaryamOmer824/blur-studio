function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-white/80 backdrop-blur-sm
      rounded-2xl shadow-lg
      border border-white/20
      p-6
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card