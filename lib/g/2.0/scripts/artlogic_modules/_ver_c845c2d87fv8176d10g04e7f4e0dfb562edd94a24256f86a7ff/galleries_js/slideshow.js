import device from './device.js';
import cycle from '../plugins/jquery.cycle2.min.js'
import '../plugins/plyr.js';


var slideshow = {

    plyr_loopcount_global: 0,
    //slideshow_init: false,

    init: function () {
        //console.log("slideshow init with - " + this.slideshow_init);
        // var slideshow.plyr_loopcount_global = 0;
        //if (this.slideshow_init == false) {
        this.plyr_loopcount_global = 0;

        if (window.galleries.device.handheld()) {
            $('.hero-parallax-element').removeClass('hero-parallax-element');
        }

        // Accessibility - Hide parallax hero header from screen readers
        $('#parallax-hero_header').attr('aria-hidden', true);

        // Accessibility -  remove links and buttons within mirror slideshow from tab order
        $('#mirror-slideshow a, #mirror-slideshow button').each(function () {
            $(this).attr('tabindex', -1);
        });

        // Combine duplicate pagination labels when using location records
        if ($('body.homepage_slideshow_continuous_cycle').length && $('#slideshow .slideshow_pager.location_pagination_enabled .slideshow-pager-item-wrapper.slideshow-text .slideshow-pager-item').length) {
            var seen = {};
            $('#slideshow .slideshow_pager.location_pagination_enabled .slideshow-pager-item-wrapper.slideshow-text .slideshow-pager-item').each(function () {

                var location = $(this).text();

                if (seen[location]) {
                    $(this).hide();
                    $(this).parent().hide();
                    $(this).parent().css('padding', '0');
                    $(this).parent().addClass('inactive');
                } else {
                    seen[location] = true
                    $(this).parent().addClass('remain_active')
                }
            })
        }

        if ($('.slide_has_video').length || $('#slideshow.fullscreen_video').length) {
            window.galleries.slideshow.video_content('body');
        }

        $('#slideshow ul, #mirror-slideshow ul').each(function () {

            $(this).find('.cycle-sentinel').not('#sidebar .cycle-sentinel').remove();

            if (!$(this).hasClass('hero-parallax-element')) {

                var autoHeight = 'calc';
                if ($("#slideshow, #mirror-slideshow").attr('data-cycle-autoheight-setting')) {
                    autoHeight = $("#slideshow").attr('data-cycle-autoheight-setting');
                }

                var slideshowtimeout = 5500;
                // if ($("#slideshow, #mirror-slideshow").attr('data-cycle-timeout-setting'))  {
                if ($("#slideshow").attr('data-cycle-timeout-setting')) {
                    slideshowtimeout = parseInt($("#slideshow").attr('data-cycle-timeout-setting'));
                }

                var newsettings;
                if ($("#slideshow, #mirror-slideshow").attr('data-cycle-custom-settings')) {
                    newsettings = JSON.parse($("#slideshow, #mirror-slideshow").attr('data-cycle-custom-settings'));
                }

                if ($(this).find('.slide_has_video')) {
                    var $instance = $(this);
                    window.galleries.slideshow.video_content_embed_scale($instance);

                    var rtime, timeout = false, delta = 300;

                    $(window).resize(function () {
                        rtime = new Date();
                        if (timeout === false) {
                            timeout = true;
                            setTimeout(resizeend, delta);
                        }
                    });

                    function resizeend() {
                        if (new Date() - rtime < delta) {
                            setTimeout(resizeend, delta);
                        } else {
                            timeout = false;
                            window.galleries.slideshow.video_content_embed_scale($instance);
                        }
                    };
                    /*function resizeend() {
                        if (new Date() - rtime < delta) {
                            setTimeout(resizeend, delta);
                        } else {
                            timeout = false;
                            window.galleries.slideshow.video_content_embed_scale($instance);   
                        }               
                    }*/
                }
                var mastersettings = {
                    fx: 'fade',
                    speed: 1200,
                    timeout: slideshowtimeout,
                    pause: 0,
                    slides: '>',
                    autoHeight: autoHeight,
                    swipe: true,
                    sync: true,
                    log: false
                }

                for (var newkey in newsettings) {
                    mastersettings[newkey] = newsettings[newkey];
                }

                var onfunction = $('#slideshow').on;
                if (onfunction) {
                    $('#slideshow ul, #mirror-slideshow ul').on('cycle-post-initialize', function (event, optionHash) {
                        //$(this).on('cycle-post-initialize', function(event, optionHash) {
                        var first_slide = $('>', this).not('.cycle-sentinel').filter(':eq(0)');
                        if (first_slide.find('.video_container.active').length) {
                            var plyr_loopcount = parseInt(first_slide.attr('data-plyr-index')) - 1;
                            // if (!isNaN(plyr_loopcount)){
                            window.plyr_video_players[plyr_loopcount].on('ready', function (event) {
                                if (!$('#hero_image_responsive').is(':visible')) {
                                    window.plyr_video_players[plyr_loopcount].play();
                                }
                            });
                            // }
                            // window.player = plyr_video_players[0]; //sometimes requires this to expose player
                        }

                        // Set position of pagination controls for standard homepage slideshow layout
                        function setSlideshowPaginationControlsPosition() {

                            if ($('.section-home #slideshow.full_list ul li .image').length) {


                                var slideshow_image_height = $('.section-home #slideshow.full_list ul li .image').outerHeight(true);
                                // If there is no caption set the pagination position higher as it no longer needs to sit inline with the caption
                                if (!$('.section-home #slideshow.full_list ul li .content.slide_has_caption').length) {


                                        slideshow_image_height -= 10

                                }

                                  if ($('#slideshow.split_slideshow').length) {
                                        // set height for split slideshow only
                                        slideshow_image_height = $('.section-home #slideshow.full_list ul li .image').outerHeight(true) - 60
                                    }


                                $('.section-home #slideshow.full_list .slideshow-pagination-controls').css({
                                    "bottom": "auto",
                                    "top": slideshow_image_height
                                });

                            }
                        }


                        setSlideshowPaginationControlsPosition();

                        $(window).resize(function () {
                            setSlideshowPaginationControlsPosition();
                        });

                        // Pause slideshow if link inside gets focus
                        $('#slideshow a, #mirror-slideshow a').focusin(function () {
                            $('#slideshow ul, #mirror-slideshow ul').cycle('pause');
                        });

                        // Slideshow pagination controls
                        if ($('#slideshow .slideshow-pagination-controls').length) {

                            $('#slideshow .slideshow-pagination-controls .btn-next').off("click.nextSlideshowSlide");
                            $('#slideshow .slideshow-pagination-controls .btn-next').on('click.nextSlideshowSlide', function () {
                                $('#slideshow ul, #mirror-slideshow ul').cycle('pause').cycle('next');
                            });

                            $('#slideshow .slideshow-pagination-controls .btn-prev').off("click.prevSlideshowSlide");
                            $('#slideshow .slideshow-pagination-controls .btn-prev').on('click.prevSlideshowSlide', function () {
                                $('#slideshow ul, #mirror-slideshow ul').cycle('pause').cycle('prev');
                            });
                        }

                        if ($('#slideshow .slideshow_pager').length) {
                            $('body').addClass('homepage-slideshow-pagination-enabled');

                            $('#slideshow .slideshow_pager').each(function () {

                                var pager = $(this);

                                pager.find('.slideshow-pager-item-wrapper:nth-child(1)').addClass('active');
                                pager.find('.slideshow-pager-item-wrapper').each(function () {
                                    var dotwrapper = $(this);

                                    if (!$('.slideshow-pager-item-wrapper.remain_active').length) {
                                        dotwrapper.click(function () {
                                            var paged_slideshow = dotwrapper.closest('.paged-slideshow-wrapper').find('ul');
                                            $(paged_slideshow).cycle(parseInt(dotwrapper.attr('data-rel')));
                                            pager.find('.slideshow-pager-item-wrapper').removeClass('active');
                                            dotwrapper.addClass('active');
                                            $(paged_slideshow).cycle('pause');

                                            if ($('#mirror-slideshow ul').length) {
                                                $('#mirror-slideshow ul').cycle(parseInt(dotwrapper.attr('data-rel')));
                                                $('#mirror-slideshow ul').cycle('pause');
                                            }
                                        });
                                    }
                                });
                            });
                        }

                        // Accessibility - stop any parallax slideshow links from being focusable
                        if ($('#parallax-slideshow a').length) {
                            $('#parallax-slideshow a').attr('tabindex', -1);
                        }

                        window.galleries.slideshow.initialized(event, optionHash);
                    });

                    // Function fired directly before the slide has changed
                    $('#slideshow ul, #mirror-slideshow ul').on('cycle-before', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                        // $(this).on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                        if ($(incomingSlideEl).find('.video_container.active').length) {
                            var plyr_loopcount = parseInt($(incomingSlideEl).attr('data-plyr-index')) - 1;
                            if (!$('#hero_image_responsive').is(':visible')) {
                                window.plyr_video_players[plyr_loopcount].play();
                            }
                        }
                        
                        if ($('#slideshow .slideshow_pager.location_pagination_enabled').length) {
                            var previous_slide_text = ($('.slideshow-pager-item-wrapper.active').attr('aria-label'));
                            var previous_slide_text_edit = previous_slide_text.substring(0, previous_slide_text.indexOf(' (Current slide)'));
                            var new_aria_label = previous_slide_text_edit
                        } else {
                            var previous_slide_number = parseInt($('.slideshow-pager-item-wrapper.active').attr('data-rel')) + 1;
                            var aria_label_title = typeof $('.slideshow-pager-item-wrapper.active').attr('data-button_aria_title') != 'undefined' ? $('.slideshow-pager-item-wrapper.active').attr('data-button_aria_title') : null;
                            var new_aria_label = 'Go to slide ' + previous_slide_number + (aria_label_title ? ', ' + aria_label_title : '')
                            $('.slideshow-pager-item-wrapper.active').removeClass('active').attr('aria-label', new_aria_label);
                        }

                        $('.slideshow-pager-item-wrapper.active').removeClass('active').attr('aria-label', new_aria_label);
                        var next_slideshow_item = (optionHash.nextSlide).toString();
                        var new_slide_aria_label = $('.slideshow-pager-item-wrapper[data-rel=' + next_slideshow_item + ']').attr('aria-label') + ' (Current slide)'

                        if ($('.slideshow-pager-item-wrapper[data-rel=' + next_slideshow_item + ']').hasClass('inactive')) {
                            var current_aria_label = $('.slideshow-pager-item-wrapper[data-rel=' + next_slideshow_item + ']').first().text()
                            $('.slideshow-pager-item-wrapper[data-rel=' + next_slideshow_item + ']').prevAll('.slideshow-pager-item-wrapper.remain_active:not(".active"):contains("' + current_aria_label + '")').addClass('active').attr('aria-label', new_slide_aria_label);
                        } else {
                            $('.slideshow-pager-item-wrapper[data-rel=' + next_slideshow_item + ']').addClass('active').attr('aria-label', new_slide_aria_label);
                        }

                        window.galleries.slideshow.after(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag);
                    });

                    $(this).on('cycle-after', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                        if ($(outgoingSlideEl).find('.video_container.active').length) {
                            var plyr_loopcount = parseInt($(outgoingSlideEl).attr('data-plyr-index')) - 1;
                            window.plyr_video_players[plyr_loopcount].pause();
                            //console.log('pausing player' + plyr_loopcount);
                        }
                    });
                }

                $('#slideshow ul, #mirror-slideshow ul').cycle(mastersettings);

                $(this).closest('#slideshow').find('.slideshow_pagination_prev').off("click.slideshow_pagination_prev").on('click.slideshow_pagination_prev', function () {

                    $(this).closest('#slideshow').find('ul').cycle('pause').cycle('prev');
                    return false;
                });

                $(this).closest('#slideshow').find('.slideshow_pagination_next').off("click.slideshow_pagination_next").on('click.slideshow_pagination_next', function () {

                    $(this).closest('#slideshow').find('ul').cycle('pause').cycle('next');
                    return false;
                });


                $('#slideshow.paused, #mirror-slideshow.paused')
                    .each(function () {
                        pausePlay();
                    })
                ;
            }
            window.galleries.slideshow.homepage_slideshow.init();
        });

        if ($('#hero_image_responsive .slide_has_video').length) {
            var plyr_loopcount = parseInt($('#hero_image_responsive .slide_has_video').attr('data-plyr-index')) - 1;
            window.plyr_video_players[plyr_loopcount].on('ready', function (event) {
                if ($('#hero_image_responsive').is(':visible')) {
                    window.plyr_video_players[plyr_loopcount].play();
                }
            });
            if ($('#hero_image_responsive').is(':visible')) {
                window.plyr_video_players[plyr_loopcount].play();
            }
        }

        //this.slideshow_init = true;
        //console.log("slideshow init change to " + this.slideshow_init);
        //}
    },

    initialized: function (event, optionHash) {

    },

    after: function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {

    },

    video_content: function (instance) {

        // instances = {}
        // plyr_video_players = Plyr.setup('.slide_video', { 
        //     captions: { 
        //         active: true
        //     },
        //     muted: true,
        //     loop: { active: true },
        //     controls: [] //controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'] //['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
        // });

        //plyr_video_players = Array.from(document.querySelectorAll('.slide_video')).map(player => new Plyr(player));

        if ($('.slide_has_video', instance).length) {

            var plyr_array = [];

            $('.slide_has_video', instance).each(function () {
                slideshow.plyr_loopcount_global = parseInt(parseInt(slideshow.plyr_loopcount_global) + parseInt(1));

                $(this).attr('data-plyr-index', slideshow.plyr_loopcount_global);
                ////PLAYERS SETUP WAS PREVIOUSLY HERE... WHY?
                if ($(this).find('.slide_video')) {
                    $(this).find('.video_container').addClass('active');
                    plyr_array.push($(this).find('.slide_video')[0]);
                }

            }).promise().done(function () {

                window.plyr_video_players = Plyr.setup(plyr_array, {

                    // These seem to replace, not extend the config options supplied in the markup. TBC
                    captions: {
                        active: true
                    },
                    muted: true,
                    volume: 0,
                    autoplay: false,
                    clickToPlay: false,
                    hideControls: false,
                    controls: []
                    // ratio: '1:1'
                });
            });
        }

        // Click event for video play/pause button
        $('#slideshow .video_pause_button, #hero_header .video_pause_button').each(function () {
            $(this).off("click.videoPauseButton");
            $(this).on("click.videoPauseButton", function () {
                if ($(".pause_symbol", this).hasClass('paused')) {
                    var current_status = 'playing';
                    $(".pause_symbol", this).removeClass("paused");
                } else {
                    var current_status = 'paused';
                    $(".pause_symbol", this).addClass("paused");
                }
                if ($(this).closest('#slideshow').length) {
                    var selector = '#slideshow .fullscreen_slideshow_video video';
                    var selector_active = '#slideshow .fullscreen_slideshow_video video';
                } else {
                    var selector = '#mirror-slideshow .slide_has_video video';
                    var selector_active = '#mirror-slideshow .slide_has_video.cycle-slide-active video';
                }
                var active_video = $(selector);
                if (active_video.length) {
                    if (current_status == 'playing') {
                        console.log('play');
                        console.log($(selector_active));
                        $(selector_active).each(function () {
                            console.log('each');
                            $(this).get(0).play();
                        });
                    } else {
                        $(selector).each(function () {
                            $(this).addClass('paused');
                            $(this).get(0).pause();
                        });
                    }
                } else {
                    console.log('Cant find active video');
                }
            });
        });
    },


    video_content_embed_scale: function (instance) {

        //Simulate object fit for the video inside the iframe, based on the ratio of the video inside

        $(instance).find('.slide_has_video').each(function () {

            var slideindex = parseInt($(this).attr('data-plyr-index')) - 1;
            var embed_wrapper_height = $(this).find('.plyr__video-embed').closest('.video_container').height();
            var embed_wrapper_width = $(this).find('.plyr__video-embed').closest('.video_container').width();
            var embed_wrapper_portrait_landscape = ((embed_wrapper_height >= embed_wrapper_width) ? 'portrait' : 'landscape');
            if (typeof plyr_video_players[slideindex].config.ratio != 'undefined' && plyr_video_players[slideindex].config.ratio) {
                var embed_ratio = plyr_video_players[slideindex].config.ratio;
            } else {
                var embed_ratio = '16:9'
            }
            var ratio_split = embed_ratio.split(':');

            if (ratio_split.length == 2) {

                var embed_portrait_landscape = ((parseInt(ratio_split[1]) >= parseInt(ratio_split[0])) ? 'portrait' : 'landscape');
                var embed_width_to_height_scale = ratio_split[1] / ratio_split[0];

                if (embed_wrapper_portrait_landscape == 'portrait' && embed_portrait_landscape == 'landscape' || embed_wrapper_portrait_landscape == 'landscape' && embed_portrait_landscape == 'landscape') {

                    // Work out the height of the inner embed based on the aspect ratio
                    var embed_video_height = embed_width_to_height_scale * embed_wrapper_width;

                    if (embed_video_height <= embed_wrapper_height) {
                        var height_difference_scale = embed_wrapper_height / embed_video_height;
                        $(this).find('.plyr__video-embed').css('transform', 'scale(' + height_difference_scale + ')');
                        $(this).find('.plyr__video-embed').css('width', 'auto');
                    } else {
                        $(this).find('.plyr__video-embed').css('transform', 'scale(1.0)');
                        $(this).find('.plyr__video-embed').css('width', '100%');
                    }

                }
            }

        });
    },

    homepage_slideshow: {

        init: function () {
            //console.log("homepage slideshow init");
            if ($('#content #slideshow.fullscreen_slideshow').length) {
                var header_size = ($('#header:not(.header_transparent)').is(':visible') ? $('#header').outerHeight() : 0);
                if (!$('.parallax-mirror #slideshow').length && header_size > 0) {

                    $(window).on("load", function () {
                        // If the header height has changed after the page 'load' event, update the main_content padding again
                        // e.g. the height may change after webfonts have properly loaded
                        var header_size = $('#header').outerHeight();
                        if (parseInt($('#slideshow.fullscreen_slideshow').css('top')) > header_size) {
                            $('#slideshow.fullscreen_slideshow').css('top', header_size);
                            window.galleries.slideshow.homepage_slideshow.process();
                        }
                    });
                }
                $('body').addClass('type-fullscreen');
                window.galleries.slideshow.homepage_slideshow.process();
                $(window).resize(function () {
                    window.galleries.slideshow.homepage_slideshow.process();
                });

                if ($('#content #slideshow.fullscreen_slideshow').hasClass('fullscreen_video') && !$('#slideshow .fullscreen_slideshow_video').hasClass('initialized')) {
                    $('#slideshow .fullscreen_slideshow_video').addClass('initialized');
                    var isMobile = window.galleries.device.handheld();
                    if (!isMobile) {
                        var videobackground_muted = false
                        if ($('#slideshow .fullscreen_slideshow_video').attr('data-muted') == "True") {
                            videobackground_muted = true
                        }
                        var videobackground;
                        Artlogic.import('plugins/backgroundVideo.js').then(function (m) {
                            videobackground = $.backgroundVideo($('#slideshow .fullscreen_slideshow_video'), {
                                "align": "centerX",
                                "width": 1920,
                                "height": 1080,
                                "path": "",
                                "filename": $('#slideshow .fullscreen_slideshow_video').attr('data-video'),
                                "container": "#slideshow .fullscreen_slideshow_video",
                                "muted": videobackground_muted
                                //"types": ["mp4","webm"]
                            });
                        })

                        if (!videobackground_muted) {
                            // Only unmute video if an interaction has already taken place with the page - this is because certain browsers block video sound if no interactions have taken place
                            // If auto-unmute is not possible, unmute on click
                            $('#slideshow .fullscreen_slideshow_video video').click(function () {
                                $('#slideshow .fullscreen_slideshow_video video')[0].muted = false;
                            });
                        }
                        if ($.browser.safari) {
                            if ($('#video_background').length) {
                                $('#video_background').get(0).play();
                            }
                        }
                    }
                }
            }

            if ($('#content #slideshow.split_slideshow').length) {
                $('body').addClass('type-split-slideshow');
                header_size = ($('#header:not(.header_transparent)').is(':visible') ? $('#header').outerHeight() : 0);
                if (!$('.parallax-mirror #slideshow').length && header_size > 0) {

                    $(window).on("load", function () {
                        // If the header height has changed after the page 'load' event, update the main_content padding again
                        // e.g. the height may change after webfonts have properly loaded
                        var header_size = $('#header').outerHeight();
                        if (parseInt($('#slideshow.split_slideshow').css('top')) > header_size) {
                            $('#slideshow.split_slideshow').css('top', header_size);
                            window.galleries.slideshow.homepage_slideshow.process();
                        }
                    });
                }
                
                window.galleries.slideshow.homepage_slideshow.process();
                $(window).resize(function () {
                    // Do not process the homepage slideshow if the page is being scaled within the feature panel editor
                    if (!$('body').hasClass('scale_for_feature_panel_sort')) {
                        window.galleries.slideshow.homepage_slideshow.process();
                    }
                });

            }
        },

        process: function () {
            if ($('#slideshow.fullscreen_slideshow').length) {
                var cms_toolbar_height = 0;
                if ($('body').hasClass('cms-frontend-toolbar-active') && $('#cms-frontend-toolbar-container').length) {
                    cms_toolbar_height = $('#cms-frontend-toolbar-container').outerHeight();
                }
                // var header_offset = ($('#header').is(':visible') ? $('#header').outerHeight() : 0);
                // if ($('#header').css('position') == 'fixed' || $('#header').css('position') == 'absolute') {
                //     var header_offset = 0;
                // }
                var slideshow_offset_top = parseInt($('#content #slideshow.fullscreen_slideshow').offset().top);
                var slideshow_height = $(window).height() - ($('#header').is(':visible') ? slideshow_offset_top : 0);
                var header_height = $('.header-fixed-wrapper').height();
                $('#content #slideshow.fullscreen_slideshow').height(slideshow_height);
                // debugger;
                $('#main_content').css('padding-top', $('#content #slideshow.fullscreen_slideshow').outerHeight(true) + (slideshow_offset_top - cms_toolbar_height) - header_height);
                if (!window.galleries.device.handheld()) {
                    $('.fullscreen_slideshow_parallax').each(function () {
                        //$(this).parallax({imageSrc: $(this).attr('data-image-src')});
                    });
                }
            }

            if ($('#slideshow.split_slideshow').length) {
                cms_toolbar_height = 0;
                if ($('body').hasClass('cms-frontend-toolbar-active') && $('#cms-frontend-toolbar-container').length) {
                    cms_toolbar_height = $('#cms-frontend-toolbar-container').outerHeight();
                }
                // var header_offset = ($('#header').is(':visible') ? $('#header').outerHeight() : 0);
                // if ($('#header').css('position') == 'fixed' || $('#header').css('position') == 'absolute') {
                //     var header_offset = 0;
                // }
                slideshow_offset_top = parseInt($('#content #slideshow.split_slideshow').offset().top);
                slideshow_height = $(window).height() - ($('#header').is(':visible') ? slideshow_offset_top : 0);
                header_height = $('.header-fixed-wrapper').height();
                $('#content #slideshow.split_slideshow').height(slideshow_height);
                // debugger;
                $('#main_content').css('padding-top', $('#content #slideshow.split_slideshow').outerHeight(true) + (slideshow_offset_top - cms_toolbar_height) - header_height);
                if (!window.galleries.device.handheld()) {
                    // $('.fullscreen_slideshow_parallax').each(function() {
                    //     //$(this).parallax({imageSrc: $(this).attr('data-image-src')});
                    // });
                }
            }

        }

    }

}

window.galleries = window.galleries || {};
window.galleries.slideshow = slideshow;
export default slideshow;
