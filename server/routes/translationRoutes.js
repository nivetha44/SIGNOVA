const express = require('express')
const {
  saveTranslation,
  getTranslations,
  deleteTranslation,
  getAnalytics,
} = require('../controllers/translationController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect) // All routes require auth

router.post('/', saveTranslation)
router.get('/', getTranslations)
router.get('/analytics', getAnalytics)
router.delete('/:id', deleteTranslation)

module.exports = router