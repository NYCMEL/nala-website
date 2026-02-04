# MTK Ready Component

A Material Design call-to-action component built with HTML, SCSS, and Vanilla JavaScript featuring Bootstrap grid system and Material Design animations.

## Features

- ✨ Material Design animations and styles
- 🎯 Bootstrap 5 responsive grid
- 🔄 Ripple effect on button click
- 📦 Configuration-based content from `MTK-ready.config.js`
- 🔔 Event publishing system with `wc.publish`
- ♿ Accessibility support (keyboard navigation, reduced motion)
- 📱 Fully responsive design
- 🚀 Component availability check before initialization

## Files

```
mtk-ready/
├── mtk-ready.html          # Main HTML structure
├── MTK-ready.config.js     # Configuration file
├── mtk-ready.scss          # Source SCSS styles
├── mtk-ready.css           # Compiled CSS
├── mtk-ready.js            # Vanilla JavaScript
└── README.md               # Documentation
```

## Installation

1. Include Bootstrap CSS in your HTML:
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

2. Include the component CSS:
```html
<link rel="stylesheet" href="mtk-ready.css">
```

3. Add the configuration script:
```html
<script src="MTK-ready.config.js"></script>
```

4. Add the component JavaScript:
```html
<script src="mtk-ready.js"></script>
```

## Usage

### HTML Structure

```html
<section class="mtk-ready" id="mtkReady">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8 col-md-7">
                <div class="mtk-ready__content">
                    <h2 class="mtk-ready__title"></h2>
                    <p class="mtk-ready__subtitle"></p>
                </div>
            </div>
            <div class="col-lg-4 col-md-5 text-md-end text-center">
                <button class="mtk-ready__btn" id="mtkReadyBtn">
                    <span class="mtk-ready__btn-text"></span>
                    <span class="mtk-ready__btn-ripple"></span>
                </button>
            </div>
        </div>
    </div>
</section>
```

### Configuration

Edit `MTK-ready.config.js` to customize content:

```javascript
window.app = window.app || {};

window.app.ready = {
    title: "Ready to Start Your Locksmith Career?",
    subtitle: "Join NALA today and unlock your potential with industry-leading training and support.",
    buttonText: "Get Started Today",
    buttonAction: "ready.get-started",
    analytics: {
        category: "CTA",
        action: "click",
        label: "Ready Component"
    }
};
```

### Event Handling

Subscribe to button click events using `wc.subscribe`:

```javascript
wc.subscribe('ready.get-started', function(data) {
    console.log('Button clicked:', data);
    // Your custom logic here
    // Example: redirect, open modal, send analytics, etc.
});
```

Published data structure:
```javascript
{
    action: "ready.get-started",
    component: "mtk-ready",
    timestamp: "2026-02-04T14:16:07.291Z",
    config: { /* full config object */ },
    analytics: { /* analytics data if provided */ }
}
```

## JavaScript API

### Component Initialization

The component automatically initializes when:
1. DOM is ready
2. Component element `#mtkReady` exists
3. Configuration in `window.app.ready` is available

### Methods

```javascript
// Access component instance
const mtkReady = new MTKReady(document.getElementById('mtkReady'));

// Set loading state
mtkReady.setLoadingState(true);

// Set error state
mtkReady.setErrorState(true);

// Destroy component
mtkReady.destroy();
```

## SCSS Customization

Edit `mtk-ready.scss` to customize styles:

```scss
// Variables
$primary-blue: #5B8DB8;
$primary-blue-dark: #4A7399;
$white: #ffffff;
$transition-duration: 0.3s;
$ripple-duration: 0.6s;
```

Compile SCSS to CSS:
```bash
sass mtk-ready.scss mtk-ready.css
```

## Material Design Features

### Animations
- **fadeInRight**: Content slides in from left
- **fadeInUp**: Button slides up
- **ripple**: Material ripple effect on click

### Elevations
- **elevation-2**: Default button state
- **elevation-4**: Hover state
- **elevation-8**: Focus state (optional)

### States
- **Default**: Normal state
- **Hover**: Elevated with subtle transform
- **Active**: Pressed state
- **Loading**: Disabled with reduced opacity
- **Error**: Muted colors with disabled button

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: iOS 12+
- Chrome Android: Latest

## Accessibility

- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ ARIA labels (add as needed)
- ✅ Reduced motion support
- ✅ Color contrast compliance

## Responsive Breakpoints

- **Desktop**: lg (≥992px) - Title and button side-by-side
- **Tablet**: md (≥768px) - Adjusted spacing
- **Mobile**: sm (<768px) - Stacked layout, centered text

## License

MIT License - feel free to use in your projects!

## Author

Created for MTK project with Material Design principles.
