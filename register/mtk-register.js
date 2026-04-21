(function () {
    const form = document.getElementById("mtk-register");
    const fields = ["name", "email", "email2", "phone"];
    const t = (key, fallback) => {
	return window.i18n && typeof window.i18n.t === "function" ? window.i18n.t(key) : fallback;
    };

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const email2 = document.getElementById("email2");
    const phone = document.getElementById("phone");

    const nameField = name.closest(".md-field");
    const nameError = nameField.querySelector(".helper");

    const emailError = email2
	  .closest(".md-field")
	  .querySelector("[data-error-email]");

    const phoneField = phone.closest(".md-field");
    const phoneError = phoneField.querySelector(".helper");

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^\+?[0-9().\-\s]{7,20}$/;

    function isValidPhone(value) {
	const raw = value.trim();
	const digits = raw.replace(/\D/g, "");
	return PHONE_REGEX.test(raw) && digits.length >= 7 && digits.length <= 15;
    }

    fields.forEach(id => {
	const input = document.getElementById(id);
	if (window.mtkRegisterConfig && window.mtkRegisterConfig[id]) {
	    input.value = window.mtkRegisterConfig[id];
	}
	input.setAttribute("placeholder", " ");
    });

    function showNameError(message) {
	name.classList.add("error");
	nameError.textContent = message;
	nameError.classList.add("error");
    }

    function clearNameError() {
	name.classList.remove("error");
	nameError.textContent = t("register.name.helper", "First Name, Middle Initial, Last Name");
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
	phoneError.textContent = t("register.phone.helper", "Phone Number");
	phoneError.classList.remove("error");
    }

    name.addEventListener("input", () => {
	if (name.value.trim().length >= 3) clearNameError();
    });

    email.addEventListener("input", () => {
	if (EMAIL_REGEX.test(email.value.trim())) clearEmailError();
    });

    email2.addEventListener("input", () => {
	if (EMAIL_REGEX.test(email.value.trim()) && email.value.trim() === email2.value.trim()) {
	    clearEmailError();
	}
    });

    phone.addEventListener("input", () => {
	if (isValidPhone(phone.value.trim())) clearPhoneError();
    });

    form.addEventListener("submit", event => {
	event.preventDefault();

	clearNameError();
	clearEmailError();
	clearPhoneError();

	for (let i = 0; i < fields.length; i++) {
	    const input = document.getElementById(fields[i]);
	    if (!input.value.trim()) {
		input.focus();
		return;
	    }
	}

	if (name.value.trim().length < 3) {
	    showNameError(t("register.error.name.length", "Name must be at least 3 characters"));
	    name.focus();
	    return;
	}

	if (!EMAIL_REGEX.test(email.value.trim())) {
	    showEmailError(t("register.error.email.invalid", "Enter a valid email address"));
	    email.focus();
	    return;
	}

	if (email.value.trim() !== email2.value.trim()) {
	    showEmailError(t("register.error.email.mismatch", "Emails do not match"));
	    email2.focus();
	    return;
	}

	if (!isValidPhone(phone.value.trim())) {
	    showPhoneError(t("register.error.phone.invalid", "Enter a valid phone number"));
	    phone.focus();
	    return;
	}

	const payload = {};
	fields.forEach(id => {
	    payload[id] = document.getElementById(id).value.trim();
	});

	wc.publish("mtk-register-submit", payload);
    });
})();
