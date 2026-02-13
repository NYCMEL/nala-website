# mtk-pager Component

A lightweight, standalone page/section manager for switching visible content inside a single container without page reloads.

## Features

- ✅ Vanilla JavaScript (no dependencies required)
- ✅ Optional jQuery support for HTML loading
- ✅ Material Design & Bootstrap compatible
- ✅ No frameworks or build tools needed
- ✅ Automatic initialization
- ✅ Event-driven architecture
- ✅ Defensive coding with error handling
- ✅ Debug logging support
- ✅ Smooth fade-in animations
- ✅ Loading states

## File Structure

```
mtk-pager/
├── mtk-pager.html         # Demo/example HTML file
├── mtk-pager.scss         # Source styles (DO NOT COMPILE)
├── mtk-pager.js           # Main component logic
├── mtk-pager.config.js    # Configuration file
└── pages/                 # Sample content pages
    ├── home.html
    ├── about.html
    ├── contact.html
    └── dashboard.html
```

## Installation

1. Include the required files in your HTML:

```html
<!-- Styles -->
<link rel="stylesheet" href="mtk-pager.css">

<!-- Optional: jQuery for HTML loading -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Configuration -->
<script src="mtk-pager.config.js"></script>

<!-- Component -->
<script src="mtk-pager.js"></script>
```

2. Add the container to your HTML:

```html
<PAGER id="mtk-pager"></PAGER>
```

## Configuration

Edit `mtk-pager.config.js` to map section IDs to content URLs:

```javascript
var app = app || {};

app.pager = {
    'home': 'pages/home.html',
    'about': 'pages/about.html',
    'contact': 'pages/contact.html',
    'dashboard': 'pages/dashboard.html'
};

app.pagerDefaults = {
    initialSection: 'home',
    loadOnInit: true,
    animationDuration: 300,
    debugMode: true
};
```

## Usage

### Basic Usage

```javascript
// Show a section
mtk_pager.show('home');
mtk_pager.show('about');
mtk_pager.show('contact');
```

### HTML Buttons

```html
<button onclick="mtk_pager.show('home')">Home</button>
<button onclick="mtk_pager.show('about')">About</button>
<button onclick="mtk_pager.show('contact')">Contact</button>
```

### Helper Methods

```javascript
// Get current section ID
const current = mtk_pager.getCurrentSection();

// Get all section IDs
const sections = mtk_pager.getSections();

// Check if initialized
const ready = mtk_pager.isInitialized();
```

## Events

mtk-pager dispatches custom events that you can listen to:

### Available Events

1. **mtk-pager:initialized** - Fired when component initializes
2. **mtk-pager:show** - Fired when a section is shown
3. **mtk-pager:loaded** - Fired when content is loaded successfully
4. **mtk-pager:hide** - Fired when a section is hidden
5. **mtk-pager:error** - Fired when an error occurs

### Listening to Events

```javascript
document.addEventListener('mtk-pager:show', function(e) {
    console.log('Section shown:', e.detail.sectionId);
    console.log('Is new section:', e.detail.isNew);
});

document.addEventListener('mtk-pager:loaded', function(e) {
    console.log('Content loaded for:', e.detail.sectionId);
});
```

## Behavior

1. **Auto-initialization**: Component initializes when DOM is ready
2. **Container detection**: Safely checks for `<PAGER id="mtk-pager">` element
3. **Section management**: Creates `<PAGER-SECTION>` elements as needed
4. **Single visibility**: Only one section is visible at a time using `.active` class
5. **Content loading**: Loads HTML from configured URLs
6. **Caching**: Once loaded, sections are cached (not reloaded on subsequent shows)
7. **Error handling**: Displays user-friendly error messages for missing content

## SCSS Structure

```scss
PAGER {
    // Main container styles
    // Loading animation
}

PAGER-SECTION {
    // Hidden by default
    
    &.mtk-pager-section.active {
        // Visible with fade-in animation
    }
}
```

**IMPORTANT**: Do NOT compile SCSS to CSS. Use the SCSS file as-is.

## API Reference

### Public Methods

#### `mtk_pager.show(sectionId)`

Shows the specified section. If the section doesn't exist, it will be created and content loaded.

- **Parameters**: `sectionId` (string) - The ID of the section to show
- **Returns**: void

#### `mtk_pager.getCurrentSection()`

Gets the currently active section ID.

- **Returns**: string | null

#### `mtk_pager.getSections()`

Gets an array of all section IDs.

- **Returns**: Array<string>

#### `mtk_pager.isInitialized()`

Checks if the component has been initialized.

- **Returns**: boolean

## Browser Support

- Modern browsers (ES6+ support required)
- Chrome, Firefox, Safari, Edge
- Optional jQuery support for wider compatibility

## Debug Mode

Enable debug logging in `mtk-pager.config.js`:

```javascript
app.pagerDefaults = {
    debugMode: true
};
```

This will output detailed console logs showing:
- Initialization status
- Section creation/activation
- Content loading progress
- Event dispatching
- Error messages

## License

Standalone component - use freely in your projects.

## Version

1.0.0 - Initial release
