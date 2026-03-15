import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'
import Toolbar from './components/Toolbar'
import StaffLayer from './components/StaffLayer'
import SheetLayer from './components/SheetLayer'
import DrawingLayer from './components/DrawingLayer'
import './App.css'

const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const ZOOM_STEP = 0.1

function detectSheetType(file) {
  const name = (file.name || '').toLowerCase()
  const mime = file.type || ''
  if (name.endsWith('.xml') || name.endsWith('.musicxml') || mime.includes('musicxml')) {
    return 'musicxml'
  }
  if (name.endsWith('.pdf') || mime === 'application/pdf') {
    return 'pdf'
  }
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || mime === 'image/jpeg') {
    return 'image'
  }
  if (name.endsWith('.png') || mime === 'image/png') {
    return 'image'
  }
  return null
}

function App() {
  const drawingLayerRef = useRef(null)
  const scoreAreaRef = useRef(null)
  const [toolbarOpen, setToolbarOpen] = useState(true)
  const [staffOn, setStaffOn] = useState(true)
  const [sheetOn, setSheetOn] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [brushOn, setBrushOn] = useState(false)
  const [brushColor, setBrushColor] = useState('#000000')
  const [eraserOn, setEraserOn] = useState(false)
  const [exportContentHeight, setExportContentHeight] = useState(1428)

  const tool = eraserOn ? 'eraser' : brushOn ? 'brush' : 'off'

  const handleImportSheet = useCallback((file) => {
    const type = detectSheetType(file)
    if (!type) {
      console.warn('Unsupported file type:', file.name)
      return
    }
    const reader = type === 'musicxml' ? new FileReader() : new FileReader()
    if (type === 'musicxml') {
      reader.onload = () => {
        setSheet({ type: 'musicxml', data: reader.result })
        setSheetOn(true)
      }
      reader.readAsText(file)
    } else {
      reader.onload = () => {
        setSheet({ type, data: reader.result })
        setSheetOn(true)
      }
      reader.readAsArrayBuffer(file)
    }
  }, [])

  const handleRemoveSheet = useCallback(() => {
    setSheet(null)
    setSheetOn(false)
    setExportContentHeight(1428)
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN))
  }, [])

  const handleBrushToggle = useCallback(() => {
    setBrushOn((v) => !v)
    setEraserOn(false)
  }, [])

  const handleColorSelect = useCallback((color) => {
    setBrushColor(color)
  }, [])

  const handleEraserToggle = useCallback(() => {
    setEraserOn((v) => !v)
    setBrushOn(false)
  }, [])

  const handleClearDrawing = useCallback(() => {
    drawingLayerRef.current?.clear()
  }, [])

  const handleExportPng = useCallback(async () => {
    const el = scoreAreaRef.current
    if (!el) return
    try {
      await document.fonts.ready
      const canvas = await html2canvas(el, { useCORS: true, allowTaint: true, scale: 1 })
      const link = document.createElement('a')
      link.download = 'harmony_board_export.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }, [])

  return (
    <div className="app">
      {toolbarOpen ? (
        <Toolbar
          staffOn={staffOn}
          sheetOn={sheetOn}
          sheet={sheet}
          zoom={zoom}
          onStaffToggle={() => setStaffOn((v) => !v)}
          onSheetToggle={() => setSheetOn((v) => !v)}
          onImportSheet={handleImportSheet}
          onRemoveSheet={handleRemoveSheet}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onHideToolbar={() => setToolbarOpen(false)}
          brushOn={brushOn}
          onBrushToggle={handleBrushToggle}
          brushColor={brushColor}
          onColorSelect={handleColorSelect}
          eraserOn={eraserOn}
          onEraserToggle={handleEraserToggle}
          onClearDrawing={handleClearDrawing}
          onExportPng={handleExportPng}
        />
      ) : (
        <button
          type="button"
          className="toolbar-toggle"
          onClick={() => setToolbarOpen(true)}
          aria-label="Show menu"
          style={{ pointerEvents: 'auto' }}
        >
          &#9776;
        </button>
      )}
      <div className="score-area-wrap">
        <div
          ref={scoreAreaRef}
          className="score-area-scaled"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            minHeight: exportContentHeight,
          }}
        >
          <StaffLayer visible={staffOn} />
          <SheetLayer
            visible={sheetOn}
            sheet={sheet}
            onSheetContentHeight={(height) =>
              setExportContentHeight((h) => Math.max(1428, height))
            }
          />
          <DrawingLayer ref={drawingLayerRef} tool={tool} brushColor={brushColor} />
        </div>
      </div>
    </div>
  )
}

export default App
