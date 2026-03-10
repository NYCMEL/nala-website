/**
 * mtk-buy.config.js
 * Plain global config — loaded as a regular <script> (no type="module").
 * Exposes window.MTK_BUY_CONFIG for mtk-buy.js to consume.
 */
window.MTK_BUY_CONFIG = {
  component: 'mtk-buy',
  version:   '1.0.0',

  popup: {
    title:           'You have reached the end of Free Trial.',
    subtitle:        'You may continue the course by purchasing one of our courses.',
    icon:            'school',
    closeOnBackdrop: true,
    closeOnEscape:   true,
    showCloseButton: true
  },

  button: {
    label:     'Purchase Course',
    icon:      'shopping_cart',
    ariaLabel: 'Purchase Course to continue learning'
  },

  events: {
    open:     'mtk-buy:open',
    close:    'mtk-buy:close',
    purchase: 'mtk-buy:purchase',
    ready:    'mtk-buy:ready'
  },

  theme: {
    primaryColor:    '#1976d2',
    primaryDark:     '#1565c0',
    primaryLight:    '#E3F2FD',
    accentColor:     '#f57c00',
    accentHover:     '#e65100',
    surfaceColor:    '#ffffff',
    textPrimary:     '#212121',
    textSecondary:   '#757575',
    borderRadius:    '16px',
    elevation:       '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
  },

  animation: {
    durationIn:  '400ms',
    durationOut: '300ms',
    easing:      'cubic-bezier(0.0, 0.0, 0.2, 1)'
  },

  a11y: {
    role:            'dialog',
    ariaModal:       true,
    ariaLabelledby:  'mtk-buy-title',
    ariaDescribedby: 'mtk-buy-desc'
  }
};
