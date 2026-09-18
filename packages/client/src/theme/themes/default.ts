import { IThemeRGB } from '../types';

/**
 * Claude Light Theme
 * Warm cream canvas, beige sidebar, charcoal text, and signature terracotta accents.
 */
export const defaultTheme: IThemeRGB = {
  // Text colors
  'rgb-text-primary': '31 30 29', // #1F1E1D (Claude charcoal)
  'rgb-text-secondary': '89 85 78', // #59554E (warm gray)
  'rgb-text-secondary-alt': '107 102 94', // #6B665E (muted warm gray)
  'rgb-text-tertiary': '107 102 94', // #6B665E (muted warm gray)
  'rgb-text-muted': '107 102 94', // #6B665E
  'rgb-text-warning': '175 75 5', // #af4b05 (amber-750)
  'rgb-text-destructive': '205 30 30', // #cd1e1e (red-650)
  'rgb-shimmer-base': '31 30 29', // #1F1E1D, matching text-primary
  'rgb-shimmer-dip': '129 130 134', // #818286

  // Link and accent colors (Claude terracotta)
  'rgb-link': '201 100 66', // #c96442
  'rgb-link-hover': '179 85 53', // #b35535
  'rgb-link-visited': '147 51 234', // #9333ea (purple-600)
  'rgb-accent-primary': '217 119 87', // #D97757 (Claude terracotta)
  'rgb-accent-primary-hover': '201 100 66', // #C96442

  // Ring colors
  'rgb-ring-primary': '107 102 94', // #6B665E

  // Header colors
  'rgb-header-primary': '250 249 245', // #FAF9F5 (Claude canvas)
  'rgb-header-hover': '243 239 230', // #F3EFE6 (Claude sidebar beige)
  'rgb-header-button-hover': '243 239 230', // #F3EFE6

  // Surface colors
  'rgb-surface-active': '235 230 220', // #EBE6DC
  'rgb-surface-active-alt': '226 220 208', // #E2DCD0
  'rgb-surface-hover': '238 234 225', // #EEEAE1
  'rgb-surface-hover-alt': '230 225 215', // #E6E1D7
  'rgb-surface-composer-hover': '238 234 225', // #EEEAE1
  'rgb-surface-primary': '250 249 245', // #FAF9F5 (Claude warm canvas)
  'rgb-chart-widget-surface': '250 249 245', // #FAF9F5
  'rgb-chart-widget-stroke': '230 225 216', // #E6E1D8
  'rgb-surface-primary-alt': '243 239 230', // #F3EFE6 (Claude sidebar beige)
  'rgb-surface-primary-contrast': '238 234 224', // #EEEAE0
  'rgb-surface-secondary': '243 239 230', // #F3EFE6 (Claude sidebar beige)
  'rgb-surface-secondary-alt': '238 234 224', // #EEEAE0
  'rgb-surface-tertiary': '238 234 224', // #EEEAE0
  'rgb-surface-tertiary-alt': '250 249 245', // #FAF9F5
  'rgb-surface-dialog': '250 249 245', // #FAF9F5
  'rgb-surface-overlay': '89 85 78', // #59554E
  'rgb-surface-submit': '217 119 87', // #D97757 (Claude terracotta)
  'rgb-surface-submit-hover': '201 100 66', // #C96442
  'rgb-surface-destructive': '185 28 28', // #b91c1c (red-700)
  'rgb-surface-destructive-hover': '153 27 27', // #991b1b (red-800)
  'rgb-surface-chat': '250 249 245', // #FAF9F5
  'rgb-surface-code': '243 239 230', // #F3EFE6
  'rgb-surface-inverted': '31 30 29', // #1F1E1D
  'rgb-surface-inverted-hover': '46 44 41', // #2E2C29
  'rgb-text-inverted': '250 249 245', // #FAF9F5
  'rgb-surface-fixed': '250 249 245', // #FAF9F5 — same in light + dark
  'rgb-surface-fixed-hover': '243 239 230', // #F3EFE6 — same in light + dark
  'rgb-text-fixed': '31 30 29', // #1F1E1D — same in light + dark

  // Border colors
  'rgb-border-light': '230 225 216', // #E6E1D8
  'rgb-border-medium': '218 212 201', // #DAD4C9
  'rgb-border-medium-alt': '218 212 201', // #DAD4C9
  'rgb-border-heavy': '191 184 170', // #BFB8AA
  'rgb-border-xheavy': '158 150 135', // #9E9687
  'rgb-border-destructive': '220 38 38', // #dc2626 (red-600)

  // Status colors
  'rgb-status-success': '4 120 87', // #047857 (green-700)
  'rgb-status-success-subtle': '236 253 245', // #ecfdf5 (green-50)
  'rgb-status-success-border': '110 231 183', // #6ee7b7 (green-300)
  'rgb-status-success-strong': '2 133 94', // #02855e
  'rgb-status-info': '37 99 235', // #2563eb (blue-600)
  'rgb-status-info-subtle': '239 246 255', // #eff6ff (blue-50)
  'rgb-status-info-border': '147 197 253', // #93c5fd (blue-300)
  'rgb-status-info-strong': '89 85 78', // #59554E
  'rgb-status-warning': '180 83 9', // #b45309 (amber-700)
  'rgb-status-warning-subtle': '255 251 235', // #fffbeb (amber-50)
  'rgb-status-warning-border': '252 211 77', // #fcd34d (amber-300)
  'rgb-status-warning-strong': '199 82 9', // #c75209
  'rgb-status-error': '185 28 28', // #b91c1c (red-700)
  'rgb-status-error-subtle': '254 242 242', // #fef2f2 (red-50)
  'rgb-status-error-border': '252 165 165', // #fca5a5 (red-300)
  'rgb-status-error-strong': '224 47 31', // #e02f1f
  'rgb-status-neutral': '89 85 78', // #59554E
  'rgb-status-neutral-subtle': '243 239 230', // #F3EFE6
  'rgb-status-neutral-border': '218 212 201', // #DAD4C9
  /** Verified mark. */
  'rgb-status-verified': '37 99 235', // #2563eb (blue-600)
  'rgb-text-on-status': '255 255 255', // #fff (white)

  // Brand colors
  'rgb-brand-purple': '126 34 206', // #7e22ce (purple-700)

  /** Code syntax highlighting */
  'rgb-syntax-text': '31 30 29', // #1F1E1D
  'rgb-syntax-comment': '107 102 94', // #6B665E
  'rgb-syntax-meta': '89 85 78', // #59554E
  'rgb-syntax-builtin': '154 103 0', // #9a6700
  'rgb-syntax-keyword': '5 80 174', // #0550ae
  'rgb-syntax-string': '10 123 98', // #0a7b62
  'rgb-syntax-attr': '154 47 106', // #9a2f6a
  'rgb-syntax-title': '180 35 24', // #b42318

  /** Categorical series scale. */
  'rgb-series-1': '5 110 189', // #056ebd (cerulean)
  'rgb-series-2': '233 86 13', // #e9560d (orange)
  'rgb-series-3': '0 148 142', // #00948e (aqua)
  'rgb-series-4': '182 123 5', // #b67b05 (amber)
  'rgb-series-5': '216 90 142', // #d85a8e (magenta)
  'rgb-series-6': '126 35 205', // #7e23cd (violet)
  'rgb-series-7': '1 131 1', // #018301 (green)
  'rgb-series-8': '63 81 181', // #3f51b5 (indigo)

  /** Unchecked switch track. */
  'rgb-switch-unchecked': '144 144 144', // #909090

  // Presentation
  'rgb-presentation': '250 249 245', // #FAF9F5 (Claude canvas)
};
