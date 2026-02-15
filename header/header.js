// PUBLISH ALL CLICKS
$(".nav-link, .navbar-brand, .btn").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    $(".nav-link, .navbar-brand, .btn").removeClass("active");
    $(this).addClass("active");

    // FOLD HAMBURGER MENU
    $(".navbar-collapse.show").removeClass("show");

    let msg = this.id; wc.log(msg);
    wc.publish(msg);
});
