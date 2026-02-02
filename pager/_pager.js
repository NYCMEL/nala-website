(function () {
    "use strict";

    function show(sectionId) {
	if (sectionId == "logout") {
	    // do nothing. drodown should shoe
	    return;
	}

	wc.log("MTKPager: show", sectionId);

	$(".MTK-pager-section").hide()

	$("#MTK-pager-" + sectionId).show();

	$(".nav-link.active").removeClass("active")
	$("#_header-menu-" + sectionId).addClass("active")
    }

    window.MTKPager = {
        show
    };

    wc.subscribe("4-mtk-pager", function(data) {
	alert("A")
    });

    wc.log("MTKPager: Initialized");
})();
