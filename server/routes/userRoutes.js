const express = require('express')
const {
  updateProfile,
  addLearnedSign,
  updatePracticeStats,
} = require('../controllers/userController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect)

router.put('/profile', updateProfile)
router.post('/learned-sign', addLearnedSign)
router.post('/practice-stats', updatePracticeStats)

module.exports = router