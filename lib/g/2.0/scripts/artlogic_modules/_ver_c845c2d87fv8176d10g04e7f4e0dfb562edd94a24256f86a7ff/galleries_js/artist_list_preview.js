import layout from './layout.js';
import device from './device.js';
import cycle from '../plugins/jquery.cycle2.min.js';

var artist_list_preview = {

    init: function() {
        if (h.element_exists('#list_preview_slideshow') && !$('#list_preview_slideshow').hasClass('no-slideshow')) {

            var selector = $("#list_preview_slideshow >").not('.cycle-sentinel');
            var random_slide_index = Math.floor(Math.random() * selector.length);
            


            if ($('#list_preview_slideshow').hasClass('content_follow')) {
                window.galleries.layout.content_follower('#list_preview_slideshow', '#sidebar');
            }

            var params = {
                fx:     'fade',
                speed:    400,
                timeout:  4500,
                pause:   0,
                before: function(cSlide, nSlide, options) {

                },
                after: function(cSlide, nSlide, options) {

                },
                slides: '>',
                startingSlide: parseInt(random_slide_index),
                autoHeight: 'calc'
            };
            
            // Accessibility - initiate slideshow in a paused state. Enabled by disable_artist_list_slideshow_autoplay gallery setting
            if ($('#list_preview_slideshow').length && $('#list_preview_slideshow').hasClass('start_paused')) {
                params.paused = true
            }
            
            //if($.browser.safari){
            //    params["loader"] = "wait";
            //}

            $('#list_preview_slideshow').cycle(params);
            
            $("#list_preview_slideshow .image[data-index='" + (parseInt(random_slide_index) + 1) + "']").each(function () {
                $(this).find("a").css({ display: "block" });
            })

            if (!window.galleries.device.handheld()) {
                $('#list_preview_navigation a').mouseover(function () {
                    
                    $("#list_preview_slideshow .image[data-index='" + $(this).data("index") + "']").each(function () {
                       $(this).find("a").css({ display: "block" });
                    });
                    
                    if ($('#list_preview_slideshow').is(':visible')) {
                        $('#list_preview_slideshow').cycle('pause');
                        $('#list_preview_slideshow').cycle(parseInt($(this).attr('data-index')) - 1);
                        return false;
                    }
                });
            }
            
            window.galleries.artist_list_preview.sidebar_height();
            
            $(window).resize(function(){
                window.galleries.artist_list_preview.sidebar_height();
            });
            
            if ($('.subsection-artist-list-preview.list-preview-fullbleed, .subsection-artist-list-preview.list-preview-random-position').length) {
                
                window.galleries.artist_list_preview.vertically_centre_artist_list.init();
            
                if ($('.subsection-artist-list-preview.list-preview-fullbleed').length) {   
                    $('body').addClass('type-fullscreen');
                }
                $('#list_preview_slideshow').each(function() {
                    $('.image', this).each(function() {
            
                            var image_src = $(this).find('img').attr('data-src') || $(this).find('img').attr('src');
                            if (image_src && typeof image_src != 'undefined') {
                                //DC - not sure, but this breaks the list sometimes, and seems to not be needed.
                                // if ($('.subsection-artist-list-preview.list-preview-random-position').length) {
                                //     //window.theme.list_preview_slideshow.shuffle_position(this);
                                // }
                                $('a', this).css({
                                    'background-image': 'url(' + image_src + ')'
                                });
                            }
        
                    });

                    if ($('.subsection-artist-list-preview.list-preview-random-position').length) {
                        $('#list_preview_slideshow').on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                            $(incomingSlideEl).each(function() {
                                window.galleries.artist_list_preview.shuffle_position(this);
                            });
                        });
                    }
                });
                $(window).resize(function() {
                    window.galleries.layout.push_to_fullheight('.subsection-artists-list', 'min-height',  0, 0);
                });

            }
            
        }
    },
    
    sidebar_height: function(){
        var img_height = 0;
        $( window ).on('load', function() {
            img_height = $("#sidebar .cycle-sentinel").height();
            $('#sidebar').height(img_height);
        });
    },
    
    shuffle_position: function(instance) {

        if (instance) {
            $(instance).each(function() {
                var pos_x = Math.floor(Math.random() * 100) + 1;
                var pos_y = Math.floor(Math.random() * 100) + 1;
                var offset_top_y = Math.floor(Math.random() * 100) + 1;
                var offset_bottom_y = Math.floor(Math.random() * 100) + 1;
                $('a', this).css({
                    'background-position': pos_x + '% ' + pos_y + '%',
                    'top': offset_top_y + 'px',
                    'bottom': offset_bottom_y + 'px'
                });
            });
        }
    },
    
    vertically_centre_artist_list: {

        init: function() {
            if ($('.x-subsection-artist-list-preview, .subsection-artist-list-standard').length) {
                $('body').addClass('list-type-vertical-align');
                $('.subsection-artist-list-preview, .subsection-artist-list-standard').each(function() {
                    $(this).closest('#content').addClass('vertical-align-middle');
                    window.galleries.artist_list_preview.vertically_centre_artist_list.push_to_fullheight();
                    $(window).resize(function() {
                        window.galleries.artist_list_preview.vertically_centre_artist_list.push_to_fullheight();
                    });
                });
            }
        },
        push_to_fullheight: function() {
            var content_module_offset = $('#content').offset().top;
            $('#content').css({'min-height':'calc(100vh - '+content_module_offset+'px)'});
        }
    },
    
}

window.galleries = window.galleries || {};
window.galleries.artist_list_preview = artist_list_preview;
export default artist_list_preview;