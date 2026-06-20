// Vintage/Aesthetic Effects
export const vintageEffects = {
  // Sepia Tone - Old photo effect
  sepia: (imageData, intensity = 0.5) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i+1]
      const b = data[i+2]
      
      const tr = 0.393 * r + 0.769 * g + 0.189 * b
      const tg = 0.349 * r + 0.686 * g + 0.168 * b
      const tb = 0.272 * r + 0.534 * g + 0.131 * b
      
      data[i] = data[i] * (1 - intensity) + tr * intensity
      data[i+1] = data[i+1] * (1 - intensity) + tg * intensity
      data[i+2] = data[i+2] * (1 - intensity) + tb * intensity
    }
    return imageData
  },

  // Vintage Grain - Film noise effect
  grain: (imageData, intensity = 0.3) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 40 * intensity
      data[i] = Math.max(0, Math.min(255, data[i] + noise))
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise))
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise))
    }
    return imageData
  },

  // Vignette - Dark corners effect
  vignette: (imageData, intensity = 0.5) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    const centerX = width / 2
    const centerY = height / 2
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const dx = x - centerX
        const dy = y - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const factor = 1 - (dist / maxDist) * intensity
        
        data[idx] = data[idx] * factor
        data[idx+1] = data[idx+1] * factor
        data[idx+2] = data[idx+2] * factor
      }
    }
    return imageData
  },

  // Warm Vintage - Warm tone effect
  warmVintage: (imageData, intensity = 0.5) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + 20 * intensity)     // More red
      data[i+1] = data[i+1] * (1 - 0.1 * intensity)          // Less green
      data[i+2] = data[i+2] * (1 - 0.2 * intensity)          // Less blue
    }
    return imageData
  },

  // Cold Vintage - Cool tone effect
  coldVintage: (imageData, intensity = 0.5) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * (1 - 0.2 * intensity)              // Less red
      data[i+1] = data[i+1] * (1 - 0.1 * intensity)          // Less green
      data[i+2] = Math.min(255, data[i+2] + 20 * intensity)  // More blue
    }
    return imageData
  },

  // Retro Glow - Soft dreamy glow
  retroGlow: (imageData, intensity = 0.5) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const glow = 30 * intensity
      data[i] = Math.min(255, data[i] + glow * 0.3)
      data[i+1] = Math.min(255, data[i+1] + glow * 0.5)
      data[i+2] = Math.min(255, data[i+2] + glow * 0.7)
    }
    return imageData
  },

  // Old Paper - Yellowish paper texture
  oldPaper: (imageData, intensity = 0.4) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const paperColor = [235, 215, 180] // Warm paper color
      const blend = intensity * 0.3
      data[i] = data[i] * (1 - blend) + paperColor[0] * blend
      data[i+1] = data[i+1] * (1 - blend) + paperColor[1] * blend
      data[i+2] = data[i+2] * (1 - blend) + paperColor[2] * blend
      
      // Add paper texture
      const texture = (Math.random() - 0.5) * 15 * intensity
      data[i] = Math.max(0, Math.min(255, data[i] + texture))
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + texture))
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + texture))
    }
    return imageData
  },

  // Dreamy - Soft dreamy blur with glow
  dreamy: (imageData, intensity = 0.5) => {
    const data = imageData.data
    const width = imageData.width
    const height = imageData.height
    
    // First apply a soft blur
    const tempData = new Uint8ClampedArray(data)
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        let r = 0, g = 0, b = 0, count = 0
        
        // Simple 3x3 blur
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const sx = x + dx
            const sy = y + dy
            const srcIdx = (sy * width + sx) * 4
            r += tempData[srcIdx]
            g += tempData[srcIdx+1]
            b += tempData[srcIdx+2]
            count++
          }
        }
        
        r /= count
        g /= count
        b /= count
        
        // Blend with original
        const blend = intensity * 0.4
        data[idx] = data[idx] * (1 - blend) + r * blend
        data[idx+1] = data[idx+1] * (1 - blend) + g * blend
        data[idx+2] = data[idx+2] * (1 - blend) + b * blend
        
        // Add subtle glow
        const glow = 20 * intensity
        data[idx] = Math.min(255, data[idx] + glow * 0.2)
        data[idx+1] = Math.min(255, data[idx+1] + glow * 0.3)
        data[idx+2] = Math.min(255, data[idx+2] + glow * 0.5)
      }
    }
    return imageData
  }
}