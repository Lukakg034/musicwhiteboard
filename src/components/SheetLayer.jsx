import { useEffect, useRef, useState } from 'react'
import { getDocument } from 'pdfjs-dist'
import OpenSheetMusicDisplay from 'opensheetmusicdisplay'

function SheetLayer({ visible, sheet, onSheetContentHeight }) {
  const containerRef = useRef(null)
  const osmdRef = useRef(null)
  const [imageUrl, setImageUrl] = useState(null)
  const pdfWrapperRef = useRef(null)
  const pdfCancelledRef = useRef(false)

  const showContent = visible && sheet !== null

  useEffect(() => {
    if (!showContent || !sheet || !containerRef.current) return

    const container = containerRef.current
    const type = sheet.type
    const data = sheet.data

    if (type === 'musicxml') {
      container.innerHTML = ''
      try {
        const osmd = new OpenSheetMusicDisplay(container, { autoResize: false })
        osmdRef.current = osmd
        const content = typeof data === 'string' ? data : new Blob([data])
        osmd.load(content).then(() => {
          osmd.render()
        }).catch((err) => {
          console.error('OSMD load error:', err)
        })
      } catch (err) {
        console.error('OSMD init error:', err)
      }
      return () => {
        if (osmdRef.current) {
          osmdRef.current.clear()
          osmdRef.current = null
        }
        container.innerHTML = ''
      }
    }

    if (type === 'pdf') {
      container.innerHTML = ''
      pdfCancelledRef.current = false
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'pointer-events: none; display: flex; flex-direction: column; width: 100%;'
      container.appendChild(wrapper)
      pdfWrapperRef.current = wrapper

      const scale = 1.5
      getDocument({ data }).promise
        .then((pdf) => {
          if (pdfCancelledRef.current) return null
          const numPages = pdf.numPages
          const pagePromises = []
          for (let i = 1; i <= Math.min(1, numPages); i++) {
            pagePromises.push(pdf.getPage(i))
          }
          return Promise.all(pagePromises).then((pages) => {
            if (pdfCancelledRef.current) return null
            let totalHeight = 0
            const viewports = pages.map((page) => {
              const viewport = page.getViewport({ scale })
              totalHeight += viewport.height
              return { page, viewport }
            })
            const renderPromises = viewports.map(({ page, viewport }) => {
              const canvas = document.createElement('canvas')
              canvas.style.pointerEvents = 'none'
              canvas.style.maxWidth = '100%'
              canvas.style.height = 'auto'
              canvas.style.display = 'block'
              canvas.width = viewport.width
              canvas.height = viewport.height
              const ctx = canvas.getContext('2d')
              wrapper.appendChild(canvas)
              return page.render({ canvasContext: ctx, viewport }).promise
            })
            return Promise.all(renderPromises).then(() =>
              pdfCancelledRef.current ? null : totalHeight
            )
          })
        })
        .then((totalHeight) => {
          if (totalHeight != null && typeof onSheetContentHeight === 'function') {
            onSheetContentHeight(totalHeight)
          }
        })
        .catch((err) => {
          console.error('PDF render error:', err)
        })

      return () => {
        pdfCancelledRef.current = true
        if (pdfWrapperRef.current && pdfWrapperRef.current.parentNode) {
          pdfWrapperRef.current.parentNode.removeChild(pdfWrapperRef.current)
        }
        pdfWrapperRef.current = null
      }
    }

    if (type === 'image') {
      const url = URL.createObjectURL(new Blob([data]))
      setImageUrl(url)
      return () => {
        URL.revokeObjectURL(url)
        setImageUrl(null)
      }
    }
  }, [showContent, sheet?.type, sheet?.data])

  if (!showContent) {
    return (
      <div
        className="sheet-layer"
        style={{ pointerEvents: 'none' }}
        aria-hidden
      />
    )
  }

  if (sheet?.type === 'image') {
    if (imageUrl) {
      return (
        <div
          className="sheet-layer"
          style={{ pointerEvents: 'none' }}
          aria-hidden
        >
          <img
            src={imageUrl}
            alt=""
            style={{ pointerEvents: 'none', maxWidth: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      )
    }
    return (
      <div className="sheet-layer" style={{ pointerEvents: 'none' }} aria-hidden />
    )
  }

  if (sheet?.type === 'pdf' || sheet?.type === 'musicxml') {
    return (
      <div
        ref={containerRef}
        className="sheet-layer"
        style={{ pointerEvents: 'none' }}
        aria-hidden
      />
    )
  }

  return (
    <div className="sheet-layer" style={{ pointerEvents: 'none' }} aria-hidden />
  )
}

export default SheetLayer
