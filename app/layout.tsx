// @req SCD-THEME-001
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import styles from './layout.module.css';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';

export const metadata: Metadata = {
  title: 'SDD Navigator Dashboard',
  description: 'Specification coverage dashboard',
};

// Anti-FOUC: inline children with `beforeInteractive` are inlined by Next into
// the initial HTML head and run synchronously before first paint — so the
// correct theme is applied before any content renders (no flash).
const themeBootstrap = `(function(){
  var stored = '';
  try { stored = localStorage.getItem('theme') || ''; } catch (_) {}
  var theme = stored === 'light' || stored === 'dark'
    ? stored
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        <header className={styles.siteHeader}>
          <nav className={styles.nav} aria-label="Site navigation">
            <span className={styles.appTitle}>SDD Navigator</span>
            <ThemeToggle />
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
