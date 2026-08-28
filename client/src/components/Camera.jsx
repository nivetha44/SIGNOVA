import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Camera as CameraIcon,
  CameraOff,
  Loader2,
  AlertCircle,
  Hand,
  FlipHorizontal,
} from 'lucide-react'
import { useHandTracking } from '../hooks/useHandTracking'

export default function Camera({ onGestureDetected }) {
  const [isCameraOn, setIsCameraOn] = useState(false)
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
    startTracking,
    stopTracking,
  } = useHandTracking()

  // ── Start Camera ──
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)

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

        // Start hand tracking once video is playing
        if (isInitialized) {
          startTracking(videoRef.current, canvasRef.current)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions.'
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
  }, [stopTracking])

  // ── Start tracking when MediaPipe initializes (if camera already on) ──
  useEffect(() => {
    if (isInitialized && isCameraOn && videoRef.current) {
      startTracking(videoRef.current, canvasRef.current)
    }
  }, [isInitialized, isCameraOn, startTracking])

  // ── Pass gesture to parent ──
  useEffect(() => {
    if (gesture && onGestureDetected) {
      onGestureDetected(gesture)
    }
  }, [gesture, onGestureDetected])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  // ── Flip camera ──
  const flipCamera = () => {
    stopCamera()
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
    setTimeout(() => startCamera(), 300)
  }

  return (
    <div style={styles.container}>
      {/* Camera Viewport */}
      <div style={styles.viewport}>
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

        {/* Canvas Overlay for Landmarks */}
        <canvas
          ref={canvasRef}
          style={{
            ...styles.canvas,
            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
            display: isCameraOn ? 'block' : 'none',
          }}
        />

        {/* Placeholder when camera is off */}
        {!isCameraOn && !cameraError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.placeholder}
          >
            <Hand size={64} color="rgba(108,99,255,0.3)" />
            <p style={styles.placeholderText}>
              Camera is off
            </p>
            <p style={styles.placeholderSubtext}>
              Click "Start Camera" to begin sign language recognition
            </p>
          </motion.div>
        )}

        {/* Camera / AI Error */}
        {(cameraError || mpError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={styles.errorOverlay}
          >
            <AlertCircle size={48} color="#EF4444" />
            <p style={styles.errorText}>{cameraError || `AI Model Error: ${mpError}`}</p>
          </motion.div>
        )}

        {/* MediaPipe Loading */}
        {mpLoading && (
          <div style={styles.loadingBadge}>
            <Loader2 size={14} className="spin" />
            Loading AI Model...
          </div>
        )}

        {/* Live Indicator */}
        {isCameraOn && (
          <div style={styles.liveBadge}>
            <div style={styles.liveDot} />
            LIVE
          </div>
        )}

        {/* Gesture Overlay on Camera */}
        {isCameraOn && gesture && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.gestureOverlay}
          >
            <span style={styles.gestureOverlaySign}>
              {gesture.sign}
            </span>
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            disabled={mpLoading}
            style={{
              ...styles.startBtn,
              opacity: mpLoading ? 0.5 : 1,
            }}
          >
            <CameraIcon size={18} />
            {mpLoading ? 'Loading AI...' : 'Start Camera'}
          </button>
        ) : (
          <div style={styles.activeControls}>
            <button onClick={flipCamera} style={styles.iconBtn}>
              <FlipHorizontal size={18} />
            </button>
            <button onClick={stopCamera} style={styles.stopBtn}>
              <CameraOff size={18} />
              Stop Camera
            </button>
          </div>
        )}

        {/* Status */}
        <div style={styles.status}>
          <div
            style={{
              ...styles.statusDot,
              background: isCameraOn
                ? '#22C55E'
                : mpLoading
                ? '#F59E0B'
                : '#6B7280',
            }}
          />
          <span style={styles.statusText}>
            {isCameraOn
              ? 'Camera Active • AI Tracking'
              : mpLoading
              ? 'Initializing MediaPipe...'
              : 'Camera Inactive'}
          </span>
        </div>
      </div>

      {/* Spin animation for loader */}
      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  viewport: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    background: '#0a0e1a',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  placeholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    zIndex: 1,
  },
  placeholderText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#9CA3AF',
  },
  placeholderSubtext: {
    fontSize: '0.85rem',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '280px',
  },
  errorOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    zIndex: 3,
    background: 'rgba(0,0,0,0.8)',
  },
  errorText: {
    fontSize: '0.9rem',
    color: '#EF4444',
    textAlign: 'center',
    maxWidth: '300px',
  },
  loadingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#F59E0B',
    zIndex: 5,
  },
  liveBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#EF4444',
    zIndex: 5,
    letterSpacing: '1px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#EF4444',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  gestureOverlay: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 24px',
    background: 'rgba(108, 99, 255, 0.9)',
    borderRadius: '9999px',
    zIndex: 5,
  },
  gestureOverlaySign: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  startBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  activeControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  iconBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  stopBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#EF4444',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '0.8rem',
    color: '#6B7280',
    fontWeight: 500,
  },
}