const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '.env') })

const connectDB = require('./config/db')

const app = express()

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}))
app.use(express.json())

// ── Routes ──
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/translations', require('./routes/translationRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SIGNOVA API is running',
    timestamp: new Date().toISOString(),
  })
})

// ── Serve Frontend in Production / Standalone Mode ──
const distPath = path.join(__dirname, '../client/dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  // ── 404 Handler for API ──
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    })
  })
}

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// ── Start Server ──
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║     🚀 SIGNOVA API Server            ║
    ║     📡 http://localhost:${PORT}         ║
    ║     📊 http://localhost:${PORT}/api/health ║
    ╚══════════════════════════════════════╝
    `)
  })
})