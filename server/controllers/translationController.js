const Translation = require('../models/Translation')
const User = require('../models/User')

// ── SAVE TRANSLATION ──
exports.saveTranslation = async (req, res) => {
  try {
    const { signs, sentence, averageConfidence, duration } = req.body

    if (!sentence || sentence.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Sentence cannot be empty.',
      })
    }

    const translation = await Translation.create({
      user: req.user._id,
      signs: signs || [],
      sentence: sentence.trim(),
      averageConfidence: averageConfidence || 0,
      duration: duration || 0,
    })

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalTranslations': 1 },
    })

    res.status(201).json({
      success: true,
      message: 'Translation saved.',
      data: translation,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── GET USER TRANSLATIONS ──
exports.getTranslations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const translations = await Translation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await Translation.countDocuments({ user: req.user._id })

    res.json({
      success: true,
      data: {
        translations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
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

// ── DELETE TRANSLATION ──
exports.deleteTranslation = async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id)

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found.',
      })
    }

    // Ensure user owns this translation
    if (translation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized.',
      })
    }

    await translation.deleteOne()

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalTranslations': -1 },
    })

    res.json({
      success: true,
      message: 'Translation deleted.',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ── GET ANALYTICS ──
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id

    // Total translations
    const totalTranslations = await Translation.countDocuments({ user: userId })

    // Average confidence
    const confidenceAgg = await Translation.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, avgConfidence: { $avg: '$averageConfidence' } } },
    ])

    const avgConfidence =
      confidenceAgg.length > 0 ? confidenceAgg[0].avgConfidence : 0

    // Most common signs
    const commonSigns = await Translation.aggregate([
      { $match: { user: userId } },
      { $unwind: '$signs' },
      { $group: { _id: '$signs.sign', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ])

    // Translations per day (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyActivity = await Translation.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      success: true,
      data: {
        totalTranslations,
        averageConfidence: Math.round(avgConfidence * 100) / 100,
        mostCommonSigns: commonSigns,
        dailyActivity,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}