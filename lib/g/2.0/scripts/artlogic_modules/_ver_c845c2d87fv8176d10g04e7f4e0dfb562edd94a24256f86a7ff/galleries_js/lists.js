var lists = {

    init: function() {
        window.galleries.lists.ajax.init();
        window.galleries.lists.ajax.rewrite_links();
        window.galleries.lists.cleanup_whitespace.init();
        window.galleries.lists.css_image_cropping.init();
        window.galleries.lists.lists_filter_reveal.init();
    },

    cleanup_whitespace: {
        init: function() {
            $('.remove_html_whitespace').each(function() {
                $(this).html($(this).html().replace(/>\s+</g,'><'));
            });
        }
    },

    ajax: {

        init: function() {

            var ajax_list_loopcount = 0;
            $('.records_list_ajax').each(function() {
                if ($('ul li > a', this).length > 0) {

                    ajax_list_loopcount = ajax_list_loopcount + 1;
                    $(this).attr('data-relative', String(ajax_list_loopcount));

                    var ajax_preview_area = '<div class="records_list_preview" data-relative="' + String(ajax_list_loopcount) + '"><div class="loader_simple">Loading</div><div class="ajax_content"></div></div>';

                    if ($(this).closest('.records_list_ajax').attr('data-ajax-preview-position') == 'top') {
                        $(this).before(ajax_preview_area);
                    } else {
                        $(this).after(ajax_preview_area);
                    }

                    if ($(this).attr('data-ajax-list-type') == 'hover') {
                        $('ul li > a', this).each(function() {
                            var instance = $(this).closest('li');
                            $(this)
                                .mouseover(function() {
                                    $(this).closest('.records_list_ajax').stop().clearQueue();
                                    $(this).closest('.records_list_ajax').animate({'min-height': 0}, 300, function() {
                                        window.galleries.lists.ajax.load(instance, '', true);
                                    });
                                    return false;
                                })
                                .mouseout(function() {
                                    $(this).closest('.records_list_ajax').stop().clearQueue();
                                })
                            ;
                        });
                    } else {
                        $('ul li > a', this).each(function() {
                            $(this).addClass('ajax_link').click(function() {
                                window.galleries.lists.ajax.load($(this).closest('li'));
                                return false;
                            });
                        });
                    }

                    if (window.location.hash && window.location.hash != '#' && window.location.hash != '#'+window.location.pathname && window.location.hash != '#undefined') {
                        var this_hash = window.location.hash.split('#')[1];
                        if (this_hash != window.location.pathname) {
                            window.galleries.lists.ajax.load([], this_hash, false);
                        }
                    } else {
                        $('li:eq(0) > a', this).each(function() {
                            // Display the first one by default
                            window.galleries.lists.ajax.load($(this).closest('li'), '', true);
                        });
                    }

                }
            });

        },

        load: function(instance, url, background_load, no_scroll) {

            if (!$(instance).closest('li').hasClass('active') || url) {

                if ($(instance).length) {
                    var url_method = $(instance).closest('.records_list_ajax').attr('data-ajax-list-url-type') && typeof $(instance).closest('.records_list_ajax').attr('data-ajax-list-url-type') != 'undefined' ? $(instance).closest('.records_list_ajax').attr('data-ajax-list-url-type') : 'hash';
                }
                
                if (url) {
                    url = url;
                    var preview_area = $('.records_list_preview');
                } else {
                    url = $('a', instance).attr('href');
                    $(instance).closest('.records_list_ajax').find('ul li').removeClass('active');
                    $(instance).addClass('active');
                    var preview_area = $('.records_list_preview[data-relative=' + $(instance).closest('.records_list_ajax').attr('data-relative') + ']');
                }

                if ($(preview_area).is(':visible')) {

                    // Position the preview area so it can be seen by the user
                    if ($(instance).length > 0) {
                        var top_offset = $(window).scrollTop() - $(instance).closest('.records_list_ajax').offset().top + 140;
                        if (top_offset < 0) {
                            top_offset = 0;
                        }
                        $('.records_list_preview').animate({'padding-top': top_offset}, 0, 'easeInOutQuint');
                    }

                    $('.loader_simple', preview_area).show();
                    $('.ajax_content', preview_area).fadeTo(0, 0);

                    window.galleries.lists.ajax.before(instance, preview_area, url);

                    $.ajax({
                        url: url,
                        data: 'modal=1',
                        cache: false,
                        dataType: 'html',
                        success: function(data) {
                            $('.loader_simple', preview_area).hide();
                            $('.ajax_content', preview_area).html(data).fadeTo(500, 1);
                            $('#content, #content_module:not(.content_module), .content_module, #sidebar:not(.sidebar), .sidebar', preview_area).each(function() {
                                $(this).attr('id', $(this).attr('id') + '_ajax');
                            });
                            $('.navigation', preview_area).remove();

                            if (!background_load) {
                                if ($(preview_area).offset().top > $(window).scrollTop() + ($(window).height() / 1.5)) {
                                    // Scrolls to the preview area if it is out of view (e.g. responsive version)
                                    $('html,body').animate(
                                        {scrollTop: $(preview_area).offset().top + (-140)},
                                        800,
                                        'easeInOutQuad'
                                    );
                                }
                            }

                            
                            if (url_method == 'full_url') {
                                history.pushState(null, null, url);
                            } else {
                                window.location.hash = url;
                            }
                            window.galleries.lists.ajax.after(instance, preview_area, url);
                        }
                    });
                }
            }

        },

        before: function(original_instance, preview_area, url) {

        },

        after: function(original_instance, preview_area, url) {

        },

        rewrite_links: function() {
            if (window.core.ajax_sections_link_rewrite) {
                var t;
                for (var i = 0; i < window.core.ajax_sections_link_rewrite.length; i ++) {
                    t = '/' + window.core.ajax_sections_link_rewrite[i] + '/';
                    if (window.location.pathname.substring(0, t.length) != t) {
                        $("a[href^='" + t + "']").not("a[href='" + t + "']").not('.ajax_link').each(function() {
                            var new_href = '' + t + '#' + $(this).attr('href');
                            $(this).attr('href', new_href);
                        });
                    }
                }
            }
        }

    },
    
    css_image_cropping: {
        /*
            Simple polyfill for image grids that use object-fit css for 'soft' cropping.
            Mostly required for all versions of Internet Explorer and older versions of Edge.
        */
        init: function() {
            
            var polyfill_images = '.records_list ul li img';
            var verbose = false;
            if ($(polyfill_images).length){
                if (verbose){
                    console.log('css_image_cropping -- grid imgs on page');
                }
                var objectfitcover_on_page = $(polyfill_images).filter(function() {
                    // If css cropping is being used, we pass a flag - a font-family on an impossible pseudo-element (invisible) from user_custom.css
                    return window.getComputedStyle($(this)[0]).getPropertyValue('font-family') == ('object-fit');
                    //return window.getComputedStyle($(this)[0], ':first-letter').getPropertyValue('font-family') == ('object-fit');
                });

                if (objectfitcover_on_page.length) {
                    if (verbose){
                        console.log('css_image_cropping -- object-fit used in grid, polyfill checking for support');
                    }
                    
                    var supportsObjectfit;
                    
                    // Detect whether '@supports' CSS is supported, preventing errors in IE
                    var supports_supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);

                    if (supports_supportsCSS){
                        // Older Edge supports '@supports' but not object-fit
                        supportsObjectfit = CSS.supports('object-fit','cover');
                    } else {
                        //IE doesn't support '@supports' or 'object-fit', so we can consider them the same
                        supportsObjectfit = false;
                    }

                    if (!supportsObjectfit || typeof supportsObjectfit == 'undefined') {
                        
                        if (verbose){
                            console.log('css_image_cropping -- polyfill running');
                        }
                        $(polyfill_images).each(function() {
                            var $img = $(this);
                            if ($img.attr('data-src') && typeof $img.attr('data-src') != 'undefined') {
                                var imageURL = $img.attr('data-src');
                            } else {
                                var imageURL = $img.attr('src');
                            }
                            if (window.getComputedStyle($img[0], ':first-letter').getPropertyValue('font-family') == 'object-fit' && imageURL) {
                                var bg_positioning = '50% 50%';
                                if ($img.css('object-position')) {
                                    var positioning = $img.css('object-position');
                                }
                                $img.parent().addClass('objectfit-fallback-bg').css({'background-image':'url('+imageURL+')','background-position':bg_positioning});
                                $img.css('visibility','hidden');
                                
                                if (!$('body').hasClass('objectfit-polyfill-active')){
                                    $('body').addClass('objectfit-polyfill-active')
                                }
                            }
                        });
                    } else {
                        if (verbose){
                            console.log('css_image_cropping -- polyfill not required, object-fit supported');
                        }
                    }
                }
            }
        },
    },
    
    lists_filter_reveal: {
        
        init: function() {

            $(".subnav_dropdown").each(function(){

                var $this = $(this);
                var $list = $this.find('ul');

                $this.closest('.heading_wrapper').addClass('display-subnav-as-dropdown');

                var dropdown_label = (($this.data().dropdownName && typeof $(".subnav_dropdown").data().dropdownName != 'undefined') ? $(".subnav_dropdown").data().dropdownName : 'Dropdown');

                $('<button id="loop1" class="reveal-subnav-dropdown-list">'+dropdown_label+'<span class="dropdown-arrow"></span></button>').insertBefore($this);

                var $button = $this.prev(".reveal-subnav-dropdown-list");


                $button.click(function(event) {

                    event.preventDefault();

                    if ($list.hasClass('open')) {
                        $list.removeClass('open');
                        $button.removeClass('open');
                        setTimeout(function() {
                            $list.slideUp();
                        }, 100);
                    } else {
                        $button.addClass('open');
                        $list.slideDown(100, function() {
                            $list.addClass('open');
                        });
                    }
                });
                
            });
            
        },
    }
}

window.galleries = window.galleries || {};
window.galleries.lists = lists;
export default lists;