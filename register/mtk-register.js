(function () {
    var form   = document.getElementById("mtk-register");
    var fields = ["name", "email", "email2", "phone"];

    var name   = document.getElementById("name");
    var email  = document.getElementById("email");
    var email2 = document.getElementById("email2");
    var phone  = document.getElementById("phone");

    var nameField  = name.closest(".md-field");
    var nameError  = nameField.querySelector(".helper");
    var emailError = email2.closest(".md-field").querySelector("[data-error-email]");
    var phoneField = phone.closest(".md-field");
    var phoneError = phoneField.querySelector(".helper");

    var EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var US_PHONE_REGEX = /^(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;

    // i18n helper — falls back to English if not loaded
    function t(key, fallback) {
        return (window.i18n ? i18n.t(key) : null) || fallback;
    }

    fields.forEach(function(id) {
        var input = document.getElementById(id);
        if (window.mtkRegisterConfig && window.mtkRegisterConfig[id]) {
            input.value = window.mtkRegisterConfig[id];
        }
        input.setAttribute("placeholder", " ");
    });

    // Update helper text labels from i18n
    function refreshLabels() {
        nameError.textContent  = t('register.name.helper', 'First Name, Middle Initial, Last Name');
        phoneError.textContent = t('register.phone.helper', 'Phone Number');
    }
    refreshLabels();
    document.addEventListener('i18n:changed', refreshLabels);

    function showNameError(message) {
        name.classList.add("error");
        nameError.textContent = message;
        nameError.classList.add("error");
    }
    function clearNameError() {
        name.classList.remove("error");
        nameError.textContent = t('register.name.helper', 'First Name, Middle Initial, Last Name');
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
        phoneError.textContent = t('register.phone.helper', 'Phone Number');
        phoneError.classList.remove("error");
    }

    name.addEventListener("input",  function() { if (name.value.trim().length >= 3) clearNameError(); });
    email.addEventListener("input", function() { if (EMAIL_REGEX.test(email.value.trim())) clearEmailError(); });
    email2.addEventListener("input", function() {
        if (EMAIL_REGEX.test(email.value.trim()) && email.value.trim() === email2.value.trim()) clearEmailError();
    });
    phone.addEventListener("input", function() { if (US_PHONE_REGEX.test(phone.value.trim())) clearPhoneError(); });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        clearNameError(); clearEmailError(); clearPhoneError();

        for (var i = 0; i < fields.length; i++) {
            var input = document.getElementById(fields[i]);
            if (!input.value.trim()) { input.focus(); return; }
        }

        if (name.value.trim().length < 3) {
            showNameError(t('register.error.name.length', 'Name must be at least 3 characters'));
            name.focus(); return;
        }
        if (!EMAIL_REGEX.test(email.value.trim())) {
            showEmailError(t('register.error.email.invalid', 'Enter a valid email address'));
            email.focus(); return;
        }
        if (email.value.trim() !== email2.value.trim()) {
            showEmailError(t('register.error.email.mismatch', 'Emails do not match'));
            email2.focus(); return;
        }
        if (!US_PHONE_REGEX.test(phone.value.trim())) {
            showPhoneError(t('register.error.phone.invalid', 'Enter a valid US phone number'));
            phone.focus(); return;
        }

        var payload = {};
        fields.forEach(function(id) {
            payload[id] = document.getElementById(id).value.trim();
        });
        wc.publish("mtk-register-submit", payload);
    });
})();
