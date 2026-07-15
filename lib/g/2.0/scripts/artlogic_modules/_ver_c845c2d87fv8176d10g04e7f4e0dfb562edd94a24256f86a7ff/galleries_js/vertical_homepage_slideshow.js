import device from './device.js';
import slide_brightness from './slide_brightness.js';
import fullpage from '../plugins/fullpage.js';

var vertical_homepage_slideshow = {
            
    init: function() {
        $('.fullscreen_vertical_slideshow').each(function() {
            
                $('body').addClass("type-fullscreen type-fullscreen-vertical-slideshow");
                
                // adjust height of slideshow placeholder to take into account a header which is not position absolute or fixed
                function adjustPlaceholderHeight() {
                    if (($('#header').css('position') != 'absolute') && $('#header').css('position') != 'fixed') {
                        $(".vertical_slideshow_placeholder").height($(window).height() - $('#header').height() - parseInt($('#main_content').css('padding-top')));
                    }
                }
                // adjust placeholder height on window resize
                $(window).resize(function() {
                    adjustPlaceholderHeight();
                });
                
                //remove padding from #main_content if there is no content to show below the slideshow other than the footer
                if ($(this).hasClass("enable-content-below") && !$(this).hasClass("content_below_slideshow")) {
                    $('#main_content').css("padding-top", 0);
                }
                
                // default selected options
                var fullpagejs_options = {
                    licenseKey: '5A2280FB-CB764510-B00655ED-19C855BB',
                    scrollBar: false,
                    css3: true,
                    autoScrolling: true,
                    verticalCentered: false,
                    navigation: true,
                    navigationPosition: 'right',
                    
                    // on the last section of the slideshow, decouple the slideshow and allow normal scroll if there is content below
                    nextOnLastSection: function(next){
                        if (next && $('.fullscreen_vertical_slideshow').hasClass("enable-content-below")) {
                            
                            $('body').addClass("fp-scroll-enabled");
                            $('body').removeClass("fp-scroll-locked");
                            $('#fp-nav').addClass("hide-nav");
                            fullpage_api.setAllowScrolling(false);
                            fullpage_api.setKeyboardScrolling(false);
                            $('html').css({'overflow' : 'visible'});
                            $('body').css({'overflow' : 'visible'});
                            if (window.galleries.device.handheld()) {
                                // $("body").animate({ scrollTop: window.innerHeight }, 500);
                                $('body').addClass("auto-scrolling");
                                $('html,body').animate(
                                    {scrollTop: $(window).height()},
                                    300,
                                    'easeInOutQuad',
                                    function() { $('body').removeClass("auto-scrolling"); } 
                                );
                            }
                            // window.scrollBy(0, window.innerHeight, 'smooth');
                        }
                    },
                    
                    // add scrolling direction class so that it can work with headers which roll away on scroll
                    onLeave: function(origin, destination, direction){
                        if (direction == 'up') {
                            $('#container').removeClass("scrolling-down");
                        } else if (direction == 'down') {
                            $('#container').addClass("scrolling-down");
                        }
                        // remove the zero opacity which is added so the second from last slide cant be seen when the page bounces when it reaches the top
                        if ( origin.index == ($('.fp-section').length - 1) && $('body').hasClass("fp-scroll-enabled") ) {
                            $('body').removeClass("fp-scroll-enabled");
                            $('body').addClass("fp-scroll-locked");
                        }
                        window.galleries.slide_brightness.slide_brightness_change_class(destination.item, $('body'));
                    },
                    
                    afterLoad: function(origin, destination, direction){
                        window.galleries.slide_brightness.slide_brightness_change_class(destination.item, $('body'));
                    }
                }
                
                // pass through custom fullpage.js options - set as a dict within gallery setting - 'homepage_slideshow_fullpagejs_settings'
                var fullpagejs_new_settings;
                if ($(".fullscreen_vertical_slideshow").attr('data-fullpagejs-custom-settings'))  {
                    var fullpagejs_new_settings = JSON.parse($(".fullscreen_vertical_slideshow").attr('data-fullpagejs-custom-settings'));
                }
                
                // add new settings to the default settings dict
                for (var newkey in fullpagejs_new_settings) {
                    fullpagejs_options[newkey] = fullpagejs_new_settings[newkey];
                }
                
                // Run slideshow
                $(this).fullpage(fullpagejs_options);
                
                // Check for single slideshow items
                if ($('.section', this).length < 2) {
                    $('#fp-nav').addClass("single-slideshow-item");
                }
                
                // if there is content below the slideshow this allows you to scroll back into the slideshow
                $(window).on('scroll.vertical_slideshow', function (event) {
                    var scroll = $(window).scrollTop();
                    
                    if (scroll <= 0 && $('.fullscreen_vertical_slideshow').hasClass("enable-content-below") && !$('body').hasClass("auto-scrolling")) {
                        $('body').addClass("fp-scroll-locked");
                        $('html').css({'overflow' : 'hidden'});
                        $('body').css({'overflow' : 'hidden'});
                        $('#fp-nav').removeClass("hide-nav");
                        fullpage_api.setAllowScrolling(true);
                        fullpage_api.setKeyboardScrolling(true);
                    }
                }).trigger('scroll.vertical_slideshow');
        });
        
        // clear history of scroll position so that on reload the page scroll is at the top
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
};

window.galleries = window.galleries || {};
window.galleries.vertical_homepage_slideshow = vertical_homepage_slideshow;
export default vertical_homepage_slideshow;