# MTK Quiz Component

A reusable, accessible quiz component built with vanilla JavaScript, Material Design principles, and SCSS.

## Files Included

- `mtk-quiz.config.js` - JSON configuration with quiz data
- `mtk-quiz.scss` - Source SCSS styles
- `mtk-quiz.css` - Compiled CSS (ready to use)
- `mtk-quiz.html` - Demo HTML file
- `mtk-quiz.js` - JavaScript class implementation

## Features

✅ **Material Design** - Modern UI with Material Design icons and styling
✅ **Fully Accessible** - ADA compliant, keyboard navigable, semantic HTML
✅ **Event-Driven** - Publishes and subscribes to events via `wc.publish` and `wc.subscribe`
✅ **Single Select** - Radio button selection for each question
✅ **Progress Tracking** - Visual progress bar showing completion status
✅ **Test Mode** - Button to auto-select first option in each question
✅ **Clear Functionality** - Reset all selections
✅ **Validation** - Ensures all questions are answered before submission
✅ **Responsive** - Mobile-friendly design

## Usage

### 1. Include Dependencies

```html
<!-- Material Icons -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!-- Roboto Font -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- Component CSS -->
<link rel="stylesheet" href="mtk-quiz.css">
```

### 2. Add HTML Structure

```html
<mtk-quiz class="mtk-quiz">
  <!-- Component will be rendered here -->
</mtk-quiz>
```

### 3. Include Scripts

```html
<!-- Config -->
<script src="mtk-quiz.config.js"></script>

<!-- Component -->
<script src="mtk-quiz.js"></script>
```

### 4. Initialize wc Event System

The component requires a `wc` object for event pub/sub:

```javascript
window.wc = {
  subscribers: {},
  publish: function(event, data) {
    console.log('Published:', event, data);
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(event, data));
    }
  },
  subscribe: function(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }
};
```

## Events

### Published Events

1. **`quiz`** - Main quiz submission event
   ```javascript
   {
     quiz_session_id: 32,
     module_id: "M1",
     answers: [...],
     submitted_at: "2025-02-04T...",
     total_questions: 20
   }
   ```

2. **`4-mtk-quiz-option-changed`** - When an option is selected
   ```javascript
   {
     questionId: 29,
     selectedOption: "a",
     timestamp: "2025-02-04T..."
   }
   ```

3. **`4-mtk-quiz-submitted`** - Same as `quiz` event
4. **`4-mtk-quiz-cleared`** - When all selections are cleared
5. **`4-mtk-quiz-test-mode`** - When test mode is activated
6. **`4-mtk-quiz-progress`** - Progress updates
   ```javascript
   {
     answered: 5,
     total: 20,
     percentage: "25.00",
     timestamp: "2025-02-04T..."
   }
   ```

### Subscribed Events

The component subscribes to all its own events and includes an `onMessage` handler for external control.

## Configuration

Edit `mtk-quiz.config.js` to customize:

```javascript
const mtkQuizConfig = {
  quiz_session_id: 32,
  module_id: "M1",
  count: 20,
  questions: [
    {
      id: 29,
      question: "Your question text",
      choice_a: "Option A",
      choice_b: "Option B",
      choice_c: "Option C",
      choice_d: "Option D"
    },
    // ... more questions
  ]
};
```

## Keyboard Accessibility

- **Tab** - Navigate between form elements
- **Arrow Up/Down** - Navigate between options
- **Arrow Left/Right** - Navigate between options
- **Space/Enter** - Select option
- **Tab to buttons** - Access Clear/Test/Submit

## Styling

All styles are scoped to `.mtk-quiz` class. Customize by overriding CSS variables:

```css
.mtk-quiz {
  --mtk-primary: #6200ea;
  --mtk-primary-light: #7c4dff;
  --mtk-primary-dark: #5300e8;
  /* ... more variables */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Free to use and modify.
