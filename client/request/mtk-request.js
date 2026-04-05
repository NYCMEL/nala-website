class MtkRequest {
  constructor() {
    this.init();
  }

  init() {
    this.waitForElement().then(() => {
      this.el = document.querySelector('.mtk-request');
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

    this.el.querySelector('.modal-title').innerText = c.title;
    this.el.querySelector('.submit-btn').innerText = c.submitText;

    const labels = this.el.querySelectorAll('.md-field label');
    labels[0].innerText = c.fields.name.label;
    labels[1].innerText = c.fields.email.label;
    labels[2].innerText = c.fields.phone.label;
    labels[3].innerText = c.fields.address.label;
    labels[4].innerText = c.fields.help.label;

    // RADIO RENDER
    const radioGroup = this.el.querySelector('.radio-group');

    this.config.contactOptions.forEach((opt, i) => {
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
      o.value = t;
      o.textContent = t;
      timeSelect.appendChild(o);
    });
  }

  bindEvents() {
    const openBtn = this.el.querySelector('.open-dialog');
    const closeBtn = this.el.querySelector('.close-dialog');
    const radios = this.el.querySelectorAll('input[name="contactType"]');
    const phoneTimes = this.el.querySelector('.phone-times');

    openBtn.addEventListener('click', () => {
      wc.log('mtk-request:open');
      wc.publish('mtk-request:open');
      this.bsModal.show();
    });

    closeBtn.addEventListener('click', () => {
      wc.log('mtk-request:close');
      wc.publish('mtk-request:close');
      this.bsModal.hide();
    });

    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        const value = radio.value;

        phoneTimes.classList.toggle('active', value === 'phone');

        wc.log('mtk-request:contact-change', value);
        wc.publish('mtk-request:contact-change', value);
      });
    });

    // Floating labels
    this.el.querySelectorAll('.md-field input, .md-field textarea, .md-field select')
      .forEach(field => {
        field.addEventListener('focus', () => {
          field.parentElement.classList.add('active');
        });

        field.addEventListener('blur', () => {
          if (!field.value) {
            field.parentElement.classList.remove('active');
          }
        });
      });

    this.el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: this.el.querySelector('.name').value,
        email: this.el.querySelector('.email').value,
        phone: this.el.querySelector('.phone').value,
        address: this.el.querySelector('.address').value,
        help: this.el.querySelector('.help').value,
        contactType: this.el.querySelector('input[name="contactType"]:checked').value,
        callTime: this.el.querySelector('.call-time').value
      };

      wc.log('mtk-request:submit', data);
      wc.publish('mtk-request:submit', data);

      this.bsModal.hide();
    });
  }

  subscribe() {
    const events = [
      'mtk-request:init',
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
  }
}

new MtkRequest();
