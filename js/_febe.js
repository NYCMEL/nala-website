class _febe {
    constructor() {
	this.registerRequestInFlight = false;

	// list of topics
	this.topics = [
	    "mtk-ready:click",
	    "mtk-courses:click",
	    "mtk-path:click",
	    "header-logo",
	    "mtk-header-dashboard",
	    "mtk-header-login",
	    "mtk-header-logout",
	    "mtk-header-home",
	    "mtk-header-news",
	    "mtk-header-hierarchy",
	    "mtk-header-register",
	    "mtk-header-settings",
	    "mtk-dashboard:continue",
	    "mtk-login-forgot",
	    "mtk-login-forgot-password",
	    "mtk-login-register",
	    "mtk-login-focus",
	    "mtk-login-submit",
	    "mtk-login-success",
	    "MTK-parts.click",
	    "mtk-hierarchy:resource:click",
	    "mtk-register-submit",
	    "mtk-hierarchy:lesson-toggled",
	    "mtk-hierarchy:quiz-clicked",
	    "mtk-dashboard:subscription-clicked",
	    "mtk-msgs:button-click",
	    "header-logo-public",
	    "header-logo-private",
	    "4-mtk-quiz-submitted",
	    "mtk-dialog:action",
	    "client:save",
	    "mtk-request:submit",
	    "mtk-biab:review-request",
	    "mtk-biab:reviews-save"
	];

	// create handlers mapping
	this.handlers = this.createHandlers();

	this.subscribe();
	this.fetchPricing();
    }

    subscribe() {
	this.topics.forEach(topic => {
	    //wc.log("_febe: subscribed to", topic);
	    PubSub.subscribe(topic, this.onMessage.bind(this));
	});
    }

    createHandlers() {
	return {
	    "mtk-path:click": this.handlePathClick.bind(this),
	    "mtk-ready:click": this.handleRegister,
	    "mtk-courses:click": this.handleRegister,
	    "mtk-login-forgot": this.handleForgotPassword,
	    "mtk-login-forgot-password": this.handleForgotPassword,
	    "mtk-login-register": this.handleRegister,
	    "mtk-hierarchy:lesson-toggled": this.handleLessonToggled,
	    "mtk-register-submit": this.handleRegisterSubmit,
	    "mtk-header-home": this.handleHome,
	    "mtk-header-news": this.handleNews,
	    "mtk-login-submit": this.handleLoginSubmit.bind(this),
	    "mtk-login-success": this.handleLoginSuccess.bind(this),
	    "mtk-dashboard:continue": this.handleCourse,
	    "mtk-header-hierarchy": this.handleCourse,
	    "mtk-hierarchy:resource:click": this.handleResource.bind(this),
	    "MTK-parts.click": this.handlePartsClick,
	    "mtk-header-logo": this.handleDashboard,
	    "mtk-header-dashboard": this.handleHeaderDashboard,
	    "mtk-header-settings": this.handleSettings,
	    "mtk-header-login": this.handleLogin,
	    "mtk-header-logout": this.handleLogout,
	    "mtk-header-register": this.handleRegister,
	    "mtk-hierarchy:quiz-clicked": this.handleQuiz,
	    "mtk-dashboard:subscription-clicked": this.handleDashboardClicks,
	    "mtk-msgs:button-click": this.handleMsgButtonClick,
	    "header-logo-public": this.handleHeaderLogoPublicClick,
	    "header-logo-private": this.handleHeaderLogoPrivateClick,
	    "4-mtk-quiz-submitted": this.handleQuizSubmitted,
	    "mtk-dialog:action": this.handleDialogActions,
	    "client:save": this.handleClientSave,
	    "mtk-request:submit": this.handleRequestSubmit,
	    "mtk-biab:review-request": this.handleBiabReviewRequest,
	    "mtk-biab:reviews-save": this.handleBiabReviewsSave,

	};
    }

    onMessage(msg, data) {
	wc.log("_febe: onMessage", msg, data);

	const handler = this.handlers[msg];

	if (handler) {
	    handler.call(this, data);
	} else {
	    wc.error("_febe: DO NOT HAVE:" + msg);
	    alert("_febe: DO NOT HAVE:" + msg);
	}
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleClientSave(data) {
	const instance = window._clientProfileInstance;
	const source = instance && instance.data ? JSON.parse(JSON.stringify(instance.data)) : {};
	const changes = data || {};

	source.nalaUID = String(source.nalaUID || changes.nalaUID || "").trim();
	source.business = source.business || {};
	source.about = source.about || {};
	source.businessHours = source.businessHours || {};
	source.paymentMethods = source.paymentMethods || {};
	source.guarantee = source.guarantee || {};
	source.socialMedia = source.socialMedia || {};
	source.socialMedia.links = Array.isArray(source.socialMedia.links) ? source.socialMedia.links : [];
	source.stats = Array.isArray(source.stats) ? source.stats : [];
	source.reviews = Array.isArray(source.reviews) ? source.reviews : [];

	if (changes.clientName !== undefined) source.business.name = changes.clientName;
	if (changes.aboutText !== undefined) source.about.description = changes.aboutText;
	if (changes.businessHoursText !== undefined) source.businessHours.text = changes.businessHoursText;
	if (changes.paymentMethodsText !== undefined) source.paymentMethods.methods = changes.paymentMethodsText;
	if (changes.guaranteeTitle !== undefined) source.guarantee.title = changes.guaranteeTitle;
	if (Array.isArray(changes.socialMedia)) source.socialMedia.links = changes.socialMedia;
	if (Array.isArray(changes.reviews)) source.reviews = changes.reviews;
	if (changes.rating !== undefined) source.business.rating = Number(changes.rating);
	if (changes.reviewCount !== undefined) source.business.reviewCount = Number(changes.reviewCount);

	if (Array.isArray(changes.stats)) {
	    source.stats = source.stats.map((stat, index) => {
		const next = Object.assign({}, stat);
		const updatedText = changes.stats[index];
		if (updatedText === undefined || updatedText === null || updatedText === "") {
		    return next;
		}

		if (typeof next.text === "string" && /^(\d+)(.*)$/.test(next.text)) {
		    next.text = next.text.replace(/^(\d+)(.*)$/, String(updatedText) + "$2");
		} else {
		    next.text = String(updatedText);
		}
		return next;
	    });
	}

	const payload = source;
	if (typeof changes.clientLogo === "string" && changes.clientLogo.indexOf("data:") === 0) {
	    payload.profile_photo_data_url = changes.clientLogo;
	}

	return fetch(wc.apiURL + "/api/business_in_a_box_profile.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(payload)
	}).then(res => {
	    return res.json().then(json => {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || "Could not save Business in a Box profile.");
		}
		return json;
	    });
	}).then(json => {
	    if (json && json.profile && instance) {
		instance.data = json.profile;
	    }

	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "success",
		    icon: "success",
		    message: "Business in a Box changes saved.",
		    closable: true,
		    timer: 6
		});
	    }

	    return json;
	}).catch(err => {
	    wc.error("Business in a Box save failed", err);
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "error",
		    icon: "error",
		    message: err && err.message ? err.message : "Could not save Business in a Box changes.",
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(err && err.message ? err.message : "Could not save Business in a Box changes.");
	    }
	});
    }


    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleRequestSubmit(data) {
	return fetch(wc.apiURL + "/api/business_in_a_box_request.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(data || {})
	}).then(res => {
	    return res.json().then(json => {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || "Could not submit request.");
		}
		return json;
	    });
	}).then(json => {
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "success",
		    icon: "success",
		    message: "Request submitted successfully.",
		    closable: true,
		    timer: 8
		});
	    }

	    return json;
	}).catch(err => {
	    wc.error("Business in a Box request submit failed", err);
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "error",
		    icon: "error",
		    message: err && err.message ? err.message : "Could not submit request.",
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(err && err.message ? err.message : "Could not submit request.");
	    }
	});
    }

    handleBiabReviewRequest(data) {
	return this.postBiabJson("/api/business_in_a_box_review_request.php", data || {}, "Review request email sent.", "Could not send review request email.");
    }

    handleBiabReviewsSave(data) {
	const instance = window._clientProfileInstance;
	if (instance && instance.data && data) {
	    instance.data.reviews = Array.isArray(data.reviews) ? data.reviews : instance.data.reviews;
	    instance.data.business = instance.data.business || {};
	    if (data.rating !== undefined) instance.data.business.rating = Number(data.rating);
	    if (data.reviewCount !== undefined) instance.data.business.reviewCount = Number(data.reviewCount);
	    instance.renderHeader();
	    instance.renderReviews();
	}

	return this.postBiabJson("/api/business_in_a_box_reviews.php", data || {}, "Review display settings saved.", "Could not save review display settings.");
    }

    postBiabJson(path, payload, successMessage, errorMessage) {
	return fetch(wc.apiURL + path, {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(payload || {})
	}).then(res => {
	    return res.json().then(json => {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || errorMessage);
		}
		return json;
	    });
	}).then(json => {
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "success",
		    icon: "success",
		    message: successMessage,
		    closable: true,
		    timer: 6
		});
	    }
	    return json;
	}).catch(err => {
	    wc.error("Business in a Box API request failed", err);
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "error",
		    icon: "error",
		    message: err && err.message ? err.message : errorMessage,
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(err && err.message ? err.message : errorMessage);
	    }
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleHeaderDashboard() {
	wc.pages.show("dashboard");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleDialogActions() {
	wc.pages.show("hierarchy");

	mtkDialog.close();
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleHeaderLogoPublicClick() {
	headerSelect('mtk-header-home');
	wc.pages.show("home");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleHeaderLogoPrivateClick() {
	wc.pages.show("dashboard");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleMsgButtonClick(data) {
	wc.log("_febe: handleMsgButtonClick: ", JSON.stringify(data));

	switch(data.action) 
	{
	    case "NextEmptyQuestion":
	    window.MtkQuiz.scrollToFirstUnanswered();

	    // CLOSE THE MSG
	    $(".mtk-msgs__close").click();
	    break;
	}
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleDashboardClicks(data) {
	if (!wc.buy || typeof wc.buy.handlePurchasePlan !== "function") {
	    return;
	}

	const payload = data || {};
	if (payload.subscriptionId === "business-in-a-box") {
	    wc.buy.handlePurchasePlan("business");
	    return;
	}

	wc.buy.handlePurchasePlan("premium");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleQuiz() {
	wc.pages.show("quiz");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleRegister() {
	if (typeof window.nalaShowRegister === "function") {
	    window.nalaShowRegister();
	    return;
	}

	if (wc.pages && typeof wc.pages.show === "function") {
	    wc.pages.show("register");
	}
    }

    handlePathClick(data) {
	const payload = data || {};
	if (
	    (payload.plan === "premium" || payload.plan === "business") &&
	    wc.buy &&
	    typeof wc.buy.handlePurchasePlan === "function"
	) {
	    wc.buy.handlePurchasePlan(payload.plan);
	    return;
	}

	this.handleRegister();
    }

    fetchPricing() {
	return fetch(wc.apiURL + "/api/pricing.php", {
	    method: "GET",
	    credentials: "include"
	}).then(res => {
	    return res.json().then(json => {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || "pricing failed");
		}

		window.nalaPricing = json && json.prices ? json.prices : {};
		document.dispatchEvent(new CustomEvent("nala-pricing:updated", {
		    detail: window.nalaPricing
		}));

		return window.nalaPricing;
	    });
	}).catch(err => {
	    wc.warn("Failed to load pricing", err);
	    return null;
	});
    }

    handleForgotPassword() {
	const emailInput = document.querySelector("#mtk-email");
	const email = emailInput ? String(emailInput.value || "").trim() : "";

	if (!email) {
	    MTKMsgs.show({
		type: "error",
		icon: "error",
		message: "Enter your email first, then click Forgot Password.",
		closable: true,
		timer: 8
	    });
	    return;
	}

	(() => {
	    fetch(wc.apiURL + "/api/forgot_password.php", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email })
	    }).then(res => {
		return res.json().then(json => {
		    if (!res.ok) {
			MTKMsgs.show({
			    type: "error",
			    icon: "error",
			    message: (json && (json.error || json.message)) ? (json.error || json.message) : "Could not process password reset.",
			    closable: true,
			    timer: 10
			});
			throw new Error(json.error || "forgot_password failed");
		    }
		    return json;
		});
	    }).then(() => {
		MTKMsgs.show({
		    type: "success",
		    icon: "success",
		    message: "If this email exists, a reset link will be emailed to you.",
		    closable: true,
		    timer: 10
		});
	    }).catch(console.error);
	})();
    }
    handleLessonToggled() {
	// NO-OP
    }

    handleRegisterSubmit(data) {
	// data ={name: 'Mel Heravi', email: 'mel.heravi@gmail.com', email2: 'mel.heravi@gmail.com', phone: '6463031234'}
	const translateRegisterMessage = (message, fallbackKey) => {
	    const dict = {
		"Please fill in all required fields.": "register.error.requiredFields",
		"An account with that email already exists.": "register.error.exists",
		"server_error": "register.error.server",
		"Registration submitted. Check your email to set your password.": "register.success"
	    };
	    const key = dict[message] || fallbackKey;
	    if (window.i18n && typeof window.i18n.t === "function" && key) {
		return window.i18n.t(key);
	    }
	    return message;
	};

	if (this.registerRequestInFlight) {
	    return;
	}

	this.registerRequestInFlight = true;

	(() => {
	    fetch(wc.apiURL + "/api/register.php", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
		    name: data.name,
		    email: data.email,
		    email2: data.email2,
		    phone: data.phone
		})
	    }).then(res => {
		return res.json().then(json => {
		    if (!res.ok) {
			const message = (json && (json.error || json.message)) ? (json.error || json.message) : wc.emsg(1003);
			MTKMsgs.show({
			    type: 'error',
			    icon: 'error',
			    message: translateRegisterMessage(message, "register.error.server"),
			    closable: true,
			    timer: 10
			});

			throw new Error(json.error || "Create user failed");
		    }
		    return json;
		});
	    }).then(json => {
		const message = (json && (json.message || json.msg)) ? (json.message || json.msg) : "Registration submitted. Check your email to set your password.";
		MTKMsgs.show({
		    type: "success",
		    icon: "success",
		    message: translateRegisterMessage(message, "register.success"),
		    closable: true,
		    timer: 12
		});
	    }).catch(console.error).finally(() => {
		this.registerRequestInFlight = false;
	    });
	})();
    }

    handleHome() {
	wc.pages.show("home");
    }

    handleNews() {
	wc.pages.show("news");
    }

    handleLoginSuccess(data) {
	wc.login(data.email, data.password).then(success => {
	    if (success) {
		wc.log("Logged in!");
		
		// SHOW PRIVATE HEADER
		$(".app-header").hide(() => $("#header-private").show(() => wc.pages.show("dashboard")));
	    }
	}).catch(err => {
	    wc.error(err);
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "error",
		    icon: "error",
		    message: err && err.message ? err.message : String(err),
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(err);
	    }
	});
    }

    handleLoginSubmit(data) {
	this.handleLoginSuccess(data);
    }

    handleCourse() {
	wc.pages.show("hierarchy");
    }

    handleResource(data) {
	this.resource(data);
    }

    handlePartsClick() {
	wc.pages.show("lessons");
	wc.timeout(() => lessonClicked(cIndex, cTitle), 500, 1);
    }

    handleDashboard() {
	wc.pages.show("dashboard");
    }

    handleSettings() {
	wc.pages.show("settings");
    }

    handleLogin() {
	wc.pages.show("login");
    }

    handleLogout() {
	Promise.resolve(wc.logout()).finally(() => {
	    wc.session = null;
	    wc.user = null;
	    wc.currentUser = null;

	    // SHOW PUBLIC HEADER
	    $(".app-header").hide(() => $("#header-public").show(() => wc.pages.show("home")));
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleQuizSubmitted(data) {
	wc.submitQuiz(data.quiz_session_id, data.module_id, data.answers, function (err, response) {
	    if (err) {
		alert("_febe.handleQuizSubmitted > Error submitting quiz.");
		return;
	    }
	    
	    wc.log("_febe.handleQuizSubmitted > Server response:", response);

	    if (response.passed) {
		mtkDialog.open({
		    id      : 'success',
		    title   : 'You passed the Quiz',
		    message : 'You have Successfully completed this set of tests',
		    icon    : 'check_circle',
		    iconColor: 'green',
		    maxWidth: '700px',
		    closeOnBackdrop: false,
		    closeOnEscape  : false,
		    buttons: [
			{ label: 'Save & Continue',  action: 'TBD', classes: 'btn btn-primary' }
		    ]
		});
		
		MTKMsgs.show({
		    type: 'success',
		    icon: 'success',
		    message: wc.emsg(1004),
		    closable: false,
		    timer: 5
		});

		// ENABLE NEXT MODULE
		window.MTKHierarchy.enableNextModule();

		wc.log("Congratulations! You passed.");
	    } else {
		mtkDialog.open({
		    id      : 'failed',
		    title   : 'You did not pass the Quiz',
		    message : 'We recommand that you re-take the test for better result',
		    icon    : 'warning',
		    iconColor: 'red',
		    maxWidth: '700px',
		    closeOnBackdrop: false,
		    closeOnEscape  : false,
		    buttons: [
			{ label: 'Re-take the test',  action: 'cancel', classes: 'btn btn-warning' }
		    ]
		});
	    }
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// RESOURCE HANDLERS
    //////////////////////////////////////////////////////////////////
    resource(data) {
	if (!data) {
	    wc.warn("_febe.resource: no data received");
	    return;
	}

	wc.log("_febe.resource:", data.description, data.url);

	const typeHandlers = {
	    video: () => {
		$(".mtk-hierarchy-rhs-video, .mtk-hierarchy-rhs-image, .mtk-hierarchy-rhs-intro").hide();
		$(".mtk-hierarchy-rhs-video").fadeIn();
		wc.timeout(() => {
		    wc.log("_febe:", data.url, data.description);
		    window.MTKVideoInstance.load(data.url, data.description);
		}, 200, 1);
	    },
	    image: () => wc.log("_febe:", data.type, data.url)
	};

	const action = typeHandlers[data.type];
	if (action) {
	    action();
	} else {
	    wc.error("NO SUCH TYPE:", data.type);
	}
    }
}

/* auto-init */
window._febe = new _febe();
