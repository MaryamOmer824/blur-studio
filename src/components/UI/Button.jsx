function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'bg-vintage-600 hover:bg-vintage-700 text-white',
    secondary: 'bg-vintage-200 hover:bg-vintage-300 text-vintage-800',
    outline: 'border-2 border-vintage-600 text-vintage-600 hover:bg-vintage-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  }

  return (
    <button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-xl font-medium
        transition-all duration-300
        hover:scale-[1.02] active:scale-[0.98]
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button