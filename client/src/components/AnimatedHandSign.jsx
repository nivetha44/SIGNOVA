import { useState, useEffect, useRef, useMemo } from 'react'
import { Play, Pause, FastForward, Info } from 'lucide-react'
import { getGestureAnimation, DEFAULT_OPEN_PALM } from '../data/gestureKeyframes'

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17], // Palm arch
]

const FINGERTIPS = [4, 8, 12, 16, 20]

export default function AnimatedHandSign({
  signName = 'HELLO',
  size = 280,
  showControls = true,
  autoPlay = true,
  speed = 1.0,
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [playbackSpeed, setPlaybackSpeed] = useState(speed)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [interpolatedPoints, setInterpolatedPoints] = useState(DEFAULT_OPEN_PALM)

  const animationData = useMemo(() => getGestureAnimation(signName), [signName])
  const frames = animationData.frames || [DEFAULT_OPEN_PALM]

  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  // ── Interpolation Loop ──
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) {
      if (frames[currentFrameIndex]) {
        setInterpolatedPoints(frames[currentFrameIndex])
      }
      return
    }

    const durationPerCycle = (animationData.duration || 1.5) * 1000 * (1 / playbackSpeed)
    const numFrames = frames.length

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = (timestamp - startTimeRef.current) % durationPerCycle
      const progress = elapsed / durationPerCycle // 0 to 1

      // Determine active frame span
      const frameSpan = 1 / numFrames
      const frameIdx = Math.floor(progress / frameSpan)
      const nextFrameIdx = (frameIdx + 1) % numFrames
      const localT = (progress - frameIdx * frameSpan) / frameSpan

      // Cosine smooth step easing
      const easedT = 0.5 * (1 - Math.cos(localT * Math.PI))

      setCurrentFrameIndex(frameIdx)

      const f1 = frames[frameIdx]
      const f2 = frames[nextFrameIdx]

      if (f1 && f2) {
        const blended = f1.map((p1, i) => {
          const p2 = f2[i] || p1
          return {
            x: p1.x + (p2.x - p1.x) * easedT,
            y: p1.y + (p2.y - p1.y) * easedT,
          }
        })
        setInterpolatedPoints(blended)
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, frames, animationData.duration, currentFrameIndex])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    startTimeRef.current = null
  }

  const cycleSpeed = () => {
    const next = playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 0.5 : 1.0
    setPlaybackSpeed(next)
  }

  const handleStep = (idx) => {
    setIsPlaying(false)
    setCurrentFrameIndex(idx)
    if (frames[idx]) {
      setInterpolatedPoints(frames[idx])
    }
  }

  return (
    <div style={{ ...styles.wrapper, maxWidth: `${size}px` }}>
      {/* SVG Hand Gesture Canvas */}
      <div style={{ ...styles.canvasContainer, height: `${size * 0.9}px` }}>
        <svg
          viewBox="0 0 100 100"
          style={styles.svg}
          aria-label={`Animated ISL gesture diagram for ${signName}`}
        >
          {/* Subtle Ambient Background Glow */}
          <circle cx="50" cy="50" r="38" fill="url(#pinkGlowGrad)" />

          <defs>
            <radialGradient id="pinkGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF2E93" stopOpacity="0.18" />
              <stop offset="80%" stopColor="#1C0B18" stopOpacity="0" />
            </radialGradient>
            <filter id="neonJointGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Palm Base Fill Silhouette */}
          {interpolatedPoints.length >= 21 && (
            <polygon
              points={`
                ${interpolatedPoints[0].x},${interpolatedPoints[0].y}
                ${interpolatedPoints[1].x},${interpolatedPoints[1].y}
                ${interpolatedPoints[5].x},${interpolatedPoints[5].y}
                ${interpolatedPoints[9].x},${interpolatedPoints[9].y}
                ${interpolatedPoints[13].x},${interpolatedPoints[13].y}
                ${interpolatedPoints[17].x},${interpolatedPoints[17].y}
              `}
              fill="rgba(255, 46, 147, 0.08)"
              stroke="none"
            />
          )}

          {/* Connecting Bones */}
          {HAND_CONNECTIONS.map(([start, end], idx) => {
            const p1 = interpolatedPoints[start]
            const p2 = interpolatedPoints[end]
            if (!p1 || !p2) return null
            return (
              <line
                key={`bone_${idx}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="rgba(255, 46, 147, 0.75)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            )
          })}

          {/* Motion Vector Arrow */}
          {animationData.motionArrow && (
            <g opacity="0.85">
              <path
                d={`M ${animationData.motionArrow.from.x} ${animationData.motionArrow.from.y} Q 50 15 ${animationData.motionArrow.to.x} ${animationData.motionArrow.to.y}`}
                fill="none"
                stroke="#FDA4AF"
                strokeWidth="1.6"
                strokeDasharray="2,2"
              />
              <circle
                cx={animationData.motionArrow.to.x}
                cy={animationData.motionArrow.to.y}
                r="2"
                fill="#FF2E93"
              />
            </g>
          )}

          {/* Hand Joints */}
          {interpolatedPoints.map((p, idx) => {
            const isTip = FINGERTIPS.includes(idx)
            const isWrist = idx === 0
            return (
              <g key={`joint_${idx}`} filter="url(#neonJointGlow)">
                {isTip && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.2"
                    fill="rgba(255, 46, 147, 0.35)"
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isTip ? 2.6 : isWrist ? 3.2 : 1.8}
                  fill={isTip ? '#FDA4AF' : isWrist ? '#FFFFFF' : '#FF2E93'}
                />
              </g>
            )
          })}
        </svg>

        {/* Live Motion Badge */}
        <div style={styles.animBadge}>
          <span style={styles.badgePulse} />
          <span>ISL Gesture Animation</span>
        </div>
      </div>

      {/* Trajectory Guide Note */}
      {animationData.description && (
        <div style={styles.descRow}>
          <Info size={13} color="var(--pink-soft)" style={{ flexShrink: 0 }} />
          <p style={styles.descText}>{animationData.description}</p>
        </div>
      )}

      {/* Interactive Controls */}
      {showControls && (
        <div style={styles.controlsBar}>
          <div style={styles.btnRow}>
            <button onClick={togglePlay} className="btn-secondary" style={styles.ctrlBtn} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button onClick={cycleSpeed} className="btn-secondary" style={styles.speedBtn} title="Playback speed">
              <FastForward size={13} color="var(--pink-soft)" />
              <span>{playbackSpeed}x</span>
            </button>
          </div>

          {/* Keyframe Step Selectors */}
          {frames.length > 1 && (
            <div style={styles.stepsRow}>
              {frames.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStep(idx)}
                  style={{
                    ...styles.stepDot,
                    background: currentFrameIndex === idx ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: currentFrameIndex === idx ? 'var(--pink-primary)' : 'var(--border-color)',
                  }}
                  title={`Step ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    margin: '0 auto',
  },
  canvasContainer: {
    position: 'relative',
    width: '100%',
    borderRadius: '18px',
    background: 'radial-gradient(circle at 50% 50%, rgba(255, 46, 147, 0.08) 0%, rgba(10, 6, 11, 0.95) 80%)',
    border: '1.5px solid rgba(255, 46, 147, 0.25)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 46, 147, 0.12)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  animBadge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '3px 9px',
    borderRadius: '9999px',
    background: 'rgba(10, 6, 11, 0.85)',
    border: '1px solid rgba(255, 46, 147, 0.35)',
    color: '#FFFFFF',
    fontSize: '0.64rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    backdropFilter: 'blur(8px)',
  },
  badgePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#FF2E93',
    boxShadow: '0 0 6px #FF2E93',
  },
  descRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '6px 12px',
    background: 'rgba(255, 46, 147, 0.06)',
    border: '1px solid rgba(255, 46, 147, 0.18)',
    borderRadius: '10px',
  },
  descText: {
    fontSize: '0.74rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.35,
  },
  controlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '4px 2px',
  },
  btnRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ctrlBtn: {
    padding: '6px 12px',
    fontSize: '0.74rem',
    borderRadius: '8px',
    gap: '5px',
  },
  speedBtn: {
    padding: '6px 10px',
    fontSize: '0.74rem',
    borderRadius: '8px',
    gap: '4px',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  stepDot: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '1px solid',
    color: '#FFFFFF',
    fontSize: '0.66rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}
