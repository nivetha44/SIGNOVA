import { useState, useEffect, useRef, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

// ─────────────────────────────────────────────
// GESTURE CLASSIFIER (Rule-Based for MVP)
// This will be replaced by your trained ML model
// ─────────────────────────────────────────────

function classifyGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  // Helper: calculate distance between two points
  const dist = (a, b) =>
    Math.sqrt(
      (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
    )

  // Helper: is finger extended?
  const isFingerExtended = (tipIdx, pipIdx) => {
    const tip = landmarks[tipIdx]
    const pip = landmarks[pipIdx]
    // Finger is extended if tip is farther from wrist than PIP
    const wrist = landmarks[0]
    return dist(tip, wrist) > dist(pip, wrist)
  }

  const thumbExtended =
    dist(landmarks[4], landmarks[0]) > dist(landmarks[3], landmarks[0]) * 1.1
  const indexExtended = isFingerExtended(8, 6)
  const middleExtended = isFingerExtended(12, 10)
  const ringExtended = isFingerExtended(16, 14)
  const pinkyExtended = isFingerExtended(20, 18)

  const extendedCount =
    [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended]
      .filter(Boolean).length

  // ── Gesture Rules ──

  // Open palm (all fingers extended) → HELLO / WELCOME
  if (extendedCount >= 4) {
    // Check if hand is near face (y position)
    const handY = landmarks[9].y
    if (handY < 0.4) {
      return { sign: 'HELLO', confidence: 0.92 }
    }
    return { sign: 'WELCOME', confidence: 0.88 }
  }

  // Thumbs up only → GOOD
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return { sign: 'GOOD', confidence: 0.91 }
  }

  // Fist (no fingers extended) → NO / BAD
  if (extendedCount === 0) {
    return { sign: 'NO', confidence: 0.85 }
  }

  // Index finger only → YOU
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return { sign: 'YOU', confidence: 0.89 }
  }

  // Index + Middle → YES (peace-like)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return { sign: 'YES', confidence: 0.87 }
  }

  // Index + Thumb (L shape) → LOVE
  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { sign: 'LOVE', confidence: 0.86 }
  }

  // Pinky only → WATER (ASL variation)
  if (!thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { sign: 'WATER', confidence: 0.82 }
  }

  // Thumb + Pinky (hang loose) → HELP
  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
    return { sign: 'HELP', confidence: 0.83 }
  }

  // Open hand near chin area → THANK YOU
  if (extendedCount >= 3 && landmarks[8].y < 0.5 && landmarks[8].y > 0.3) {
    return { sign: 'THANK YOU', confidence: 0.80 }
  }

  // Index pointing to self → I / ME
  if (indexExtended && !middleExtended && landmarks[8].x > 0.4 && landmarks[8].x < 0.6) {
    return { sign: 'I', confidence: 0.84 }
  }

  // Flat hand, fingers together → PLEASE
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended) {
    return { sign: 'PLEASE', confidence: 0.79 }
  }

  // Fallback
  if (extendedCount >= 2) {
    return { sign: 'FOOD', confidence: 0.65 }
  }

  return { sign: 'SORRY', confidence: 0.60 }
}

// ─────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────

export function useHandTracking() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)
  const [gesture, setGesture] = useState(null)

  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastVideoTimeRef = useRef(-1)
  const isTrackingRef = useRef(false)

  // Initialize MediaPipe
  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        setIsLoading(true)
        setError(null)

        console.log('Loading MediaPipe vision tasks...')
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        if (cancelled) return

        console.log('Creating HandLandmarker...')
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.5,
            minHandPresenceConfidence: 0.5,
            minTrackingConfidence: 0.5,
          }
        )

        if (cancelled) return

        setIsInitialized(true)
        setIsLoading(false)
        console.log('MediaPipe HandLandmarker ready!')
      } catch (err) {
        console.error('MediaPipe init error:', err)
        if (!cancelled) {
          setError(err.message)
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      isTrackingRef.current = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  // Process a single video frame
  const processFrame = useCallback(
    (video, canvas) => {
      if (!isTrackingRef.current || !handLandmarkerRef.current || !video) return

      // If video is not ready yet, keep trying
      if (video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(() =>
          processFrame(video, canvas)
        )
        return
      }

      const videoTime = video.currentTime

      // Don't reprocess the same frame
      if (videoTime === lastVideoTimeRef.current) {
        animFrameRef.current = requestAnimationFrame(() =>
          processFrame(video, canvas)
        )
        return
      }
      lastVideoTimeRef.current = videoTime

      try {
        const detection = handLandmarkerRef.current.detectForVideo(
          video,
          performance.now()
        )

        setResults(detection)

        // Draw landmarks on canvas
        if (canvas && detection.landmarks && detection.landmarks.length > 0) {
          drawLandmarks(canvas, video, detection)
        }

        // Classify gesture from first hand
        if (detection.landmarks && detection.landmarks.length > 0) {
          const prediction = classifyGesture(detection.landmarks[0])
          setGesture(prediction)
        } else {
          setGesture(null)
        }
      } catch {
        // Silently handle frame processing errors
      }

      if (isTrackingRef.current) {
        animFrameRef.current = requestAnimationFrame(() =>
          processFrame(video, canvas)
        )
      }
    },
    []
  )

  // Start tracking loop
  const startTracking = useCallback(
    (video, canvas) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      isTrackingRef.current = true
      processFrame(video, canvas)
    },
    [processFrame]
  )

  // Stop tracking
  const stopTracking = useCallback(() => {
    isTrackingRef.current = false
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }, [])

  return {
    isInitialized,
    isLoading,
    error,
    results,
    gesture,
    startTracking,
    stopTracking,
  }
}

// ─────────────────────────────────────────────
// DRAW HAND SKELETON ON CANVAS
// ─────────────────────────────────────────────

function drawLandmarks(canvas, video, detection) {
  const ctx = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!detection.landmarks) return

  // Hand connections (MediaPipe standard)
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],       // Index
    [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
    [0, 13], [13, 14], [14, 15], [15, 16],// Ring
    [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
    [5, 9], [9, 13], [13, 17],            // Palm
  ]

  for (const handLandmarks of detection.landmarks) {
    // Draw connections
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.7)'
    ctx.lineWidth = 2

    for (const [start, end] of HAND_CONNECTIONS) {
      const startPoint = handLandmarks[start]
      const endPoint = handLandmarks[end]

      ctx.beginPath()
      ctx.moveTo(
        startPoint.x * canvas.width,
        startPoint.y * canvas.height
      )
      ctx.lineTo(
        endPoint.x * canvas.width,
        endPoint.y * canvas.height
      )
      ctx.stroke()
    }

    // Draw landmarks
    for (let i = 0; i < handLandmarks.length; i++) {
      const point = handLandmarks[i]
      const x = point.x * canvas.width
      const y = point.y * canvas.height

      // Fingertips get bigger dots
      const isTip = [4, 8, 12, 16, 20].includes(i)
      const radius = isTip ? 6 : 3

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = isTip ? '#00D4FF' : '#6C63FF'
      ctx.fill()

      // Glow effect on fingertips
      if (isTip) {
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.2)'
        ctx.fill()
      }
    }
  }
}