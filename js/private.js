///////////////////////////////////////////////////////////////////
//// PRIVATE JS PIECES 
///////////////////////////////////////////////////////////////////

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}

wc.startInactivityTracking();

wc.timeout(function(){
    MTKMsgs.show({
	type: 'success',
	icon: 'check_circle',
	message: 'Loading in progress. Please wait...',
	buttons: [],
	closable: false, // No X button
	timer: 3, // Auto-close after 5 seconds
	block: true,
    });
}, 100, 1);

// INITIAL PAGE
MTKPager.show("dashboard");
