// PUBLISH ALL CLICKS
$(".navbar-toggler, .nav-link, .navbar-brand, .btn").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    let eid = this.id;

    headerSelect(eid);

    let msg = eid; wc.log(msg);
    wc.publish(msg);
});

function headerSelect(id) {
    $(".nav-link, .navbar-brand, .btn").removeClass("active");
    $(this).addClass("active");
    
    // FOLD HAMBURGER MENU
    $(".navbar-collapse.show").removeClass("show");

    $("#" + id).addClass("active");
}
