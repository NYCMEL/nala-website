class _febe {
    constructor() {
        this.topics = [
            "header.menu.click",
            "header.button.click",
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
            wc.log("_febe: onMessage", data.description, data.url);
	    resource(data);
            break;

        case "header.menu.click":
            MTKPager.resource(data.id);
            break;

        case "header.button.click":
            MTKPager.resource(data.id);
            break;

        case "MTK-parts.click":
            MTKPager.resource("lessons");

            wc.timeout(() => {
                lessonClicked(cIndex, cTitle);
            }, 500, 1);
            break;

        default:
            alert("_febe: DO NOT HAVE:" + msg);
            break;
        }
    }

    ///////////////////////////////////////////////////////
    ///// PROCESS A RESOURCE
    ///////////////////////////////////////////////////////
    resource(data) {
	console.log(">>>>>>>>", data.description);
    }
}

/* auto-init */
window._febe = new _febe();
