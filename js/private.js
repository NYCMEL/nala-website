///////////////////////////////////////////////////////////////////
//// PRIVATE JS PIECES 
///////////////////////////////////////////////////////////////////

wc.timeout(function(){
    MTKMsgs.show({
	type: 'success',
	icon: 'check_circle',
	message: 'Loading in progress. Please wait...',
	buttons: [],
	closable: true, // No X button
	timer: 3 // Auto-close after 5 seconds
    });
}, 1000, 1);

/************************************************************
 * INACTIVITY TIMER
 ************************************************************/
// Start tracking AFTER login
wc.inactivity.idleTime = 0.2 * 60 * 1000;
wc.inactivity.countdown = 10;
wc.startInactivityTracking();

// INITIAL PAGE
MTKPager.show("dashboard");
