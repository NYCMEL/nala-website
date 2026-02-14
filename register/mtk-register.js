(function () {
    const form = document.getElementById("mtk-register");
    const fields = ["name", "email", "email2", "phone"];

    // Populate initial values from config
    fields.forEach(id => {
	const input = document.getElementById(id);
	if (window.mtkRegisterConfig && window.mtkRegisterConfig[id]) {
	    input.value = window.mtkRegisterConfig[id];
	}
	input.setAttribute("placeholder", " "); // required for floating labels
    });

    form.addEventListener("submit", e => {
	e.preventDefault();

	for (let id of fields) {
	    const input = document.getElementById(id);
	    if (!input.value.trim()) {
		input.focus();
		return;
	    }
	}

	const payload = {};
	fields.forEach(id => {
	    payload[id] = document.getElementById(id).value.trim();
	});

	wc.log("mtk-register-submit", payload);
	wc.publish("mtk-register-submit", payload);
    });
})();
