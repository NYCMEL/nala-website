// PUBLISH ALL CLICKS
$(".nav-link, .navbar-brand, .btn").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    let msg = this.id; wc.log(msg);
    wc.log(msg);
    wc.publish(msg);
});
