document.querySelectorAll('#_header .nav-link, #_footer .nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        PubSub.publish('navigate', link.dataset.section);
    });
});

// Load initial section
PubSub.publish('navigate', 'home');
