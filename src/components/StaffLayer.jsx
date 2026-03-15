import { useEffect, useRef, useState } from 'react'
import VexFlow from 'vexflow'

const { Renderer, Stave, StaveConnector } = VexFlow
const SVG = Renderer.Backends.SVG

const FALLBACK_WIDTH = 800
const SYSTEMS_COUNT = 6
/** Extra vertical space between systems for harmonic analysis annotations */
const ANALYSIS_GAP = 48

function StaffLayer({ visible }) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        requestAnimationFrame(() => {
          setContainerWidth(entry.contentRect.width)
        })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  useEffect(() => {
    if (!visible || !containerRef.current) return

    const width = containerWidth || FALLBACK_WIDTH
    if (width <= 0) return

    const container = containerRef.current
    container.innerHTML = ''

    const singleStaveHeight = 90
    const gapBetweenStaves = 10
    const grandStaffHeight = singleStaveHeight * 2 + gapBetweenStaves
    const systemHeight = grandStaffHeight + ANALYSIS_GAP
    const totalHeight = SYSTEMS_COUNT * systemHeight
    const staffWidth = width - 20

    const context = Renderer.buildContext(container, SVG, width, totalHeight)
    const ctx = context

    let y = 10

    for (let i = 0; i < SYSTEMS_COUNT; i++) {
      const trebleStave = new Stave(10, y, staffWidth, { rightBar: false })
      trebleStave.addClef('treble')
      trebleStave.setContext(ctx).draw()

      const bassY = y + singleStaveHeight + gapBetweenStaves
      const bassStave = new Stave(10, bassY, staffWidth, { rightBar: false })
      bassStave.addClef('bass')
      bassStave.setContext(ctx).draw()

      const braceConnector = new StaveConnector(trebleStave, bassStave)
      braceConnector.setType('brace')
      braceConnector.setContext(ctx).draw()

      const singleConnector = new StaveConnector(trebleStave, bassStave)
      singleConnector.setType('single')
      singleConnector.setContext(ctx).draw()

      y += systemHeight
    }

    return () => {
      container.innerHTML = ''
    }
  }, [visible, containerWidth])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="staff-layer"
      style={{ pointerEvents: 'none' }}
      aria-hidden
    />
  )
}

export default StaffLayer
