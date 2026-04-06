if (typeof MtkRequest === 'undefined') {

class MtkRequest {
  constructor() {
    this.init();
  }

  init() {
    this.waitForElement().then(() => {
      this.el     = document.querySelector('.mtk-request');
      this.config = window.mtkRequestConfig;

      this.modalEl = this.el.querySelector('.modal');
      this.bsModal = new bootstrap.Modal(this.modalEl);

      this.render();
      this.bindEvents();
      this.subscribe();
    });
  }

  waitForElement() {
    return new Promise(resolve => {
      const check = () => {
        if (document.querySelector('.mtk-request')) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });
  }

  render() {
    const c = this.config;

    this.el.querySelector('.modal-title').innerText  = c.title;
    this.el.querySelector('.submit-btn').innerText   = c.submitText;

    // Fields: label + placeholder
    const fieldMap = [
      { selector: '.name',    key: 'name'    },
      { selector: '.email',   key: 'email'   },
      { selector: '.phone',   key: 'phone'   },
      { selector: '.address', key: 'address' },
      { selector: '.help',    key: 'help'    },
    ];

    fieldMap.forEach(({ selector, key }) => {
      const field  = c.fields[key];
      const input  = this.el.querySelector(selector);
      const label  = input && input.parentElement.querySelector('label');

      if (label) label.innerText = field.label;
      if (input && field.placeholder) input.setAttribute('placeholder', field.placeholder);
    });

    // Radio buttons
    const radioGroup = this.el.querySelector('.radio-group');
    c.contactOptions.forEach((opt, i) => {
      const wrapper = document.createElement('label');
      wrapper.className = 'radio-item';
      wrapper.innerHTML = `
        <input type="radio" name="contactType" value="${opt.value}" ${i === 0 ? 'checked' : ''}>
        <span class="radio-custom"></span>
        <span>${opt.label}</span>
      `;
      radioGroup.appendChild(wrapper);
    });

    // Call times
    const timeSelect = this.el.querySelector('.call-time');
    c.phoneTimes.forEach(t => {
      const o = document.createElement('option');
      o.value       = t;
      o.textContent = t;
      timeSelect.appendChild(o);
    });
  }

  bindEvents() {
    const openBtn   = this.el.querySelector('.open-dialog');
    const closeBtn  = this.el.querySelector('.close-dialog');
    const radios    = this.el.querySelectorAll('input[name="contactType"]');
    const phoneTimes = this.el.querySelector('.phone-times');

    openBtn.addEventListener('click', () => {
      wc.log('mtk-request:open');
      wc.log('[mtk-request] publish → mtk-request:open');
      wc.publish('mtk-request:open');
      this.bsModal.show();
    });

    closeBtn.addEventListener('click', () => {
      wc.log('mtk-request:close');
      wc.log('[mtk-request] publish → mtk-request:close');
      wc.publish('mtk-request:close');
      this.bsModal.hide();
    });

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        const value = radio.value;
        phoneTimes.classList.toggle('active', value === 'phone');
        wc.log('mtk-request:contact-change', value);
        wc.log('[mtk-request] publish → mtk-request:contact-change', value);
        wc.publish('mtk-request:contact-change', value);
      });
    });

    // Floating labels — stay floated when placeholder is showing
    this.el.querySelectorAll('.md-field input, .md-field textarea, .md-field select')
      .forEach(field => {
        // Float immediately if placeholder exists (field looks occupied)
        if (field.getAttribute('placeholder') && field.getAttribute('placeholder').trim()) {
          field.parentElement.classList.add('active');
        }

        field.addEventListener('focus', () => {
          field.parentElement.classList.add('active');
        });

        field.addEventListener('blur', () => {
          // Keep floated if field has value OR has a visible placeholder
          const hasPlaceholder = field.getAttribute('placeholder') && field.getAttribute('placeholder').trim();
          if (!field.value && !hasPlaceholder) {
            field.parentElement.classList.remove('active');
          }
        });
      });

    this.el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const phoneInput   = this.el.querySelector('.phone');
      const contactType  = this.el.querySelector('input[name="contactType"]:checked')?.value || '';

      const nameInput  = this.el.querySelector('.name');
      const emailInput = this.el.querySelector('.email');
      const helpInput  = this.el.querySelector('.help');

      // Helper: highlight a field red and clear styling on next input
      const flagField = (input) => {
        input.parentElement.classList.add('active');
        input.focus();
        input.style.borderBottomColor = '#dc3545';
        input.parentElement.querySelector('label').style.color = '#dc3545';
        input.addEventListener('input', function onFix() {
          input.style.borderBottomColor = '';
          input.parentElement.querySelector('label').style.color = '';
          input.removeEventListener('input', onFix);
        });
      };

      // 1. Name — always required
      if (!nameInput.value.trim()) {
        wc.log('[mtk-request] Validation failed — name is required');
        flagField(nameInput);
        return;
      }

      const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const PHONE_REGEX = /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.\-]?\d{3}[\s.\-]?\d{4}$/;

      // 2. Contact method drives which field is required + format validation
      if (contactType === 'phone' && !phoneInput.value.trim()) {
        wc.log('[mtk-request] Validation failed — phone required when contact by phone selected');
        flagField(phoneInput);
        return;
      }

      if (contactType === 'email' && !emailInput.value.trim()) {
        wc.log('[mtk-request] Validation failed — email required when contact by email selected');
        flagField(emailInput);
        return;
      }

      // 3. Neither filled — require at least one
      if (!emailInput.value.trim() && !phoneInput.value.trim()) {
        wc.log('[mtk-request] Validation failed — email or phone required');
        flagField(emailInput);
        return;
      }

      // 4. Format validation — only validate if the field has a value
      if (emailInput.value.trim() && !EMAIL_REGEX.test(emailInput.value.trim())) {
        wc.log('[mtk-request] Validation failed — invalid email format');
        flagField(emailInput);
        return;
      }

      if (phoneInput.value.trim() && !PHONE_REGEX.test(phoneInput.value.trim())) {
        wc.log('[mtk-request] Validation failed — invalid phone format');
        flagField(phoneInput);
        return;
      }

      // 5. Help — required
      if (!helpInput.value.trim()) {
        wc.log('[mtk-request] Validation failed — help description is required');
        flagField(helpInput);
        return;
      }

      const data = {
        nalaUID:     (this.el.querySelector('.nala-uid')?.value   || '').trim(),
        name:        (this.el.querySelector('.name').value        || '').trim(),
        email:       (this.el.querySelector('.email').value       || '').trim(),
        phone:       (phoneInput.value                            || '').trim(),
        address:     (this.el.querySelector('.address').value     || '').trim(),
        help:        (this.el.querySelector('.help').value        || '').trim(),
        contactType: contactType,
        callTime:    (this.el.querySelector('.call-time').value   || '').trim(),
        submittedAt: new Date().toISOString(),
        source:      'mtk-request'
      };

      wc.log('[mtk-request] Submit →', data);
      wc.log('[mtk-request] publish → mtk-request:submit', data);
      wc.publish('mtk-request:submit', data);

      this.bsModal.hide();
    });
  }

  subscribe() {
    const events = [
      'mtk-request:init',
      'mtk-request:open',
      'mtk-request:submit',
      'mtk-request:contact-change',
      'mtk-request:update'
    ];

    events.forEach(event => {
      wc.subscribe(event, (msg) => this.onMessage(event, msg));
    });
  }

  onMessage(event, message) {
    wc.log('mtk-request:received', { event, message });
    if (event === 'mtk-request:open') {
      this.bsModal.show();
    }
  }
}

if (!window._mtkRequestInstance) {
    window._mtkRequestInstance = new MtkRequest();
}

}