class _febe {
    constructor() {
        this.topics = [
	    "header-public-logo",
	    "header-public-home",
	    "header-public-login",
	    "header-public-logout",
	    "header-public-register",

            "MTK-parts.click",
            "mtk-hierarchy:resource:click"
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
        case "mtk-hierarchy:resource:click":
            this.resource(data);
            break;

        case "MTK-parts.click":
            MTKPager.show("lessons");

            wc.timeout(() => {
                lessonClicked(cIndex, cTitle);
            }, 500, 1);
            break;

	case "header-public-logo":
	case "header-public-home":
	    document.location.reload();
            break;

	case "header-public-login":
	    MTKPager.show("login");
            break;

	case "header-public-logout":
	    document.location.href = "http://localhost/Melify/tools/nala-website";
            break;

	case "header-public-register":
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
