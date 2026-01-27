(function () {
    const root = document.getElementById("_register-root");
    const form = document.getElementById("_register-form");
    const submitBtn = document.getElementById("_register-submit");

    if (!root || !form || !submitBtn || typeof PubSub === "undefined") return;

    /* ===== Publish ALL click events inside _register ===== */
    root.addEventListener("click", function (event) {
	const target = event.target;

	PubSub.publish("_register.click", {
	    component: "_register",
	    elementId: target.id || null,
	    tagName: target.tagName,
	    inputType: target.type || null,
	    timestamp: Date.now()
	});
    });

    /* ===== Get all required fields ===== */
    const requiredFields = form.querySelectorAll(
	"input[required], select[required]"
    );

    /* ===== Auto-select first option for Age and Education dropdowns ===== */
    const dropdownIds = ["_register-age", "_register-education"];
    dropdownIds.forEach(function (id) {
	const select = document.getElementById(id);
	if (select && select.options.length > 1) {
	    select.selectedIndex = 1; // first real option
	    PubSub.publish("_register.select.default", {
		component: "_register",
		elementId: select.id,
		value: select.value,
		timestamp: Date.now()
	    });
	}
    });

    /* ===== Validate form completeness and toggle submit ===== */
    function validateForm() {
	let isValid = true;

	requiredFields.forEach(function (field) {
	    if (!field.value || field.value.trim() === "") {
		isValid = false;
	    }
	});

	submitBtn.disabled = !isValid;

	PubSub.publish("_register.validation.state", {
	    component: "_register",
	    valid: isValid,
	    timestamp: Date.now()
	});
    }

    /* Attach listeners to required fields */
    requiredFields.forEach(function (field) {
	field.addEventListener("input", validateForm);
	field.addEventListener("change", validateForm);
    });

    /* ===== Handle submit ===== */
    form.addEventListener("submit", function (event) {
	event.preventDefault();

	/* Focus first empty required field */
	for (let i = 0; i < requiredFields.length; i++) {
	    const field = requiredFields[i];
	    if (!field.value || field.value.trim() === "") {
		field.focus();

		PubSub.publish("_register.validation.error", {
		    component: "_register",
		    elementId: field.id,
		    reason: "required_empty",
		    timestamp: Date.now()
		});

		return; // stop submission
	    }
	}

	/* Build JSON payload of all fields */
	const formData = {};
	const fields = form.querySelectorAll("input, select");

	fields.forEach(function (field) {
	    if (!field.id) return;
	    formData[field.id] = field.value.trim();
	});

	const payload = {
	    component: "_register",
	    formId: "_register-form",
	    timestamp: Date.now(),
	    data: formData
	};

	wc.log("payload", payload);

	/* Publish JSON payload */
	PubSub.publish("_register.submit", payload);
    });

    /* ===== Initial validation on load ===== */
    validateForm();
})();
