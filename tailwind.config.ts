import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:   'rgb(var(--color-background) / <alpha-value>)',
        surface:      'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2':  'rgb(var(--color-surface-2) / <alpha-value>)',
        border:       'rgb(var(--color-border) / <alpha-value>)',
        text:         'rgb(var(--color-text) / <alpha-value>)',
        muted:        'rgb(var(--color-muted) / <alpha-value>)',
        accent:       'rgb(var(--color-accent) / <alpha-value>)',
        'accent-dim': 'rgb(var(--color-accent) / 0.12)',
        success:      '#22c55e',
        danger:       '#ef4444',
        warning:      '#f59e0b',
        info:         '#3b82f6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgb(var(--color-shadow) / 0.12), 0 0 0 1px rgb(var(--color-border) / 0.5)',
        glow: '0 0 20px rgb(var(--color-accent) / 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
