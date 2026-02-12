// ============================================
// GET CURRENT USER INFO
// ============================================
wc.post(wc.apiURL + '/api/login_api.php', {
    email: "mel@google.com",
    password: "test"
}, function(response) {
    wc.response = response;
    wc.log('Success:', JSON.stringify(response));
}, function(error) {
    wc.log('Error:', error);
});

