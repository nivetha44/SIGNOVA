// Canonical 2D Hand Landmark Keyframes & Motion Paths for Indian Sign Language (ISL) Signs
// Coordinates normalized in [0, 100] coordinate space representing the 21 MediaPipe hand landmarks:
// 0: Wrist
// 1-4: Thumb (1: CMC, 2: MCP, 3: IP, 4: TIP)
// 5-8: Index (5: MCP, 6: PIP, 7: DIP, 8: TIP)
// 9-12: Middle (9: MCP, 10: PIP, 11: DIP, 12: TIP)
// 13-16: Ring (13: MCP, 14: PIP, 15: DIP, 16: TIP)
// 17-20: Pinky (17: MCP, 18: PIP, 19: DIP, 20: TIP)

export const DEFAULT_OPEN_PALM = [
  { x: 50, y: 88 }, // 0: Wrist
  { x: 38, y: 78 }, { x: 30, y: 68 }, { x: 25, y: 58 }, { x: 22, y: 50 }, // 1-4 Thumb
  { x: 42, y: 60 }, { x: 40, y: 44 }, { x: 39, y: 32 }, { x: 38, y: 20 }, // 5-8 Index
  { x: 50, y: 58 }, { x: 50, y: 40 }, { x: 50, y: 26 }, { x: 50, y: 14 }, // 9-12 Middle
  { x: 58, y: 60 }, { x: 60, y: 44 }, { x: 61, y: 32 }, { x: 62, y: 22 }, // 13-16 Ring
  { x: 65, y: 64 }, { x: 68, y: 52 }, { x: 70, y: 42 }, { x: 72, y: 32 }, // 17-20 Pinky
]

export const GESTURE_ANIMATIONS = {
  HELLO: {
    name: 'HELLO',
    description: 'Open palm raised at temple, waving gently side-to-side',
    motionArrow: { from: { x: 40, y: 20 }, to: { x: 65, y: 20 }, type: 'wave' },
    frames: [
      // Frame 1: Tilt left
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x - 6, y: p.y - 2 })),
      // Frame 2: Neutral center
      DEFAULT_OPEN_PALM,
      // Frame 3: Tilt right
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x + 8, y: p.y - 2 })),
      // Frame 4: Neutral center
      DEFAULT_OPEN_PALM,
    ],
    duration: 1.4,
  },

  'THANK YOU': {
    name: 'THANK YOU',
    description: 'Flat palm touches chin, then moves forward and slightly downward',
    motionArrow: { from: { x: 50, y: 40 }, to: { x: 50, y: 75 }, type: 'forward' },
    frames: [
      // Frame 1: Up at chin
      [
        { x: 50, y: 55 },
        { x: 40, y: 50 }, { x: 34, y: 44 }, { x: 30, y: 38 }, { x: 28, y: 34 },
        { x: 44, y: 42 }, { x: 43, y: 32 }, { x: 42, y: 24 }, { x: 42, y: 16 },
        { x: 50, y: 40 }, { x: 50, y: 30 }, { x: 50, y: 20 }, { x: 50, y: 12 },
        { x: 56, y: 42 }, { x: 57, y: 32 }, { x: 58, y: 24 }, { x: 58, y: 16 },
        { x: 62, y: 45 }, { x: 64, y: 36 }, { x: 66, y: 28 }, { x: 68, y: 22 },
      ],
      // Frame 2: Extended forward and downward
      [
        { x: 50, y: 78 },
        { x: 38, y: 70 }, { x: 30, y: 62 }, { x: 24, y: 56 }, { x: 20, y: 50 },
        { x: 44, y: 56 }, { x: 43, y: 46 }, { x: 42, y: 38 }, { x: 42, y: 30 },
        { x: 50, y: 54 }, { x: 50, y: 44 }, { x: 50, y: 34 }, { x: 50, y: 24 },
        { x: 56, y: 56 }, { x: 57, y: 46 }, { x: 58, y: 38 }, { x: 58, y: 30 },
        { x: 62, y: 59 }, { x: 64, y: 50 }, { x: 66, y: 42 }, { x: 68, y: 36 },
      ],
    ],
    duration: 1.6,
  },

  YES: {
    name: 'YES',
    description: 'Fist nodding up and down like a head nodding agreement',
    motionArrow: { from: { x: 50, y: 45 }, to: { x: 50, y: 65 }, type: 'nod' },
    frames: [
      // Frame 1: Fist tilted up
      [
        { x: 50, y: 75 },
        { x: 38, y: 70 }, { x: 34, y: 64 }, { x: 36, y: 58 }, { x: 44, y: 56 }, // Thumb over fingers
        { x: 44, y: 58 }, { x: 44, y: 50 }, { x: 48, y: 54 }, { x: 48, y: 60 }, // Index curled
        { x: 50, y: 58 }, { x: 50, y: 48 }, { x: 52, y: 54 }, { x: 52, y: 60 }, // Middle curled
        { x: 56, y: 60 }, { x: 56, y: 50 }, { x: 56, y: 56 }, { x: 56, y: 62 }, // Ring curled
        { x: 62, y: 62 }, { x: 62, y: 54 }, { x: 60, y: 60 }, { x: 58, y: 64 }, // Pinky curled
      ],
      // Frame 2: Fist tilted down
      [
        { x: 50, y: 88 },
        { x: 38, y: 82 }, { x: 34, y: 76 }, { x: 36, y: 70 }, { x: 44, y: 68 },
        { x: 44, y: 70 }, { x: 44, y: 62 }, { x: 48, y: 66 }, { x: 48, y: 72 },
        { x: 50, y: 70 }, { x: 50, y: 60 }, { x: 52, y: 66 }, { x: 52, y: 72 },
        { x: 56, y: 72 }, { x: 56, y: 62 }, { x: 56, y: 68 }, { x: 56, y: 74 },
        { x: 62, y: 74 }, { x: 62, y: 66 }, { x: 60, y: 72 }, { x: 58, y: 76 },
      ],
    ],
    duration: 1.2,
  },

  NO: {
    name: 'NO',
    description: 'Index and middle fingers snap down onto thumb or wag side-to-side',
    motionArrow: { from: { x: 35, y: 35 }, to: { x: 65, y: 35 }, type: 'wag' },
    frames: [
      // Frame 1: Extended index & middle open
      [
        { x: 50, y: 82 },
        { x: 40, y: 74 }, { x: 34, y: 66 }, { x: 30, y: 58 }, { x: 32, y: 50 },
        { x: 44, y: 56 }, { x: 42, y: 42 }, { x: 40, y: 30 }, { x: 38, y: 18 },
        { x: 50, y: 56 }, { x: 50, y: 42 }, { x: 50, y: 30 }, { x: 50, y: 18 },
        { x: 56, y: 62 }, { x: 58, y: 54 }, { x: 56, y: 60 }, { x: 54, y: 64 }, // Ring curled
        { x: 62, y: 64 }, { x: 64, y: 58 }, { x: 62, y: 64 }, { x: 60, y: 68 }, // Pinky curled
      ],
      // Frame 2: Index & middle closed tight against thumb
      [
        { x: 50, y: 82 },
        { x: 40, y: 74 }, { x: 38, y: 66 }, { x: 40, y: 58 }, { x: 44, y: 50 },
        { x: 44, y: 56 }, { x: 44, y: 48 }, { x: 44, y: 48 }, { x: 44, y: 50 },
        { x: 50, y: 56 }, { x: 48, y: 48 }, { x: 46, y: 48 }, { x: 46, y: 50 },
        { x: 56, y: 62 }, { x: 58, y: 54 }, { x: 56, y: 60 }, { x: 54, y: 64 },
        { x: 62, y: 64 }, { x: 64, y: 58 }, { x: 62, y: 64 }, { x: 60, y: 68 },
      ],
    ],
    duration: 1.1,
  },

  PLEASE: {
    name: 'PLEASE',
    description: 'Flat hand rubs circular clockwise motion over chest',
    motionArrow: { from: { x: 40, y: 40 }, to: { x: 60, y: 60 }, type: 'circle' },
    frames: [
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x - 8, y: p.y - 6 })),
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x + 8, y: p.y - 6 })),
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x + 8, y: p.y + 6 })),
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x - 8, y: p.y + 6 })),
    ],
    duration: 1.8,
  },

  SORRY: {
    name: 'SORRY',
    description: 'Fist with thumb resting across rubs circular motion on chest',
    motionArrow: { from: { x: 40, y: 40 }, to: { x: 60, y: 60 }, type: 'circle' },
    frames: [
      // Frame 1: Left circle
      [
        { x: 44, y: 76 },
        { x: 32, y: 70 }, { x: 28, y: 64 }, { x: 30, y: 58 }, { x: 38, y: 56 },
        { x: 38, y: 58 }, { x: 38, y: 50 }, { x: 42, y: 54 }, { x: 42, y: 60 },
        { x: 44, y: 58 }, { x: 44, y: 48 }, { x: 46, y: 54 }, { x: 46, y: 60 },
        { x: 50, y: 60 }, { x: 50, y: 50 }, { x: 50, y: 56 }, { x: 50, y: 62 },
        { x: 56, y: 62 }, { x: 56, y: 54 }, { x: 54, y: 60 }, { x: 52, y: 64 },
      ],
      // Frame 2: Right circle
      [
        { x: 56, y: 76 },
        { x: 44, y: 70 }, { x: 40, y: 64 }, { x: 42, y: 58 }, { x: 50, y: 56 },
        { x: 50, y: 58 }, { x: 50, y: 50 }, { x: 54, y: 54 }, { x: 54, y: 60 },
        { x: 56, y: 58 }, { x: 56, y: 48 }, { x: 58, y: 54 }, { x: 58, y: 60 },
        { x: 62, y: 60 }, { x: 62, y: 50 }, { x: 62, y: 56 }, { x: 62, y: 62 },
        { x: 68, y: 62 }, { x: 68, y: 54 }, { x: 66, y: 60 }, { x: 64, y: 64 },
      ],
    ],
    duration: 1.6,
  },

  GOOD: {
    name: 'GOOD',
    description: 'Clear thumbs up gesture moving upward with positive bounce',
    motionArrow: { from: { x: 50, y: 65 }, to: { x: 50, y: 25 }, type: 'upward' },
    frames: [
      // Frame 1: Thumbs Up start
      [
        { x: 50, y: 80 },
        { x: 40, y: 70 }, { x: 34, y: 56 }, { x: 30, y: 42 }, { x: 28, y: 24 }, // Thumb high up
        { x: 46, y: 64 }, { x: 46, y: 56 }, { x: 48, y: 62 }, { x: 48, y: 68 }, // Curled
        { x: 52, y: 64 }, { x: 52, y: 54 }, { x: 54, y: 60 }, { x: 54, y: 68 }, // Curled
        { x: 58, y: 66 }, { x: 58, y: 56 }, { x: 60, y: 62 }, { x: 60, y: 70 }, // Curled
        { x: 64, y: 68 }, { x: 64, y: 60 }, { x: 64, y: 66 }, { x: 64, y: 72 }, // Curled
      ],
      // Frame 2: Thumbs Up bounced higher
      [
        { x: 50, y: 68 },
        { x: 40, y: 58 }, { x: 34, y: 44 }, { x: 30, y: 30 }, { x: 28, y: 12 },
        { x: 46, y: 52 }, { x: 46, y: 44 }, { x: 48, y: 50 }, { x: 48, y: 56 },
        { x: 52, y: 52 }, { x: 52, y: 42 }, { x: 54, y: 48 }, { x: 54, y: 56 },
        { x: 58, y: 54 }, { x: 58, y: 44 }, { x: 60, y: 50 }, { x: 60, y: 58 },
        { x: 64, y: 56 }, { x: 64, y: 48 }, { x: 64, y: 54 }, { x: 64, y: 60 },
      ],
    ],
    duration: 1.2,
  },

  LOVE: {
    name: 'LOVE',
    description: 'I Love You sign (Thumb, Index, Pinky extended, Middle & Ring folded)',
    motionArrow: { from: { x: 45, y: 45 }, to: { x: 55, y: 45 }, type: 'pulse' },
    frames: [
      // Frame 1: ILY Hand
      [
        { x: 50, y: 84 },
        { x: 38, y: 74 }, { x: 28, y: 66 }, { x: 20, y: 58 }, { x: 14, y: 52 }, // Thumb extended
        { x: 42, y: 58 }, { x: 40, y: 42 }, { x: 38, y: 28 }, { x: 36, y: 16 }, // Index extended
        { x: 50, y: 60 }, { x: 50, y: 50 }, { x: 50, y: 58 }, { x: 50, y: 66 }, // Middle folded
        { x: 58, y: 62 }, { x: 58, y: 52 }, { x: 58, y: 60 }, { x: 58, y: 68 }, // Ring folded
        { x: 65, y: 64 }, { x: 70, y: 48 }, { x: 74, y: 34 }, { x: 78, y: 22 }, // Pinky extended
      ],
      // Frame 2: Pulse scale
      [
        { x: 50, y: 82 },
        { x: 37, y: 72 }, { x: 26, y: 64 }, { x: 18, y: 56 }, { x: 12, y: 50 },
        { x: 41, y: 56 }, { x: 39, y: 39 }, { x: 37, y: 25 }, { x: 35, y: 12 },
        { x: 50, y: 58 }, { x: 50, y: 48 }, { x: 50, y: 56 }, { x: 50, y: 64 },
        { x: 58, y: 60 }, { x: 58, y: 50 }, { x: 58, y: 58 }, { x: 58, y: 66 },
        { x: 66, y: 62 }, { x: 72, y: 45 }, { x: 77, y: 30 }, { x: 82, y: 18 },
      ],
    ],
    duration: 1.4,
  },

  WATER: {
    name: 'WATER',
    description: 'Three fingers (W shape) tapping against the side of the chin',
    motionArrow: { from: { x: 46, y: 30 }, to: { x: 54, y: 30 }, type: 'tap' },
    frames: [
      // Frame 1: W shape
      [
        { x: 50, y: 84 },
        { x: 40, y: 74 }, { x: 38, y: 66 }, { x: 42, y: 60 }, { x: 48, y: 56 }, // Thumb touches pinky
        { x: 42, y: 56 }, { x: 38, y: 40 }, { x: 36, y: 26 }, { x: 34, y: 14 }, // Index up
        { x: 50, y: 54 }, { x: 50, y: 38 }, { x: 50, y: 24 }, { x: 50, y: 12 }, // Middle up
        { x: 58, y: 56 }, { x: 62, y: 40 }, { x: 64, y: 26 }, { x: 66, y: 14 }, // Ring up
        { x: 64, y: 66 }, { x: 62, y: 58 }, { x: 56, y: 58 }, { x: 52, y: 58 }, // Pinky folded
      ],
      // Frame 2: Tap tap
      [
        { x: 50, y: 80 },
        { x: 40, y: 70 }, { x: 38, y: 62 }, { x: 42, y: 56 }, { x: 48, y: 52 },
        { x: 42, y: 52 }, { x: 38, y: 36 }, { x: 36, y: 22 }, { x: 34, y: 10 },
        { x: 50, y: 50 }, { x: 50, y: 34 }, { x: 50, y: 20 }, { x: 50, y: 8 },
        { x: 58, y: 52 }, { x: 62, y: 36 }, { x: 64, y: 22 }, { x: 66, y: 10 },
        { x: 64, y: 62 }, { x: 62, y: 54 }, { x: 56, y: 54 }, { x: 52, y: 54 },
      ],
    ],
    duration: 1.2,
  },

  FOOD: {
    name: 'FOOD',
    description: 'Fingertips grouped together into mouth shape, tapping toward lips',
    motionArrow: { from: { x: 50, y: 50 }, to: { x: 50, y: 25 }, type: 'tap' },
    frames: [
      // Frame 1: Flattened O-shape away from mouth
      [
        { x: 50, y: 82 },
        { x: 42, y: 72 }, { x: 42, y: 60 }, { x: 46, y: 50 }, { x: 50, y: 42 },
        { x: 46, y: 60 }, { x: 48, y: 50 }, { x: 50, y: 44 }, { x: 50, y: 42 },
        { x: 50, y: 58 }, { x: 50, y: 48 }, { x: 50, y: 44 }, { x: 50, y: 42 },
        { x: 54, y: 60 }, { x: 52, y: 50 }, { x: 50, y: 44 }, { x: 50, y: 42 },
        { x: 58, y: 64 }, { x: 54, y: 54 }, { x: 52, y: 46 }, { x: 50, y: 42 },
      ],
      // Frame 2: Close to lips
      [
        { x: 50, y: 68 },
        { x: 42, y: 58 }, { x: 42, y: 46 }, { x: 46, y: 36 }, { x: 50, y: 28 },
        { x: 46, y: 46 }, { x: 48, y: 36 }, { x: 50, y: 30 }, { x: 50, y: 28 },
        { x: 50, y: 44 }, { x: 50, y: 34 }, { x: 50, y: 30 }, { x: 50, y: 28 },
        { x: 54, y: 46 }, { x: 52, y: 36 }, { x: 50, y: 30 }, { x: 50, y: 28 },
        { x: 58, y: 50 }, { x: 54, y: 40 }, { x: 52, y: 32 }, { x: 50, y: 28 },
      ],
    ],
    duration: 1.3,
  },

  YOU: {
    name: 'YOU',
    description: 'Index finger pointing straight toward the conversation partner',
    motionArrow: { from: { x: 50, y: 60 }, to: { x: 50, y: 20 }, type: 'forward' },
    frames: [
      // Frame 1: Hand pointing
      [
        { x: 50, y: 84 },
        { x: 40, y: 76 }, { x: 38, y: 68 }, { x: 42, y: 60 }, { x: 48, y: 58 },
        { x: 48, y: 58 }, { x: 48, y: 42 }, { x: 48, y: 28 }, { x: 48, y: 14 }, // Index straight forward
        { x: 54, y: 62 }, { x: 54, y: 54 }, { x: 52, y: 60 }, { x: 50, y: 64 }, // Curled
        { x: 58, y: 64 }, { x: 58, y: 56 }, { x: 56, y: 62 }, { x: 54, y: 66 }, // Curled
        { x: 62, y: 66 }, { x: 62, y: 58 }, { x: 60, y: 64 }, { x: 58, y: 68 }, // Curled
      ],
      // Frame 2: Point slightly extended
      [
        { x: 50, y: 80 },
        { x: 40, y: 72 }, { x: 38, y: 64 }, { x: 42, y: 56 }, { x: 48, y: 54 },
        { x: 48, y: 54 }, { x: 48, y: 38 }, { x: 48, y: 24 }, { x: 48, y: 10 },
        { x: 54, y: 58 }, { x: 54, y: 50 }, { x: 52, y: 56 }, { x: 50, y: 60 },
        { x: 58, y: 60 }, { x: 58, y: 52 }, { x: 56, y: 58 }, { x: 54, y: 62 },
        { x: 62, y: 62 }, { x: 62, y: 54 }, { x: 60, y: 60 }, { x: 58, y: 64 },
      ],
    ],
    duration: 1.2,
  },

  I: {
    name: 'I',
    description: 'Index finger points inward touching own chest',
    motionArrow: { from: { x: 50, y: 20 }, to: { x: 50, y: 65 }, type: 'inward' },
    frames: [
      // Frame 1: Pointing inward
      [
        { x: 50, y: 86 },
        { x: 40, y: 78 }, { x: 38, y: 70 }, { x: 42, y: 64 }, { x: 48, y: 60 },
        { x: 48, y: 62 }, { x: 48, y: 50 }, { x: 48, y: 40 }, { x: 48, y: 30 },
        { x: 54, y: 64 }, { x: 54, y: 56 }, { x: 52, y: 62 }, { x: 50, y: 66 },
        { x: 58, y: 66 }, { x: 58, y: 58 }, { x: 56, y: 64 }, { x: 54, y: 68 },
        { x: 62, y: 68 }, { x: 62, y: 60 }, { x: 60, y: 66 }, { x: 58, y: 70 },
      ],
      // Frame 2: Pressed gently to chest
      [
        { x: 50, y: 88 },
        { x: 40, y: 80 }, { x: 38, y: 72 }, { x: 42, y: 66 }, { x: 48, y: 62 },
        { x: 48, y: 64 }, { x: 48, y: 54 }, { x: 48, y: 46 }, { x: 48, y: 38 },
        { x: 54, y: 66 }, { x: 54, y: 58 }, { x: 52, y: 64 }, { x: 50, y: 68 },
        { x: 58, y: 68 }, { x: 58, y: 60 }, { x: 56, y: 66 }, { x: 54, y: 70 },
        { x: 62, y: 70 }, { x: 62, y: 62 }, { x: 60, y: 68 }, { x: 58, y: 72 },
      ],
    ],
    duration: 1.2,
  },

  WELCOME: {
    name: 'WELCOME',
    description: 'Both open hands sweep inward in welcoming arc toward body',
    motionArrow: { from: { x: 20, y: 30 }, to: { x: 50, y: 60 }, type: 'welcome' },
    frames: [
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x - 12, y: p.y - 10 })),
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x, y: p.y + 4 })),
    ],
    duration: 1.6,
  },
}

export const getGestureAnimation = (signName) => {
  const key = signName ? signName.toUpperCase().trim() : ''
  if (GESTURE_ANIMATIONS[key]) {
    return GESTURE_ANIMATIONS[key]
  }

  // Fallback procedural animation for other catalog signs
  return {
    name: signName,
    description: 'Visual gesture reference guide',
    motionArrow: { from: { x: 40, y: 40 }, to: { x: 60, y: 40 }, type: 'wave' },
    frames: [
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x - 4, y: p.y - 2 })),
      DEFAULT_OPEN_PALM,
      DEFAULT_OPEN_PALM.map((p) => ({ x: p.x + 4, y: p.y - 2 })),
      DEFAULT_OPEN_PALM,
    ],
    duration: 1.5,
  }
}
