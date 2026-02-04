class _febe {
    constructor() {
        this.topics = [
	    "ready.get-started",

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
	case "ready.get-started":
	case "mtk-login-register":
            MTKPager.show("register");
            break;

	case "mtk-register:submit":
            break;

	case "mtk-header-home":
            MTKPager.show("home");
            break;

	case "mtk-login-success":
	    document.location.href = window.app.baseUrl + "private"
            MTKPager.show("dashboard");
            break;

	case "mtk-dashboard:continue":
        case "mtk-header-hierarchy":
            MTKPager.show("hierarchy");
            break;

        case "mtk-hierarchy:resource:click":
            this.resource(data);
            break;

        case "MTK-parts.click":
            MTKPager.show("lessons");

            wc.timeout(() => {
                lessonClicked(cIndex, cTitle);
            }, 500, 1);
            break;

	case "mtk-header-logo":
	case "mtk-header-dashboard":
            MTKPager.show("dashboard");
            break;

	case "mtk-header-settings":
	    MTKPager.show("settings");
            break;

	case "mtk-header-login":
	    MTKPager.show("login");
            break;

	case "mtk-header-logout":
	    console.log(">>>>>>>>>", window.app.baseUrl);
	    document.location.href = "index.html";
            break;

	case "mtk-header-register":
	    MTKPager.show("register");
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
	    console.log(">>>>>>", data.type, data.url);

	    $(".mtk-hierarchy-rhs-video, .mtk-hierarchy-rhs-image, .mtk-hierarchy-rhs-intro").hide();
	    $(".mtk-hierarchy-rhs-video").fadeIn();

	    // "https://www.w3schools.com/html/mov_bbb.mp4",
	    // LOAD VIDEO DYNAMICALLY
	    wc.timeout(function(){
		window.MTKVideoInstance.load(data.url, data.description);
	    }, 200, 1);
	    break;

	    case "image":
	    console.log(">>>>>>", data.type, data.url);
	    break;

	    default:
	    console.error("NO SUCH TYPE:", data.type);
	    break;
	}
    }
}

/* auto-init */
window._febe = new _febe();
