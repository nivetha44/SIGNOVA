const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ── REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      })
    }

    // Create user
    const user = await User.create({ name, email, password })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          stats: user.stats,
        },
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      })
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      })
    }

    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          stats: user.stats,
          learnedSigns: user.learnedSigns,
        },
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── GET CURRENT USER ──
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          stats: user.stats,
          learnedSigns: user.learnedSigns,
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}