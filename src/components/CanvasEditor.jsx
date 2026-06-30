// Add these styles to CanvasEditor for mobile responsiveness

// In the canvas container div, add:
<div className="relative w-full overflow-auto" style={{ touchAction: 'none' }}>
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
      minHeight: '300px', 
      maxHeight: '60vh',
      touchAction: 'none',
      width: '100%',
      height: 'auto',
    }}
  />
</div>