(function () {
    "use strict";

    function show(sectionId) {
	wc.log("MTKPager: show", sectionId);

	$(".MTK-pager-section").fadeOut(300);

	$("#MTK-pager-" + sectionId).fadeIn(300);
    }

    window.MTKPager = {
        show
    };

    wc.log("MTKPager: Initialized");
})();
