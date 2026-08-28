// ISL Grammar Engine & Natural Language Smoothing Layer
// Transforms raw ISL token sequences into natural grammatical sentences in English, Tamil, and Hindi.

const PATTERNS = [
  {
    match: ['I', 'WANT', 'GO', 'HOME'],
    en: 'I want to go home.',
    ta: 'நான் வீட்டிற்கு செல்ல விரும்புகிறேன்.',
    hi: 'मैं घर जाना चाहता हूँ।',
  },
  {
    match: ['I', 'GO', 'HOME'],
    en: 'I am going home.',
    ta: 'நான் வீட்டிற்கு செல்கிறேன்.',
    hi: 'मैं घर जा रहा हूँ।',
  },
  {
    match: ['I', 'YESTERDAY', 'MARKET', 'GO'],
    en: 'I went to the market yesterday.',
    ta: 'நான் நேற்று சந்தைக்கு சென்றேன்.',
    hi: 'मैं कल बाजार गया था।',
  },
  {
    match: ['YOU', 'WATER', 'WANT'],
    en: 'Do you want some water?',
    ta: 'உங்களுக்கு தண்ணீர் வேண்டுமா?',
    hi: 'क्या आपको पानी चाहिए?',
  },
  {
    match: ['PLEASE', 'HELP'],
    en: 'Please help me.',
    ta: 'தயவுசெய்து எனக்கு உதவுங்கள்.',
    hi: 'कृपया मेरी मदद करें।',
  },
  {
    match: ['PLEASE', 'HELP', 'I'],
    en: 'Please help me.',
    ta: 'தயவுசெய்து எனக்கு உதவுங்கள்.',
    hi: 'कृपया मेरी मदद करें।',
  },
  {
    match: ['HELLO', 'YOU', 'GOOD'],
    en: 'Hello! How are you doing?',
    ta: 'வணக்கம்! நீங்கள் நலமாக இருக்கிறீர்களா?',
    hi: 'नमस्ते! आप कैसे हैं?',
  },
  {
    match: ['THANK YOU', 'HELP'],
    en: 'Thank you very much for your help.',
    ta: 'உங்கள் உதவிக்கு மிக்க நன்றி.',
    hi: 'आपकी मदद के लिए बहुत-बहुत धन्यवाद।',
  },
  {
    match: ['SORRY', 'I'],
    en: 'I am really sorry.',
    ta: 'என்னை மன்னிக்கவும்.',
    hi: 'मुझे वास्तव में खेद है।',
  },
  {
    match: ['FOOD', 'GOOD'],
    en: 'The food is very good.',
    ta: 'உணவு மிகவும் நன்றாக உள்ளது.',
    hi: 'खाना बहुत अच्छा है।',
  },
  {
    match: ['I', 'LOVE', 'YOU'],
    en: 'I love you.',
    ta: 'நான் உன்னை நேசிக்கிறேன்.',
    hi: 'मैं आपसे प्यार करता हूँ।',
  },
  {
    match: ['WATER', 'PLEASE'],
    en: 'Please give me some water.',
    ta: 'தயவுசெய்து தண்ணீர் தாருங்கள்.',
    hi: 'कृपया पानी दीजिए।',
  },
  {
    match: ['DOCTOR', 'HELP'],
    en: 'I need a doctor, please help.',
    ta: 'மருத்துவ உதவி தேவை, உதவுங்கள்.',
    hi: 'मुझे डॉक्टर की आवश्यकता है, कृपया मदद करें।',
  },
]

export function smoothGrammar(rawWords = [], targetLang = 'en') {
  if (!rawWords || !rawWords.length) return ''

  const upperTokens = rawWords.map((w) => w.trim().toUpperCase()).filter(Boolean)
  if (!upperTokens.length) return ''

  // 1. Direct Pattern Matching
  const exactMatch = PATTERNS.find(
    (p) => p.match.length === upperTokens.length && p.match.every((val, i) => val === upperTokens[i])
  )
  if (exactMatch && exactMatch[targetLang]) {
    return exactMatch[targetLang]
  }

  // 2. Subsequence / Permutation Matching
  const partialMatch = PATTERNS.find(
    (p) => p.match.every((token) => upperTokens.includes(token)) && upperTokens.length <= p.match.length + 1
  )
  if (partialMatch && partialMatch[targetLang]) {
    return partialMatch[targetLang]
  }

  // 3. Fallback Heuristic Smoothing
  const joined = rawWords.join(' ').toLowerCase()
  if (targetLang === 'ta') {
    return `${rawWords.join(' ')}.`
  }
  if (targetLang === 'hi') {
    return `${rawWords.join(' ')}।`
  }

  // English fallback: Proper casing and terminal punctuation
  const capitalized = joined.charAt(0).toUpperCase() + joined.slice(1)
  return `${capitalized}.`
}

export function formatRawSequence(words = []) {
  return words.filter(Boolean).join(' → ')
}
