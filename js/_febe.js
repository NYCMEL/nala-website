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
	    "mtk-hierarchy:quiz-clicked",
	    "mtk-dashboard:subscription-clicked",
	    "mtk-msgs:button-click",
	    "header-logo-public",
	    "header-logo-private",
	    "4-mtk-quiz-submitted",
	];

	// create handlers mapping
	this.handlers = this.createHandlers();

	this.subscribe();
    }

    //////////////////////////////////////////////////////////////////
    ///// subscribe
    //////////////////////////////////////////////////////////////////
    subscribe() {
	this.topics.forEach(topic => {
	    wc.log("_febe: subscribed to", topic);
	    PubSub.subscribe(topic, this.onMessage.bind(this));
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// createHandlers
    //////////////////////////////////////////////////////////////////
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
	    "MTK-parts.click": this.handlePartsClick,
	    "mtk-header-logo": this.handleDashboard,
	    "mtk-header-dashboard": this.handleDashboard,
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
	};
    }

    //////////////////////////////////////////////////////////////////
    ///// onMessage
    //////////////////////////////////////////////////////////////////
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
    ///// handleQuizSubmitted
    //////////////////////////////////////////////////////////////////
    handleQuizSubmitted(data) {
	wc.log(">>>>>>>>", JSON.stringify(data.answers));

	wc.submitQuiz(data.quiz_session_id, data.module_id, data.answers, function (err, response) {
	    if (err) {
		alert("_febe.handleQuizSubmitted > Error submitting quiz.");
		return;
	    }

	    if (response.passed) {
		alert("You passed!");
	    } else {
		alert("You did not pass. Try again.");
	    }

	    console.log("Server response:", response);
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// handleHeaderLogoPublicClick
    //////////////////////////////////////////////////////////////////
    handleHeaderLogoPublicClick() {
	mtk_pager.show("home");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleHeaderLogoPrivateClick
    //////////////////////////////////////////////////////////////////
    handleHeaderLogoPrivateClick() {
	mtk_pager.show("dashboard");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleMsgButtonClick
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
    ///// handleDashboardClicks
    //////////////////////////////////////////////////////////////////
    handleDashboardClicks() {
	alert("_febe: handleDashboardClicks");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleQuiz
    //////////////////////////////////////////////////////////////////
    handleQuiz() {
	mtk_pager.show("quiz");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleRegister
    //////////////////////////////////////////////////////////////////
    handleRegister() {
	mtk_pager.show("register");
    }

    handleLessonToggled() {
	// NO-OP
    }

    //////////////////////////////////////////////////////////////////
    ///// handleRegisterSubmit
    //////////////////////////////////////////////////////////////////
    handleRegisterSubmit(data) {
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
	    }).then(res => {
		return res.json().then(json => {
		    if (!res.ok) {
			MTKMsgs.show({
			    type: 'error',
			    icon: 'error',
			    message: app.emsg(1003),
			    closable: true,
			    timer: 10
			});

			throw new Error(json.error || "Create user failed");
		    }
		    return json;
		});
	    }).then(json => {
		console.log("user created", json.user); // includes name
	    }).catch(console.error);
	})();
    }

    //////////////////////////////////////////////////////////////////
    ///// handleHome
    //////////////////////////////////////////////////////////////////
    handleHome() {
	mtk_pager.show("home");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleLoginSuccess
    //////////////////////////////////////////////////////////////////
    handleLoginSuccess(data) {
	wc.login(data.email, data.password).then(success => {
	    if (success) {
		wc.log("Logged in!");
		
		// SHOW PRIVATE HEADER
		$(".app-header").hide(() => $("#header-private").show(() => mtk_pager.show("dashboard")));
	    }
	}).catch(err => {
	    wc.error(err);
	    alert(err);
	});
    }

    //////////////////////////////////////////////////////////////////
    ///// handleCourse
    //////////////////////////////////////////////////////////////////
    handleCourse() {
	mtk_pager.show("course");
    }

    //////////////////////////////////////////////////////////////////
    ///// handlePartsClick
    //////////////////////////////////////////////////////////////////
    handlePartsClick() {
	mtk_pager.show("lessons");
	wc.timeout(() => lessonClicked(cIndex, cTitle), 500, 1);
    }

    //////////////////////////////////////////////////////////////////
    ///// handleDashboard
    //////////////////////////////////////////////////////////////////
    handleDashboard() {
	mtk_pager.show("dashboard");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleSettings
    //////////////////////////////////////////////////////////////////
    handleSettings() {
	mtk_pager.show("settings");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleLogin
    //////////////////////////////////////////////////////////////////
    handleLogin() {
	mtk_pager.show("login");
    }

    //////////////////////////////////////////////////////////////////
    ///// handleLogout
    //////////////////////////////////////////////////////////////////
    handleLogout() {
	wc.logout();
	
	// SHOW PUBLIC HEADER
	$(".app-header").hide(() => $("#header-public").show(() => mtk_pager.show("home")));
    }
}

/* auto-init */
window._febe = new _febe();
