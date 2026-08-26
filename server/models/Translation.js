const mongoose = require('mongoose')

const translationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    signs: [
      {
        sign: String,
        confidence: Number,
        timestamp: Date,
      },
    ],
    sentence: {
      type: String,
      required: true,
    },
    averageConfidence: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Index for fast user queries
translationSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Translation', translationSchema)