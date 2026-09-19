var scroll_sections = {

    init: function() {

        $('.record-page-content-combined').each(function(i) {

            if (!$('#container.record-page-content-combined-container').length) {
                $('#container').addClass('record-page-content-combined-container');

                // Due to timing issues (mainly with mode theme), we need to simulate a resize for flowgrid due to the sidebar getting hidden
                window.galleries.responsive.flow_list_init();
                window.galleries.responsive.flow_list_after_resize();
            }
            var subnav = $(this).find('#sub_nav > ul > li:not(#sub-item-share):not(#sub-item-cv):not(#sub-item-artist-website):not(#artists-browser) > a, #sticky_sub_nav > ul > li:not(#sub-item-share-page_header):not(#sub-item-cv-page_header):not(#sub-item-artist-website-page_header):not(#artists-browser-page_header) > a');

            var artist_subnav = $('#sub_nav > ul > li:not(#sub-item-share):not(#sub-item-cv):not(#sub-item-artist-website):not(#artists-browser) > a');


            if($("#custom-feature-panel-container").length) {
                var sections = $('#custom-feature-panel-container').find('.feature_panels_inner > ul > li > section');
            }else{
                var sections = $('.record-page-content-combined').find('.scroll_section_container > section');
            }
            
            subnav.off('click.scroll_sections').on('click.scroll_sections', function() {
                $('body').addClass('window-forced-scroll-up');
                var this_type = $(this).attr('data-subsection-type');
                var related_item = sections.filter('[data-subsection-type="' + this_type + '"]');
                
                if (related_item.length) {
                    var direction = (related_item.offset().top > $(window).scrollTop() ? 'down' : 'up');
                    if ($('#header').length > 0 && direction == 'down' && !$('#sticky_sub_nav').is(':visible')) {
                        var offset = -60;
                        var offset = offset + $('#header').outerHeight();
                    }
                    else if ($('#header').length > 0 && direction == 'up' || $('#sticky_sub_nav').length) {
                        var offset = 20;
                        var offset = offset + $('#header').outerHeight();
                    } else {
                        var offset = 40;
                    }

                    if ($('#cms-frontend-toolbar-container').length > 0) {
                        var offset = offset + $('#cms-frontend-toolbar-container').outerHeight();
                    }
                    var related_item_offset = related_item.offset().top - offset;
                    related_item_offset = (related_item_offset < 1 ? 0 : related_item_offset);
                    $('html,body').animate(
                        {scrollTop: related_item_offset},
                        800,
                        'easeInOutQuad',
                        function() {
                            $('body').delay(100).queue(function() {
                                $(this).removeClass('window-forced-scroll-up');
                                $(this).dequeue();
                            });
                            window.galleries.scroll_sections.subnav_active_change();
                            // Accessibility - set focus on new section
                            $(related_item).get(0).focus({preventScroll:true});
                        }
                    );
                }
                return false;
            });

            artist_subnav.off('click.scroll_sections').on('click.scroll_sections', function() {

                $('body').addClass('window-forced-scroll-up');
                var this_type = $(this).attr('data-subsection-type');
                var related_item = sections.filter('[data-subsection-type="' + this_type + '"]');
                
                if (related_item.length) {
                    var direction = (related_item.offset().top > $(window).scrollTop() ? 'down' : 'up');
                    if ($('#header').length > 0 && direction == 'down' && !$('#sticky_sub_nav').is(':visible')) {
                        var offset = -60;
                        var offset = offset + $('#header').outerHeight();
                    }
                    else if ($('#header').length > 0 && direction == 'up' || $('#sticky_sub_nav').length) {
                        var offset = 20;
                        var offset = offset + $('#header').outerHeight();
                    } else {
                        var offset = 40;
                    }

                    if ($('#cms-frontend-toolbar-container').length > 0) {
                        var offset = offset + $('#cms-frontend-toolbar-container').outerHeight();
                    }
                    var related_item_offset = related_item.offset().top - offset;
                    related_item_offset = (related_item_offset < 1 ? 0 : related_item_offset);
                    $('html,body').animate(
                        {scrollTop: related_item_offset},
                        800,
                        'easeInOutQuad',
                        function() {
                            $('body').delay(100).queue(function() {
                                $(this).removeClass('window-forced-scroll-up');
                                $(this).dequeue();
                            });
                            window.galleries.scroll_sections.subnav_active_change();
                            // Accessibility - set focus on new section
                            $(related_item).get(0).focus({preventScroll:true});
                        }
                    );
                }
                return false;
            });

            try {
                $.pageload.refresh('#sticky_sub_nav');
            } catch {
                
            }
        });

    },

    subnav_active_change: function() {
        var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
        var windowHeight = $(window).height(); // get the height of the window
        var docHeight = $(document).height();

        $('.record-page-content-combined #sub_nav ul li a, .record-page-content-combined #sticky_sub_nav ul li a')
            .each(function() {

                var this_type = $(this).attr('data-subsection-type');
                var sections = $('.record-page-content-combined .scroll_section_container > section');
                var related_item = sections.filter('[data-subsection-type="' + this_type + '"]');

                if (related_item.length) {
                    var offset = windowHeight/2;
                    if ($('#cms-frontend-toolbar-container').length > 0) {
                        offset = offset + $('#cms-frontend-toolbar-container').outerHeight();
                    }
                    var divPos = related_item.offset().top - offset; // get the offset of the div from the top of page
                    var divHeight = related_item.outerHeight(); // get the height of the div in question
                    if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
                        $(".record-page-content-combined #sub_nav ul li a[data-subsection-type='" + this_type + "']").closest('li').addClass("active");
                        $(".record-page-content-combined #sticky_sub_nav ul li a[data-subsection-type='" + this_type + "']").closest('li').addClass("active");
                    } else {
                        $(".record-page-content-combined #sub_nav ul li a[data-subsection-type='" + this_type + "']").closest('li').removeClass("active");
                        $(".record-page-content-combined #sticky_sub_nav ul li a[data-subsection-type='" + this_type + "']").closest('li').removeClass("active");
                    }
                }
            })
            .promise()
            .done(function() {

            });

        if(windowPos + windowHeight == docHeight) {
            if (!$("#scroll_section_nav ul li:last-child").closest('li').hasClass("active")) {
                var navActiveCurrent = $(".active").attr("href");
                $("#scroll_section_nav ul li[href='" + navActiveCurrent + "']").closest('li').removeClass("active");
                $("#scroll_section_nav ul l li:last-child").closest('li').addClass("active");
            }
        }
    }

}

window.galleries = window.galleries || {};
window.galleries.scroll_sections = scroll_sections;
export default scroll_sections;
