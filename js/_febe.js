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
	    "mtk-dialog:action",
	];

	// create handlers mapping
	this.handlers = this.createHandlers();

	this.subscribe();
    }

    subscribe() {
	this.topics.forEach(topic => {
	    //wc.log("_febe: subscribed to", topic);
	    PubSub.subscribe(topic, this.onMessage.bind(this));
	});
    }

    createHandlers() {
	return {
	    "mtk-path:click": this.handleRegister,
	    "mtk-ready:click": this.handleRegister,
	    "mtk-courses:click": this.handleRegister,
	    "mtk-login-forgot-password": this.handleForgotPassword,
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
    handleDashboardClicks() {
	alert("_febe: handleDashboardClicks");
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
	wc.timeout(function(){
	    wc.pages.show("register");
	    
	    $('[mtk-pages-id="register"]').css("display","block");
	}, 300, 1);
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
		    message: "If this email exists, a reset link has been sent.",
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

	(() => {
	    fetch(wc.apiURL + "/api/register.php", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
		    name: data.name,
		    email: data.email,
		    phone: data.phone
		})
	    }).then(res => {
		return res.json().then(json => {
		    if (!res.ok) {
			MTKMsgs.show({
			    type: 'error',
			    icon: 'error',
			    message: (json && (json.error || json.message)) ? (json.error || json.message) : wc.emsg(1003),
			    closable: true,
			    timer: 10
			});

			throw new Error(json.error || "Create user failed");
		    }
		    return json;
		});
	    }).then(json => {
        MTKMsgs.show({
            type: "success",
            icon: "success",
            message: "Registration submitted. Check your email to set your password.",
            closable: true,
            timer: 12
        });
	    }).catch(console.error);
	})();
    }

    handleHome() {
	wc.pages.show("home");
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
	    alert(err);
	});
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
	wc.logout();
	
	// SHOW PUBLIC HEADER
	$(".app-header").hide(() => $("#header-public").show(() => wc.pages.show("home")));
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


