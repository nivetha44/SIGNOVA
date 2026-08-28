import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera as CameraIcon,
  CameraOff,
  Pause,
  Play,
  FlipHorizontal,
  Hand,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useHandTracking } from '../hooks/useHandTracking'
import { useLanguage } from '../context/LanguageContext'

export default function Camera({ onGestureDetected, targetSign = null }) {
  const { t } = useLanguage()
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [facingMode, setFacingMode] = useState('user')
  const [cameraError, setCameraError] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const {
    isInitialized,
    isLoading: mpLoading,
    error: mpError,
    gesture,
    isHandDetected,
    isLowConfidence,
    handCount,
    startTracking,
    stopTracking,
  } = useHandTracking()

  // ── Start Camera ──
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      setIsPaused(false)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsCameraOn(true)

        if (isInitialized) {
          startTracking(videoRef.current, canvasRef.current)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions in your browser.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : `Camera error: ${err.message}`
      )
    }
  }, [facingMode, isInitialized, startTracking])

  // ── Stop Camera ──
  const stopCamera = useCallback(() => {
    stopTracking()
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraOn(false)
    setIsPaused(false)
  }, [stopTracking])

  // ── Pause / Resume ──
  const togglePause = () => {
    if (!videoRef.current) return
    if (isPaused) {
      videoRef.current.play()
      startTracking(videoRef.current, canvasRef.current)
      setIsPaused(false)
    } else {
      videoRef.current.pause()
      stopTracking()
      setIsPaused(true)
    }
  }

  // ── Flip Camera ──
  const flipCamera = () => {
    stopCamera()
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
    setTimeout(() => startCamera(), 300)
  }

  // ── Start Tracking when MediaPipe loads ──
  useEffect(() => {
    if (isInitialized && isCameraOn && !isPaused && videoRef.current) {
      startTracking(videoRef.current, canvasRef.current)
    }
  }, [isInitialized, isCameraOn, isPaused, startTracking])

  // ── Pass detected gesture to parent ──
  useEffect(() => {
    if (gesture && onGestureDetected && !isPaused) {
      onGestureDetected(gesture)
    }
  }, [gesture, onGestureDetected, isPaused])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const isTargetMatched = targetSign && gesture?.sign === targetSign.toUpperCase()

  return (
    <div style={styles.container}>
      {/* Camera Viewport */}
      <div style={{ ...styles.viewport, borderColor: isTargetMatched ? 'var(--pink-primary)' : 'var(--border-color)' }}>
        {/* Video Element */}
        <video
          ref={videoRef}
          style={{
            ...styles.video,
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            display: isCameraOn ? 'block' : 'none',
          }}
          playsInline
          muted
        />

        {/* Canvas Overlay for Landmark Skeleton */}
        <canvas
          ref={canvasRef}
          style={{
            ...styles.canvas,
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            display: isCameraOn ? 'block' : 'none',
          }}
        />

        {/* Placeholder when Camera is off */}
        {!isCameraOn && !cameraError && (
          <div style={styles.placeholder}>
            <div style={styles.placeholderIcon}>
              <Hand size={42} color="var(--pink-soft)" />
            </div>
            <h3 style={styles.placeholderTitle}>Camera is Inactive</h3>
            <p style={styles.placeholderText}>
              Click "Start Camera" to enable real-time sign recognition with MediaPipe.
            </p>
          </div>
        )}

        {/* Camera Error Message */}
        {(cameraError || mpError) && (
          <div style={styles.errorOverlay}>
            <AlertTriangle size={36} color="#EF4444" />
            <p style={styles.errorText}>{cameraError || `AI Engine Error: ${mpError}`}</p>
          </div>
        )}

        {/* Live Tracking Badges */}
        {isCameraOn && (
          <div style={styles.badgeRow}>
            <div style={{ ...styles.liveBadge, borderColor: isPaused ? 'rgba(245,158,11,0.5)' : 'rgba(255,46,147,0.5)' }}>
              <div style={{ ...styles.liveDot, background: isPaused ? '#F59E0B' : '#FF2E93', boxShadow: isPaused ? 'none' : '0 0 8px #FF2E93' }} />
              {isPaused ? 'PAUSED' : 'LIVE ISL'}
            </div>

            {handCount > 0 && (
              <div style={styles.handCountBadge}>
                <Hand size={12} color="var(--pink-soft)" />
                {handCount} {handCount === 1 ? 'Hand' : 'Hands'}
              </div>
            )}
          </div>
        )}

        {/* Live Detected Sign Banner */}
        <AnimatePresence>
          {isCameraOn && gesture && !isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{
                ...styles.detectedBanner,
                borderColor: isTargetMatched ? '#10B981' : 'var(--pink-primary)',
                boxShadow: isTargetMatched ? '0 0 20px rgba(16, 185, 129, 0.4)' : '0 0 20px rgba(255, 46, 147, 0.3)',
              }}
            >
              <div style={styles.detectedLeft}>
                <span style={styles.detectedSign}>{gesture.sign}</span>
                <span style={styles.detectedConfidence}>{Math.round(gesture.confidence * 100)}% Match</span>
              </div>
              {isTargetMatched && (
                <div style={styles.matchBadge}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Target Match!</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Hint */}
        {isCameraOn && !isHandDetected && !isPaused && (
          <div style={styles.statusHint}>
            <Hand size={14} color="var(--pink-soft)" />
            <span>{t('trans_no_hand', 'Position hand inside camera frame')}</span>
          </div>
        )}

        {isCameraOn && isHandDetected && isLowConfidence && !isPaused && (
          <div style={{ ...styles.statusHint, background: 'rgba(245,158,11,0.9)', color: '#000' }}>
            <AlertTriangle size={14} />
            <span>{t('trans_low_confidence', 'Sign uncertain. Please hold steady.')}</span>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div style={styles.controlsBar}>
        {!isCameraOn ? (
          <button onClick={startCamera} disabled={mpLoading} className="btn-primary" style={styles.startBtn}>
            <CameraIcon size={18} />
            {mpLoading ? t('common_loading', 'Loading AI Engine...') : t('trans_start_camera', 'Start Camera')}
          </button>
        ) : (
          <div style={styles.activeControls}>
            <button onClick={togglePause} className="btn-secondary" style={styles.ctrlBtn}>
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? t('trans_resume_camera', 'Resume') : t('trans_pause_camera', 'Pause')}
            </button>

            <button onClick={flipCamera} className="btn-secondary" style={styles.iconBtn} title="Flip Camera">
              <FlipHorizontal size={17} />
            </button>

            <button
              onClick={stopCamera}
              className="btn-secondary"
              style={{ ...styles.ctrlBtn, borderColor: 'rgba(239,68,68,0.35)', color: '#EF4444' }}
            >
              <CameraOff size={16} />
              {t('trans_stop_camera', 'Stop')}
            </button>
          </div>
        )}
      </div>

      {/* Privacy Guarantee */}
      <div style={styles.privacyNote}>
        <ShieldCheck size={15} color="var(--pink-soft)" />
        <span>{t('dash_camera_privacy', 'Camera processing runs 100% locally in real time. Video is never recorded or stored.')}</span>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
  },
  viewport: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    background: '#070408',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 46, 147, 0.08)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  canvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    textAlign: 'center',
    background: 'radial-gradient(circle at 50% 40%, rgba(255, 46, 147, 0.08) 0%, rgba(7, 4, 8, 0.98) 80%)',
  },
  placeholderIcon: {
    width: '68px',
    height: '68px',
    borderRadius: '18px',
    background: 'rgba(255, 46, 147, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '14px',
    border: '1px solid rgba(255, 46, 147, 0.3)',
    boxShadow: '0 0 20px rgba(255, 46, 147, 0.2)',
  },
  placeholderTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    marginBottom: '6px',
    color: 'var(--text-primary)',
  },
  placeholderText: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    maxWidth: '320px',
    lineHeight: 1.5,
  },
  errorOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(7, 4, 8, 0.96)',
    padding: '24px',
    textAlign: 'center',
    gap: '12px',
    zIndex: 10,
  },
  errorText: {
    fontSize: '0.88rem',
    color: '#EF4444',
    maxWidth: '320px',
  },
  badgeRow: {
    position: 'absolute',
    top: '14px',
    left: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 5,
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '9999px',
    background: 'rgba(10, 6, 11, 0.85)',
    border: '1px solid rgba(255, 46, 147, 0.4)',
    color: '#FFFFFF',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    backdropFilter: 'blur(10px)',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
  },
  handCountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 11px',
    borderRadius: '9999px',
    background: 'rgba(10, 6, 11, 0.85)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.7rem',
    fontWeight: 600,
    backdropFilter: 'blur(10px)',
  },
  detectedBanner: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '8px 22px',
    background: 'rgba(16, 10, 18, 0.94)',
    backdropFilter: 'blur(16px)',
    border: '1.5px solid var(--pink-primary)',
    borderRadius: '9999px',
    minWidth: '220px',
  },
  detectedLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  detectedSign: {
    fontSize: '1.25rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FDA4AF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  detectedConfidence: {
    fontSize: '0.74rem',
    fontWeight: 700,
    color: 'var(--pink-soft)',
  },
  matchBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.74rem',
    fontWeight: 700,
    color: '#10B981',
  },
  statusHint: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 4,
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '6px 16px',
    background: 'rgba(10, 6, 11, 0.88)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  controlsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startBtn: {
    padding: '12px 28px',
  },
  activeControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  ctrlBtn: {
    padding: '10px 18px',
    fontSize: '0.85rem',
  },
  iconBtn: {
    width: '42px',
    height: '42px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    fontSize: '0.76rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
}