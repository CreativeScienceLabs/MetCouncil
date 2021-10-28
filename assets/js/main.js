jQuery(function () {

/*======================================
    sticky nav
=======================================*/
	jQuery('#nav').onePageNav();

/*======================================
    sticky
=======================================*/
    if (jQuery.fn.sticksy) { 
        if (jQuery(".js-sticky-widget").length) {
            var stickyEl = jQuery('.js-sticky-widget').sticksy({ 
                topSpacing: 20, 
                listen: true 
            });
        }
    }

});


