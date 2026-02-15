window.app = window.app || {};

window.app.baseUrl = "/repo_deploy/";

/************************************************************
 * CONFIG INACTIVITY TIMER
 ************************************************************/
wc.inactivity = {
    idleTime: 2 * 60 * 1000, /* one minute */
    countdown: 40 /* 30 seconds countdown */
};

// START TRACKING. COMMENT TO BYPASS
wc.startInactivityTracking();

window.wc.working = false;

wc.productionURL = "https://nala-test.com";

wc.apiURL = 'https://nala-test.com';
