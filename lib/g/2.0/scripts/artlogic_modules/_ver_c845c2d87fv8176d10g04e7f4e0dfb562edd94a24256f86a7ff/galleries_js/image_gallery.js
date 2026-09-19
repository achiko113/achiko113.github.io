import device from './device.js';
import contact_form_popup from './contact_form_popup.js'
import cycle from '../plugins/jquery.cycle2.min.js'
import jscroller_start from './jscroller_start.js'

var image_gallery = {

    init: function () {

        var first_load = true

        if (h.element_exists('.image_gallery_multiple') && h.element_exists('#secondary_image_thumbnails')) {
            window.galleries.image_gallery.standard();
        }

        if (h.element_exists('#ig_slideshow')) {
            window.galleries.image_gallery.dynamic();
        }

        if (h.element_exists('#ig_slider') || h.element_exists('.ig_slider')) {
            window.galleries.image_gallery.slider.init();
        }

        if (h.element_exists('.detail_expand_grid') || h.element_exists('.detail_expand_grid')) {
            window.galleries.image_gallery.detail_expand_grid.init();
        }

    },

    standard: function () {
        var overrideSettings;
        if ($('.image_gallery_multiple').attr('data-cycle-custom-settings')) {
            var overrideSettings = JSON.parse($('.image_gallery_multiple').attr('data-cycle-custom-settings'));
        }

        var masterSettings = {
            fx: 'fade',
            speed: 600,
            timeout: 12000,
            paused: true,
            slides: '>',
            autoHeight: 'container',
            swipe: true
        };

        for (var overrideSetting in overrideSettings) {
            masterSettings[overrideSetting] = overrideSettings[overrideSetting];
        }

        $('.image_gallery_multiple').cycle(masterSettings);

        // Accessibility - cycle sentinel slide should be ignored by focus trapping.
        setTimeout(function () {
            $('#popup_content .image_gallery_multiple .item.cycle-sentinel a').removeClass('focustrap-first focustrap-focusable focustrap-item').addClass('focustrap-ignore');
        }, 500);

        // remove roomview attributes from cycle sentinels
        setTimeout(function () {
            $('.image_gallery_multiple .cycle-sentinel img').removeAttr('data-roomview-id data-roomview-artwork-cm-width data-roomview-custom-config').removeClass('roomview-image roomview-initialised');
        }, 500);

        var currenltySelectedMessage = '<span class="screen-reader-only active-thumbnail-message">, currently selected.</span>'

        $('#secondary_image_thumbnails a')
            .click(function () {
                var scroll_context = 'html,body';
                var element_offset_scroll = $(window).scrollTop();
                var element_offset_top = $('.image_gallery_multiple').offset().top;
                if ($(this).closest('#popup_content').length) {
                    var scroll_context = '#popup_content';
                    var element_offset_scroll = $('#popup_content').scrollTop();
                    var element_offset_top = 0;
                }
                if (element_offset_scroll > element_offset_top) {
                    $(scroll_context).animate(
                        {scrollTop: element_offset_top + (-20)},
                        300,
                        'easeInOutQuad'
                    );
                }
                $('.image_gallery_multiple').cycle(parseInt($(this).attr('data-index')));
                $('#secondary_image_thumbnails a .active-thumbnail-message').remove();
                $(currenltySelectedMessage).insertAfter($(this).find(".screen-reader-only"));

                // Accessibility - Update focus trapping when a different image is selected to show in the slideshow if it is the first focus item
                if (!$(this).hasClass('active') && $('#popup_content .image_gallery_multiple .item a').hasClass('focustrap-first')) {
                    $('#popup_content .image_gallery_multiple .item:not(.cycle-sentinel) a').removeClass('focustrap-ignore');
                    $('#popup_content .image_gallery_multiple .item:not(.cycle-slide-active) a').addClass('focustrap-ignore');
                    h.accessibility.focus_untrap();
                    h.accessibility.focus_trap('#popup_box .inner', false, '#popup_container .close');
                }

                $('#secondary_image_thumbnails a').removeClass('active');
                $(this).addClass('active');

                if ($(this).parent('.video_embed').length) {
                    $(window).trigger('resize.fitvids');
                }

                return false;
            })
            .attr("role", "button");
        $(currenltySelectedMessage).insertAfter("#secondary_image_thumbnails a:first .screen-reader-only");
        $('#secondary_image_thumbnails a:first').addClass('active');
    },

    detail_expand_grid: {

        init: function () {
            var selectors = '.detail_expand_grid';

            $('li a', selectors).click(function () {
                var wrapper = $(this).closest('li');
                var hash = $(this).attr('href');
                if ($(window).width() < 459) {
                    $.pageload.load($(this).attr('href'), true, false);
                } else {
                    if (!$(wrapper).hasClass('active')) {
                        window.galleries.image_gallery.detail_expand_grid.load_work(wrapper, $(this).attr('href'));
                    }
                }
                return false;
            });
            var original_browser_width = $(window).width();
            $(window).resize(function () {
                if ($(window).width() != original_browser_width) {
                    $('.detail_expand_grid').each(function () {
                        if ($('.expander_detail', this).length > 0) {
                            $('.expander_detail', this).remove();
                        }
                        if ($('li', this).attr('style') && $('li', this).attr('style') != 'undefined') {
                            $('li', this).removeClass('active').removeAttr('style');
                        }
                    });
                }
            });
            //$('> ul', selectors).addClass('loading');
            //$(window).on("load", function() {
            //    $('> ul', selectors).removeClass('loading');
            //});
        },

        load_work: function (wrapper, link) {
            console.log('do ajax');

            if ($(wrapper).closest('ul').hasClass('loading')) {

                $(window).off("load.load_work_pre_click");
                $(window).on("load.load_work_pre_click", function () {
                    window.galleries.image_gallery.detail_expand_grid.load_work(wrapper, link);
                });

            } else {
                console.log('do ajax');

                $(wrapper).closest('ul').find('li').removeClass('active');
                $(wrapper).addClass('active').addClass('loading');

                if (typeof detail_expand_load_work_ajax_request != 'undefined') {
                    detail_expand_load_work_ajax_request.abort();
                }

                var detail_expand_load_work_ajax_request = $.ajax({
                    url: link,
                    data: {'modal': '1'},
                    cache: false,
                    success: function (data) {

                        $(wrapper).closest('ul').find('li').not(wrapper).find('.expander_detail').css('opacity', '0');
                        $(wrapper).append('<div class="expander_detail">' + data + '</div>');
                        window.galleries.contact_form_popup.init();
                        $(".expander_detail #image_container a, #secondary_image_thumbnails a").fancybox({
                            'overlayShow': true,
                            'overlayOpacity': 0.7,
                            'overlayColor': '#d9d9d9',
                            'imageScale': 'true',
                            'zoomOpacity': 'true',
                            prevEffect: 'fade',
                            nextEffect: 'fade',
                            closeEffect: 'fade',
                            openEffect: 'fade',
                            helpers: {
                                title: {
                                    type: 'inside'
                                }
                            }
                        });


                        $('.expander_detail', wrapper).waitForImages({
                            finished: function () {
                                window.setTimeout(function () {

                                    console.log(link);
                                    history.replaceState(null, null, link);
                                    //should clear on scroll - to be built

                                    window.galleries.contact_form_popup.init();
                                    window.galleries.sharing.init();
                                    if (typeof window.addthis === 'undefined') {
                                    } else {
                                        window.addthis.toolbox('#social_sharing_links,.social_sharing_links');
                                        window.addthis.update('share', 'url', $('#social_sharing_params').attr('data-url'));
                                        //addthis.url = $('#social_sharing_params').attr('data-url');

                                    }
                                    $(".expander_detail #content").each(function () {
                                        var id = $(this).attr('id')
                                        $(this).attr('id', 'ajax_' + id)
                                    });

                                    //change .image class to prevent dynamic grid sizing
                                    $(".expander_detail .image").each(function () {
                                        var base_class = $(this).attr('class')
                                        $(this).attr('class', 'ajax_' + base_class)
                                    });
                                    //scroll to show only half of clicked grid item
                                    var scroll_offset = $(wrapper).offset().top + ($(wrapper).height() / 2);
                                    if ($(window).width() <= 459) {
                                        scroll_offset = $(wrapper).offset().top - 70;
                                    }
                                    var detail_above = $(wrapper).prevAll().find('.expander_detail');
                                    var existing_detail = $(wrapper).closest('ul').find('li').not(wrapper).find('.expander_detail');

                                    // If there is already an expanded area above, work out the final scroll position once this area is removed
                                    if (detail_above.length > 0 && detail_above.closest('li').offset().top != $(wrapper).offset().top) {
                                        scroll_offset = scroll_offset - $(wrapper).prevAll().find('.expander_detail').height();
                                    }
                                    if (existing_detail.length > 0 && existing_detail.closest('li').offset().top == $(wrapper).offset().top) {
                                        $(wrapper).addClass('no-animation');
                                    }

                                    $(wrapper).closest('ul').find('li').not(wrapper).find('.expander_detail').remove();

                                    var wrapper_height = $(wrapper).height();
                                    $(wrapper).closest('ul').find('li').css('height', wrapper_height);
                                    $(wrapper).css('height', $('#image_gallery', wrapper).outerHeight() + wrapper_height);

                                    $('.expander_detail,.expander_detail #content_module:not(.content_module), .expander_detail .content_module,', wrapper).css({
                                        'height': $('.expander_detail #image_gallery', wrapper).outerHeight(),
                                        'opacity': '1'
                                    });
                                    $('.expander_detail #image_gallery', wrapper).append('<button class="close" aria-label="Close expanded detail view">Close</button>');
                                    $('.expander_detail .close', wrapper).click(function () {
                                        window.galleries.image_gallery.detail_expand_grid.close_work($(wrapper).closest('ul'));
                                    });
                                    $('html,body').animate(
                                        {scrollTop: scroll_offset},
                                        400,
                                        'easeInOutQuad'
                                    );
                                    $(wrapper).removeClass('loading');
                                    $(wrapper).closest('ul').find('li').removeClass('no-animation');
                                    $('.expander_detail .ps_item a', wrapper).click(function (e) {
                                        e.preventDefault();
                                        if ($(this).hasClass('ps_next')) {
                                            $(this).closest('.detail_expand_grid').find('ul li.active').next('li').find('a').trigger('click');
                                        } else if ($(this).hasClass('ps_previous')) {
                                            $(this).closest('.detail_expand_grid').find('ul li.active').prev('li').find('a').trigger('click');
                                        }
                                    });
                                    $(".expander_detail #content_module #secondary_image_thumbnails a").attr('rel', 'group');

                                    window.galleries.artworks.init();
                                }, 200);


                                detail_expand_load_work_ajax_request = undefined;
                            },
                            waitForAll: true
                        });

                        $("#ajax_content_module #secondary_image_thumbnails a").fancybox({
                            'overlayShow': true,
                            'overlayOpacity': 0.7,
                            'overlayColor': '#d9d9d9',
                            'imageScale': 'true',
                            'zoomOpacity': 'true',
                            prevEffect: 'fade',
                            nextEffect: 'fade',
                            closeEffect: 'fade',
                            openEffect: 'fade',
                            afterLoad: function () {
                                $(".fancybox-overlay").addClass("fancybox-overlay-image");
                            },
                            helpers: {
                                title: {
                                    type: 'inside'
                                }
                            }
                        });
                        //window.galleries.image_gallery.standard();
                        if (h.element_exists('.store_item')) {
                            window.cart.add_to_cart($('.store_item .store_item_add_to_cart'));
                            window.cart.remove_from_cart($('.store_item .store_item_remove_from_cart'));
                        }

                        /* 
                        Placeholder function to call after the AJAX event completes.
                        Functionality can be added in main.js with window.galleries.image_gallery.detail_expand_grid.afterLoadWork = function(){...}
                        */
                        window.galleries.image_gallery.detail_expand_grid.afterLoadWork();

                    }
                });
            }
        },

        afterLoadWork: function () {

            h.accessibility.closeWithEscapeKey('.expander_detail .close');
            $('.detail_expand_grid ul li.active > a:first-child').attr("aria-expanded", "true").focus()

        },

        close_work: function (artworks_wrapper) {
            if ($(artworks_wrapper).length > 0) {
                $(artworks_wrapper).find('.expander_detail').closest('li').each(function () {
                    $('.detail_expand_grid ul li.active > a:first-child').attr("aria-expanded", "false")
                    $('.expander_detail', this).css('height', '0').css('opacity', '0');
                    $('.expander_detail', this).remove();
                    $(this).removeClass('active').height($('> a', this).height());
                });
                $(artworks_wrapper).find('.expander_detail');
                $('.detail_expand_grid ul li.active .artwork_detail_wrapper').removeAttr("tabindex");
            }
        }

    },

    slider: {

        init: function () {
            $('#ig_slider, .ig_slider').each(function () {
                if (!$(this).hasClass('ig_slider_single_image') && !$(this).hasClass('slick-slider')) {
                    window.galleries.image_gallery.slider.load(this);
                    window.galleries.image_gallery.slider.max_height();
                    $(window).resize(function () {
                        window.galleries.image_gallery.slider.max_height();
                        Artlogic.import('plugins/slick.js').then(function (m) {
                            if ($('#ig_slider, .ig_slider').hasClass('slick-initialized')) {
                                $('#ig_slider, .ig_slider').slick('setPosition');
                            }
                        });
                    });
                } else {
                    window.galleries.image_gallery.slider.max_height();
                    $(window).resize(function () {
                        window.galleries.image_gallery.slider.max_height();
                    });
                }
            });
        },

        load: function (ig_instance) {
            var slide_count = $('.item', ig_instance).length;
            var variable_width = true;
            if (slide_count <= 2) {
                variable_width = false;
            }
            var startingSlide = 0;
            if ($(ig_instance).find('.item.starting_slide').length) {
                startingSlide = $(ig_instance).find('.item.starting_slide').index();
            }
            Artlogic.import('plugins/slick.js').then(function (m) {
                $(ig_instance).slick({
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    accessibility: true, //left right arrow keys
                    centerMode: true,
                    variableWidth: variable_width,
                    autoplay: false,
                    autoplaySpeed: 6000,
                    arrows: true,
                    centerPadding: '0',
                    lazyLoad: 'progressive',
                    initialSlide: startingSlide,
                    focusOnChange: true
                });
                window.galleries.image_gallery.slider.max_height();
            });


            // Before slide change
            $(ig_instance).on('beforeChange', function (slick, currentSlide) {
                var ig_slideshow_wrapper = $(slick.target).closest('.ig_slider_container_wrapper');
                if ($('#ig_slider_caption, .ig_slider_caption', ig_slideshow_wrapper).length) {
                    $('#ig_slider_caption, .ig_slider_caption', ig_slideshow_wrapper).addClass('transition');
                }
            });
            $(ig_instance).on('afterChange', function (slick, currentSlide) {
                var ig_slideshow_wrapper = $(slick.target).closest('.ig_slider_container_wrapper');
                if ($('#ig_slider_caption, .ig_slider_caption', ig_slideshow_wrapper).length) {
                    window.galleries.image_gallery.slider.caption(ig_slideshow_wrapper);
                    window.galleries.image_gallery.slider.form_image(ig_slideshow_wrapper);
                }

                $(window).trigger('resize');
            });

        },

        max_height: function () {
            $('#ig_slider, .ig_slider').each(function () {
                var slick_carousel_container = $(this);
                ////Use original image dimensions to scale proportionally
                var slideshow_width = $(slick_carousel_container).width();
                var windowHeight = $(window).height();


                var slideshow_ratio = 1.8;
                if ($(this).attr('data-slideshow-ratio')) {
                    slideshow_ratio = $(this).attr('data-slideshow-ratio');
                }
                //ideal slideshow height, a ratio of the width
                var proportional_height = Math.floor(slideshow_width / slideshow_ratio);

                var upperLimit = 550;
                if ($(slick_carousel_container).attr('data-carousel-max-height')) {
                    upperLimit = $(slick_carousel_container).attr('data-carousel-max-height');
                }

                var set_height = upperLimit;
                //if the proportional height can't fit into the window height, use the window height instead
                if (proportional_height > windowHeight) {
                    proportional_height = windowHeight;
                }
                //allow the slideshow to scale proportionately, up to the upper limit
                if (proportional_height < upperLimit) {
                    set_height = proportional_height;
                } else {
                    set_height = upperLimit;
                }

                $('.item', this).each(function (i) {
                    var scaleRatio = set_height / $(this).data('imgheight');
                    var scaledHeight = Math.round($(this).data('imgheight') * scaleRatio);
                    var scaledWidth = Math.round($(this).data('imgwidth') * scaleRatio);
                    if (isNaN($(this).data('imgheight'))) {
                        scaledHeight = set_height;
                    }
                    $(this).height(scaledHeight).width(scaledWidth).find('img').height(scaledHeight).width(scaledWidth);
                });
                $('#ig_slider_container_outer, #ig_slider_container, #ig_slider, .ig_slider_container_outer, .ig_slider_container, .ig_slider, .ig_slider_container .slick-list, .ig_slider_container .slick-track, .feature_panels .panel_slider .slider_panel_fill').height(set_height);
            });
        },

        caption: function (slick_carousel_wrapper) {
            $('#ig_slider_caption, .ig_slider_caption', slick_carousel_wrapper).removeClass('transition');
            ////Load the caption into the caption space, from data attribute
            var caption = $(".slick-slide.slick-center", slick_carousel_wrapper).attr('data-caption');
            $('#ig_slider_caption, .ig_slider_caption', slick_carousel_wrapper).html(caption);
            slick_carousel_wrapper.find(".ig_slider_tools").find(".enquire_button_container").find(".button").find("a").attr("data-contact-form-details", caption);
            //change to support multi slider and enquiry form caption
        },

        form_image: function (slick_carousel_wrapper) {
            var current_image_path = slick_carousel_wrapper.find(".slick-current").find('img').attr("src");
            slick_carousel_wrapper.find(".ig_slider_tools").find(".enquire_button_container").find(".button").find("a").attr("data-contact-form-image", current_image_path);
            //change to support multi slider and enquiry form image
        },
        override_settings: function (target, data) {
            //console.log("override setings");

            Artlogic.import('plugins/slick.js').then(function (m) {
                $(target).slick('unslick');
                $(target).slick({data});
            });

            //console.log("override done");

        }


    },

    dynamic: function () {
        var slideshow_selector = '.ig_slideshow_container';
        if ($(slideshow_selector).length < 1) {
            slideshow_selector = '#ig_slideshow_container';
        }

        $(slideshow_selector).each(function () {

            var onfunction = $('#ig_slideshow', this).on;
            if (onfunction) {
                // Method for jQuery Cycle 2 ONLY
                // Function fired directly after the slideshow is initialized
                $('#ig_slideshow', this).on('cycle-post-initialize', function (event, optionHash) {

                    var this_instance = $(this).closest('#ig_slideshow_container');
                    window.setTimeout(function () {

                        //console.log("find height = " + $('#ig_slideshow > .item:eq(0)', this_instance).find('img').height());
                        if ($('#ig_slideshow .item.cycle-slide:eq(0)', this_instance).find('img').height() > 0 && $('#ig_slideshow .item.cycle-slide:eq(0)', this_instance).find('img').height() > $('#ig_slideshow', this_instance).height()) {
                            $('#ig_slideshow', this_instance).height($('#ig_slideshow .item.cycle-slide:eq(0)', this_instance).find('img').height());

                        }

                    }, 400);
                });

                // Display the controller count
                if ($('#ig_slideshow_controller_count').length > 0) {
                    $('#ig_slideshow_controller_count').html('1 ' + $('#ig_slideshow_controller_count').attr('data-separator') + ' ' + $('#ig_slideshow >').not('cycle-sentinel').length);
                    if ($('#ig_slideshow >').not('cycle-sentinel').length < 2) {
                        $('#ig_slideshow_controller').addClass('ig_slideshow_controller_single_item');
                    }
                }

                // Display the first caption
                // Dan - I have started working on adding an enquire button for the works slideshow layout
                var initial_caption = ($('#ig_slideshow > :eq(0)', this).attr('data-rel') && typeof $('#ig_slideshow > :eq(0)', this).attr('data-rel') != 'undefined' ? $('#ig_slideshow > :eq(0)', this).attr('data-rel') : $('#ig_slideshow > :eq(0)', this).attr('rel'));
                // var initial_enquire_button = $('#ig_slideshow > :eq(0)', this).find('.enquire').clone();
                if ($('#ig_slideshow .item.item_starting_slide').length) {
                    initial_caption = ($('#ig_slideshow .item.item_starting_slide', this).attr('data-rel') && typeof $('#ig_slideshow .item.item_starting_slide', this).attr('data-rel') != 'undefined' ? $('#ig_slideshow .item.item_starting_slide', this).attr('data-rel') : $('#ig_slideshow .item.item_starting_slide', this).attr('rel'));
                    // var initial_enquire_button = $('#ig_slideshow .item.item_starting_slide', this).find('.enquire').clone();
                }
                if (initial_caption && typeof initial_caption != 'undefined') {
                    initial_caption = initial_caption.replace(/\n/g, '');
                }

                $('#ig_slideshow_caption, .ig_slideshow_caption', this).html(initial_caption);

                // Optional: Some sites can include an external custom defined caption area, this doesn't relate to the current slideshow instance
                $('#ig_slideshow_caption_external').html(initial_caption);

                // $('#ig_slideshow_enquire').html(initial_enquire_button);

                // Function fired directly before the slide changes
                $('#ig_slideshow', this).on('cycle-before', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                    var this_instance = $(this).closest('#ig_slideshow_container');
                    var this_caption = ($(incomingSlideEl, this_instance).attr('data-rel') && typeof $(incomingSlideEl, this_instance).attr('data-rel') != 'undefined' ? $(incomingSlideEl, this_instance).attr('data-rel') : $(incomingSlideEl, this_instance).attr('rel'));
                    if (this_caption && typeof this_caption != 'undefined') {
                        this_caption = this_caption.replace(/\n/g, '');
                    }
                    $('#ig_slideshow_caption, .ig_slideshow_caption', this_instance).html(this_caption);
                    // Optional: Some sites can include an external custom defined caption area, this doesn't relate to the current slideshow instance
                    $('#ig_slideshow_caption_external').html(this_caption);

                    // var this_enquire_button = $(incomingSlideEl, this_instance).find('.enquire').clone();
                    // console.log(this_enquire_button);
                    // $('#ig_slideshow_enquire').html(this_enquire_button);
                    // window.galleries.contact_form_popup.init();

                    if ($('#ig_slideshow_controller_count').length > 0) {
                        $('#ig_slideshow_controller_count').html(optionHash.nextSlide + 1 + ' ' + $('#ig_slideshow_controller_count').attr('data-separator') + ' ' + optionHash.slideCount);
                    }
                    $('#ig_slideshow_thumbnails a', this_instance).removeClass('active');

                    var selected_slide_index = $('#ig_slideshow >', this_instance).not('.cycle-sentinel').index(incomingSlideEl);

                    // Use data-rel if available (changed for W3C compliance), otherwise fall-back to rel
                    if ($('#ig_slideshow_thumbnails a[data-rel=' + selected_slide_index + ']').length) {
                        var active_thumbnail = $('#ig_slideshow_thumbnails a[data-rel=' + selected_slide_index + ']');
                    } else {
                        var active_thumbnail = $('#ig_slideshow_thumbnails a[rel=' + selected_slide_index + ']');
                    }
                    active_thumbnail.addClass('active');
                });

                // Function fired directly after the slide has changed
                $('#ig_slideshow', this).on('cycle-after', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {

                });
            }


            var autoHeight = 'container';
            if ($('#ig_slideshow', this).attr('data-cycle-autoheight-setting')) {
                autoHeight = $("#ig_slideshow", this).attr('data-cycle-autoheight-setting');
            }

            var cycleSpeed = 1200;
            if ($('#ig_slideshow', this).attr('data-cycle-speed-setting')) {
                cycleSpeed = $("#ig_slideshow", this).attr('data-cycle-speed-setting');
            }

            var cycleFx = 'fade';
            if ($('#ig_slideshow', this).attr('data-cycle-fx-setting')) {
                cycleFx = $("#ig_slideshow", this).attr('data-cycle-fx-setting');
            }

            var startingSlide = 0;
            if ($('#ig_slideshow .item.item_starting_slide').length) {
                startingSlide = $('#ig_slideshow .item.item_starting_slide').index();
            }

            var newsettings;
            if ($('#ig_slideshow', this).attr('data-cycle-custom-settings')) {
                newsettings = JSON.parse($('#ig_slideshow', this).attr('data-cycle-custom-settings').replace(/'/g, '"'));
            }

            var mastersettings = {
                fx: cycleFx,
                speed: cycleSpeed,
                timeout: 6000,
                pause: 0,

                slides: '>',
                //autoHeight: 'calc',
                autoHeight: autoHeight,
                swipe: true,
                startingSlide: startingSlide
            }

            for (var newkey in newsettings) {
                mastersettings[newkey] = newsettings[newkey];
            }

            $('#ig_slideshow', this)
                .cycle(mastersettings)
                .each(function () {
                    console.log('found a show')
                    if ($('.artwork_video_link', this).length > 0) {
                        var artwork_video_object = $('.artwork_video_object', this);
                        $('.artwork_video_link', this).click(function () {
                            $(this).hide();
                            artwork_video_object.html($(this).attr('rel'));
                            return false;
                        });
                    }

                    $(this).on('cycle-initialized', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                        if ($('.artwork_video_link', this).length > 0) {
                            var artwork_video_object = $('.artwork_video_object', this);
                            $('.artwork_video_link', this).click(function () {
                                $(this).hide();
                                artwork_video_object.html($(this).attr('rel'));
                                return false;
                            });
                        }
                    });

                    // NEW CODE ////
                    var onfunction = $(this).on;
                    if (onfunction) {
                        $(this).on('cycle-post-initialize', function (event, optionHash) {
                            window.galleries.image_gallery.initialized(event, optionHash);
                        });
                        // Function fired directly before the slide has changed
                        $(this).on('cycle-before', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                            window.galleries.image_gallery.after(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag);
                            if (history.replaceState && $(incomingSlideEl).attr('data-href')) {
                                var new_url = $(incomingSlideEl).attr('data-href');
                                history.replaceState(null, null, new_url);
                            }
                        });
                    }


                })
            ;


            $('#ig_slideshow_thumbnails a:eq(0)', this).addClass('active');

            // Accessibility - Make the links act as buttons
            $('#ig_slideshow_thumbnails a', this).attr("role", "button");
            h.accessibility.role_button();

            $('#ig_slideshow_thumbnails a', this).click(function () {
                var this_instance = $(this).closest('#ig_slideshow_container');
                $('#ig_slideshow .artwork_video_object', this_instance).html('');
                $('#ig_slideshow .artwork_video_link', this_instance).show();
                $('#ig_slideshow', this_instance).cycle('pause');

                var slide_index = false;
                if ($(this).attr('data-rel') && typeof $(this).attr('data-rel') != 'undefined') {
                    slide_index = $(this).attr('data-rel');
                } else if ($(this).attr('rel') && typeof $(this).attr('rel') != 'undefined') {
                    slide_index = $(this).attr('rel');
                }
                if (slide_index) {
                    $('#ig_slideshow', this_instance).cycle(parseInt(slide_index));
                }
                return false;
            });

            if ($("#ig_slideshow_thumbnails_container", this).hasClass('ig_thumbnails_type_scroller')) {
                if (!$("#ig_slideshow_thumbnails_container", this).hasClass('ig_thumbnails_type_scroller_disabled')) {

                    var scroller_type = '';
                    if ($("#ig_slideshow_thumbnails_container", this).hasClass('ig_thumbnails_type_scroller_click')) {
                        scroller_type = 'clickButtons';
                    }

                    if (!window.galleries.device.handheld()) {

                        window.galleries.jscroller_start.init($("#ig_slideshow_thumbnails_container", this), scroller_type);

                    } else {

                        $("#ig_slideshow_thumbnails_container", this).addClass('ig_thumbnails_type_scroller_handheld');

                    }

                    if ($('#ig_slideshow_thumbnails', this).width() < $('#ig_slideshow_thumbnails_container', this).width()) {
                        $('#ig_slideshow_thumbnails_container', this).addClass('ig_slideshow_thumbnails_inactive');
                    }

                }
            } else {

                //count the ul's and add first and last classes
                var ul_count = parseInt($('#ig_slideshow_thumbnails', this).find('ul').length) - 1;
                $('#ig_slideshow_thumbnails ul', this).eq(0).addClass('first');
                $('#ig_slideshow_thumbnails ul', this).eq(ul_count).addClass('last');
                //check if support for on method
                if (onfunction) {
                    $('#ig_slideshow_thumbnails', this).on('cycle-update-view', function (event, optionHash, slideOptionsHash, currentSlideEl) {
                        var this_instance = $(this).closest('#ig_slideshow_container');
                        $('#ig_slideshow_thumbnails_container', this_instance).removeClass('last_slide_active').removeClass('first_slide_active');
                        //slidecount
                        //optionHash.slideCount
                        //optionHash.currSlide
                        //console.log(optionHash.slideCount);
                        if (optionHash && typeof optionHash != 'undefined') {
                            if (optionHash.slideCount > 1) {
                                //check if current slide is last and add class
                                if (optionHash.currSlide == optionHash.slideCount - 1) {
                                    $('#ig_slideshow_thumbnails_container', this_instance).addClass('last_slide_active');
                                }
                                //check if current slide is the first add class first
                                if (optionHash.currSlide == 0) {
                                    $('#ig_slideshow_thumbnails_container', this_instance).addClass('first_slide_active');
                                }
                            }
                        }
                    });
                }//end of if onfunction


                $('#ig_slideshow_thumbnails', this).cycle({
                    fx: 'scrollHorz',
                    speed: 500,
                    timeout: 1000,
                    slides: '>'
                });
                $('#ig_slideshow_thumbnails', this).cycle('pause');
                $('#ig_slideshow_thumbnails_prev a', this).click(function () {
                    var this_instance = $(this).closest('#ig_slideshow_container');
                    $('#ig_slideshow_thumbnails', this_instance).cycle('prev');
                    return false;
                });
                $('#ig_slideshow_thumbnails_next a', this).click(function () {
                    var this_instance = $(this).closest('#ig_slideshow_container');
                    $('#ig_slideshow_thumbnails', this_instance).cycle('next');
                    return false;
                });
            }

            $('#ig_slideshow_controller').each(function () {
                $('#ig_slideshow_controller_prev a').click(function () {
                    var this_instance = $('#ig_slideshow_container');
                    $('#ig_slideshow').cycle('pause').cycle('prev');
                    return false;
                });
                $('#ig_slideshow_controller_next a').click(function () {
                    var this_instance = $('#ig_slideshow_container');
                    $('#ig_slideshow').cycle('pause').cycle('next');
                    return false;
                });
            });

        });

    },

    initialized: function () {

    },

    after: function () {

    }

};

window.galleries = window.galleries || {};
window.galleries.image_gallery = image_gallery;
export default image_gallery;