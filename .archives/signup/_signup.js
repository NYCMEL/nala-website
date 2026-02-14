function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) return callback(el);
  setTimeout(() => waitForElement(selector, callback), 100);
}

waitForElement('#mtkSignupForm', initSignup);

function initSignup(form) {
  const steps = document.querySelectorAll('.step-panel');
  const dots = document.querySelectorAll('.step-dot');
  const labels = document.querySelectorAll('.step-label');

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');

  let currentStep = 0;
  let hasInteracted = false;

  const requiredFields = {
    0: ['firstName', 'lastName', 'email', 'repeatEmail'],
    1: ['phone', 'address']
  };

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    labels.forEach((l, i) => l.classList.toggle('active', i === index));

    prevBtn.style.display = index === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = index === steps.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = index === steps.length - 1 ? 'inline-block' : 'none';

    validateStep();
  }

  function validateStep(force = false) {
    let valid = true;
    const fields = requiredFields[currentStep] || [];

    fields.forEach(id => {
      const input = document.getElementById(id);
      const error = document.getElementById(`error-${id}`);

      if (!hasInteracted && !force) {
        error.textContent = '';
        input.classList.remove('is-invalid');
        return;
      }

      error.textContent = '';
      input.classList.remove('is-invalid');

      if (!input.value.trim()) {
        valid = false;
        error.textContent = 'This field is required';
        input.classList.add('is-invalid');
      }

      if (id === 'repeatEmail') {
        const email = document.getElementById('email').value;
        if (input.value && input.value !== email) {
          valid = false;
          error.textContent = 'Emails do not match';
          input.classList.add('is-invalid');
        }
      }
    });

    nextBtn.disabled = !valid;
  }

  form.addEventListener('input', () => {
    hasInteracted = true;
    validateStep();
  });

  nextBtn.addEventListener('click', () => {
    hasInteracted = true;
    validateStep(true);

    if (!nextBtn.disabled) {
      currentStep++;
      hasInteracted = false;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener('click', () => {
    currentStep--;
    hasInteracted = false;
    showStep(currentStep);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = {
      general: {
        firstName: firstName.value,
        middleInitial: middleInitial.value,
        lastName: lastName.value,
        email: email.value
      },
      contact: {
        phone: phone.value,
        address: address.value
      },
      optional: {
        ageGroup: ageGroup.value,
        education: education.value
      }
    };

    console.log('MTK-signup submission:', JSON.stringify(data, null, 2));
  });

  showStep(currentStep);
}
