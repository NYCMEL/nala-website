const MTK_BUY_CONFIG = {
  component: "mtk-buy",
  version: "1.0.0",

  popup: {
    title: "You have reached the end of Free Trial.",
    subtitle: "You may continue the course by purchasing one of our courses.",
    icon: "school",
    closeOnBackdrop: true,
    closeOnEscape: true,
    showCloseButton: true
  },

  button: {
    label: "Purchase Course",
    icon: "shopping_cart",
    ariaLabel: "Purchase Course to continue learning"
  },

  events: {
    open:     "mtk-buy:open",
    close:    "mtk-buy:close",
    purchase: "mtk-buy:purchase",
    ready:    "mtk-buy:ready"
  },

  theme: {
    primaryColor:      "#1565C0",
    primaryDark:       "#0D47A1",
    primaryLight:      "#E3F2FD",
    accentColor:       "#FF6F00",
    accentHover:       "#E65100",
    surfaceColor:      "#FFFFFF",
    backgroundColor:   "rgba(0,0,0,0.54)",
    textPrimary:       "#212121",
    textSecondary:     "#757575",
    iconColor:         "#1565C0",
    borderRadius:      "16px",
    elevation:         "0 24px 48px rgba(0,0,0,0.22), 0 8px 16px rgba(0,0,0,0.12)"
  },

  animation: {
    durationIn:  "320ms",
    durationOut: "220ms",
    easing:      "cubic-bezier(0.4, 0, 0.2, 1)"
  },

  a11y: {
    role:          "dialog",
    ariaModal:     true,
    ariaLabelledby: "mtk-buy-title",
    ariaDescribedby: "mtk-buy-desc"
  }
};

export default MTK_BUY_CONFIG;
