var sub_navigation = {
    
    init: function() {
        window.galleries.sub_navigation.inject_sub_nav();
        window.galleries.sub_navigation.page_header_setup();
        window.galleries.sub_navigation.disable_page_header();
        this.set_panel_anchor_links();
    },
    
    inject_sub_nav: function() {
        
        if ($('.scroll_sub_nav_enabled').length && $('.scroll_section_container').length && $('.page-param-type-artist_id #sub_nav.navigation, .page-param-type-exhibition_id #sub_nav.navigation').length) {
                $('.page-param-type-artist_id #sub_nav.navigation, .page-param-type-exhibition_id #sub_nav.navigation').each(function() {
                    $('#header .inner').after('<div class="page-header-container record-page-content-combined" aria-hidden="true"><div id="page_header"><span class="page-header-inner"></span></div>');
                    
                    var original_html = $(this).parent().clone();
                    original_html.find('.has_subtitle').removeAttr('hidden');
                    original_html.find('#h1_wrapper').removeClass('hidden');
                    original_html.find('.h1_wrapper').removeClass('hidden');
                    // We don't want to add the share button to the header
                    original_html.find('#sub-item-share').remove();
                    
                    // Accessibillity changes to remove duplicate ids and change cloned h1 tags to h2
                    original_html.find('h1, h1.has_subtitle, h1.has_subnav').replaceWith(function() {
                        return $('<h2>', {
                            'class': this.className,
                            html: $(this).html()
                        },'</h2>')
                    })
                    original_html.find("#sub_nav").prop("id", "sticky_sub_nav");
                    original_html.find('#sticky_sub_nav ul li, #exhibition-status-current').each(function() {
                        $(this).attr("id", $(this).attr("id") + "-page_header");
                    })
                    
                    $('.page-header-inner').append(original_html.html());
                });
            }
        }, 
        
    page_header_setup: function() {
    
    if ($('.scroll_sub_nav_enabled').length && $('.scroll_section_container').length && $('.page-param-type-artist_id #sub_nav.navigation, .page-param-type-exhibition_id #sub_nav.navigation').length) {
        if (!$('.layout-hero-header').length) {
                if ($('.scroll_section_container').length && $('.page-param-type-artist_id #sub_nav.navigation, .page-param-type-exhibition_id #sub_nav.navigation').length) {
                    $(window).resize(function() {
                        $('.header-fixed-wrapper').height($('.header_fixed').height());
                    }).trigger('resize');
                }
            }
        }
    },
    
    enable_page_header: function(window_scroll_top, scroll_direction) {
        
        if ($('.scroll_sub_nav_enabled').length && $('.scroll_section_container').length && $('.page-param-type-artist_id #sub_nav.navigation, .page-param-type-exhibition_id #sub_nav.navigation').length) {
            if (!$('.layout-hero-header').length) {
                $('#container').addClass('page_header_enable');
            } else {
                
                var sub_nav_top = $('#sub_nav').offset().top;
                var sub_nav_height = $('#sub_nav').outerHeight(true);
                var sub_nav_offset = sub_nav_top + sub_nav_height;
                var sub_nav_offset_scroll_down = sub_nav_offset + 300;
                var sub_nav_offset_scroll_up = sub_nav_offset - 200;
                
                if ($('.page-top').length) {
                    $('#container').removeClass('page_header_enable');
                } else if (window_scroll_top > sub_nav_offset_scroll_down && scroll_direction =='down') {
                    $('#container').addClass('page_header_enable');
                } else if (window_scroll_top < sub_nav_offset_scroll_up && scroll_direction =='up') {
                    $('#container').removeClass('page_header_enable');
                }
            }
        }
    },

    disable_page_header: function() {
        if (!$('.scroll_section_container').length || !$('.page-param-type-artist_id, .page-param-type-exhibition_id').length) {
            $('#container').removeClass('page_header_enable');
        }
    },
    
    set_panel_anchor_links: function() {
        var container = $('#main_content');
        var links_html = '<div id="sub_nav" class="feature-panel-nav navigation noprint clearafter clearwithin" role="navigation" aria-label="Subnavigation"><ul>';
        var anchor_panels = $('[data-anchor-label].panel');
        if ($('#sub_nav').length) {
            return;
        }
        
        anchor_panels.each(function(i) {
            var id = $(this).attr('data-panel-unique-id');
            var text = $(this).attr('data-anchor-label');
            
            // create anchor links
            links_html += ''+
            '<li id="sub-item-overview" class="'+(!i ? 'first' : '')+'">'+
                '<a href="#" role="button">'+text+'</a>'+
            '</li>';
        });
        links_html += '</ul></div>';
        
        if (container.length && anchor_panels.length) {
            var heading_wrapper = container.find('.heading_wrapper:not(.hidden)');
            var home_slideshow = container.find('#content #slideshow');
            if (heading_wrapper.length) {
                heading_wrapper.append(links_html);
            } else if (home_slideshow.length) {
                home_slideshow.after(links_html);
            } else {
                container.prepend(links_html);
            }
            
            container.find('a').click(function(event) {
                event.preventDefault();
                var label = $(this).text();
                var section_el = $('[data-anchor-label="'+label+'"]');

                if (section_el.length) {
                    var offset = section_el.offset().top - 60;
                    $('html,body').animate(
                        { scrollTop: offset },
                        800,
                        'easeInOutQuad',
                        function () {
                            $('body').delay(100).queue(function () {
                                $(this).removeClass('window-forced-scroll-up');
                                $(this).dequeue();
                            });
                            // window.galleries.scroll_sections.subnav_active_change();
                            // Accessibility - set focus on new section
                            $(section_el).get(0).focus({ preventScroll: true });
                        }
                    );
                }
            })
        }
    }
    
}

window.galleries = window.galleries || {};
window.galleries.sub_navigation = sub_navigation;
export default sub_navigation;