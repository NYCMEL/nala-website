(function() {
    const form = document.getElementById('publicReviewForm');
    const status = document.getElementById('reviewSubmitStatus');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const nalaUID = params.get('nalaUID') || '';
    const token = params.get('token') || '';

    form.addEventListener('submit', function(event) {
	event.preventDefault();
	const formData = new FormData(form);
	const payload = {
	    nalaUID: nalaUID,
	    token: token,
	    customerName: String(formData.get('customerName') || '').trim(),
	    rating: Number(formData.get('rating') || 0),
	    text: String(formData.get('text') || '').trim()
	};

	if (!payload.customerName || !payload.rating || !payload.text) {
	    setStatus('Please add your name, rating, and review.', true);
	    return;
	}

	setStatus('Submitting your review...', false);
	fetch((window.wc && wc.apiURL ? wc.apiURL : '') + '/api/business_in_a_box_review_submit.php', {
	    method: 'POST',
	    credentials: 'include',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify(payload)
	}).then(function(res) {
	    return res.json().then(function(json) {
		if (!res.ok) {
		    throw new Error((json && (json.error || json.message)) || 'Could not submit review.');
		}
		return json;
	    });
	}).then(function() {
	    form.reset();
	    setStatus('Thank you. Your rating has been submitted.', false);
	}).catch(function(err) {
	    setStatus(err && err.message ? err.message : 'Could not submit review.', true);
	});
    });

    function setStatus(message, isError) {
	if (!status) return;
	status.textContent = message;
	status.style.color = isError ? '#b3261e' : '#28642d';
    }
})();
