FORGET ALL PREVIOUS CONTEXT for mtk-login

Create a reusable UI login named mtk-login using:
- HTML
- SCSS
- Vanilla JavaScript
- Bootstrap 5 (layout only)
- Modern Material Design and Material Design icons
- Always create a JS class form mtk-login

Rules:
- The login is wrapped in a block element <mtk-login class="mtk-login">.
- The root element uses .mtk-login.
- All styles are scoped to .mtk-login.
- No global styles or IDs.
- publish click events using wc.publish
- subscribe to all 4-mtk-login everns using wc.subscribe
- create a onMessage function to be passed to wc.subscribe function

Data:
- The login is JSON driven.
- any and all data must come from mtk-login.config.js file

Behavior:
- "MUST WAIT" for element to be available inside DOM

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
- mtk-login.config.js (JSON FILE)
- mtk-login.scss
- mtk-login.html
- mtk-login.js
- a minimal index.html file

Create a login screen with email, password and fortgot password link and a link to register if not done so
use Material design form with floating labels.
use large fields
do a full validation on email
do not navigate away from this screen
disable submit button unless both fields are selected
wc.publish on submit and click on links
