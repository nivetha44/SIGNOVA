import { useState, useEffect, useRef, useCallback } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

// ─────────────────────────────────────────────
// ACCURATE ISL GESTURE CLASSIFIER (RULE-BASED)
// ─────────────────────────────────────────────

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
}

function isExtended(landmarks, tipIdx, pipIdx) {
  const wrist = landmarks[0]
  return dist(landmarks[tipIdx], wrist) > dist(landmarks[pipIdx], wrist)
}

function classifySingleHand(landmarks) {
  if (!landmarks || landmarks.length < 21) return null

  const wrist = landmarks[0]
  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const thumbExt = dist(thumbTip, wrist) > dist(landmarks[3], wrist) * 1.15
  const indexExt = isExtended(landmarks, 8, 6)
  const middleExt = isExtended(landmarks, 12, 10)
  const ringExt = isExtended(landmarks, 16, 14)
  const pinkyExt = isExtended(landmarks, 20, 18)

  const extCount = [thumbExt, indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length

  // 1. OK Sign (Thumb + Index touching, Middle, Ring, Pinky extended)
  const thumbIndexDist = dist(thumbTip, indexTip)
  if (thumbIndexDist < 0.08 && middleExt && ringExt && pinkyExt) {
    return { sign: 'OK', confidence: 0.94 }
  }

  // 2. Victory / Peace (Index + Middle extended in V shape, others folded)
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const fingerGap = dist(indexTip, middleTip)
    if (fingerGap > 0.06) {
      return { sign: 'YES', confidence: 0.91 } // ISL affirmative/peace
    }
  }

  // 3. I Love You (Thumb + Index + Pinky extended, Middle & Ring folded)
  if (thumbExt && indexExt && !middleExt && !ringExt && pinkyExt) {
    return { sign: 'LOVE', confidence: 0.93 }
  }

  // 4. Help / Hang Loose (Thumb + Pinky extended, others folded)
  if (thumbExt && !indexExt && !middleExt && !ringExt && pinkyExt) {
    return { sign: 'HELP', confidence: 0.88 }
  }

  // 5. Thumbs Up Only -> GOOD
  if (thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt && thumbTip.y < landmarks[3].y) {
    return { sign: 'GOOD', confidence: 0.95 }
  }

  // 6. Fist (All folded) -> NO
  if (extCount === 0) {
    return { sign: 'NO', confidence: 0.89 }
  }

  // 7. Index pointing forward/away -> YOU
  if (indexExt && !middleExt && !ringExt && !pinkyExt && indexTip.y > 0.3) {
    if (indexTip.x > 0.35 && indexTip.x < 0.65) {
      return { sign: 'YOU', confidence: 0.92 }
    }
    return { sign: 'I', confidence: 0.87 }
  }

  // 8. Water (W shape - 3 middle fingers extended)
  if (!thumbExt && indexExt && middleExt && ringExt && !pinkyExt) {
    return { sign: 'WATER', confidence: 0.90 }
  }

  // 9. Food (All fingertips close together in pinch)
  const tipsSpread =
    dist(thumbTip, indexTip) + dist(indexTip, middleTip) + dist(middleTip, ringTip) + dist(ringTip, pinkyTip)
  if (tipsSpread < 0.28 && landmarks[9].y < 0.6) {
    return { sign: 'FOOD', confidence: 0.89 }
  }

  // 10. Open Hand (All fingers extended)
  if (extCount >= 4) {
    // High near forehead/temple -> HELLO
    if (landmarks[9].y < 0.38) {
      return { sign: 'HELLO', confidence: 0.95 }
    }
    // Near chin/mouth -> THANK YOU
    if (landmarks[9].y >= 0.38 && landmarks[9].y <= 0.65 && indexTip.y < landmarks[0].y) {
      return { sign: 'THANK YOU', confidence: 0.92 }
    }
    // Mid torso open sweep -> WELCOME
    return { sign: 'WELCOME', confidence: 0.88 }
  }

  // 11. Flat hand, 4 fingers together on chest -> PLEASE
  if (indexExt && middleExt && ringExt && pinkyExt && !thumbExt) {
    return { sign: 'PLEASE', confidence: 0.86 }
  }

  // Fallback for subtle gesture
  if (extCount >= 2) {
    return { sign: 'PLEASE', confidence: 0.72 }
  }

  return { sign: 'SORRY', confidence: 0.68 }
}

// ─────────────────────────────────────────────
// MAIN HAND TRACKING HOOK
// ─────────────────────────────────────────────

export function useHandTracking() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gesture, setGesture] = useState(null)
  const [isHandDetected, setIsHandDetected] = useState(false)
  const [isLowConfidence, setIsLowConfidence] = useState(false)
  const [handCount, setHandCount] = useState(0)

  const handLandmarkerRef = useRef(null)
  const animFrameRef = useRef(null)
  const isTrackingRef = useRef(false)
  const lastVideoTimeRef = useRef(-1)

  // Temporal smoothing buffer
  const historyBufferRef = useRef([])

  useEffect(() => {
    let cancelled = false

    async function initMediaPipe() {
      try {
        setIsLoading(true)
        setError(null)

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        if (cancelled) return

        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
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
        })

        if (cancelled) return
        setIsInitialized(true)
        setIsLoading(false)
      } catch (err) {
        console.error('MediaPipe initialization error:', err)
        if (!cancelled) {
          setError(err.message || 'Failed to initialize hand tracking engine')
          setIsLoading(false)
        }
      }
    }

    initMediaPipe()

    return () => {
      cancelled = true
      isTrackingRef.current = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  const processFrameRef = useRef(null)

  const processFrame = useCallback((video, canvas) => {
    if (!isTrackingRef.current || !handLandmarkerRef.current || !video) return

    if (video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(() => {
        if (processFrameRef.current) processFrameRef.current(video, canvas)
      })
      return
    }

    const videoTime = video.currentTime
    if (videoTime === lastVideoTimeRef.current) {
      animFrameRef.current = requestAnimationFrame(() => {
        if (processFrameRef.current) processFrameRef.current(video, canvas)
      })
      return
    }
    lastVideoTimeRef.current = videoTime

    try {
      const detection = handLandmarkerRef.current.detectForVideo(video, performance.now())

      const handsPresent = detection.landmarks && detection.landmarks.length > 0
      setIsHandDetected(handsPresent)
      setHandCount(detection.landmarks?.length || 0)

      if (canvas) {
        drawHandLandmarks(canvas, video, detection)
      }

      if (handsPresent) {
        const rawPrediction = classifySingleHand(detection.landmarks[0])
        if (rawPrediction) {
          // Temporal buffer smoothing (last 5 frames)
          const buffer = historyBufferRef.current
          buffer.push(rawPrediction)
          if (buffer.length > 6) buffer.shift()

          // Find majority sign in buffer
          const counts = {}
          buffer.forEach((item) => {
            counts[item.sign] = (counts[item.sign] || 0) + 1
          })
          const dominantSign = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b))

          const avgConfidence =
            buffer.filter((b) => b.sign === dominantSign).reduce((acc, curr) => acc + curr.confidence, 0) /
            counts[dominantSign]

          const smoothed = {
            sign: dominantSign,
            confidence: Math.round(avgConfidence * 100) / 100,
          }

          setGesture(smoothed)
          setIsLowConfidence(smoothed.confidence < 0.7)
        }
      } else {
        historyBufferRef.current = []
        setGesture(null)
        setIsLowConfidence(false)
      }
    } catch {
      // Silently continue next frame on transient detection glitches
    }

    if (isTrackingRef.current) {
      animFrameRef.current = requestAnimationFrame(() => {
        if (processFrameRef.current) processFrameRef.current(video, canvas)
      })
    }
  }, [])

  useEffect(() => {
    processFrameRef.current = processFrame
  }, [processFrame])

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

  const stopTracking = useCallback(() => {
    isTrackingRef.current = false
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
    setIsHandDetected(false)
    setGesture(null)
    historyBufferRef.current = []
  }, [])

  return {
    isInitialized,
    isLoading,
    error,
    gesture,
    isHandDetected,
    isLowConfidence,
    handCount,
    startTracking,
    stopTracking,
  }
}

// ─────────────────────────────────────────────
// CANVAS SKELETON RENDERER WITH GLOW
// ─────────────────────────────────────────────

function drawHandLandmarks(canvas, video, detection) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = video.videoWidth || 640
  canvas.height = video.videoHeight || 480
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!detection.landmarks || !detection.landmarks.length) return

  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8], // Index
    [0, 9], [9, 10], [10, 11], [11, 12], // Middle
    [0, 13], [13, 14], [14, 15], [15, 16], // Ring
    [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    [5, 9], [9, 13], [13, 17], // Palm bridge
  ]

  for (const hand of detection.landmarks) {
    // Draw connecting bones
    ctx.strokeStyle = 'rgba(255, 46, 147, 0.75)'
    ctx.lineWidth = 3.5
    ctx.lineCap = 'round'

    for (const [start, end] of HAND_CONNECTIONS) {
      const p1 = hand[start]
      const p2 = hand[end]
      ctx.beginPath()
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height)
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height)
      ctx.stroke()
    }

    // Draw keypoint joints
    for (let i = 0; i < hand.length; i++) {
      const p = hand[i]
      const x = p.x * canvas.width
      const y = p.y * canvas.height
      const isFingertip = [4, 8, 12, 16, 20].includes(i)

      ctx.beginPath()
      ctx.arc(x, y, isFingertip ? 7 : 4.5, 0, 2 * Math.PI)
      ctx.fillStyle = isFingertip ? '#FDA4AF' : '#FF2E93'
      ctx.fill()

      if (isFingertip) {
        ctx.beginPath()
        ctx.arc(x, y, 13, 0, 2 * Math.PI)
        ctx.fillStyle = 'rgba(255, 46, 147, 0.35)'
        ctx.fill()
      }
    }
  }
}