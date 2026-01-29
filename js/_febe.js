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
            this.resource(data);
            break;

        case "header.menu.click":
            MTKPager.show(data.id);
            break;

        case "header.button.click":
            MTKPager.show(data.id);
            break;

        case "MTK-parts.click":
            MTKPager.show("lessons");

            wc.timeout(() => {
                lessonClicked(cIndex, cTitle);
            }, 500, 1);
            break;

        default:
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
        if (data.url) {
            wc.log("_febe.resource: opening", data.url);
            // window.open(data.url, "_blank");
        }
    }
}

/* auto-init */
window._febe = new _febe();
