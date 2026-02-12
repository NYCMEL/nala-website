wc.timeout(function(){
    MTKMsgs.show({
	type: 'success',
	icon: 'check_circle',
	message: 'Loading in progress. Please wait...',
	buttons: [],
	closable: true, // No X button
	timer: 3, // Auto-close after 5 seconds
	block: true
    });
}, 100, 1);

// INITIAL PAGE
wc.getSession(function (loggedIn, session, err) {
    if (err) return;
    
    if (loggedIn) {
	wc.log('IS LOGGED IN');
	document.location.href = document.location.origin + "/repo_deploy/private";
    } else {
	wc.log('IS NOT LOGGED IN');
	MTKPager.show("home");
    }
});
