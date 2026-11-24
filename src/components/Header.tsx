'use client';

import { useTranslations, useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function Header({ solid = false }: { solid?: boolean }) {
  const t = useTranslations('header');
  const th = useTranslations('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const locale = useLocale() as Locale;
  const logoHref = `/${locale}`;
  const opaque = solid || scrolled || menuOpen;
  const near = {en:'Nearby places',ro:'În apropiere',es:'Lugares cercanos',zh:'周边景点'}[locale];
  const menu = {en:'Navigation menu',ro:'Meniu de navigare',es:'Menú de navegación',zh:'导航菜单'}[locale];
  const links = [...(['gallery','reviews','map'] as const).map(section => ({href:logoHref+'#'+section, label:t(section)})), {href:logoHref+'/nearby',label:near}];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: opaque ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: opaque ? '1px solid var(--border-color)' : 'none',
        backdropFilter: opaque ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href={logoHref} className="font-display text-lg font-semibold tracking-tight" style={{ color: opaque ? 'var(--text-primary)' : '#fff' }}>
          {th('title')}
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map(({href,label}) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium transition-colors"
              style={{ color: opaque ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)' }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <button type="button" aria-label={menu} aria-controls="mobile-menu" aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-md bg-[var(--tag-bg)] text-[var(--tag-text)]" onClick={()=>setMenuOpen(!menuOpen)}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-menu" className="lg:hidden grid px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        {links.map(({href,label})=><a key={href} href={href} onClick={()=>setMenuOpen(false)} className="p-2 hover:underline">{label}</a>)}
      </nav>}
    </header>
  );
}
