import slideshow from './slideshow.js';

var slide_brightness = {

    imagesAlreadyChecked: {},

    init: function() {

        // if ($("#logo").hasClass('auto_brightness_disabled')){

        //     if ($("#logo").attr('data-logo-image-variant-light') && typeof $("#logo").attr('data-logo-image-variant-light') !== 'undefined') {
        //         var logo = document.getElementById("#logo");
        //         var logo_image_url = $("#logo").attr('data-logo-image-variant-light');
        //         logo.pseudoStyle("after","background-image",logo_image_url);
        //     }
        // }

        var $slideshow_selector = $('#slideshow.fullscreen_slideshow.override-slide-brightness ul, #slideshow.fullscreen_slideshow.detect-slide-brightness ul, #cover_page_slideshow.detect-slide-brightness ul, .fullscreen_vertical_slideshow');
        var $addclass_element = $('body');
        
        $slideshow_selector.each(function() {
            var $slideshow = $(this);

            window.galleries.slideshow.after = function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                window.galleries.slide_brightness.slide_brightness_change_class(incomingSlideEl,$addclass_element,$slideshow);
            }
            var onfunction = $slideshow_selector.on;
            if (onfunction) {
                $slideshow_selector.on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                    window.galleries.slide_brightness.slide_brightness_change_class(incomingSlideEl,$addclass_element,$slideshow);
                });
            }
            
            // Process brightness on the first slide initially
            if ($('#slideshow.fullscreen_slideshow.override-slide-brightness ul').length) {
                window.galleries.slide_brightness.slide_brightness_change_class($('#slideshow ul li').not('.cycle-sentinel').filter(':eq(0)'),$('body'),$slideshow);
            }
            setTimeout(function() {
                if ($('#slideshow.fullscreen_slideshow.detect-slide-brightness ul').length) {
                    window.galleries.slide_brightness.slide_brightness_change_class($('#slideshow ul li').not('.cycle-sentinel').filter(':eq(0)'),$('body'),$slideshow);
                } else if ($('#cover_page_slideshow.detect-slide-brightness ul').length) {
                    window.galleries.slide_brightness.slide_brightness_change_class($('#cover_page_slideshow ul li').not('.cycle-sentinel').filter(':eq(0)'),$('body'),$slideshow);
                } else if ($('.fullscreen_vertical_slideshow').length) {
                    window.galleries.slide_brightness.slide_brightness_change_class($('.fullscreen_vertical_slideshow .section').not('.cycle-sentinel').filter(':eq(0)'),$('body'),$slideshow);
                }
            }, 500);
        });

    },

    slide_brightness_change_class: function (slide,$addclass_element,$slideshow){
        var $slide = $(slide);
        
        if ($slideshow && typeof $slideshow != 'undefined') {
            if ($slideshow.is(":visible")) {
                if ($slide.length && $slide.hasClass('fullscreen-slide-brightness-detected') && ($slide.hasClass('fullscreen-slide-image-dark') || $slide.hasClass('fullscreen-slide-image-light'))) {
                
                    $addclass_element.removeClass('fullscreen-slide-light fullscreen-slide-dark');
    
                    if ($slide.hasClass('fullscreen-slide-brightness-detected')){
                        if ($slide.hasClass('fullscreen-slide-image-dark')){
                            $addclass_element.addClass('fullscreen-slide-dark');
                        } else if ($slide.hasClass('fullscreen-slide-image-light')){
                            $addclass_element.addClass('fullscreen-slide-light');
                        }
                    }
                    setTimeout(function () {
                        if (! $addclass_element.hasClass('fullscreen-slide-brightness-transition')){
                            $addclass_element.addClass('fullscreen-slide-brightness-transition');
                        }
                    }, 500);
                    
                }
            }
            
        }
    }
}

window.galleries = window.galleries || {};
window.galleries.slide_brightness = slide_brightness;
export default slide_brightness;