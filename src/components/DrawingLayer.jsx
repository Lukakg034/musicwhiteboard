import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const BRUSH_LINE_WIDTH = 2
const ERASER_LINE_WIDTH = 20

function getCanvasCoords(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

const DrawingLayer = forwardRef(function DrawingLayer({ tool, brushColor }, ref) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
  }), [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      const w = Math.max(1, Math.floor(width))
      const h = Math.max(1, Math.floor(height))
      requestAnimationFrame(() => {
        canvas.width = w
        canvas.height = h
      })
    })
    observer.observe(wrapper)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const startStroke = (e) => {
      if (tool !== 'brush' && tool !== 'eraser') return
      e.preventDefault()
      isDrawingRef.current = true
      canvas.setPointerCapture(e.pointerId)
      const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY)
      if (tool === 'brush') {
        ctx.strokeStyle = brushColor
        ctx.globalCompositeOperation = 'source-over'
        ctx.lineWidth = BRUSH_LINE_WIDTH
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,1)'
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = ERASER_LINE_WIDTH
      }
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    const moveStroke = (e) => {
      if (!isDrawingRef.current) return
      e.preventDefault()
      const { x, y } = getCanvasCoords(canvas, e.clientX, e.clientY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    const endStroke = (e) => {
      if (!isDrawingRef.current) return
      e.preventDefault()
      isDrawingRef.current = false
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (_) {}
    }

    canvas.addEventListener('pointerdown', startStroke)
    canvas.addEventListener('pointermove', moveStroke)
    canvas.addEventListener('pointerup', endStroke)
    canvas.addEventListener('pointercancel', endStroke)

    return () => {
      canvas.removeEventListener('pointerdown', startStroke)
      canvas.removeEventListener('pointermove', moveStroke)
      canvas.removeEventListener('pointerup', endStroke)
      canvas.removeEventListener('pointercancel', endStroke)
    }
  }, [tool, brushColor])

  return (
    <div ref={wrapperRef} className="drawing-layer">
      <canvas ref={canvasRef} className="drawing-canvas" />
    </div>
  )
})

export default DrawingLayer
