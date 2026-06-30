import { useEffect } from 'react'

export function useCanvasShortcuts({
  onUndo,
  onRedo,
  onSave,
  onReset,
  onDelete,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        onUndo?.()
      }
      
      // Ctrl+Shift+Z or Ctrl+Y: Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault()
        onRedo?.()
      }
      
      // Ctrl+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
      }
      
      // Escape: Reset
      if (e.key === 'Escape') {
        onReset?.()
      }
      
      // Delete or Backspace: Clear
      if (e.key === 'Delete' || e.key === 'Backspace') {
        onDelete?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onUndo, onRedo, onSave, onReset, onDelete])
}