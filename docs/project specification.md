# Harmony Blackboard Web App – MVP Specification

## Purpose

Create a lightweight web application used as a visual background for teaching harmony and music analysis during online or classroom lessons.

The application will display either:

1. Multiple empty grand staves (treble + bass clef) without notes
2. Imported sheet music (MusicXML, PDF, JPG, PNG)

The application is designed to be used together with a drawing tool such as Gink and a stylus tablet.
Teachers will write annotations manually over the screen.

The app itself does NOT need tools for entering notes or text.

---

# Core Concept

The application contains two visual layers:

1. Staff Layer (generated empty systems)
2. Sheet Music Layer (imported file)

A drawing tool such as Gink runs above the browser and captures stylus input.

Therefore the app must allow pointer events to pass through.

---

# Technology Stack

* React
* Vite
* VexFlow (for rendering staff systems)
* OpenSheetMusicDisplay (for MusicXML rendering)
* PDF.js (for PDF rendering)

No backend required.

---

# UI Layout

Top toolbar:

[ Staff ON/OFF ]
[ Sheet ON/OFF ]
[ Import Sheet ]
[ Remove Sheet ]
[ Zoom + ]
[ Zoom - ]

Main canvas area below toolbar.

---

# Staff Layer

When enabled, the app renders multiple piano-style systems.

Each system contains:

* Treble clef
* Bass clef

No notes.

The clefs should appear automatically on every system.

Between systems there must be extra vertical space to allow harmonic analysis writing.

Example layout:

Treble Staff
Bass Staff

(empty analysis space)

Treble Staff
Bass Staff

(empty analysis space)

Number of systems: default 6.

---

# Sheet Music Layer

Import button must support:

* MusicXML
* PDF
* JPG
* PNG

Behavior:

MusicXML → render using OpenSheetMusicDisplay
PDF → render using PDF.js
Image → render with standard <img>

Sheet layer appears above the staff layer.

---

# Zoom

Zoom applies to the entire score area.

Zoom In button increases scale by 10%.
Zoom Out button decreases scale by 10%.

Use CSS transform scale.

Zoom should affect both staff mode and sheet mode.

---

# Sheet Visibility

Sheet ON/OFF toggles the visibility of the imported sheet layer.

Remove Sheet button completely clears the sheet from memory.

---

# Pointer Behavior

All canvas and score elements must allow pointer events to pass through so that drawing software can capture stylus input.

CSS requirement:

pointer-events: none

This is critical.

---

# Performance Requirements

Application should load instantly.

Rendering staff systems must be fast enough for live teaching.

---

# Future Features (not required for MVP)

* Adjustable number of systems
* Export screenshot
* Collaborative real-time annotation
* Roman numeral harmonic labels
* MIDI playback

---

# Goal of MVP

Create a simple and stable visual score background for teaching harmony online.

No notation editing is required.
