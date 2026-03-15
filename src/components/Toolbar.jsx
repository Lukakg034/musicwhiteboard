function Toolbar({
  staffOn,
  sheetOn,
  sheet,
  zoom,
  onStaffToggle,
  onSheetToggle,
  onImportSheet,
  onRemoveSheet,
  onZoomIn,
  onZoomOut,
  onHideToolbar,
  brushOn,
  onBrushToggle,
  brushColor,
  onColorSelect,
  eraserOn,
  onEraserToggle,
  onClearDrawing,
  onExportPng,
}) {
  const hasSheet = sheet !== null

  return (
    <header className="toolbar" style={{ pointerEvents: 'auto' }}>
      {onHideToolbar && (
        <button
          type="button"
          className="toolbar-btn toolbar-hide"
          onClick={onHideToolbar}
          aria-label="Hide toolbar"
        >
          &#9776;
        </button>
      )}
      <button
        type="button"
        className="toolbar-btn"
        onClick={onStaffToggle}
        aria-pressed={staffOn}
      >
        Staff {staffOn ? 'ON' : 'OFF'}
      </button>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onSheetToggle}
        disabled={!hasSheet}
        aria-pressed={sheetOn}
      >
        Sheet {sheetOn ? 'ON' : 'OFF'}
      </button>
      <label className="toolbar-btn toolbar-btn-label">
        Import Sheet
        <input
          type="file"
          accept=".xml,.musicxml,.pdf,.jpg,.jpeg,.png,application/vnd.recordare.musicxml+xml,application/pdf,image/jpeg,image/png"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            onImportSheet(file)
            e.target.value = ''
          }}
          aria-label="Import sheet music"
        />
      </label>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onRemoveSheet}
        disabled={!hasSheet}
      >
        Remove Sheet
      </button>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onBrushToggle}
        aria-pressed={brushOn}
      >
        Brush {brushOn ? 'ON' : 'OFF'}
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-color"
        onClick={() => onColorSelect?.('#000000')}
        aria-pressed={brushColor === '#000000'}
        aria-label="Color Black"
        title="Black"
      >
        <span className="toolbar-swatch" style={{ background: '#000000' }} />
        Black
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-color"
        onClick={() => onColorSelect?.('#0000ff')}
        aria-pressed={brushColor === '#0000ff'}
        aria-label="Color Blue"
        title="Blue"
      >
        <span className="toolbar-swatch" style={{ background: '#0000ff' }} />
        Blue
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-color"
        onClick={() => onColorSelect?.('#ff0000')}
        aria-pressed={brushColor === '#ff0000'}
        aria-label="Color Red"
        title="Red"
      >
        <span className="toolbar-swatch" style={{ background: '#ff0000' }} />
        Red
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-color"
        onClick={() => onColorSelect?.('#008000')}
        aria-pressed={brushColor === '#008000'}
        aria-label="Color Green"
        title="Green"
      >
        <span className="toolbar-swatch" style={{ background: '#008000' }} />
        Green
      </button>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onEraserToggle}
        aria-pressed={eraserOn}
        aria-label="Eraser"
      >
        Eraser
      </button>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onClearDrawing}
        aria-label="Clear Drawing"
      >
        Clear Drawing
      </button>
      <button
        type="button"
        className="toolbar-btn"
        onClick={onExportPng}
        aria-label="Export PNG"
      >
        Export PNG
      </button>
      <button type="button" className="toolbar-btn" onClick={onZoomIn} aria-label="Zoom in">
        Zoom +
      </button>
      <button type="button" className="toolbar-btn" onClick={onZoomOut} aria-label="Zoom out">
        Zoom -
      </button>
      <span className="toolbar-zoom">{Math.round(zoom * 100)}%</span>
    </header>
  )
}

export default Toolbar
