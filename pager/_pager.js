(function () {
    "use strict";

    function show(sectionId) {
	if (sectionId == "logout") {
	    // do nothing. drodown should shoe
	    return;
	}

	$(".mtk-pager-section").hide()

	$("#mtk-pager-" + sectionId).show();

	$(".nav-link.active").removeClass("active")
	$("#mtk-header-" + sectionId).addClass("active")
    }

    ///////////////////////////////////////////
    // usage:
    //    wc.publish("4-mtk-pager", {"action":"show", "page":"course"})
    ///////////////////////////////////////////
    // wc.subscribe("4-mtk-pager", function(msg, data) {
    // 	wc.log(JSON.stringify(data))
	
    // 	switch(data.action) 
    // 	{
    // 	    case "show":
    // 	    MTKPager.show(data.page);
    // 	    break;

    // 	    default:
    // 	    break;
    // 	}
    // });

    window.MTKPager = {
        show
    };

    wc.log("MTKPager: Initialized");
})();
