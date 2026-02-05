# MTK Pager Component

A lightweight, standalone page/section manager that switches visible content inside a single container without page reloads.

## Files Included

- `mtk-pager.config.js` - Configuration file with section definitions
- `mtk-pager.scss` - SCSS styles for pager and sections
- `mtk-pager.html` - Demo HTML file
- `mtk-pager.js` - JavaScript class implementation

## Features

✅ **Vanilla JavaScript** - No dependencies required (jQuery optional)
✅ **Single Container** - All sections managed in one PAGER element
✅ **Dynamic Loading** - Loads content from external URLs (requires jQuery)
✅ **Section Management** - Automatically creates and manages sections
✅ **Event System** - Full wc.publish/subscribe integration
✅ **Defensive Coding** - Safe initialization and error handling
✅ **Material Design** - Smooth transitions and animations
✅ **Bootstrap Compatible** - Works with Bootstrap components
✅ **Single Public API** - Only `mtk-pager.show(sectionId)` exposed globally

## Container Structure

```html
<PAGER id="mtk-pager" style="display:block">
  <!-- Sections are dynamically created here -->
  <PAGER-SECTION id="mtk-pager-home" class="mtk-pager-section active">
    <!-- Content loaded here -->
  </PAGER-SECTION>
  <PAGER-SECTION id="mtk-pager-quiz" class="mtk-pager-section">
    <!-- Content loaded here -->
  </PAGER-SECTION>
</PAGER>
```

## Usage

### 1. Include Dependencies

```html
<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Bootstrap (optional) -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Component CSS -->
<link rel="stylesheet" href="mtk-pager.scss">

<!-- jQuery (optional - for loading external content) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

### 2. Add Container

```html
<PAGER id="mtk-pager" style="display:block"></PAGER>
```

### 3. Include Scripts

```html
<!-- Config -->
<script src="mtk-pager.config.js"></script>

<!-- Component -->
<script src="mtk-pager.js"></script>
```

### 4. Use the API

```javascript
// Show a section (creates if doesn't exist)
window['mtk-pager'].show('home');
window['mtk-pager'].show('quiz');
window['mtk-pager'].show('results');
```

## Configuration

Edit `mtk-pager.config.js`:

```javascript
const app = app || {};

app.pager = {
  "sections": {
    "home": {
      "url": "pages/home.html",
      "title": "Home"
    },
    "quiz": {
      "url": "pages/quiz.html",
      "title": "Quiz"
    }
  },
  "defaultSection": "home"  // Loads automatically on init
};
```

## Behavior

1. **Initialization**: Automatically initializes when loaded
2. **Container Detection**: Safely checks if PAGER element exists
3. **Section Management**: Each section has:
   - Element: `<PAGER-SECTION>`
   - ID format: `mtk-pager-{sectionId}`
   - Class: `mtk-pager-section`
   - Display: `block`
4. **Visibility**: Only ONE section visible at a time using `.active` class
5. **Content Loading**: 
   - With jQuery: Loads from URL using `$.load()`
   - Without jQuery: Shows warning, creates empty section
6. **Idempotent**: `show()` can be called multiple times safely

## API

### Public Method

**`window['mtk-pager'].show(sectionId)`**

Shows the specified section. If section doesn't exist, creates it and loads content from configured URL.

```javascript
// Examples
window['mtk-pager'].show('home');
window['mtk-pager'].show('quiz');
window['mtk-pager'].show('profile');
```

### Events Published

1. **`4-mtk-pager-initialized`** - When component initializes
   ```javascript
   {
     containerId: "mtk-pager",
     hasJQuery: true,
     sectionsCount: 5,
     timestamp: "2026-02-05T..."
   }
   ```

2. **`4-mtk-pager-loading`** - When loading content
   ```javascript
   {
     sectionId: "home",
     url: "pages/home.html",
     timestamp: "2026-02-05T..."
   }
   ```

3. **`4-mtk-pager-loaded`** - When content loaded successfully
4. **`4-mtk-pager-error`** - When content loading fails
5. **`4-mtk-pager-warning`** - When jQuery unavailable
6. **`4-mtk-pager-section-changed`** - When active section changes
   ```javascript
   {
     previousSection: "home",
     currentSection: "quiz",
     timestamp: "2026-02-05T..."
   }
   ```

### Events Subscribed

The component subscribes to all `4-mtk-pager-*` events and handles:
- **`4-mtk-pager-show`** - External show requests
  ```javascript
  wc.publish('4-mtk-pager-show', { sectionId: 'home' });
  ```

## Styling

### CSS Classes

- `.mtk-pager` - Main container
- `.mtk-pager-section` - Individual section (hidden by default)
- `.mtk-pager-section.active` - Visible section
- `.mtk-pager.loading` - Loading state

### Customization

```css
.mtk-pager {
  --mtk-pager-primary: #6200ea;
  --mtk-pager-background: #ffffff;
  --mtk-pager-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Debug Logging

The component provides detailed console logging:
- 🟢 Green: Success messages
- 🟡 Yellow: Warning messages
- 🔴 Red: Error messages
- 📩 Envelope: Event messages
- 📝 Note: WC log messages

## jQuery Notes

- **With jQuery**: Can load external HTML files
- **Without jQuery**: Sections created but content not loaded from URLs
- Component gracefully degrades without jQuery

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Example Integration

```html
<button onclick="window['mtk-pager'].show('home')">Home</button>
<button onclick="window['mtk-pager'].show('quiz')">Quiz</button>

<PAGER id="mtk-pager" style="display:block"></PAGER>
```

## Important Notes

1. **Container must exist** before initialization
2. **Only ONE public API**: `window['mtk-pager'].show()`
3. **No global pollution** except `window['mtk-pager']`
4. **Section IDs** automatically prefixed with `mtk-pager-`
5. **Config required** in `app.pager` object
6. **Defensive coding** throughout with safety checks

## License

Free to use and modify.
