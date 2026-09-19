var accessibility = {
            
    init: function() {
        window.galleries.accessibility.top_nav();
        
        // Wrapped in document ready to ensure it is called last
        // We know this is weird because its already nested in another $(document).ready and should be improved in the future if possible
        $(document).ready(function() {
            h.accessibility.role_button();
            
            // Some screen readers read out Horizontal rules, so we add aria-hidden to them
            // This is a temporary fix until we update tinymce to allow html attriubtes to be added or to always add the aria-hidden
            // attribute if a horizontal rule is added with tinymce
            $('hr').attr('aria-hidden', 'true');
        });
    },
    
    top_nav: function() {
        
        // Add dialog role to the top nav when it turns into an overlay.
        var responsive_top_size = $('#header #responsive_slide_nav_wrapper_inner').attr('data-responsive-top-size');
        if (responsive_top_size == 'responsive_nav_always_enabled') {
            $('#header #responsive_slide_nav_wrapper_inner').attr({
                role: "dialog",
                'aria-label': "Main navigation",
                'aria-modal': true
            });
        } else {
            $(window).resize(function(){
                if ($(window).width() < parseInt(responsive_top_size)) {
                    $('#header #responsive_slide_nav_wrapper_inner').attr({
                        role: "dialog",
                        'aria-label': "Main navigation",
                        'aria-modal': true
                    });
                } else {
                    $('#header #responsive_slide_nav_wrapper_inner').removeAttr('role aria-label');
                }
            });
        }
        
    }
    
}

window.galleries = window.galleries || {};
window.galleries.accessibility = accessibility;
export default accessibility;