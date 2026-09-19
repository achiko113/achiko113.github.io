import debounce from './debounce.js';

var layout = {

    init: function () {

        $('.read_more_container').each(function () {
            if ($('#read_more_content', this).length) {
                $('#read_more_button a', this).off().click(function () {
                    $(this).closest('.read_more_container').find('#read_more_button').addClass("hidden").find("a").attr("aria-expanded", "true");
                    $(this).closest('.read_more_container').find('#read_less_button').removeClass("hidden");
                    $(this).closest('.read_more_container').find('#read_more_content').slideDown(400);
                    return false;
                });

                $('#read_less_button a', this).off().click(function () {
                    $(this).closest('.read_more_container').find('#read_more_content').slideUp(300, function () {
                        $(this).closest('.read_more_container').find('#read_more_button').removeClass("hidden").find("a").attr("aria-expanded", "false");
                        $(this).closest('.read_more_container').find('#read_less_button').addClass("hidden");
                    });
                    return false;
                });
            }
        });

        $('.reveal_more_text_container').each(function () {
            if ($('.full_content', this).length) {
                $('.read_more_link a', this).off().click(function () {
                    $(this).closest('.reveal_more_text_container').find('.initial_content, .read_more_link').slideUp();
                    $(this).closest('.reveal_more_text_container').find('.full_content').slideDown().focus();
                    $(this).closest('.reveal_more_text_container').find('.read_less_link').slideDown();
                    return false;
                });
                $('.read_less_link a', this).off().click(function () {
                    $(this).closest('.reveal_more_text_container').find('.full_content, .read_less_link').slideUp();
                    $(this).closest('.reveal_more_text_container').find('.initial_content').slideDown().focus();
                    $(this).closest('.reveal_more_text_container').find('.read_more_link').slideDown();
                    return false;
                });
            }
        });

        $('.open_panel_link a').off().click(function () {
            var related_container = $(this).attr('href');
            if (typeof related_container != 'undefined' && $(related_container).length > 0) {
                if ($(this).closest('.open_panel_link').hasClass('active')) {
                    $(this).closest('.open_panel_link').removeClass('active');
                    $(this).find('.label_toggle[data-inactive]').each(function () {
                        $(this).text($(this).attr('data-inactive'));
                    });
                    $(related_container).slideUp(500, 'easeInOutQuad').focus();
                } else {
                    $(this).closest('.open_panel_link').addClass('active');
                    $(this).find('.label_toggle[data-active]').each(function () {
                        $(this).text($(this).attr('data-active'));
                    });
                    $(related_container).slideDown(500, 'easeInOutQuad');
                    $('html, body').animate({
                        scrollTop: $(related_container).offset().top - 60
                    }, 800, 'easeInOutQuad',
                        function () {

                        });
                }
                return false;
            }
        });


        if ($("#container").fitVids) {
            $("#container").fitVids({ ignore: '.video_inline' });
            $(window).on('resize.fitvids', function () {
                $('.fluid-width-video-wrapper').each(function () {
                    if ($(window).width() > 767) {
                        if (parseInt($(this).css('padding-top')) > parseInt($(this).parent().height()) || $(this).hasClass('dynamic-width-downscaled')) {
                            var new_padding_top = (($(this).parent().height() / $(this).parent().width()) * 100);
                            if (parseInt(new_padding_top) < 20) {
                                new_padding_top = 20;
                            }
                            $(this).css('padding-top', new_padding_top + '%');
                            $(this).addClass('dynamic-width-downscaled');
                        }
                    }

                });
            });
        }

        window.galleries.layout.header.init();
        if ($('#header').hasClass('header_fixed')) {
            window.galleries.layout.header_fixed();
        }

        $('#content_module:not(.content_module), .content_module').each(function () {
            var $this = $(this);
            if ($.trim($this.html()) == '') {
                $this.addClass('no_content');
            }
        });

        window.galleries.layout.images.init();

        // Set in a timeout to fix an issue with flow list on android devices
        // Parallax also added to timeout to help prevent any timing issues
        setTimeout(function () {

            window.galleries.layout.inview.init()

            if ($('.parallax-element').length && typeof $(window).parallax != 'undefined') {
                $(window).parallax.setup();
                $(window).trigger('scroll'); // Added by Dan H on 25/09/2018 to fix a pageload bug https://artlogic.monday.com/boards/117534001/pulses/114995279
            }

        }, 100);





    },

    images: {

        init: function () {

            window.galleries.layout.images.align_captions();
            window.galleries.layout.images.align_sidebar_image_captions();

            $(window).on('resize', window.galleries.debounce(200, function () {
                window.galleries.layout.images.align_captions();
                window.galleries.layout.images.align_sidebar_image_captions();
            }));

            $('.image_align_caption').on('change.lazyload-complete', function () {
                window.galleries.layout.images.align_captions($(this));
            });

            $('.align_sidebar_image_caption').on('change.lazyload-complete', function () {
                window.galleries.layout.images.align_sidebar_image_captions($(this));
            });
        },

        align_captions: function (elements) {

            var elements = typeof elements != 'undefined' ? elements : '.image_align_caption';

            $(elements).each(function () {

                var image_object_fit_string = typeof $(this).find('img').css('object-fit') != 'undefined' ? $(this).find('img').css('object-fit') : '';
                var image_object_fit_enabled = false;

                if (image_object_fit_string == 'contain' || image_object_fit_string == 'cover') {
                    image_object_fit_enabled = true;
                }

                if ($(this).find('.object-fit-container').length && image_object_fit_enabled) {
                    var image_wrapper = $(this).find('.object-fit-container');
                } else if ($(this).find('> span:first-child').not('.caption').length) {
                    var image_wrapper = $(this).find('> span:first-child').not('.caption');
                } else {
                    var image_wrapper = $(this).find('img');
                }

                if (image_wrapper.length) {
                    var item_width = image_wrapper.width();
                    var item_height = image_wrapper.height();
                    var image_width = (typeof $(this).attr('data-width') != 'undefined' ? $(this).attr('data-width') : 0);
                    var image_height = (typeof $(this).attr('data-height') != 'undefined' ? $(this).attr('data-height') : 0);
                    if (image_object_fit_enabled && image_width && image_height && parseInt(image_height) > parseInt(image_width)) {
                        var height_proportion = image_height / item_height;
                        var caption_width = image_width / height_proportion;

                        if (caption_width && caption_width > 150) {
                            $(this).find('.caption').css('max-width', caption_width);
                        }
                    } else if (!image_object_fit_enabled) {
                        var caption_width = image_width;

                        if (caption_width && caption_width > 150) {
                            $(this).find('.caption').css('max-width', caption_width);
                        }
                    }
                }
            });
        },

        align_sidebar_image_captions: function (elements) {
            var elements = typeof elements != 'undefined' ? elements : '.image.align_sidebar_image_caption';

            $(elements).each(function () {
                const $this = $(this);
                const $img = $this.find('img');

                if ($img.css('object-fit') === 'contain') {
                    $img.css('width', 'auto');

                    $img.on('load', function () {
                        const $imgWidth = $img.width();

                        if ($imgWidth) {
                            $this.next('.caption').css({
                                'max-width': $imgWidth + 'px',
                                'margin-left': 'auto',
                                'margin-right': 'auto',
                            });
                        }
                    });
                }
            });
        },

    },

    inview: {

        elements: '.records_list:not(#list_preview_navigation) ul li, #popup_content #image_gallery #image_container, .artwork_detail_wrapper:not(.site-popup-enabled-content) #image_gallery #image_container, #sidebar, .sidebar, .feature_panels ul li.panel, .inview_element',

        init: function (custom_elements) {
            if (custom_elements && typeof custom_elements != 'undefined') {
                var inview_elements = $(custom_elements);
            } else {
                var inview_elements = $(this.elements);
            }
            if ($(inview_elements).length) {
                Artlogic.import('plugins/inview.js')
                    .then(function (inview) {
                        if ($.isFunction($.fn.inview)) {
                            // if (custom_elements && typeof custom_elements != 'undefined') {
                            //     inview_elements = $(custom_elements);
                            // } else {
                            //     inview_elements = $(window.galleries.layout.inview.elements);
                            // }
                            var lazyload_enabled = $('body').hasClass('layout-lazyload-enabled');

                            inview_elements.inview({
                                'lazyload': lazyload_enabled,
                                'lazyload_selector': '.image, .image_lazy_load',
                                'lazyload_loader_html': '<svg class="loader" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/></svg>'
                            });
                        }
                    })
            }
        },

        destroy: function () {
            Artlogic.import('plugins/inview.js')
                .then(function (inview) {
                    if (typeof $.fn.inview.destroy != 'undefined') {
                        $.fn.inview.destroy();
                    }
                })
        }

    },

    header: {

        init: function () {

            if ($('#hero_header').length) {
                if (typeof $('#hero_header').attr('data-height-override') != 'undefined') {
                    $('body').addClass('layout-hero-header-height-override-' + $('#hero_header').attr('data-height-override'));
                }
            }

            window.galleries.layout.header.process();
            $(window).resize(function () {
                window.galleries.layout.header.process();
            });
        },

        process: function () {


            var elements_to_offset = '.hero_splash_text, #hero_header > .inner, #slideshow.fullscreen_slideshow .content';
            if ($('#header').length && $('.header-ui-wrapper').length && $('#logo').length) {
                var header_height = $('#header').height();

                if ($('#hero_header').hasClass('hero-mode-fullbleed') && $('#hero_header').hasClass('hero-fixed-aspect-ratio') && $('#header.header_transparent').length == 0) {
                    $('#hero_header').css('margin-top', header_height);
                } else if ($('#hero_header').hasClass('hero-mode-fullbleed')) {
                    $(elements_to_offset).css('padding-top', header_height);
                }

                if ($('#hero_header').hasClass('hero-mode-fullbleed') && $('#hero_header').hasClass('hero-fixed-aspect-ratio')) {
                    $('#hero_header').css('min-height', '');
                    if ($('#hero_header #hero_heading').height() > $('#hero_header').height() - 40) {
                        $('#hero_header').css('min-height', $('#hero_header #hero_heading').height() + 40);
                    }
                }

                var logo_bottom_offset = $('#logo').offset().top + $('#logo').height();
                var toolbar_top_offset = $('.header-ui-wrapper').offset().top;
                if (logo_bottom_offset - 1 < toolbar_top_offset) {
                    $('#header').addClass('header_toolbar_wrapped');
                } else {
                    $('#header').removeClass('header_toolbar_wrapped');
                }
            } else {
                $(elements_to_offset).css('padding-top', '');
            }

            $('.feature_panels .panel_hero .hero_section').each(function () {
                $(this).css('min-height', '');
                $(this).closest('.panel_hero').find('.hero_section_placeholder').css('min-height', '');
                if (($('.hero_heading', this).height()) > $(this).height() - 40) {
                    $(this).css('min-height', $('.hero_heading', this).height() + 40);
                    $(this).closest('.panel_hero').find('.hero_section_placeholder').css('min-height', $('.hero_heading', this).height() + 40);
                }
            });

            // add .subnav_wrapped class if subnav is too long and has wrapped
            if ($('.heading_wrapper').length && ($('.heading_wrapper #h1_wrapper').length || $('.heading_wrapper .h1_wrapper').length) && $('.heading_wrapper #sub_nav ul li').length) {


                $('.heading_wrapper #sub_nav').removeClass('subnav_wrapped')

                //DC - not sure why we were previously accounting for element heights in this, so removed..
                var subnav_top_offset = ($('.heading_wrapper #sub_nav').offset().top) - parseInt($('.heading_wrapper #sub_nav').css('margin-top'));

                if ($('.heading_wrapper #h1_wrapper').length) {

                    var h1_wrapper_top_offset = ($('.heading_wrapper #h1_wrapper').offset().top) - parseInt($('.heading_wrapper #h1_wrapper').css('margin-top'));
                }
                if ($('.heading_wrapper .h1_wrapper').length) {

                    var h1_wrapper_top_offset = ($('.heading_wrapper .h1_wrapper').offset().top) - parseInt($('.heading_wrapper .h1_wrapper').css('margin-top'));
                }


                var offset_difference = function (subnav_top_offset, h1_wrapper_top_offset) {
                    return Math.abs(subnav_top_offset - h1_wrapper_top_offset);
                }(subnav_top_offset, h1_wrapper_top_offset);

                // if the top offsets are different then we know it has wrapped
                // Allow 3 px for differences in font rendering between browsers
                if (offset_difference >= 3) {
                    $('.heading_wrapper #sub_nav').addClass('subnav_wrapped')
                }
            }
        }

    },

    header_fixed: function () {

        $('body').addClass('layout-fixed-header');

    },

    navigation_centered: function (element) {
        $(element).fadeTo(0, 0).css({ 'float': 'left', 'visibility': 'visible' });
        $(window).on("load", function () {
            $(element)
                .css({
                    'width': $(element).width() + 2,
                    'margin': '0 auto',
                    'float': 'none'
                })
                .fadeTo(250, 1)
                ;
            $(element).css({ 'display': '', 'float': '' });
        });
    },

    content_follower: function (element, sticky_element) {
        sticky_element = sticky_element && typeof sticky_element != 'undefined' ? sticky_element : false;

        /*  
            Now uses css 'position:sticky' if supported. This may need to be applied to a *different* element
            to the old js method. In which case, specify the original element first and the separate sticky_element for newer browsers.
        */
        if ($(element).length > 0) {

            var supportsPositionSticky;
            // Detect whether '@supports' CSS is supported, preventing errors in IE
            var supports_supportsCSS = !!((window.CSS && window.CSS.supports) || window.supportsCSS || false);
            if (supports_supportsCSS) {
                // Older Edge supports '@supports' but not position sticky
                supportsPositionSticky = CSS.supports('position', 'sticky');
                console.log('sticky supported');
            } else {
                //IE doesn't support '@supports' or 'object-fit', so we can consider them the same
                supportsPositionSticky = false;
            }


            if (supportsPositionSticky || typeof supportsPositionSticky !== 'undefined') {

                if (sticky_element) {
                    console.log('sticky added to sticky_element');
                    var $sticky = $(sticky_element);
                } else {
                    console.log('sticky added to element');
                    var $sticky = $(element);
                }

                $sticky.addClass('content_follow_sticky');
                // var header_height = ($('#header').is(':visible') ? $('#header').outerHeight() : 0);
                // Not needed when an element is sticky: $sticky.css('top', header_height + 30);

                // $(window).resize(function(){
                //     var header_height = ($('#header').is(':visible') ? $('#header').outerHeight() : 0);
                //     // Not needed when an element is sticky: $sticky.css('top', header_height + 30);
                // });

            } else {

                console.log('legacy content-follow');
                var $scrolling_div = $(element);
                // Older method
                var offset = $scrolling_div.offset().top;
                if ($('#header.header_fixed').length > 0) {
                    var offset = offset - $('#header.header_fixed').outerHeight();
                }
                if ($('#cms-frontend-toolbar-container').length > 0) {
                    var offset = offset - $('#cms-frontend-toolbar-container').outerHeight();
                }
                $(window).scroll(function () {
                    var window_scroll_pos = $(window).scrollTop();
                    if (window_scroll_pos > offset) {
                        $scrolling_div.stop().animate({ "marginTop": (window_scroll_pos - offset) + 10 + "px" }, "slow");
                    }
                    else if (window_scroll_pos == 0) {
                        $scrolling_div.stop().animate({ "marginTop": (window_scroll_pos) + "px" }, "slow");
                    }
                });
            }

        }
    },

    push_to_fullheight: function (element, css_height_rule, subtract_px, add_px) {
        var $elem = $(element);
        var subtract_css = ' - 0px';
        var add_css = ' + 0px';

        if ($elem.length) {
            var content_module_offset = $elem.offset().top;
            if ($(subtract_px).length) {
                subtract_css = ' - ' + subtract_px.toString() + 'px'
            }
            if ($(add_px).length) {
                add_css = ' + ' + add_px.toString() + 'px'
            }
            // if ( $('body.cms-frontend-toolbar-active').length ) {
            //     content_module_offset -= 28;
            // }
            var height = 'calc((100vh - ' + content_module_offset + 'px)' + subtract_css + add_css + ')'
            $elem.css(css_height_rule, height);
        } else {
            console.log("Element pushed to fullheight doesn't exist.");
        }
    },

}

window.galleries = window.galleries || {};
window.galleries.layout = layout;
export default layout;