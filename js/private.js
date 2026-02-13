///////////////////////////////////////////////////////////////////
//// PRIVATE JS PIECES 
///////////////////////////////////////////////////////////////////

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}

wc.startInactivityTracking();

wc.getSession(function (loggedIn, session, err) {
    if (err) return;
   
    // SAVE FOR USE
    wc.session = session;

    if (loggedIn) {
        wc.log('User is logged in');
    } else {
        wc.log('User is logged out');
    }
});

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
