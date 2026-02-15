(function () {
  const form = document.getElementById("mtk-register");
  const fields = ["name", "email", "email2", "phone"];

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const email2 = document.getElementById("email2");
  const phone = document.getElementById("phone");

  const nameField = name.closest(".md-field");
  const nameError = nameField.querySelector(".helper");

  const emailError = email2
    .closest(".md-field")
    .querySelector("[data-error]");

  const phoneField = phone.closest(".md-field");
  const phoneError = phoneField.querySelector(".helper");

  // Regex patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const US_PHONE_REGEX =
    /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;

  // Init values + floating labels
  fields.forEach(id => {
    const input = document.getElementById(id);

    if (window.mtkRegisterConfig && window.mtkRegisterConfig[id]) {
      input.value = window.mtkRegisterConfig[id];
    }

    input.setAttribute("placeholder", " ");
  });

  /* ---------- Error Helpers ---------- */

  function showNameError(message) {
    name.classList.add("error");
    nameError.textContent = message;
    nameError.classList.add("error");
  }

  function clearNameError() {
    name.classList.remove("error");
    nameError.textContent = "First Name, Middle Initial, Last Name";
    nameError.classList.remove("error");
  }

  function showEmailError(message) {
    email2.classList.add("error");
    emailError.textContent = message;
    emailError.classList.add("error");
  }

  function clearEmailError() {
    email2.classList.remove("error");
    emailError.textContent = "";
    emailError.classList.remove("error");
  }

  function showPhoneError(message) {
    phone.classList.add("error");
    phoneError.textContent = message;
    phoneError.classList.add("error");
  }

  function clearPhoneError() {
    phone.classList.remove("error");
    phoneError.textContent = "Phone Number";
    phoneError.classList.remove("error");
  }

  /* ---------- Live Validation ---------- */

  name.addEventListener("input", () => {
    if (name.value.trim().length >= 3) {
      clearNameError();
    }
  });

  email.addEventListener("input", () => {
    if (EMAIL_REGEX.test(email.value.trim())) {
      clearEmailError();
    }
  });

  email2.addEventListener("input", () => {
    if (
      EMAIL_REGEX.test(email.value.trim()) &&
      email.value.trim() === email2.value.trim()
    ) {
      clearEmailError();
    }
  });

  phone.addEventListener("input", () => {
    if (US_PHONE_REGEX.test(phone.value.trim())) {
      clearPhoneError();
    }
  });

  /* ---------- Submit ---------- */

  form.addEventListener("submit", event => {
    event.preventDefault();

    clearNameError();
    clearEmailError();
    clearPhoneError();

    // Required fields
    for (let i = 0; i < fields.length; i++) {
      const input = document.getElementById(fields[i]);

      if (!input.value.trim()) {
        input.focus();
        return;
      }
    }

    // Name length validation
    if (name.value.trim().length < 3) {
      showNameError("Name must be at least 3 characters");
      name.focus();
      return;
    }

    // Email format validation
    if (!EMAIL_REGEX.test(email.value.trim())) {
      showEmailError("Enter a valid email address");
      email.focus();
      return;
    }

    // Email match validation
    if (email.value.trim() !== email2.value.trim()) {
      showEmailError("Emails do not match");
      email2.focus();
      return;
    }

    // US phone validation
    if (!US_PHONE_REGEX.test(phone.value.trim())) {
      showPhoneError("Enter a valid US phone number");
      phone.focus();
      return;
    }

    // Build payload
    const payload = {};

    fields.forEach(id => {
      payload[id] = document.getElementById(id).value.trim();
    });

    wc.publish("mtk-register-submit", payload);
  });
})();
