///////////////////////////////////////////////////////////////////
//// PRIVATE JS PIECES 
///////////////////////////////////////////////////////////////////

// localhot. CHANGE BROWSER TITLE
if (document.location.protocol == "http:") {
    document.title = "NALA - Local";
}

wc.startInactivityTracking();

wc.timeout(function(){
    wc.getSession(function (loggedIn, session, err) {
	if (err) return;
	
	// SAVE FOR USE
	wc.session = session;

	if (loggedIn) {
	    // SET USER NAME
	    $("#uname").html(wc.session.name)

            wc.log('User is logged in');
	} else {
            wc.log('User is logged out');
	}
    });

    MTKMsgs.show({
	type: 'success',
	icon: 'check_circle',
	message: 'Loading in progress. Please wait...',
	buttons: [],
	closable: false, // No X button
	timer: 3, // Auto-close after 5 seconds
	block: true,
    });
}, 300, 1);

// INITIAL PAGE
MTKPager.show("dashboard");
