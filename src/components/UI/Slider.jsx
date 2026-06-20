function Slider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  icon 
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <label className="text-sm font-medium text-vintage-700">
            {label}
          </label>
        </div>
        <span className="text-sm font-semibold text-vintage-600 bg-vintage-100 px-2 py-0.5 rounded-full">
          {value}%
        </span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          w-full h-2 rounded-lg appearance-none
          bg-vintage-200
          accent-vintage-600
          focus:outline-none focus:ring-2 focus:ring-vintage-400
        "
      />
    </div>
  )
}

export default Slider