# Harmony Blackboard – Feature Update (Brush Drawing + Export)

## Purpose

This document defines an additional feature update for the existing Harmony Blackboard web application.

The update introduces:

1. A stylus-compatible drawing layer (Brush + Eraser tools)
2. Exporting the entire score area as a PNG image

These features allow teachers to annotate harmony exercises directly within the application and export the annotated result.

---

# New Feature 1 – Drawing Layer

## Overview

Add a drawing canvas above all existing visual layers.

Current layer order becomes:

Staff Layer (VexFlow)
Sheet Layer (optional imported score)
Drawing Layer (Canvas for annotations)

The drawing layer must allow stylus drawing while keeping staff and sheet layers unchanged.

---

# Drawing Tools

Add drawing tools to the existing toolbar.

New toolbar controls:

Brush ON/OFF
Color: Black
Color: Blue
Color: Red
Color: Green
Eraser
Clear Drawing

---

# Brush Tool

The brush tool allows freehand drawing on the canvas.

Implementation requirements:

* Use HTML Canvas
* Support stylus and mouse input
* Use pointer events

Events:

pointerdown
pointermove
pointerup

Brush draws lines using the current selected color.

Default brush color: Black.

---

# Color Selection

Four available colors:

Black
Blue
Red
Green

Changing color updates the canvas drawing stroke style.

Example:

ctx.strokeStyle = selectedColor

---

# Eraser Tool

The eraser removes drawing strokes from the canvas.

Important:

The eraser must only affect the drawing layer.

It must NOT affect:

* Staff layer
* Sheet layer

Implementation suggestion:

ctx.globalCompositeOperation = "destination-out"

When switching back to brush:

ctx.globalCompositeOperation = "source-over"

---

# Clear Drawing

Add a "Clear Drawing" button.

This clears the entire drawing canvas.

It must NOT affect:

* Staff systems
* Imported sheet music

Implementation example:

ctx.clearRect(0, 0, canvas.width, canvas.height)

---

# Drawing Layer Behavior

The drawing canvas must:

* Always match the size of the score container
* Resize correctly when zoom changes
* Remain aligned with the staff and sheet layers

The drawing layer must remain the top visual layer.

---

# New Feature 2 – Export PNG

## Overview

Add a button that exports the entire score area as a PNG image.

This includes:

* Staff systems
* Imported sheet music
* Drawing annotations

The toolbar must NOT appear in the exported image.

---

# Export Button

Add toolbar button:

Export PNG

---

# Export Behavior

When clicked:

1. Capture the score container
2. Convert the capture into a PNG image
3. Trigger a file download

Suggested library:

html2canvas

---

# Export Requirements

Exported image must include:

Staff layer
Sheet layer
Drawing layer

Exported image must exclude:

Toolbar

---

# File Name

Suggested default file name:

harmony_board_export.png

---

# Performance

Drawing must remain responsive during stylus input.

Export should complete within a few seconds even with large drawings.

---

# Integration Notes

This feature update must integrate with the existing application architecture without modifying existing functionality.

Existing features such as:

Staff visibility
Sheet import
Zoom controls

must continue to work normally.

The drawing layer must properly scale with zoom and remain visually aligned with all score elements.
