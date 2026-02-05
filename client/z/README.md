# MTK Client - Business Profile Component

A modular web component for displaying business profile information using vanilla JavaScript, SCSS, and web components.

## Files Structure

```
├── index.html          # Main HTML file
├── config.json         # Configuration file with all business data
├── mtk-client.html     # Component template
├── mtk-client.js       # Component controller (vanilla JS)
├── wc-include.js       # Web component include utility
├── styles.scss         # SCSS styles (uncompiled)
├── styles.css          # Compiled CSS (temporary - compile from SCSS)
└── README.md           # This file
```

## Features

- **Modular Architecture**: Separate HTML, CSS, and JS files
- **Config-Driven**: All data loaded from `config.json`
- **Web Components**: Uses custom `<wc-include>` element
- **Responsive Design**: Mobile-first approach
- **Interactive**: Click handlers for buttons and social links
- **SCSS Support**: Uses SCSS with variables and mixins

## Setup

1. **Compile SCSS to CSS** (required for production):
   ```bash
   sass styles.scss styles.css
   ```

2. **Serve the files** using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

## Configuration

Edit `config.json` to customize the business profile:

```json
{
  "business_name": "Your Business Name",
  "rating": {
    "score": 4.9,
    "total_reviews": 16
  },
  "pricing": {
    "service_call_fee": 65
  },
  ...
}
```

## Usage

### Basic Implementation

```html
<wc-include src="mtk-client.html"></wc-include>
```

### Dynamic Config Update

```javascript
// Access the component instance
window.mtkClient.updateConfig({
  business_name: "New Business Name",
  pricing: {
    service_call_fee: 75
  }
});
```

### Get Current Config

```javascript
const config = window.mtkClient.getConfig();
console.log(config);
```

## SCSS Compilation

To compile SCSS to CSS, you need to have Sass installed:

```bash
# Install Sass globally
npm install -g sass

# Compile SCSS
sass styles.scss styles.css

# Watch for changes
sass --watch styles.scss:styles.css
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Custom Elements v1 API
- Shadow DOM support

## Customization

### Colors

Edit SCSS variables in `styles.scss`:

```scss
$primary-color: #667eea;
$secondary-color: #764ba2;
$blue: #3b82f6;
```

### Layout

Modify grid layout in `styles.scss`:

```scss
.main-content {
  grid-template-columns: 2fr 1fr; // Change ratio
}
```

### Events

Add custom event handlers in `mtk-client.js`:

```javascript
handleButtonClick(action) {
  // Custom logic here
}
```

## Notes

- The `styles.css` file is a pre-compiled version for quick testing
- Always compile `styles.scss` to `styles.css` for production
- The component uses Shadow DOM for style encapsulation
- Config changes require page reload unless using `updateConfig()` method

## License

MIT
