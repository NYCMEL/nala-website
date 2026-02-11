FORGET ALL PREVIOUS CONTEXT for mtk-msgs

Create a reusable UI msgs named mtk-msgs using:
- HTML
- SCSS
- Vanilla JavaScript
- Bootstrap 5 (layout only)
- Modern Material Design, Material Design icons and styles
- Always create a JS class for mtk-msgs and initialize it inside the JS file itself

Rules:
- The msgs is wrapped in a display:block element <mtk-msgs class="mtk-msgs">.
- The root element uses .mtk-msgs.
- All styles must be scoped to .mtk-msgs.
- No global styles or IDs.
- publish click events using wc.publish
- subscribe to all 4-mtk-msgs everns using wc.subscribe
- create a onMessage function to be passed to wc.subscribe function

Data:
- The msgs is JSON driven.
  - any and all data must come from mtk-msgs.config.js file

Restrictions:
- No frameworks.
- No Bootstrap.
- No external libraries.
- Vanilla Javascript

Accessibility:
- Use semantic HTML.
- Keyboard accessible.
- Visible focus states.
- ADA compliant

Output! Create exactly these files:
- mtk-msgs.config.js (JSON FILE)
- mtk-msgs.scss
- mtk-msgs.html
- mtk-msgs.js
- A minimal index.html file

Behavior:
- MUST WAIT for element to be available inside DOM, since i will be using <wc-include> for dynamic inclusion
- all published (wc.publish) messages should be logged using wc.log to console before being published

mtk-msg is JSON driven
mtk-msg is a small panel that opens below the mtk-header and initially hidden
mtk-msg has a height of 40px
mtk-msg can have bootstrap info, warning and error colors
mtk-msg has and icon (warning and error) to the left
mtk-msg has a message that appears next to the icon
mtk-msg can have one or more buttons pulled to right
mtk-msg can have an "X" all the way on the right
mtk-msg elments should all be lined up horizontally
mtk-msg should have an API to show or hide
mtk-msg should wc.publish("mtk-msg-btn", data) for all button events
