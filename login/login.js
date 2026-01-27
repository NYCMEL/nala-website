// MTK-login initialization function
function MTKLoginInit(containerId = 'app-login-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Load HTML into container
  fetch('./login/login.html')
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      // Wait for elements to exist
      const form = container.querySelector('#mtk-login-form');
      const email = container.querySelector('#mtk-login-email');
      const password = container.querySelector('#mtk-login-password');
      const forgot = container.querySelector('#mtk-forgot-password');

      if (!form || !email || !password || !forgot) return;

      // Initialize Material Design text fields
      container.querySelectorAll('.mdc-text-field').forEach(el => {
        new mdc.textField.MDCTextField(el);
      });

      // Form submit handler
      form.addEventListener('submit', e => {
        e.preventDefault();
        console.log({
          email: email.value.trim(),
          password: password.value
        });
      });

      // Forgot password handler
      forgot.addEventListener('click', e => {
        e.preventDefault();
        console.log('Forgot password clicked');
      });
    });
}

// Initialize MTK-login after DOM ready
document.addEventListener('DOMContentLoaded', () => MTKLoginInit());
