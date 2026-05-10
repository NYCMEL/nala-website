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
	    "mtk-header-contact",
	    "mtk-header-hierarchy",
	    "mtk-header-register",
	    "mtk-header-settings",
	    "mtk-header-messages",
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
	    "mtk-biab:reviews-save",
	    "mtk-biab:invoice-sent",
	    "mtk-biab:invoices-load",
	    "mtk-biab:email-invoice",
	    "mtk-biab:delete-invoice",
	    "mtk-biab:card-order-load",
	    "mtk-biab:business-card-submit",
	    "mtk-biab:google-seo-status-load",
	    "mtk-biab:google-seo-request",
	    "mtk-biab:reset",
	    "mtk-dashboard:reset-biab",
	    "mtk-invoice:save",
	    "mtk-settings:privacy-save",
	    "mtk-settings:business-save",
	    "mtk-settings:services-save",
	    "mtk-settings:change-password",
	    "mtk-contact:submit"
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
	    "mtk-header-contact": this.handleContact,
	    "mtk-login-submit": this.handleLoginSubmit.bind(this),
	    "mtk-login-success": this.handleLoginSuccess.bind(this),
	    "mtk-dashboard:continue": this.handleCourse,
	    "mtk-header-hierarchy": this.handleCourse,
	    "mtk-hierarchy:resource:click": this.handleResource.bind(this),
	    "MTK-parts.click": this.handlePartsClick,
	    "mtk-header-logo": this.handleDashboard,
	    "mtk-header-dashboard": this.handleHeaderDashboard,
	    "mtk-header-settings": this.handleSettings,
	    "mtk-header-messages": this.handleAlerts,
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
	    "mtk-biab:invoice-sent": this.handleBiabInvoiceSent,
	    "mtk-biab:invoices-load": this.handleBiabInvoicesLoad,
	    "mtk-biab:email-invoice": this.handleBiabInvoiceEmail,
	    "mtk-biab:delete-invoice": this.handleBiabInvoiceDelete,
	    "mtk-biab:card-order-load": this.handleBiabCardOrderLoad,
	    "mtk-biab:business-card-submit": this.handleBiabCardSubmit,
	    "mtk-biab:google-seo-status-load": this.handleBiabGoogleSeoStatusLoad,
	    "mtk-biab:google-seo-request": this.handleBiabGoogleSeoRequest,
	    "mtk-biab:reset": this.handleBiabReset,
	    "mtk-dashboard:reset-biab": this.handleBiabReset,
	    "mtk-invoice:save": this.handleInvoiceSave,
	    "mtk-settings:privacy-save": this.handleSettingsSave,
	    "mtk-settings:business-save": this.handleSettingsSave,
	    "mtk-settings:services-save": this.handleSettingsSave,
	    "mtk-settings:change-password": this.handleSettingsChangePassword,
	    "mtk-contact:submit": this.handleContactSubmit,

	};
    }

    onMessage(msg, data) {
	wc.log("_febe: onMessage", msg, data);

	const handler = this.handlers[msg];

	if (handler) {
	    handler.call(this, data);
	} else {
	    wc.error("_febe: DO NOT HAVE:" + msg);
	}
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    customerMessage(err, fallback) {
	if (window.wc && typeof wc.customerMessage === "function") {
	    return wc.customerMessage(err, fallback);
	}
	return fallback || "Something went wrong. Please try again.";
    }

    t(key, fallback) {
	if (window.wc && typeof wc.t === "function") {
	    return wc.t(key, fallback);
	}
	if (window.i18n && typeof window.i18n.t === "function") {
	    const value = window.i18n.t(key);
	    if (value && value !== key) return value;
	}
	return fallback;
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
		    message: this.customerMessage(err, this.t("biab.error.save", "Could not save Business in a Box changes. Please try again.")),
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(this.customerMessage(err, this.t("biab.error.save", "Could not save Business in a Box changes. Please try again.")));
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
		    message: this.customerMessage(err, this.t("biab.error.request", "Could not submit request. Please try again.")),
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(this.customerMessage(err, this.t("biab.error.request", "Could not submit request. Please try again.")));
	    }
	});
    }

    handleBiabReviewRequest(data) {
	return this.postBiabJson("/api/business_in_a_box_review_request.php", data || {}, "Review request email sent.", this.t("biab.error.reviewRequest", "Could not send review request email."));
    }

    getSessionUser() {
	const session = (window.wc && wc.session) || {};
	return session.user || session.currentUser || window.wc.currentUser || {};
    }

    getBusinessPageId() {
	const user = this.getSessionUser();
	return String(
	    (window._clientProfileInstance && window._clientProfileInstance.data && window._clientProfileInstance.data.nalaUID) ||
	    (wc.session && wc.session.nalaUID) ||
	    user.nalaUID ||
	    user.id ||
	    user.user_id ||
	    user.email ||
	    "demo"
	).replace(/[^a-zA-Z0-9_-]/g, "");
    }

    buildReviewUrl(uid, token) {
	const origin = (wc && wc.apiURL) ? String(wc.apiURL).replace(/\/$/, "") : window.location.origin;
	return origin + "/repo_deploy/client/review.html?nalaUID=" + encodeURIComponent(uid) + "&token=" + encodeURIComponent(token);
    }

    normalizeInvoicePayload(data) {
	const values = Object.assign({}, (data && data.values) || data || {});
	const totals = (data && data.totals) || {};
	const subtotal = Number(totals.subtotal || 0);
	const tax = Number(totals.tax || 0);
	const total = Number(totals.total || 0);
	return Object.assign({}, values, {
	    invoiceNumber: values.invoiceNumber || ("INV-" + new Date().toISOString().slice(0, 10).replace(/-/g, "")),
	    invoiceDate: values.invoiceDate || new Date().toISOString().slice(0, 10),
	    serviceFeeAmount: values.serviceFee || 0,
	    partsAmount: values.partsMaterials || 0,
	    laborAmount: 0,
	    taxAmount: tax,
	    subtotal,
	    total,
	    paymentStatus: values.paymentStatus || "Open"
	});
    }

    handleInvoiceSave(data) {
	const uid = this.getBusinessPageId();
	const invoice = this.normalizeInvoicePayload(data || {});

	return this.postBiabJson("/api/business_in_a_box_invoices.php", {
	    nalaUID: uid,
	    invoice
	}, "", this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    const savedId = json && json.id ? json.id : invoice.id;
	    const token = "review-" + (savedId || Date.now()).toString().replace(/[^a-zA-Z0-9_-]/g, "");
	    const reviewPayload = {
		nalaUID: uid,
		customerName: invoice.customerName,
		customerEmail: invoice.customerEmail,
		jobType: invoice.serviceType || invoice.notes || "Locksmith service",
		token,
		reviewUrl: this.buildReviewUrl(uid, token)
	    };

	    return this.postBiabJson("/api/business_in_a_box_review_request.php", reviewPayload, this.t("invoice.success.reviewSent", "Invoice saved. Review request email sent automatically."), this.t("biab.error.reviewRequest", "Could not send review request email.")).then(() => {
		wc.publish("mtk-biab:invoice-sent", Object.assign({}, invoice, { id: savedId, nalaUID: uid }));
		wc.publish("4-mtk-biab:invoice-saved", {
		    invoice: Object.assign({}, invoice, { id: savedId, nalaUID: uid }),
		    invoices: json.invoices || []
		});
		return json;
	    });
	});
    }

    handleBiabInvoiceSent(data) {
	const invoice = data || {};
	const customer = invoice.customerName || "Customer";
	const total = Number(invoice.total || 0);

	return fetch((wc && wc.apiURL ? wc.apiURL : "") + "/api/alerts.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify({
	    action: "create",
	    eventKey: invoice.id ? "invoice_sent:" + invoice.id : "",
	    type: "success",
	    icon: "receipt_long",
	    title: "Invoice sent",
	    message: "Invoice " + (invoice.id || "") + " was sent to " + customer + (total ? " for $" + total.toFixed(2) : "") + ".",
	    actionUrl: "/repo_deploy/biab/index.html?tool=invoices",
	    sourceType: "business_in_a_box_invoice",
	    sourceId: invoice.id || "",
	    payload: invoice
	    })
	}).catch(err => wc.warn("Could not save invoice alert", err));
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

	return this.postBiabJson("/api/business_in_a_box_reviews.php", data || {}, "Review display settings saved.", this.t("biab.error.reviewsSave", "Could not save review display settings."));
    }

    readStoredSettings() {
	try {
	    return JSON.parse(localStorage.getItem("nala_profile_settings") || "{}") || {};
	} catch (err) {
	    return {};
	}
    }

    writeStoredSettings(settings) {
	try {
	    localStorage.setItem("nala_profile_settings", JSON.stringify(settings || {}));
	} catch (err) {
	    wc.warn("Could not store settings locally", err);
	}
	window.nalaSettingsProfile = settings || {};
    }

    handleSettingsSave(data) {
	const payload = data && data.payload ? data.payload : data || {};
	const tabId = payload.tabId || "";
	const values = payload.values || {};
	const settings = this.readStoredSettings();
	settings[tabId] = Object.assign({}, settings[tabId] || {}, values);
	this.writeStoredSettings(settings);

	if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
	    MTKMsgs.show({
		type: "success",
		icon: "success",
		message: this.t("settings.success.saved", "Settings saved."),
		closable: true,
		timer: 5
	    });
	}

	if (tabId !== "business" && tabId !== "services") {
	    return Promise.resolve(settings);
	}

	return this.saveSettingsToBusinessProfile(settings).catch(err => {
	    wc.warn("Could not sync settings to BIAB profile", err);
	    return settings;
	});
    }

    saveSettingsToBusinessProfile(settings) {
	const uid = this.getBusinessPageId();
	const business = settings.business || {};
	const services = settings.services || {};
	const privacy = settings.privacy || {};
	const customServices = this.normalizeCustomServices(services.customServices);
	const launchServices = Array.isArray(services.launchServices) ? services.launchServices : [];
	const allServices = launchServices.concat(customServices).filter(Boolean);
	const businessName = business.customerFacingBusinessName || business.legalBusinessName || "Your Company Name";
	const phone = business.businessPhone || privacy.phone || "";
	const email = business.businessEmail || privacy.emailAddress || "";
	const website = business.businessWebsite || business.website || "";
	const serviceArea = services.serviceArea || "";

	const profile = {
	    nalaUID: uid && uid.length >= 3 ? uid : "DEMO",
	    business: {
		name: businessName,
		logo: "img/clients/x.webp",
		logoKind: "artwork",
		phone: phone,
		email: email,
		website: website,
		serviceArea: serviceArea,
		services: allServices.join(", "),
		rating: 0,
		ratingText: "",
		reviewCount: 0,
		isTopPro: false,
		isOnline: false
	    },
	    stats: [],
	    contact: {
		phone: phone,
		email: email,
		website: website,
		serviceArea: serviceArea,
		priceText: "Contact for estimate",
		ctaButton: "Request estimate",
		viewDetailsLink: ""
	    },
	    guarantee: {
		title: (business.customerFacingBusinessName || "Our") + " Guarantee",
		text: "Work is guaranteed or your money back. We stand behind every job.",
		learnMoreLink: ""
	    },
	    tabs: [],
	    about: {
		description: "Local locksmith service for " + (serviceArea || "your area") + ".",
		readMoreLink: ""
	    },
	    businessHours: {
		title: "Business hours",
		text: business.businessHours || "Call for current availability."
	    },
	    paymentMethods: {
		title: "Payment methods",
		methods: "This business accepts common payment methods. Confirm details when booking."
	    },
	    socialMedia: {
		title: "Social media",
		links: [
		    { platform: "facebook", icon: "img/facebook.png", url: "" },
		    { platform: "instagram", icon: "img/instagram.png", url: "" },
		    { platform: "twitter", icon: "img/twitter.png", url: "" }
		]
	    },
	    reviews: [],
	    topProStatus: {
		title: "",
		description: "",
		years: []
	    }
	};

	return fetch(wc.apiURL + "/api/business_in_a_box_profile.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(profile)
	}).then(res => this.readBiabJsonResponse(res, this.t("biab.error.save", "Could not save Business in a Box changes.")));
    }

    getBiabJson(path, errorMessage) {
	return fetch(this.getBiabApiUrl(path), {
	    method: "GET",
	    credentials: "include"
	}).then(res => this.readBiabJsonResponse(res, errorMessage));
    }

    handleBiabInvoicesLoad(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	return this.getBiabJson("/api/business_in_a_box_invoices.php?nalaUID=" + encodeURIComponent(uid), this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:invoices-loaded", {
		nalaUID: uid,
		invoices: json.invoices || []
	    });
	    return json;
	});
    }

    handleBiabInvoiceEmail(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	return this.postBiabJson("/api/business_in_a_box_invoice_email.php", {
	    nalaUID: uid,
	    invoiceId: data && data.invoiceId
	}, this.t("invoice.success.reviewSent", "Invoice saved. Review request email sent automatically."), this.t("biab.error.reviewRequest", "Could not send review request email.")).then(json => {
	    wc.publish("4-mtk-biab:invoice-emailed", json);
	    return json;
	});
    }

    handleBiabInvoiceDelete(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	return this.postBiabJson("/api/business_in_a_box_invoices.php", {
	    action: "delete",
	    nalaUID: uid,
	    invoiceId: data && data.invoiceId
	}, "Invoice deleted.", this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:invoices-loaded", {
		nalaUID: uid,
		invoices: json.invoices || []
	    });
	    return json;
	});
    }

    handleBiabCardOrderLoad(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	return this.getBiabJson("/api/business_in_a_box_card_order.php?nalaUID=" + encodeURIComponent(uid), this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:card-order-loaded", {
		nalaUID: uid,
		order: json.order || null
	    });
	    return json;
	});
    }

    handleBiabCardSubmit(data) {
	const payload = data || {};
	const uid = payload.nalaUID || this.getBusinessPageId();
	const template = payload.template || {};
	const order = {
	    templateId: payload.templateId || template.id || "",
	    template,
	    values: payload.values || {},
	    orderedAt: payload.orderedAt || new Date().toISOString()
	};

	return this.postBiabJson("/api/business_in_a_box_card_order.php", {
	    nalaUID: uid,
	    order
	}, "", this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:card-order-loaded", {
		nalaUID: uid,
		order: json.order || order
	    });
	    return json;
	});
    }

    normalizeCustomServices(value) {
	if (Array.isArray(value)) {
	    return value.map(item => {
		if (typeof item === "string") {
		    return item.trim();
		}
		if (item && item.checked === false) {
		    return "";
		}
		return String((item && item.label) || "").trim();
	    }).filter(Boolean);
	}
	return String(value || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }

    handleBiabGoogleSeoStatusLoad(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	return this.getBiabJson("/api/business_in_a_box_google_seo.php?nalaUID=" + encodeURIComponent(uid), this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:google-seo-status", {
		nalaUID: uid,
		status: json.status || {}
	    });
	    return json;
	});
    }

    handleBiabGoogleSeoRequest(data) {
	const payload = data || {};
	const uid = payload.nalaUID || this.getBusinessPageId();
	return this.postBiabJson("/api/business_in_a_box_google_seo.php", Object.assign({}, payload, {
	    nalaUID: uid,
	    action: "prepare"
	}), this.t("biab.googleSeo.preparedSuccess", "Google SEO package prepared."), this.t("biab.error.generic", "Could not complete that request. Please try again.")).then(json => {
	    wc.publish("4-mtk-biab:google-seo-status", {
		nalaUID: uid,
		status: json.status || {}
	    });
	    return json;
	});
    }

    handleBiabReset(data) {
	const uid = (data && data.nalaUID) || this.getBusinessPageId();
	try {
	    window.localStorage.removeItem("nala_profile_settings");
	    window.localStorage.removeItem("nala_biab_ordered_card_" + uid);
	    window.localStorage.removeItem("nala_biab_setup_prompt_seen_" + uid);
	} catch (err) {}

	const requests = [
	    this.postBiabJson("/api/business_in_a_box_card_order.php", {
		action: "reset",
		nalaUID: uid
	    }, "", this.t("biab.error.generic", "Could not complete that request. Please try again.")),
	    this.postBiabJson("/api/business_in_a_box_invoices.php", {
		action: "reset",
		nalaUID: uid
	    }, "", this.t("biab.error.generic", "Could not complete that request. Please try again.")),
	    this.postBiabJson("/api/business_in_a_box_reviews.php", {
		action: "reset",
		nalaUID: uid
	    }, "", this.t("biab.error.generic", "Could not complete that request. Please try again.")),
	    this.postBiabJson("/api/business_in_a_box_google_seo.php", {
		action: "reset",
		nalaUID: uid
	    }, "", this.t("biab.error.generic", "Could not complete that request. Please try again."))
	];

	return Promise.allSettled(requests).then(() => {
	    wc.publish("4-mtk-biab:card-order-loaded", { nalaUID: uid, order: null });
	    wc.publish("4-mtk-biab:invoices-loaded", { nalaUID: uid, invoices: [] });
	    wc.publish("4-mtk-biab:google-seo-status", { nalaUID: uid, status: {} });
	});
    }

    handleSettingsChangePassword(data) {
	const payload = data && data.payload ? data.payload : data || {};
	const values = payload.values || {};
	const user = this.getSessionUser();
	const email = String(values.emailAddress || user.email || (wc.session && wc.session.email) || "").trim();

	if (!email) {
	    MTKMsgs.show({
		type: "error",
		icon: "error",
		message: this.t("settings.error.noEmail", "Could not start password reset from this session."),
		closable: true,
		timer: 8
	    });
	    return;
	}

	return fetch(wc.apiURL + "/api/forgot_password.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify({ email })
	}).then(res => {
	    if (!res.ok) throw new Error("reset failed");
	    return res.json().catch(() => ({}));
	}).then(() => {
	    MTKMsgs.show({
		type: "success",
		icon: "success",
		message: this.t("settings.success.reset", "Password reset email sent. Please check your inbox."),
		closable: true,
		timer: 10
	    });
	}).catch(() => {
	    MTKMsgs.show({
		type: "error",
		icon: "error",
		message: this.t("settings.error.resetFail", "Could not send reset link."),
		closable: true,
		timer: 10
	    });
	});
    }

    getBiabApiUrl(path) {
	const normalizedPath = path && path.charAt(0) === "/" ? path : "/" + path;
	const base = document.querySelector("base[href]");

	if (base) {
	    try {
		const baseUrl = new URL(base.getAttribute("href"), window.location.origin);
		const basePath = baseUrl.pathname.replace(/\/$/, "");
		if (basePath && basePath !== "/") {
		    return basePath + normalizedPath;
		}
	    } catch (err) {
		console.warn("Could not resolve BIAB API base path", err);
	    }
	}

	const apiRoot = wc && wc.apiURL ? String(wc.apiURL).replace(/\/$/, "") : "";
	return apiRoot + normalizedPath;
    }

    readBiabJsonResponse(res, errorMessage) {
	return res.text().then(text => {
	    let json = {};
	    try {
		json = text ? JSON.parse(text) : {};
	    } catch (err) {
		throw new Error(errorMessage);
	    }

	    if (!res.ok || json.error) {
		throw new Error((json && (json.error || json.message)) || errorMessage);
	    }

	    return json;
	});
    }

    postBiabJson(path, payload, successMessage, errorMessage) {
	return fetch(this.getBiabApiUrl(path), {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(payload || {})
	}).then(res => {
	    return this.readBiabJsonResponse(res, errorMessage);
	}).then(json => {
	    if (successMessage && window.MTKMsgs && typeof MTKMsgs.show === "function") {
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
		    message: this.customerMessage(err, errorMessage || this.t("biab.error.generic", "Could not complete that request. Please try again.")),
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(this.customerMessage(err, errorMessage || this.t("biab.error.generic", "Could not complete that request. Please try again.")));
	    }
	    throw err;
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
		message: "Enter your email first, then click Forgot password.",
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
			    message: this.t("login.reset.sentGeneric", "If this email exists, a reset link will be emailed to you."),
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
		    message: this.t("login.reset.sentGeneric", "If this email exists, a reset link will be emailed to you."),
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
		"server_error": "register.error.server",
		"If registration can be completed, we will email the next steps.": "register.success",
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
			    message: this.customerMessage(
				translateRegisterMessage(message, "register.error.server"),
				this.t("register.error.server", "Registration failed. Please try again.")
			    ),
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

    handleContact() {
	wc.pages.show("contact");
    }

    handleContactSubmit(data) {
	return fetch(wc.apiURL + "/api/contact.php", {
	    method: "POST",
	    credentials: "include",
	    headers: { "Content-Type": "application/json" },
	    body: JSON.stringify(data || {})
	}).then(res => {
	    return res.json().then(json => {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || "Could not send your message.");
		}
		return json;
	    });
	}).then(json => {
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "success",
		    icon: "mark_email_read",
		    message: this.t("contact.success", "Your message was sent. We will get back to you shortly."),
		    closable: true,
		    timer: 8
		});
	    }
	    wc.publish("4-mtk-contact:sent", json || {});
	    return json;
	}).catch(err => {
	    wc.error("Contact submit failed", err);
	    if (window.MTKMsgs && typeof MTKMsgs.show === "function") {
		MTKMsgs.show({
		    type: "error",
		    icon: "error",
		    message: this.customerMessage(err, this.t("contact.error", "Could not send your message. Please try again.")),
		    closable: true,
		    timer: 10
		});
	    }
	    wc.publish("4-mtk-contact:error", { message: err.message || "" });
	});
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
		    message: this.customerMessage(err, wc.emsg ? wc.emsg(1000) : "Unable to sign in with those credentials."),
		    closable: true,
		    timer: 10
		});
	    } else {
		alert(this.customerMessage(err, wc.emsg ? wc.emsg(1000) : "Unable to sign in with those credentials."));
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

    handleAlerts() {
	wc.pages.show("alerts");
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
	const response = data && data.response ? data.response : data;
	if (!response || typeof response !== "object") {
	    wc.warn("_febe.handleQuizSubmitted > missing response payload", data);
	    return;
	}

	wc.log("_febe.handleQuizSubmitted > Server response:", response);

	if (response.passed) {
	    mtkDialog.open({
		id      : 'success',
		title   : 'You passed the quiz',
		message : 'You have successfully completed this quiz.',
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
	    if (window.MTKHierarchy && typeof window.MTKHierarchy.enableNextModule === "function") {
		window.MTKHierarchy.enableNextModule();
	    }

	    wc.log("Congratulations! You passed.");
	} else {
	    mtkDialog.open({
		id      : 'failed',
		title   : 'You did not pass the quiz',
		message : 'We recommend retaking the quiz for a better result.',
		icon    : 'warning',
		iconColor: 'red',
		maxWidth: '700px',
		closeOnBackdrop: false,
		closeOnEscape  : false,
		buttons: [
		    { label: 'Retake the quiz',  action: 'cancel', classes: 'btn btn-warning' }
		]
	    });
	}
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
