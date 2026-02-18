class _febe {
    constructor() {
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
	    "mtk-header-hierarchy",
	    "mtk-header-register",
	    "mtk-header-settings",
	    "mtk-dashboard:continue",
	    "mtk-login-forgot-password",
	    "mtk-login-register",
	    "mtk-login-focus",
	    "mtk-login-success",
	    "MTK-parts.click",
	    "mtk-hierarchy:resource:click",
	    "mtk-register-submit",
	    "mtk-hierarchy:lesson-toggled",
	    "mtk-hierarchy:quiz-clicked"
	];

	// create handlers mapping
	this.handlers = this.createHandlers();

	this.subscribe();
    }

    subscribe() {
	this.topics.forEach(topic => {
	    wc.log("_febe: subscribed to", topic);
	    PubSub.subscribe(topic, this.onMessage.bind(this));
	});
    }

    createHandlers() {
	return {
	    "mtk-path:click": this.handleRegister,
	    "mtk-ready:click": this.handleRegister,
	    "mtk-courses:click": this.handleRegister,
	    "mtk-login-register": this.handleRegister,
	    "mtk-hierarchy:lesson-toggled": this.handleLessonToggled,
	    "mtk-register-submit": this.handleRegisterSubmit,
	    "mtk-header-home": this.handleHome,
	    "mtk-login-success": this.handleLoginSuccess.bind(this),
	    "mtk-dashboard:continue": this.handleCourse,
	    "mtk-header-hierarchy": this.handleCourse,
	    "mtk-hierarchy:resource:click": this.handleResource.bind(this),
	    "MTK-parts.click": this.handlePartsClick,
	    "mtk-header-logo": this.handleDashboard,
	    "mtk-header-dashboard": this.handleDashboard,
	    "mtk-header-settings": this.handleSettings,
	    "mtk-header-login": this.handleLogin,
	    "mtk-header-logout": this.handleLogout,
	    "mtk-header-register": this.handleRegister,
	    "mtk-hierarchy:quiz-clicked": this.handleQuiz,

	};
    }

    onMessage(msg, data) {
	wc.log("_febe: onMessage", msg, data);

	const handler = this.handlers[msg];
	if (handler) {
	    handler(data);
	} else {
	    wc.error("_febe: DO NOT HAVE:" + msg);
	    alert("_febe: DO NOT HAVE:" + msg);
	}
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleQuiz() {
	mtk_pager.show("quiz");
    }

    //////////////////////////////////////////////////////////////////
    ///// HANDLERS
    //////////////////////////////////////////////////////////////////
    handleRegister() {
	mtk_pager.show("register");
    }

    handleLessonToggled() {
	// NO-OP
    }

    handleRegisterSubmit(data) {
	// data ={name: 'Mel Heravi', email: 'mel.heravi@gmail.com', email2: 'mel.heravi@gmail.com', phone: '6463031234'}

	console.log(">>>>data:", data);

	(() => {
	    fetch(wc.apiURL + "/api/admin_create_user.php", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
		    name: data.name,
		    email: data.email,
		    password: "changeme123",
		    role: "registered"
		})
	    })
		.then(res => {
		    return res.json().then(json => {
			if (!res.ok) {
			    throw new Error(json.error || "Create user failed");
			}
			return json;
		    });
		})
		.then(json => {
		    console.log("user created", json.user); // includes name
		})
		.catch(console.error);
	})();
    }

    handleHome() {
	mtk_pager.show("home");
    }

    handleLoginSuccess(data) {
	wc.login(data.email, data.password)
	    .then(success => {
		if (success) {
		    wc.log("Logged in!");

		    // SHOW PRIVATE HEADER
		    $(".app-header").hide(() => $("#header-private").show(() => mtk_pager.show("dashboard")));
		}
	    })
	    .catch(err => {
		wc.error(err);
		alert(err);
	    });
    }

    handleCourse() {
	mtk_pager.show("course");
    }

    handleResource(data) {
	this.resource(data);
    }

    handlePartsClick() {
	mtk_pager.show("lessons");
	wc.timeout(() => lessonClicked(cIndex, cTitle), 500, 1);
    }

    handleDashboard() {
	mtk_pager.show("dashboard");
    }

    handleSettings() {
	mtk_pager.show("settings");
    }

    handleLogin() {
	mtk_pager.show("login");
    }

    handleLogout() {
	wc.logout();
	
	// SHOW PUBLIC HEADER
	$(".app-header").hide(() => $("#header-public").show(() => mtk_pager.show("home")));
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
