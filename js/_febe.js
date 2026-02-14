class _febe {
    constructor() {
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

	    "mtk-register:submit"
        ];

        this.subscribe();
    }

    subscribe() {
        this.topics.forEach(topic => {
            wc.log("_febe: subscribed to", topic);
            PubSub.subscribe(topic, this.onMessage.bind(this));
        });
    }

    onMessage(msg, data) {
        wc.log("_febe: onMessage", msg, data);

        switch (msg) {
	case "mtk-path:click":
	case "mtk-ready:click":
	case "mtk-courses:click":
	case "mtk-login-register":
            mtk_pager.show("register");
            break;

	case "mtk-register:submit":
            break;

	case "mtk-header-home":
            mtk_pager.show('home');
            break;
	    
	case "mtk-login-success":
	    wc.doLogin(data.email, data.password)
		.then(success => {
		    if (success) {
			wc.log('Logged in!');
			// SHOW PUBLIC HEADER (needed here)
			$(".app-header").hide(function() {
			    $("#header-private").show();
			});
			mtk_pager.show('dashboard');
		    }
		})
		.catch(err => {
		    wc.error(err);
		    alert(err);
		});
	    break;

	case "mtk-dashboard:continue":
        case "mtk-header-hierarchy":
            mtk_pager.show("course");
            break;

        case "mtk-hierarchy:resource:click":
            this.resource(data);
            break;

        case "MTK-parts.click":
            mtk_pager.show("lessons");

            wc.timeout(() => {
                lessonClicked(cIndex, cTitle);
            }, 500, 1);
            break;

	case "mtk-header-logo":
	case "mtk-header-dashboard":
            mtk_pager.show("dashboard");
            break;

	case "mtk-header-settings":
	    mtk_pager.show("settings");
            break;

	case "mtk-header-login":
            mtk_pager.show('login');
            break;

	case "mtk-header-logout":
	    wc.doLogout();
	    
	    // SHOW PUBLIC HEADER
	    $(".app-header").hide(function() {
		$("#header-public").show();
	    });

            mtk_pager.show("home");
            break;

	case "mtk-header-register":
            mtk_pager.show('register');
            break;

        default:
	    wc.error("_febe: DO NOT HAVE:" + msg)
            alert("_febe: DO NOT HAVE:" + msg);
            break;
        }
    }

    /* RESOURCE HANDLER */
    resource(data) {
        if (!data) {
            wc.warn("_febe.resource: no data received");
            return;
        }

        wc.log("_febe.resource:", data.description, data.url);

        // example actions you can expand later
	switch(data.type) 
	{
	    case "video":
	    $(".mtk-hierarchy-rhs-video, .mtk-hierarchy-rhs-image, .mtk-hierarchy-rhs-intro").hide();
	    $(".mtk-hierarchy-rhs-video").fadeIn();

	    // "https://www.w3schools.com/html/mov_bbb.mp4",
	    // LOAD VIDEO DYNAMICALLY
	    wc.timeout(function(){
		window.MTKVideoInstance.load(data.url, data.description);
	    }, 200, 1);
	    break;

	    case "image":
	    wc.log("_febe:", data.type, data.url);
	    break;

	    default:
	    wc.error("NO SUCH TYPE:", data.type);
	    break;
	}
    }
}

/* auto-init */
window._febe = new _febe();
