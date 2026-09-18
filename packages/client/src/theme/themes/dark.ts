import { IThemeRGB } from '../types';

/**
 * Claude Dark Theme
 * Deep warm charcoal canvas, dark sidebar, warm cream text, and signature terracotta accents.
 */
export const darkTheme: IThemeRGB = {
  // Text colors
  'rgb-text-primary': '245 243 239', // #F5F3EF (warm cream)
  'rgb-text-secondary': '208 203 193', // #D0CBC1
  'rgb-text-secondary-alt': '181 176 166', // #B5B0A6
  'rgb-text-tertiary': '181 176 166', // #B5B0A6
  'rgb-text-muted': '181 176 166', // #B5B0A6
  'rgb-text-warning': '245 158 11', // #f59e0b (amber-500)
  'rgb-text-destructive': '248 113 113', // #f87171 (red-400)
  'rgb-shimmer-base': '245 243 239', // #F5F3EF, carried at 0.8 alpha
  'rgb-shimmer-dip': '179 179 179', // #b3b3b3

  // Link and accent colors (Claude terracotta)
  'rgb-link': '224 137 108', // #E0896C
  'rgb-link-hover': '235 158 133', // #EB9E85
  'rgb-link-visited': '192 132 252', // #c084fc (purple-400)
  'rgb-accent-primary': '217 119 87', // #D97757 (Claude terracotta)
  'rgb-accent-primary-hover': '224 137 108', // #E0896C

  // Ring colors
  'rgb-ring-primary': '181 176 166', // #B5B0A6

  // Header colors
  'rgb-header-primary': '30 29 27', // #1E1D1B (Claude dark canvas)
  'rgb-header-hover': '42 40 37', // #2A2825
  'rgb-header-button-hover': '42 40 37', // #2A2825

  // Surface colors
  'rgb-surface-active': '51 49 45', // #33312D
  'rgb-surface-active-alt': '66 63 58', // #423F3A
  'rgb-surface-hover': '46 44 41', // #2E2C29
  'rgb-surface-hover-alt': '56 54 50', // #383632
  'rgb-surface-composer-hover': '46 44 41', // #2E2C29
  'rgb-surface-primary': '30 29 27', // #1E1D1B (Claude dark canvas)
  'rgb-chart-widget-surface': '37 36 34', // #252422
  'rgb-chart-widget-stroke': '51 49 45', // #33312D
  'rgb-surface-primary-alt': '24 23 22', // #181716 (Claude dark sidebar)
  'rgb-surface-primary-contrast': '37 36 34', // #252422
  'rgb-surface-secondary': '24 23 22', // #181716
  'rgb-surface-secondary-alt': '37 36 34', // #252422
  'rgb-surface-tertiary': '42 40 37', // #2A2825
  'rgb-surface-tertiary-alt': '42 40 37', // #2A2825
  'rgb-surface-dialog': '37 36 34', // #252422
  'rgb-surface-overlay': '0 0 0', // #000 (black)
  'rgb-surface-submit': '217 119 87', // #D97757 (Claude terracotta)
  'rgb-surface-submit-hover': '224 137 108', // #E0896C
  'rgb-surface-destructive': '153 27 27', // #991b1b (red-800)
  'rgb-surface-destructive-hover': '127 29 29', // #7f1d1d (red-900)
  'rgb-surface-chat': '30 29 27', // #1E1D1B
  'rgb-surface-code': '37 36 34', // #252422
  'rgb-surface-inverted': '250 249 245', // #FAF9F5
  'rgb-surface-inverted-hover': '243 239 230', // #F3EFE6
  'rgb-text-inverted': '31 30 29', // #1F1E1D
  'rgb-surface-fixed': '250 249 245', // #FAF9F5 — same in light + dark
  'rgb-surface-fixed-hover': '243 239 230', // #F3EFE6 — same in light + dark
  'rgb-text-fixed': '31 30 29', // #1F1E1D — same in light + dark

  // Border colors
  'rgb-border-light': '51 49 45', // #33312D
  'rgb-border-medium': '66 63 58', // #423F3A
  'rgb-border-medium-alt': '66 63 58', // #423F3A
  'rgb-border-heavy': '92 88 81', // #5C5851
  'rgb-border-xheavy': '122 117 109', // #7A756D
  'rgb-border-destructive': '239 68 68', // #ef4444 (red-500)

  // Status colors
  'rgb-status-success': '110 231 183', // #6ee7b7 (green-300)
  'rgb-status-success-subtle': '2 44 34', // #022c22 (green-950)
  'rgb-status-success-border': '6 95 70', // #065f46 (green-800)
  'rgb-status-success-strong': '8 135 89', // #088759
  'rgb-status-info': '147 197 253', // #93c5fd (blue-300)
  'rgb-status-info-subtle': '23 37 84', // #172554 (blue-950)
  'rgb-status-info-border': '30 64 175', // #1e40af (blue-800)
  'rgb-status-info-strong': '181 176 166', // #B5B0A6
  'rgb-status-warning': '252 211 77', // #fcd34d (amber-300)
  'rgb-status-warning-subtle': '69 26 3', // #451a03 (amber-950)
  'rgb-status-warning-border': '146 64 14', // #92400e (amber-800)
  'rgb-status-warning-strong': '146 64 14', // #92400e (amber-800)
  'rgb-status-error': '252 165 165', // #fca5a5 (red-300)
  'rgb-status-error-subtle': '69 10 10', // #450a0a (red-950)
  'rgb-status-error-border': '153 27 27', // #991b1b (red-800)
  'rgb-status-error-strong': '153 27 27', // #991b1b (red-800)
  'rgb-status-neutral': '208 203 193', // #D0CBC1
  'rgb-status-neutral-subtle': '37 36 34', // #252422
  'rgb-status-neutral-border': '51 49 45', // #33312D
  /** Verified mark. */
  'rgb-status-verified': '26 127 216', // #1a7fd8
  'rgb-text-on-status': '255 255 255', // #fff (white)

  // Brand colors
  'rgb-brand-purple': '171 104 255', // #ab68ff

  /** Code syntax highlighting */
  'rgb-syntax-text': '245 243 239', // #F5F3EF
  'rgb-syntax-comment': '144 144 144', // #909090
  'rgb-syntax-meta': '166 166 166', // #a6a6a6
  'rgb-syntax-builtin': '233 149 12', // #e9950c
  'rgb-syntax-keyword': '46 149 211', // #2e95d3
  'rgb-syntax-string': '0 166 125', // #00a67d
  'rgb-syntax-attr': '223 48 121', // #df3079
  'rgb-syntax-title': '242 44 61', // #f22c3d

  /** Categorical series scale. */
  'rgb-series-1': '9 140 238', // #098cee (cerulean)
  'rgb-series-2': '217 87 35', // #d95723 (orange)
  'rgb-series-3': '6 158 152', // #069e98 (aqua)
  'rgb-series-4': '200 133 12', // #c8850c (amber)
  'rgb-series-5': '213 82 130', // #d55282 (magenta)
  'rgb-series-6': '171 104 254', // #ab68fe (violet)
  'rgb-series-7': '80 167 49', // #50a731 (green)
  'rgb-series-8': '120 130 190', // #8082be (indigo)

  /** Unchecked switch track. */
  'rgb-switch-unchecked': '106 106 106', // #6a6a6a

  // Presentation
  'rgb-presentation': '30 29 27', // #1E1D1B (Claude dark canvas)
};
