var i = '';

$(function() {
    $("#hamburger").click(function() {
        
        var open = (i++ % 2 == 0);
   
        $("header").animate({
            maxHeight: open ? 1400 : 60
        },200);

     $("#hamburger .line").animate({
         "margin-top": (open ? -2 : 5) + "px",
         "margin-left": (open ? 20 : 0) + "%",
        width: (open ? 60 : 100) + "%",     
     },200);

     $(".navigation-icon").animate({
         "padding-top": (open ? 13 : 0) + "px",
     },200);

    });
});


var submitted=false;

function onEmailSubmitted() {
    $('#ss-form').hide();
    $('#signuptitle').hide();
    $('#calltoaction').hide();
    $('#thanks').show();
    $('#thankstitle').show();
};

function onVideoSubmitted() {
    $('#introPreSubmit').hide();
    $('#video-form').hide();
    $('#introPostSubmit').show();
};