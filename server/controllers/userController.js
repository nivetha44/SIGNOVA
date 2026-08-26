const User = require('../models/User')

// ── UPDATE PROFILE ──
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated.',
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── UPDATE LEARNED SIGN ──
exports.addLearnedSign = async (req, res) => {
  try {
    const { sign, accuracy } = req.body

    const user = await User.findById(req.user._id)

    // Check if sign already learned
    const existing = user.learnedSigns.find((s) => s.sign === sign)

    if (existing) {
      // Update accuracy if better
      if (accuracy > existing.accuracy) {
        existing.accuracy = accuracy
      }
    } else {
      user.learnedSigns.push({ sign, accuracy })
      user.stats.signsLearned = user.learnedSigns.length
    }

    await user.save()

    res.json({
      success: true,
      message: 'Sign progress updated.',
      data: {
        signsLearned: user.stats.signsLearned,
        learnedSigns: user.learnedSigns,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── UPDATE PRACTICE STATS ──
exports.updatePracticeStats = async (req, res) => {
  try {
    const { accuracy } = req.body

    const user = await User.findById(req.user._id)

    user.stats.totalPracticeSessions += 1
    user.stats.practiceAccuracy = Math.round(
      (user.stats.practiceAccuracy * (user.stats.totalPracticeSessions - 1) +
        accuracy) /
        user.stats.totalPracticeSessions
    )

    // Update streak (simplified)
    user.stats.currentStreak += 1
    if (user.stats.currentStreak > user.stats.longestStreak) {
      user.stats.longestStreak = user.stats.currentStreak
    }

    await user.save()

    res.json({
      success: true,
      data: user.stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}