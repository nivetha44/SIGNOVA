import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useLanguage } from '../context/LanguageContext'
import { WifiOff } from 'lucide-react'

export default function OfflineBadge() {
  const isOnline = useOnlineStatus()
  const { t } = useLanguage()

  if (isOnline) return null

  return (
    <div style={styles.badge} role="status" aria-live="polite">
      <WifiOff size={14} />
      <span>{t('common_offline_mode', 'Offline Mode Active — Core features work locally')}</span>
    </div>
  )
}

const styles = {
  badge: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 18px',
    background: '#1C0B18',
    color: '#FFFFFF',
    fontSize: '0.8rem',
    fontWeight: 700,
    borderRadius: '9999px',
    border: '1.5px solid var(--pink-primary)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 46, 147, 0.3)',
    backdropFilter: 'blur(12px)',
  },
}
