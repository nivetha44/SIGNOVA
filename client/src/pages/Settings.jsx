import { useState } from 'react'
import {
  Moon,
  Sun,
  Monitor,
  Type,
  Trash2,
  CheckCircle2,
} from 'lucide-react'
import { getSettings, saveSettings } from '../services/localStore'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme, textSize, setTextSize } = useTheme()

  const [historyEnabled, setHistoryEnabled] = useState(() => getSettings().historyEnabled !== false)
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(() => getSettings().leaderboardOptIn !== false)
  const [savedBadge, setSavedBadge] = useState(false)

  const showSaved = () => {
    setSavedBadge(true)
    setTimeout(() => setSavedBadge(false), 1800)
  }

  const handleHistoryToggle = (e) => {
    const val = e.target.checked
    setHistoryEnabled(val)
    saveSettings({ historyEnabled: val })
    showSaved()
  }

  const handleLeaderboardToggle = (e) => {
    const val = e.target.checked
    setLeaderboardOptIn(val)
    saveSettings({ leaderboardOptIn: val })
    showSaved()
  }

  const handleClearCache = () => {
    if (!window.confirm('Clear all local app preferences, cache, and history?')) return
    localStorage.clear()
    window.location.reload()
  }

  return (
    <main className="page-wrapper">
      <div className="container" style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p className="eyebrow">{t('nav_settings', 'SYSTEM PREFERENCES')}</p>
          <h1 style={styles.title}>{t('set_title', 'Settings & Accessibility')}</h1>
          <p style={styles.subtitle}>
            {t(
              'set_subtitle',
              'Customize appearance theme, font scaling, interface languages, and privacy preferences.'
            )}
          </p>
        </div>

        {/* Settings List Card */}
        <div className="glass-card" style={styles.settingsCard}>
          {/* Language Preference */}
          <SettingRow
            title={t('set_language', 'Interface Language')}
            description="Choose the language for application UI, instructions, and speech synthesis."
          >
            <div style={styles.btnGroup}>
              {[
                ['en', '🇬🇧 English'],
                ['ta', '🇮🇳 தமிழ் (Tamil)'],
                ['hi', '🇮🇳 हिन्दी (Hindi)'],
              ].map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => {
                    setLanguage(code)
                    showSaved()
                  }}
                  style={{
                    ...styles.optionBtn,
                    background: language === code ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: language === code ? '#FFFFFF' : 'var(--text-secondary)',
                    borderColor: language === code ? 'var(--pink-primary)' : 'var(--border-color)',
                    fontWeight: language === code ? 700 : 500,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Theme Preference */}
          <SettingRow
            title={t('set_appearance', 'Appearance Theme')}
            description="Select a theme that automatically follows your operating system or stays fixed."
          >
            <div style={styles.btnGroup}>
              {[
                ['dark', Moon, t('set_theme_dark', 'Dark (Default)')],
                ['light', Sun, t('set_theme_light', 'Light')],
                ['system', Monitor, t('set_theme_system', 'System')],
              ].map(([val, Icon, label]) => (
                <button
                  key={val}
                  onClick={() => {
                    setTheme(val)
                    showSaved()
                  }}
                  style={{
                    ...styles.optionBtn,
                    background: theme === val ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: theme === val ? '#FFFFFF' : 'var(--text-secondary)',
                    borderColor: theme === val ? 'var(--pink-primary)' : 'var(--border-color)',
                    fontWeight: theme === val ? 700 : 500,
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Text Size Accessibility */}
          <SettingRow
            title={t('set_text_size', 'Text Scaling')}
            description="Increase interface font sizing for enhanced readability and accessibility."
          >
            <div style={styles.btnGroup}>
              {[
                ['normal', '100% (Normal)'],
                ['large', '115% (Large)'],
                ['xlarge', '130% (Extra Large)'],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => {
                    setTextSize(val)
                    showSaved()
                  }}
                  style={{
                    ...styles.optionBtn,
                    background: textSize === val ? 'var(--pink-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: textSize === val ? '#FFFFFF' : 'var(--text-secondary)',
                    borderColor: textSize === val ? 'var(--pink-primary)' : 'var(--border-color)',
                    fontWeight: textSize === val ? 700 : 500,
                  }}
                >
                  <Type size={15} />
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Privacy & History Storage */}
          <SettingRow
            title={t('set_privacy', 'Translation History')}
            description={t(
              'set_save_history',
              'Save translated text and sign sequences to local history. Camera video is never saved.'
            )}
          >
            <label style={styles.switchWrap}>
              <input
                type="checkbox"
                checked={historyEnabled}
                onChange={handleHistoryToggle}
                style={{ cursor: 'pointer', accentColor: 'var(--pink-primary)', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {historyEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </SettingRow>

          {/* Leaderboard Participation */}
          <SettingRow
            title="Leaderboard Participation"
            description={t(
              'set_leaderboard_visible',
              'Allow your learner name and score to be displayed on the community leaderboard.'
            )}
          >
            <label style={styles.switchWrap}>
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={handleLeaderboardToggle}
                style={{ cursor: 'pointer', accentColor: 'var(--pink-primary)', width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {leaderboardOptIn ? 'Opted In' : 'Hidden'}
              </span>
            </label>
          </SettingRow>

          {/* Reset App Data */}
          <SettingRow
            title="Reset Application Data"
            description="Clear all cached history, streaks, and preferences from this device."
          >
            <button onClick={handleClearCache} className="btn-secondary" style={styles.resetBtn}>
              <Trash2 size={15} color="#EF4444" />
              Reset All Local Data
            </button>
          </SettingRow>
        </div>

        {/* Saved confirmation toast */}
        {savedBadge && (
          <div style={styles.toast}>
            <CheckCircle2 size={16} color="#10B981" />
            <span>Preferences saved</span>
          </div>
        )}
      </div>
    </main>
  )
}

function SettingRow({ title, description, children }) {
  return (
    <div style={styles.settingRow}>
      <div style={styles.settingInfo}>
        <h3 style={styles.settingTitle}>{title}</h3>
        <p style={styles.settingDesc}>{description}</p>
      </div>
      <div style={styles.settingControls}>{children}</div>
    </div>
  )
}

const styles = {
  container: {
    padding: '36px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '900px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
    fontWeight: 900,
    color: 'var(--text-primary)',
  },
  subtitle: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    maxWidth: '650px',
  },
  settingsCard: {
    padding: '10px 30px',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '22px',
    background: 'linear-gradient(180deg, rgba(28, 11, 24, 0.7) 0%, rgba(11, 8, 13, 0.9) 100%)',
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '24px 0',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
  },
  settingInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxWidth: '450px',
  },
  settingTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#FFFFFF',
  },
  settingDesc: {
    fontSize: '0.84rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  settingControls: {
    display: 'flex',
    alignItems: 'center',
  },
  btnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  optionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  switchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  resetBtn: {
    padding: '8px 16px',
    fontSize: '0.8rem',
    color: '#EF4444',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: '#120914',
    border: '1px solid var(--pink-primary)',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#FFFFFF',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 46, 147, 0.25)',
    zIndex: 9999,
  },
}
