(function () {
    const topics = [
	"header.menu.click",
	"header.button.click",
	"MTK-parts.click",
	"mtk-hierarchy:resource:click"
    ];

    topics.forEach(topic => {
	wc.log("_febe: subscribed to", topic);
	
	PubSub.subscribe(topic, onMessage);
    });

    // DEFINE ALL ACTIONS FOR A TOPIC
    function onMessage(msg, data) {
	wc.log("_febe: onMessage", msg, data);
	
	switch(msg) 
	{
	    case "mtk-hierarchy:resource:click":
	    wc.log("_febe: onMessage", data.description, data.url);
	    break;

	    case "header.menu.click":
	    MTKPager.show(data.id);
	    break;

	    case "header.button.click":
	    MTKPager.show(data.id);
	    break;

	    case "MTK-parts.click":
	    MTKPager.show("lessons");

	    wc.timeout(function(){
		lessonClicked(cIndex, cTitle);
	    }, 500, 1);
	    break;

	    default:
	    alert("_febe: DO NOT HAVE:" + msg);
	    break;
	}
    }
})();
