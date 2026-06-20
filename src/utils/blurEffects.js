// Blur Effects Library
export const blurEffects = {
  watery: {
    name: '💧 Watery Blur',
    apply: (imageData, x, y, radius, intensity) => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const effectRadius = radius * intensity * 0.5
      
      for (let dy = -effectRadius; dy <= effectRadius; dy++) {
        for (let dx = -effectRadius; dx <= effectRadius; dx++) {
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist > effectRadius) continue
          
          const px = Math.floor(x + dx)
          const py = Math.floor(y + dy)
          if (px < 0 || px >= width || py < 0 || py >= height) continue
          
          const ripple = Math.sin(dist * 0.5) * 2
          const sx = px + ripple * (dx / (dist || 1))
          const sy = py + ripple * (dy / (dist || 1))
          
          if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
            const srcIdx = (Math.floor(sy) * width + Math.floor(sx)) * 4
            const dstIdx = (py * width + px) * 4
            const blend = intensity * 0.3
            data[dstIdx] = data[srcIdx] * (1 - blend) + (data[srcIdx] + Math.random() * 10) * blend
            data[dstIdx+1] = data[srcIdx+1] * (1 - blend) + (data[srcIdx+1] + Math.random() * 10) * blend
            data[dstIdx+2] = data[srcIdx+2] * (1 - blend) + (data[srcIdx+2] + Math.random() * 10) * blend
          }
        }
      }
      return imageData
    }
  },
  
  scratch: {
    name: '🧱 Scratch Blur',
    apply: (imageData, x, y, radius, intensity) => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const scratchRadius = radius * intensity * 0.3
      const numScratches = Math.floor(intensity * 15) + 5
      
      for (let i = 0; i < numScratches; i++) {
        const angle = Math.random() * Math.PI * 2
        const length = scratchRadius * (0.3 + Math.random() * 0.7)
        const startX = x + Math.cos(angle) * scratchRadius * 0.5
        const startY = y + Math.sin(angle) * scratchRadius * 0.5
        
        for (let t = 0; t < length; t += 0.5) {
          const px = Math.floor(startX + Math.cos(angle) * t)
          const py = Math.floor(startY + Math.sin(angle) * t)
          if (px < 0 || px >= width || py < 0 || py >= height) continue
          const idx = (py * width + px) * 4
          const brightness = 0.3 + Math.random() * 0.7
          const factor = intensity * 0.3
          data[idx] = data[idx] * 0.5 + 128 * brightness * factor
          data[idx+1] = data[idx+1] * 0.5 + 128 * brightness * factor
          data[idx+2] = data[idx+2] * 0.5 + 128 * brightness * factor
        }
      }
      return imageData
    }
  },
  
  pixel: {
    name: '🔲 Pixel Blur',
    apply: (imageData, x, y, radius, intensity) => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const pixelSize = Math.max(2, Math.floor(radius * intensity * 0.3))
      
      for (let dy = -radius; dy <= radius; dy += pixelSize) {
        for (let dx = -radius; dx <= radius; dx += pixelSize) {
          const px = Math.floor(x + dx)
          const py = Math.floor(y + dy)
          if (px < 0 || px >= width || py < 0 || py >= height) continue
          
          let r = 0, g = 0, b = 0, count = 0
          for (let py2 = py; py2 < py + pixelSize && py2 < height; py2++) {
            for (let px2 = px; px2 < px + pixelSize && px2 < width; px2++) {
              const idx = (py2 * width + px2) * 4
              r += data[idx]; g += data[idx+1]; b += data[idx+2]; count++
            }
          }
          if (count > 0) {
            r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count)
            for (let py2 = py; py2 < py + pixelSize && py2 < height; py2++) {
              for (let px2 = px; px2 < px + pixelSize && px2 < width; px2++) {
                const idx = (py2 * width + px2) * 4
                data[idx] = r; data[idx+1] = g; data[idx+2] = b
              }
            }
          }
        }
      }
      return imageData
    }
  },
  
  fog: {
    name: '🌫 Fog Blur',
    apply: (imageData, x, y, radius, intensity) => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const fogRadius = radius * intensity * 0.4
      
      for (let dy = -fogRadius; dy <= fogRadius; dy++) {
        for (let dx = -fogRadius; dx <= fogRadius; dx++) {
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist > fogRadius) continue
          const px = Math.floor(x + dx); const py = Math.floor(y + dy)
          if (px < 0 || px >= width || py < 0 || py >= height) continue
          const idx = (py * width + px) * 4
          const fogFactor = (1 - dist / fogRadius) * intensity * 0.4
          const fogColor = 200 + Math.random() * 55
          data[idx] = data[idx] * (1 - fogFactor) + fogColor * fogFactor
          data[idx+1] = data[idx+1] * (1 - fogFactor) + fogColor * fogFactor
          data[idx+2] = data[idx+2] * (1 - fogFactor) + fogColor * fogFactor
        }
      }
      return imageData
    }
  },
  
  glass: {
    name: '✨ Glass Blur',
    apply: (imageData, x, y, radius, intensity) => {
      const data = imageData.data
      const width = imageData.width
      const height = imageData.height
      const glassRadius = radius * intensity * 0.4
      
      for (let dy = -glassRadius; dy <= glassRadius; dy++) {
        for (let dx = -glassRadius; dx <= glassRadius; dx++) {
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist > glassRadius) continue
          const px = Math.floor(x + dx); const py = Math.floor(y + dy)
          if (px < 0 || px >= width || py < 0 || py >= height) continue
          const idx = (py * width + px) * 4
          const glassFactor = (1 - dist / glassRadius) * intensity * 0.3
          const shiftX = Math.sin(dy * 0.1) * 3
          const shiftY = Math.cos(dx * 0.1) * 3
          const srcX = Math.max(0, Math.min(width - 1, px + shiftX))
          const srcY = Math.max(0, Math.min(height - 1, py + shiftY))
          const srcIdx = (srcY * width + srcX) * 4
          data[idx] = data[srcIdx] * (1 - glassFactor * 0.3) + Math.min(255, data[srcIdx] + 40) * glassFactor * 0.3
          data[idx+1] = data[srcIdx+1] * (1 - glassFactor * 0.3) + Math.min(255, data[srcIdx+1] + 40) * glassFactor * 0.3
          data[idx+2] = data[srcIdx+2] * (1 - glassFactor * 0.3) + Math.min(255, data[srcIdx+2] + 40) * glassFactor * 0.3
        }
      }
      return imageData
    }
  },
  
 motion: {
  name: '🌀 Motion Blur',
  apply: (imageData, x, y, radius, intensity) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    const motionRadius = Math.max(5, radius * intensity * 0.3)
    
    // Motion direction from center
    const centerX = width / 2
    const centerY = height / 2
    const angle = Math.atan2(y - centerY, x - centerX)
    
    for (let dy = -motionRadius; dy <= motionRadius; dy++) {
      for (let dx = -motionRadius; dx <= motionRadius; dx++) {
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist > motionRadius) continue
        
        const px = Math.floor(x + dx)
        const py = Math.floor(y + dy)
        if (px < 0 || px >= width || py < 0 || py >= height) continue
        
        let r = 0, g = 0, b = 0, count = 0
        const steps = Math.floor(intensity * 8) + 4
        
        for (let i = 0; i < steps; i++) {
          const t = (i / steps) * dist * 0.5
          const sx = Math.floor(px + Math.cos(angle) * t)
          const sy = Math.floor(py + Math.sin(angle) * t)
          
          if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
            const idx = (sy * width + sx) * 4
            r += data[idx]
            g += data[idx+1]
            b += data[idx+2]
            count++
          }
        }
        
        if (count > 0) {
          const idx = (py * width + px) * 4
          data[idx] = Math.floor(r / count)
          data[idx+1] = Math.floor(g / count)
          data[idx+2] = Math.floor(b / count)
        }
      }
    }
    return imageData
  }
}
}