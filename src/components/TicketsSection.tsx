'use client';

import { useTranslations } from 'next-intl';

export default function TicketsSection() {
  const t = useTranslations('tickets');

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Park Free */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--accent)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L4 12h3v4h10v-4h3L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {t('park')}
                </h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{t('parkPrice')}</p>
              </div>
            </div>
          </div>

          {/* Parking */}
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {t('parking')}
                </h3>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{t('parkingPrice')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div
            className="rounded-xl p-5 flex items-start gap-4"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('guided')}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('guidedPrice')}</p>
            </div>
          </div>

          <div
            className="rounded-xl p-5 flex items-start gap-4"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{t('facilities')}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('facilitiesDesc')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
