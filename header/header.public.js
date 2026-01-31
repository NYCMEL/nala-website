$(".nav-link, .navbar-brand").on("click", function(e) {
    let msg = this.id; wc.log(msg);
    wc.publish(msg);
});
