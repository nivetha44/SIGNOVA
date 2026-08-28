// Resilient Local Storage Engine (Offline-First)
// Persists user preferences, translation history, favourites, XP, streaks, and practice stats.

const KEYS = {
  history: 'signova_history',
  favourites: 'signova_favourites',
  stats: 'signova_stats',
  settings: 'signova_settings',
  daily: 'signova_daily_challenge',
  frequent: 'signova_frequent_phrases',
}

const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to write to localStorage for key ${key}:`, err)
  }
}

// ─── TRANSLATION HISTORY ───
export const getHistory = () => safeRead(KEYS.history, [])

export const saveLocalTranslation = (item) => {
  const settings = getSettings()
  if (settings.historyEnabled === false) return getHistory()

  const current = getHistory()
  const entry = {
    id: item.id || crypto.randomUUID?.() || `trans_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    signs: item.signs || [],
    rawSentence: item.rawSentence || item.signs?.join(' ') || '',
    sentence: item.sentence || item.rawSentence || '',
    language: item.language || 'en',
    averageConfidence: item.averageConfidence || 0.85,
    isFavourite: item.isFavourite || false,
    createdAt: item.createdAt || new Date().toISOString(),
  }

  // Track frequent phrase
  if (entry.sentence) {
    trackFrequentPhrase(entry.sentence)
  }

  const next = [entry, ...current.filter((t) => t.id !== entry.id)].slice(0, 100)
  safeWrite(KEYS.history, next)
  return next
}

export const deleteLocalTranslation = (id) => {
  const next = getHistory().filter((t) => t.id !== id)
  safeWrite(KEYS.history, next)
  return next
}

export const clearHistory = () => {
  safeWrite(KEYS.history, [])
  return []
}

// ─── FAVOURITES ───
export const getFavourites = () => safeRead(KEYS.favourites, [])

export const toggleFavourite = (idOrItem) => {
  const current = getFavourites()
  const id = typeof idOrItem === 'string' ? idOrItem : idOrItem.id || idOrItem.name
  const exists = current.some((item) => (typeof item === 'string' ? item === id : item.id === id))

  const next = exists
    ? current.filter((item) => (typeof item === 'string' ? item !== id : item.id !== id))
    : [...current, typeof idOrItem === 'string' ? idOrItem : { id, ...idOrItem }]

  safeWrite(KEYS.favourites, next)
  return next
}

export const isFavourite = (id) => {
  const current = getFavourites()
  return current.some((item) => (typeof item === 'string' ? item === id : item.id === id))
}

// ─── STATS & XP ───
export const getStats = () =>
  safeRead(KEYS.stats, {
    xp: 250,
    currentStreak: 3,
    bestStreak: 7,
    accuracy: 91,
    sessions: 12,
    signsLearned: 14,
    practiceMinutes: 45,
    level: 2,
    categoryMastery: {
      Greetings: 85,
      Basics: 90,
      Food: 70,
      Emotions: 75,
      Family: 40,
      Emergency: 60,
      Verbs: 50,
      Nouns: 45,
    },
  })

export const updateStats = (patch) => {
  const current = getStats()
  const next = { ...current, ...patch }
  safeWrite(KEYS.stats, next)
  return next
}

export const addXP = (amount) => {
  const current = getStats()
  const newXP = (current.xp || 0) + amount
  const newLevel = Math.floor(newXP / 500) + 1
  return updateStats({ xp: newXP, level: newLevel })
}

export const logPracticeSession = (minutes = 5, sessionAccuracy = 90) => {
  const current = getStats()
  const sessions = (current.sessions || 0) + 1
  const practiceMinutes = (current.practiceMinutes || 0) + minutes
  const totalAcc = ((current.accuracy || 85) * (sessions - 1) + sessionAccuracy) / sessions
  return updateStats({
    sessions,
    practiceMinutes,
    accuracy: Math.round(totalAcc),
  })
}

// ─── DAILY CHALLENGE ───
export const getDailyChallenge = () => {
  const today = new Date().toISOString().slice(0, 10)
  const saved = safeRead(KEYS.daily, null)
  if (saved && saved.date === today) {
    return saved
  }

  // Daily target signs
  const initialDaily = {
    date: today,
    targets: ['HELLO', 'THANK YOU', 'PLEASE'],
    completed: [],
    bonusClaimed: false,
    rewardXP: 150,
  }
  safeWrite(KEYS.daily, initialDaily)
  return initialDaily
}

export const completeDailySign = (signName) => {
  const daily = getDailyChallenge()
  if (!daily.targets.includes(signName) || daily.completed.includes(signName)) {
    return daily
  }
  const nextCompleted = [...daily.completed, signName]
  let bonusClaimed = daily.bonusClaimed
  if (nextCompleted.length === daily.targets.length && !daily.bonusClaimed) {
    addXP(daily.rewardXP)
    bonusClaimed = true
  }
  const next = { ...daily, completed: nextCompleted, bonusClaimed }
  safeWrite(KEYS.daily, next)
  return next
}

export const getFrequentlyUsed = () =>
  safeRead(KEYS.frequent, [
    'Hello, how are you today?',
    'Thank you for your kind help.',
    'I want to go home.',
    'Please give me some water.',
  ])

export const getFrequentPhrases = () => {
  const list = getFrequentlyUsed()
  return list.map((text, idx) => ({ id: `phrase_${idx}`, text, language: 'en' }))
}

export const trackFrequentPhrase = (phrase) => {
  if (!phrase || typeof phrase !== 'string') return
  const current = getFrequentlyUsed()
  const filtered = current.filter((p) => p.toLowerCase() !== phrase.toLowerCase())
  const next = [phrase, ...filtered].slice(0, 8)
  safeWrite(KEYS.frequent, next)
}

export const removeFrequentPhrase = (phrase) => {
  const next = getFrequentlyUsed().filter((p) => p !== phrase)
  safeWrite(KEYS.frequent, next)
  return next
}

// ─── SETTINGS ───
export const getSettings = () =>
  safeRead(KEYS.settings, {
    theme: 'system',
    textSize: 'normal',
    language: 'en',
    historyEnabled: true,
    leaderboardOptIn: true,
  })

export const saveSettings = (patch) => {
  const current = getSettings()
  const next = { ...current, ...patch }
  safeWrite(KEYS.settings, next)
  return next
}