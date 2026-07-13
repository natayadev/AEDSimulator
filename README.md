# AEDSimulator

⚡️ Interactive AED (Automated External Defibrillator) simulator built to teach first-aid protocol — how to recognize the need for defibrillation and follow the correct sequence of steps, with voice guidance and visual feedback.

## Overview

The simulator walks through the real AED protocol as a state machine:

`OFF → POWER_ON → CALL_911 → START → PLACE_PADS → ANALYZING → SHOCK_ADVISED / CPR → ANALYZING (loop)`

- **Voice guidance** via the Web Speech API (`SpeechSynthesisUtterance`, Spanish `es-ES`), narrating each step as in a real device.
- **Audio feedback** via Howler.js (metronome beeps for CPR compressions, device sounds).
- **Visual display** (`VisualDisplay.jsx`) showing device state, pad placement (drag-and-drop left/right pads), shock flash, and compression counter.
- Animations powered by Framer Motion; icons from lucide-react.

## Tech stack

- React 19 + Vite 7
- Tailwind CSS
- Framer Motion (animations)
- Howler.js (audio)
- Web Speech API (voice)

## Getting started

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Project structure

```text
src/
  App.jsx           Main component: state machine wiring, pad drag/drop, compression counter
  states.js          STEPS enum + reducer (protocol state machine)
  AudioManager.js    Howler-based sound effects / metronome
  VisualDisplay.jsx  Visual representation of the AED device and current step
public/audio/        Sound assets
```
