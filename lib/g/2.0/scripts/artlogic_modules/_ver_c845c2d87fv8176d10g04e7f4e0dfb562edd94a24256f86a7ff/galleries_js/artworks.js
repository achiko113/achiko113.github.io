import artwork_filters from './artwork_filters.js'

var artworks = {

    init: function() {
        // If using the version of the template where the filter panel is loaded
        // in via AJAX (it's slow to render so this method can take advantage of
        // caching), load in the panel and make it visible.
        if ($('#artworks_filter_panel').length) {
            
            var queryString = $('#artworks_filter_panel').data('query_string');
            queryString = queryString ? '?' + queryString : '';
            var proxy_dir_prefix = '';
            if (window.archimedes.proxy_dir && typeof window.archimedes.proxy_dir !='undefined') {
                proxy_dir_prefix = window.archimedes.proxy_dir;
                var lang_code = window.archimedes.proxy_dir.replace('/', '');
                queryString = queryString ? queryString + '&lang=' + lang_code : '?lang=' + lang_code;
            }
            if ($('#artworks_filter_panel').html().trim() === '' && $('#artworks_filter_panel').hasClass('hidden')) {
                $.get(proxy_dir_prefix + '/artwork_filters/' + queryString, function(html) {
                    $('#artworks_filter_panel').html(html).removeClass('hidden');
                    window.galleries.artwork_filters.init();
                    if ($('#artworks_grid_ajax').html().trim() === '') {
                        window.galleries.artwork_filters.load_works_api();
                    }
                    $('#artworks_filter_panel').css('min-height', '');
                });
            } else {
                window.galleries.artwork_filters.init();
            }
            
            // Load hash permalinks
            var filterPermalink = '';
            if (window.location.hash && typeof window.location.hash != 'undefined') {
                if (window.location.hash.indexOf('#filters=') == 0) {
                    filterPermalink = window.location.hash.replace('#filters=', '');
                    var queryString = filterPermalink ? '?' + filterPermalink : '';
                    if (queryString && queryString != '') { 
                        var proxy_dir_prefix = '';
                        if (window.archimedes.proxy_dir && typeof window.archimedes.proxy_dir !='undefined') {
                            proxy_dir_prefix = window.archimedes.proxy_dir;
                            var lang_code = window.archimedes.proxy_dir.replace('/', '');
                            queryString = queryString ? queryString + '&lang=' + lang_code : '?lang=' + lang_code;
                        }
                        window.galleries.artwork_filters.load_works_api('/modules/get_artworks/' + queryString);
                        $.get(proxy_dir_prefix + '/artwork_filters/' + queryString, function(html) {
                            $('#artworks_filter_panel').html(html);
                            window.galleries.artwork_filters.init();
                        });
                        $('body').addClass('artwork-filters-active');
                    }
                }
            }
            
            if (typeof window.onpopstate != 'undefined') {
                window.onpopstate = function(event) {
                    if (!$('#filterpanel_form').hasClass('forced-hash-change') && !$('body').hasClass('page-popup-active') && window.location.hash && typeof window.location.hash != 'undefined') {
                        if (window.location.hash.indexOf('#filters=') == 0) {
                            filterPermalink = window.location.hash.replace('#filters=', '');
                            var queryString = filterPermalink ? '?' + filterPermalink : '';
                            if (queryString && queryString != '') { 
                                var proxy_dir_prefix = '';
                                if (window.archimedes.proxy_dir && typeof window.archimedes.proxy_dir !='undefined') {
                                    proxy_dir_prefix = window.archimedes.proxy_dir;
                                    var lang_code = window.archimedes.proxy_dir.replace('/', '');
                                    queryString = queryString ? queryString + '&lang=' + lang_code : '?lang=' + lang_code;
                                }
                                window.galleries.artwork_filters.load_works_api('/modules/get_artworks/' + queryString);
                                $.get(proxy_dir_prefix + '/artwork_filters/' + queryString, function(html) {
                                    $('#artworks_filter_panel').html(html);
                                    window.galleries.artwork_filters.init();
                                });
                            }
                        }
                    }
                    $('#filterpanel_form').removeClass('forced-hash-change');
                };
            }
        }

        if ($('#artwork_description2_reveal_button').length > 0) {
            window.galleries.artworks.artwork_description2_reveal_button();
        }
        if ($('#artwork_description2_hide_button').length > 0) {
            window.galleries.artworks.artwork_description2_hide_button();
        }
        if ($('#artist_list.artist_image_on_hover').length > 0 || $('.artist_list.artist_image_on_hover').length > 0) {
            window.galleries.artworks.artist_list_artist_image_on_hover();
        }
        if ($('#artwork_descriptive_read_more_button').length > 0) {
            window.galleries.artworks.artwork_descriptive_read_more_button();
        }
        
        if ($(".roomview-image").length) {
            setTimeout(() => {
                
                $(".roomview-image").each(function(){
                    
                    if ($(this).hasClass('roomview-photo-image')) {
            
                        var rv_options = {
                            zoom_enabled: typeof $(this).attr('data-roomview-zoom-disabled') != 'undefined' ? false : true,
                            zoom_scrollwheel_enabled: typeof $(this).attr('data-roomview-scrollwheel-disabled') != 'undefined' ? false : true
                        }
                        var $that = $(this);
                        // $(this).roomViewPhoto(rv_options);
                        if (typeof roomViewPhoto == 'undefined') {
                            Artlogic.import('plugins/roomview-photo.1.0.js')
                                .then(function(roomview){
                                    $that.roomViewPhoto(rv_options);
                                });
                        } else {
                            $(this).roomViewPhoto(rv_options);
                        }
                        
                    } else {
                        
                        var rv_options = {
                            furniture_type: 'chair',
                            wall_type: 'standard', // Options: 'standard', 'concrete', 'brick'
                            verbose_mode: false
                        }
                        // Supply a json config in the html:  data-roomview-custom-config='{"furniture_type":"my_chair","furniture_items": {"rs_chair":{"classname_suffix":"my_chair","furniture_width_cm":148}}}'
                        var custom_config = $(this).data('roomview-custom-config');
    
                        if (custom_config && typeof custom_config != 'undefined') {
                            if (custom_config.furniture_type && typeof custom_config.furniture_type != 'undefined') {
                                rv_options["furniture_type"] = custom_config.furniture_type;
                            }
                            if (custom_config.furniture_items && typeof custom_config.furniture_items != 'undefined') {
                                rv_options.furniture_items = custom_config.furniture_items;
                            }
                            if (custom_config.wall_type && typeof custom_config.wall_type != 'undefined') {
                                rv_options["wall_type"] = custom_config.wall_type;
                            }
                            if (custom_config.floor_type && typeof custom_config.floor_type != 'undefined') {
                                rv_options["floor_type"] = custom_config.floor_type;
                            }
                        }
                        var $that = $(this); 
                        Artlogic.import('plugins/roomview.js')
                        .then(function(roomview){
                            $that.roomView(rv_options);
                        });
                    }
                    
                });
            }, 250);

            $('.roomview-button-custom').off().click(function(e) {
                
                e.preventDefault();
                
                // For accessibility - tracks which element to refocus on
                try {
                    h.accessibility.global_variables.element_to_refocus_to = $(this).children('a');
                } catch(error) {
                    console.error(error);
                }

                if($(this).parent().parent().hasClass('thumbnails')){
                    $(".roomview-buttons-wrapper > ul").addClass("active");
                    $(".roomview-photo-close").addClass("active");
                     $(".detail_view_module_roomview .roomview-buttons-wrapper > .link , .detail_view_module_ar > button").addClass('hidden');


                     if( $(".roomview-buttons-wrapper > ul").height() > 80 ){

                        $(".visualisation-tools").addClass("expand-one-row");
                     }
                     if( $(".roomview-buttons-wrapper > ul").height() > 160 ){

                        $(".visualisation-tools").addClass("expand-two-row");
                     }
                }
        
                var roomview_id = $(this).attr('data-roomview-id');
                if (roomview_id && typeof roomview_id != 'undefined') {
                    if ($('#image_gallery').find('.image_gallery_multiple').length) {
                        var roomview_instance = $('#image_gallery .item:not(.cycle-sentinel) .roomview-image[data-roomview-id="' + roomview_id + '"]');
                    } else {
                        var roomview_instance = $('#image_gallery .roomview-image[data-roomview-id="' + roomview_id + '"]');
                    }
                    if ($('#image_gallery').find('.image_gallery_multiple').length && !$('.image_gallery_multiple .item:not(.cycle-sentinel) .roomview-image[data-roomview-id="' + roomview_id + '"]').closest('.item').hasClass('cycle-slide-active')) {
                        
                        // Change slide before view in a room starts
                        var this_slide_index = roomview_instance.closest('.cycle-slide').index($('#image_gallery .image_gallery_multiple .cycle-slide').not('.cycle-sentinel'));
                        if (this_slide_index > -1) {
                            $('.image_gallery_multiple').cycle(this_slide_index);
                            setTimeout(function() {
                                if (typeof roomview_instance.roomView === 'function') {
                                    roomview_instance.roomView('open');
                                }
                            }, 600, roomview_instance);
                        }
                    } else {
                        if (typeof roomview_instance.roomView === 'function') {
                            roomview_instance.roomView('open');
                        }
                    }
                }

                if (window.gtag) {
                    gtag('event', 'view_on_a_wall_clicked', {});
                }
                
                window.galleries.artworks.roomview_callback();
                
                if (window.ga && typeof window.ga != 'undefined') {
                    var analytics_params = {
                        'hitType': 'event',
                        'eventCategory': 'View on a wall clicked',
                        'eventAction': window.location.pathname,
                        'eventLabel': ''
                    };
                    ga('send', analytics_params);
                    ga('tracker2.send', analytics_params);
                    ga('artlogic_tracker.send', analytics_params);
                }
            });


            $('.roomview-photo-close').off().click(function(e) {
                 $(".roomview-buttons-wrapper > ul").removeClass("active");
                 $(".roomview-photo-close").removeClass("active");
                 $(".visualisation-tools").removeClass("expand-one-row");
                 $(".visualisation-tools").removeClass("expand-two-row");
                 $(".detail_view_module_roomview .roomview-buttons-wrapper > .link , .detail_view_module_ar > button").removeClass('hidden');
            });

        }

        $(window).off('resize.image_gallery_images').on('resize.image_gallery_images', function() {
            $('#image_gallery .image[data-width]').each(function() {
                var image_width = $(this).attr('data-width') && typeof $(this).attr('data-width') != 'undefined' ? $(this).attr('data-width') : false;
                var image_height = $(this).attr('data-height') && typeof $(this).attr('data-height') != 'undefined' ? $(this).attr('data-height') : false;
                if (image_width && image_height) {
                    var item_width = $(this).find('.image').width();
                    var image_width_proportional = 0;
                    var image_height_proportional = 0;
                    if (image_width && image_height) {
                        var image_width_proportional = item_width / image_width;
                        var image_height_proportional = image_height * image_width_proportional;
                        if (image_height_proportional) {
                                $(this).css('min-height', image_height_proportional);
                        }
                    }
                }
            });
        }).trigger('resize.image_gallery_images');
        
        if ($('.image_hover_zoom').length) {
            if (!window.galleries.device.handheld()) {
                $('.image_hover_zoom').each(function() {
                    // Disabled on handheld as this stops users from swiping through the works.
                    var zoom_image = $(this).attr('data-zoom-url');
                    var zoom_type = window.galleries.device.handheld() ? 'click' : 'mouseover';
                    if (zoom_image && typeof zoom_image != 'undefined') {
                        var that = this;
                        Artlogic.import('plugins/zoom.js').then(function(m) {
                            $(that).zoom({
                                url: zoom_image,
                                duration: 400,
                                on: zoom_type,
                                onZoomIn: function(){
                                    $('body').addClass('zoom-active');
                                },
                                onZoomOut: function(){
                                    $('body').removeClass('zoom-active');
                                }}
                            );
                        })
                    }
                });
            }
        }
        
        if (window.galleries.device.handheld()) {
            var prevous_drag_percentage = 0;
            var x;

            var freezeVp = function(e) {
                e.preventDefault();
            };
            function stopBodyScrolling (bool) {
                if (bool === true) {
                    document.body.addEventListener("touchmove", function(e) {
                        e.preventDefault();
                    }, {passive: false});
                } else {
                    document.body.removeEventListener("touchmove", function(e) {
                        e.preventDefault();
                    }, {passive: false});
                }
            }
            
            var debounce_flag = false;
            var debounce_timeout = false;
            $('#popup_content').off('scroll').on('scroll', function() {
                var scrolling_element = $(this);
                if (!debounce_flag) {
                    debounce_flag = true;
                    $(scrolling_element).addClass('scrolling').removeClass('not-scrolling');
                }
                clearTimeout(debounce_timeout);
                debounce_timeout = setTimeout(function() {
                    $(scrolling_element).removeClass('scrolling').addClass('not-scrolling');
                    debounce_flag = false;
                }, 800, scrolling_element);
            });
            
            $('#image_gallery')
                .on('touchstart', function(e) {
                    x = e.originalEvent.targetTouches[0].pageX // anchor point
                })
                .on('touchmove', function(e) {
                    $('#image_gallery').addClass('dragging');
                    var change = e.originalEvent.targetTouches[0].pageX - x;
                    var percentage = 100 * change / window.innerWidth;
                    var drag_element = $('#image_gallery .draginner');
                    if (change < -10 || change > 10) {
                        var condition_context = $('#image_gallery').closest('#popup_content').length ? '#popup_content' : '#container_outer';
                        var condition = !$(condition_context).hasClass('scrolling') && !$('body').hasClass('roomview-active');
                        if (condition) {
                            // not yet working ios: stopBodyScrolling(true);
                            $('body').addClass('content-swipe');
                            drag_element.css({'transform': 'translate3d(' + percentage + '%, 0, 0)'});
                            $('#image_gallery .draginner').attr('data-left', percentage);
                            prevous_drag_percentage = percentage;
                        } else {

                        }
                    }
                })
                .on('touchend', function(e) {
                    $('#image_gallery').removeClass('dragging');
                    var percentage = $('#image_gallery .draginner').attr('data-left');
                    var drag_element = $('#image_gallery .draginner');
                    $('#image_gallery').removeClass('dragging');
                    window.setTimeout(function() {
                        $('body').removeClass('content-swipe');
                    }, 200);
                    if (percentage > 30) {
                        // Previous
                        if ($('body').hasClass('page-popup-active')) {
                            var link = $('#popup_box > .inner > .pagination_controls .previous').not('.disabled');
                        } else {
                            var link = $('#image_gallery .pagination_controls .previous a').not('.disabled');
                        }
                        if (link.length) {
                            $('.draginner_loader').addClass('loading');
                            drag_element.css({'transform': 'translate3d(201%, 0, 0)'});
                            link.trigger('click');
                        } else {
                            prevous_drag_percentage = 0;
                            drag_element.css({'transform': 'translate3d(0, 0, 0)'});
                            $('#image_gallery.draginner').attr('data-left', '0');
                        }
                    } else if (percentage < -30) {
                        // Next
                        if ($('body').hasClass('page-popup-active')) {
                            var link = $('#popup_box > .inner > .pagination_controls .next').not('.disabled');
                        } else {
                            var link = $('#image_gallery .pagination_controls .next a').not('.disabled');
                        }
                        if (link.length) {
                            $('.draginner_loader').addClass('loading');
                            drag_element.css({'transform': 'translate3d(-201%, 0, 0)'});
                            link.trigger('click');
                        } else {
                            varprevous_drag_percentage = 0;
                            drag_element.css({'transform': 'translate3d(0, 0, 0)'});
                            $('#image_gallery .draginner').attr('data-left', '0');
                        }
                    } else {
                        var prevous_drag_percentage = 0;
                        drag_element.css({'transform': 'translate3d(0, 0, 0)'});
                        $('#image_gallery .draginner').attr('data-left', '0');
                    }
                })
            ;
        }
    },
    
    roomview_callback: function() {
                
    },

    artwork_description2_reveal_button: function() {
        $('#artwork_description2_reveal_button').click(function() {
            //$('#artwork_description').slideUp();
            $(' #artwork_description2_reveal_button, #artwork_description_container').slideUp();
            $(' #artwork_description2_hide_button').slideDown();
            $('#artwork_description_2').slideDown();
            $('#image_gallery').addClass('artwork_full_details_open');
            $('#artwork_description_2').get(0).focus();
            return false;
        });
    },

    artwork_description2_hide_button: function() {
        $('#artwork_description2_hide_button').click(function() {
            //$('#artwork_description').slideUp();
            $(' #artwork_description2_hide_button').slideUp();
            $(' #artwork_description2_reveal_button, #artwork_description_container').slideDown();
            $('#artwork_description_2').slideUp(function() {
                $('#artwork_description2_reveal_button a').get(0).focus();
            });
            $('#image_gallery').removeClass('artwork_full_details_open');
            return false;
        });
    },

    artist_list_artist_image_on_hover: function() {
        $('#artist_list:not(.artist_list).artist_image_on_hover ul li a img, .artist_list.artist_image_on_hover ul li a img')
            .each(function() {
                if (!$(this).closest('a').hasClass('no-hover')) {
                    $(this).mouseover(function() {
                        $(this).stop().clearQueue().fadeTo(300, 0.0001);
                    });
                    $(this).mouseout(function() {
                        $(this).fadeTo(500, 1);
                    });
                }
            })
        ;
    },
    
    artwork_descriptive_read_more_button: function() {
        
        $('#artwork_descriptive_read_more_button').off().on('click', function() {
            
            if ($('#popup_content #image_gallery').length) {
                $('#popup_content').animate({
                    scrollTop: ($("#secondary_content_module").offset().top + $('#popup_content').scrollTop() - $('html,body').scrollTop())
                }, 600, function() {
                    if ($('#popup_content #secondary_content_module').length) {
                        $("#popup_content #secondary_content_module").get(0).focus({preventScroll:true});
                    }
                });
                return false;
            } else {
                $('html, body').animate({
                    scrollTop: $("#secondary_content_module").offset().top
                }, 600, function() {
                    if ($('#secondary_content_module').length) {
                        $("#secondary_content_module").get(0).focus({preventScroll:true});
                    }
                });
            }
            
        });
    }

}

window.galleries = window.galleries || {};
window.galleries.artworks = artworks;
export default artworks;