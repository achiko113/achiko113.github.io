import fancybox from '../plugins/fancybox-2.1.3.js'

var image_popup = {

    init: function(custom_fancybox_options) {
        
        if( $('body.prevent_user_image_save').length > 0 ){
            $('.image_popup').not('.fancybox-filtered').each(function(i){
                var image_url = $('.image_popup').eq(i).attr('href');
                $('.image_popup').eq(i).attr('data-fancybox-href', image_url).attr('href', "#");
            });
        }
        var reset_hash_on_close = false;
        var popup_has_zoom_buttons = false;
        var original_page_hash, popup_has_zoom, has_been_clicked, big_image_link;
        

        var fancybox_options = {
            overlayShow: true,
            overlayOpacity: 0.7,
            overlayColor: '#d9d9d9',
            imageScale: 'true',
            zoomOpacity: 'true',
            // Fancybox 2.0 and above
            prevEffect: 'fade',
            nextEffect: 'fade',
            closeEffect: 'fade',
            openEffect: 'fade',
            padding: 40,
            helpers : {
                title: {
                    type: 'inside'
                }
            },
            beforeLoad:function(current, previous) {
                window.galleries.image_popup.beforeLoad(current, previous);

                // Modify the fancybox caption to the hidden .fancybox-caption element if it exists. 
                // The hidden element allows virtualurls to replace the href as the content is not encoded for use as an attribute.
                this.title = ($(this.element).parent().find('.fancybox-caption').html() || $(this.element).data('fancybox-title'));
                
                if (window.location.hash.indexOf('#/image_popup/') == -1) {
                    original_page_hash = window.location.hash;
                } else {
                    original_page_hash = false;
                }
            },
            afterLoad: function(current, previous) {
                popup_has_zoom = $(current.element).hasClass('image_popup_zoom');
                if (popup_has_zoom) {
                    big_image_link = current.element.attr('data-popup_zoom_image');
                }
                if (current.element.attr('data-fancybox-hash')) {
                    var image_popup_hash = '#/image_popup/' + current.element.attr('data-fancybox-hash') + '/';
                    location.replace(image_popup_hash);
                    reset_hash_on_close = true;
                }
                $('.fancybox-overlay').addClass('fancybox-overlay-image');
                window.galleries.image_popup.afterLoad(current, previous);
            },
            afterShow: function() {
                window.galleries.image_popup.afterShow();
                $('.zoomContainer').remove();
                if (popup_has_zoom) {
                    $('.fancybox-wrap').addClass('elevatezoom-enabled');
                    $('.fancybox-image').addClass('elevatezoom').attr( "data-zoom-image", big_image_link);
                    Artlogic.import('plugins/elevateZoom.js')
                    .then(function(elevateZoom) {
                        $(".elevatezoom").elevateZoom({
                            zoomType: "inner",
                            cursor: "default",
                            zoomWindowFadeIn: 200,
                            zoomWindowFadeOut: 200,
                            zoomWindowWidth: 0,
                            zoomWindowHeight: 0
                        });
                    })
                    
                }
                // Add accessibility role and aria attributes
                $('.fancybox-skin').attr({role: "dialog", "aria-label": "image popup", 'aria-modal': true});
                // Make the close link element act like a button
                $('.fancybox-skin a[title="Close"], .fancybox-skin a[title="Previous"], .fancybox-skin a[title="Next"]').attr("role", "button");
                h.accessibility.role_button();
                
                // add image alt tag
                var imgAlt = $(this.element).find("img").attr("alt");
                var dataAlt = $(this.element).data("alt");
                if (imgAlt) {
                    $(".fancybox-image").attr("alt", imgAlt);
                } else if (dataAlt) {
                    $(".fancybox-image").attr("alt", dataAlt);
                }
                
                // focus trap the popup
                var focus_element
                if (popup_has_zoom && $('.fancybox-skin button:first').length) {
                    focus_element = '.fancybox-skin button:first'
                } else {
                    focus_element = '.fancybox-skin a:first'
                }
                h.accessibility.on_popup_opening('.fancybox-skin', focus_element, false);
            },
            beforeClose: function() {
                window.galleries.image_popup.beforeClose();
                if ($('.powerzoom_image').length) {
                    if ($('.fancybox-image').powerzoom) {
                        $('.powerzoom_image').hide();
                        $('.powerzoom_image').powerzoom("destroy");
                    }
                }

                if (reset_hash_on_close == true) {
                    if(history.pushState) {
                        var original_page_state = ((original_page_hash.length) ? original_page_hash : ' ');
                        history.pushState(null, null, original_page_state);
                    } else {
                        original_page_state = ((original_page_hash.length) ? original_page_hash : '#/');
                        location.hash = original_page_state;
                    }
                }
                h.accessibility.on_popup_closing();
                
            },
            afterClose: function() {
                window.galleries.image_popup.afterClose();
                $('.zoomContainer').remove();
            }
        };

        // Filter out certain descendents
        var image_popup_elements = $('a.image_popup, a.fancybox').filter(function() {
            return !$(this).closest('.tile_list_formatted').length;
        });
        
        
        $(image_popup_elements).each(function() {
            $(this).addClass('fancybox-filtered');
        });

        if($("body").hasClass("page-publications")){
            $('#main_content .fancybox-filtered').fancybox(fancybox_options);
        }else{
            $('.fancybox-filtered').fancybox(fancybox_options);
        }
        
        $(image_popup_elements).click(function() {
            // For accessibility - tracks which element to refocus on
            try {
                h.accessibility.global_variables.element_to_refocus_to = $(this);
            } catch(error) {
                console.error(error);
            }
        });
        
        // Apply special rules to descendents of tile lists, so the images show in their original order
        $('.tile_list_formatted a.image_popup').click(function() {
                var this_href = $(this).attr('data-fancybox-href') && typeof $(this).attr('data-fancybox-href') != 'undefined' ? $(this).attr('data-fancybox-href') : $(this).attr('href');
                var related_element = $('.tile_list_original a.image_popup[href="' + this_href + '"], .tile_list_original a.image_popup[data-fancybox-href="' + this_href + '"]');
                if (related_element && typeof related_element != 'undefined') {
                related_element.trigger('click');
                return false;
                }
        });

        has_been_clicked = false;

        var fancybox_options_with_zoom = {
            overlayShow: true,
            overlayOpacity: 0.7,
            overlayColor: '#d9d9d9',
            imageScale: 'true',
            zoomOpacity: 'true',
            // Fancybox 2.0 and above
            prevEffect: 'fade',
            nextEffect: 'fade',
            closeEffect: 'fade',
            openEffect: 'fade',
            margin: 0,
            padding: 0,
            helpers : {
                title: {
                    type: 'inside'
                }
            },
            beforeLoad:function(current, previous) {
                window.galleries.image_popup.beforeLoad(current, previous);
                
            },
            afterLoad: function(current, previous) {
                popup_has_zoom = $(current.element).hasClass('image_popup_zoom');
                if (popup_has_zoom) {
                    big_image_link = current.element.attr('data-popup_zoom_image');
                }
                var popup_has_zoom_buttons = $(current.element).hasClass('image_popup_zoom_buttons');
                if (popup_has_zoom_buttons) {
                    $('body').addClass('fancybox-powerzoom');
                    if ((current.element.attr('href') && current.element.attr('href') != "#")){
                        var original_image_link = current.element.attr('href')
                    } else {
                        var original_image_link = current.element.attr('data-fancybox-href');
                    }
                    $('.fancybox-inner').text('');
                    $('.fancybox-inner').html('<div class="fancybox-image disabled"><span class="powerzoom-lowres" style="background-image:url(' + original_image_link +' );"><span class="powerzoom-lowres-upscale"></span></span></div>');
                    var big_image_link = current.element.attr('data-popup_zoom_image');

                    $('.fancybox-inner').append('<div class="powerzoom_controls loading powerzoom-initial"><div class="powerzoom_pan"><div class="zoom-button pz_n"><i class="fa fa-chevron-up"></i></div><div class="zoom-button pz_s"><i class="fa fa-chevron-down"></i></div><div class="zoom-button pz_e"><i class="fa fa-chevron-right"></i></div><div class="zoom-button pz_w"><i class="fa fa-chevron-left"></i></div></div><div class="powerzoom_loading_indicator zoom-button powerzoom_zoom"> <span class="loading-dots"><i class="fa fa-circle"></i><i class="fa fa-circle"></i><i class="fa fa-circle"></i></span></div> <button id="zoomOutButton" class="zoomOutButton zoom-button powerzoom_zoom" aria-label="Zoom out"><i class="fa fa-search-minus"></i></button><button id="zoomInButton" class="zoomInButton zoom-button powerzoom_zoom" aria-label="Zoom in"><i class="fa fa-search-plus"></i></button><button id="zoomResetButton" class="zoomResetButton zoom-button powerzoom_zoom" aria-label="Reset zoom"><i class="fa fa-repeat"></i></button></div>');
                    $('.fancybox-image').append('<img src="" class="powerzoom-highres powerzoom-min powerzoom-transition preloading"/>');

                    $('.powerzoom_controls .zoom-button, .powerzoom-lowres').click(function(event) {
                        if ($('.powerzoom_controls').hasClass('powerzoom-initial')) {
                            $('.powerzoom_controls').addClass('showloader');
                            var has_been_clicked = true;
                        }
                    });
                    $('img.powerzoom-highres').attr('src', big_image_link).on('load', function() {
                        $('.powerzoom_controls .zoom-button, .powerzoom-lowres').off('click');
                        var original_image_width = $('img.powerzoom-highres').width();
                        var original_image_height = $('img.powerzoom-highres').height();
                        $(this).addClass('loaded');
                        if ($(window).width() > 950) {
                            $('.powerzoom-lowres-upscale').css({'background-image': "url(" + big_image_link + ")"});
                            setTimeout(function(){
                                $('.powerzoom-lowres').css({'background-image': "none"});
                            },3000);
                        }
                        Artlogic.import('plugins/powerzoom.js').then(function(m){
                            window.galleries.image_popup.powerzoom(original_image_width,original_image_height);
                        });
                        // if (has_been_clicked) {
                        //     $('.powerzoom_controls #zoomInButton.zoom-button').trigger('click');
                        // }
                    });
                }
                window.galleries.image_popup.afterLoad(current, previous);
            },
            afterShow: function() {
                window.galleries.image_popup.afterShow();
                $('.zoomContainer').remove();
                if (popup_has_zoom) {
                    $('.fancybox-wrap').addClass('elevatezoom-enabled');
                    $('.fancybox-image').addClass('elevatezoom').attr( "data-zoom-image", big_image_link);
                    $(".elevatezoom").elevateZoom({
                        zoomType: "inner",
                        cursor: "default",
                        zoomWindowFadeIn: 200,
                        zoomWindowFadeOut: 200,
                        zoomWindowWidth: 1100,
                        zoomWindowHeight: 800
                    });
                }
                if (popup_has_zoom_buttons) {
                    $('body').addClass('fancybox-powerzoom');
                    $('.fancybox-image').css('line-height', $('.fancybox-inner').height() + 'px');
                    //window.galleries.image_popup.powerzoom();
                    var focus_element = '.fancybox-skin button:first'
                } else {
                    var focus_element = '.fancybox-skin a:first'
                }
                // add ARIA landmark
                $('.fancybox-overlay').attr({role: "dialog", "aria-label": "image popup", 'aria-modal': true});
                // Make the close link element act like a button
                $('.fancybox-skin a[title="Close"], .fancybox-skin a[title="Previous"], .fancybox-skin a[title="Next"]').attr("role", "button");
                h.accessibility.role_button();
                // add image alt tag
                var imgAlt = $(this.element).find("img").attr("alt");
                var dataAlt = $(this.element).data("alt");
                if (imgAlt && typeof imgAlt !== 'undefined') {
                    $("img.powerzoom-highres").attr("alt", imgAlt);
                } else if (dataAlt && typeof dataAlt !== 'undefined') {
                    $("img.powerzoom-highres").attr("alt", dataAlt);
                }
                // Class added to detect when fancybox is showing - this is to get around an issue where beforeClose gets called before fancybox opens
                $('body').addClass('fancybox-visible');
                // focus trap the popup
                h.accessibility.on_popup_opening('.fancybox-overlay', focus_element, '.fancybox-overlay .fancybox-close');
            },
            beforeClose: function() {
                window.galleries.image_popup.beforeClose();
                // Only call on_popup_closing when the popup is actually open. (beforeClose gets called before fancybox opens)
                if ($('body').hasClass('fancybox-visible')) {
                    h.accessibility.on_popup_closing();
                }
                $('body').removeClass('fancybox-visible');
            },
            afterClose: function() {
                window.galleries.image_popup.afterClose();
                $('.zoomContainer').remove();
                $('body').removeClass('fancybox-powerzoom');
                $('.powerzoom_controls').addClass('initial');
                $('.powerzoom-lowres').removeClass('hidden');
                $('.powerzoom-highres').addClass('preloading');
            }
        };

        if (custom_fancybox_options && typeof custom_fancybox_options !== 'undefined') {
            $.extend(fancybox_options, custom_fancybox_options)
        }

        //Additional fancybox settings, for powerzoom only
        fancybox_options_with_zoom['width'] = '100%';
        fancybox_options_with_zoom['height'] = '100%';
        fancybox_options_with_zoom['autoSize'] = false;
        fancybox_options_with_zoom['type'] = 'html';
        fancybox_options_with_zoom['content'] = '<div></div>';
        fancybox_options_with_zoom['closeClick'] = false;
        fancybox_options_with_zoom['arrows'] = false;
        fancybox_options_with_zoom['helpers'] = {overlay:{closeClick: false},title: null};

        $("a.image_popup_zoom_buttons").fancybox(fancybox_options_with_zoom);

            if (window.location.hash.indexOf('/image_popup/') == 1) {
                window.galleries.image_popup.detect_popup_hash();
            }
            

    },

    beforeLoad: function(current, previous) {
        //call this in main.js
    },
    afterLoad: function(current, previous) {
        //call this in main.js
    },
    afterShow: function() {
        //call this in main.js
    },
    beforeClose: function() {
        //call this in main.js
    },
    afterClose: function() {
        //call this in main.js
    },

    powerzoom: function (original_image_width, original_image_height) {

        $('.powerzoom_controls').addClass('loaded').removeClass('loading');
        var has_been_clicked;

        function get_framesize() {
            var window_width = $('.fancybox-inner').width();
            var window_height = $('.fancybox-inner').height();
            return {w: window_width, h: window_height};
        }

        function min_max_zoom() {

            var powerzoom = $('.powerzoom-highres').data('powerzoom');
            if (powerzoom.percent > 1.99){
                $('.powerzoom_controls').addClass('powerzoom-max');
            } else {
                $('.powerzoom_controls').removeClass('powerzoom-max');
            }
            if (powerzoom.percent == powerzoom.minPercent){
                $('.powerzoom_controls').addClass('powerzoom-min');
            } else {
                $('.powerzoom_controls').removeClass('powerzoom-min');
            }
        }

        $( window ).resize(function() {
            setTimeout(function(){
                var new_height = get_framesize().h
                var new_width = get_framesize().w
                $('.powerzoom-highres').powerzoom({width: new_width, height:new_height });
                $('.fancybox-image').css('line-height', new_height + 'px');
                var powerzoom = $('.powerzoom-highres').data('powerzoom');
            },600);
        });

        //CHECK FRAME SIZE TO RENDER ZOOM AREA
        var height = get_framesize().h
        var width = get_framesize().w


        //RENDER ZOOM AREA AT CORRECT SIZE
        $('.powerzoom-highres').powerzoom({
            zoom: 5,
            maxZoom: 2,
            zoomTouch: 40,
            maxZoomTouch:2,
            image_width: original_image_width,
            image_height: original_image_height,
            width: width,
            height: height,
            controls: '<span style="display:none;"></span>'
        });

        $(".powerzoom-highres").mousedown(function() {
            $(this).removeClass('powerzoom-transition');
            return false;
        });
        //SAVE ZOOM OBJECT AS VARIABLE, AND UPDATE ALL PARAMETERS
        var powerzoom = $('.powerzoom-highres').data('powerzoom');


        //LOAD HI-RES IF CLICK ON LOW-RES VERSION
        $('.powerzoom-lowres').click(function(event) {
            if ($('.powerzoom_controls').hasClass('powerzoom-initial')) {
                has_been_clicked = true;
                if ($('.powerzoom_controls').hasClass('loaded')){
                    window.setTimeout(function() {
                        $('.powerzoom_controls').removeClass('powerzoom-initial showloader');
                        $('.powerzoom-lowres').hide().addClass('hidden');
                        $('.powerzoom-highres').hide().removeClass('preloading').fadeIn();
                    }, 400);
                } else {
                    //show loader
                    $('.powerzoom_controls').addClass('showloader');
                }
                powerzoom.update();
            }
        });

        $('.powerzoom_controls .zoom-button').click(function(event) {

            $('.powerzoom-highres').addClass('powerzoom-transition');
            var powerzoom = $('.powerzoom-highres').data('powerzoom');
            var scrollValue = 300
            var curX = powerzoom.img_left
            var curY = powerzoom.img_top
            if ($(this).hasClass('zoomInButton') && $('.powerzoom_controls').hasClass('powerzoom-initial')) {
                has_been_clicked = true;
                if ($('.powerzoom_controls').hasClass('loaded')){
                    window.setTimeout(function() {
                        $('.powerzoom_controls').removeClass('powerzoom-initial showloader');
                        $('.powerzoom-lowres').hide().addClass('hidden');
                        $('.powerzoom-highres').hide().removeClass('preloading').fadeIn();
                    }, 400);
                } else {
                    //show loader
                    $('.powerzoom_controls').addClass('showloader');
                }
                powerzoom.update();
            } else if ($(this).hasClass('pz_w')){
                powerzoom.drag({startX: curX, startY: curY, dx: scrollValue, dy: 0});
            } else if ($(this).hasClass('pz_e')) {
                powerzoom.drag({startX: curX, startY: curY, dx: -scrollValue, dy: 0});
            } else if ($(this).hasClass('pz_n')) {
                powerzoom.drag({startX: curX, startY: curY, dx: 0, dy: scrollValue});
            } else if ($(this).hasClass('pz_s')) {
                powerzoom.drag({startX: curX, startY: curY , dx: 0, dy: -scrollValue});
            } else if ($(this).hasClass('zoomInButton')) {
                powerzoom.zoomIn();
            } else if ($(this).hasClass('zoomOutButton') && $('.powerzoom_controls').hasClass('powerzoom-min')) {
                if (!$('.powerzoom_controls').hasClass('powerzoom-initial')){
                    $('.powerzoom_controls').addClass('powerzoom-initial');
                    $('.powerzoom-highres').hide().addClass('hidden');
                    $('.powerzoom-lowres').hide().fadeIn().removeClass('hidden');
                }
            } else if ($(this).hasClass('zoomOutButton')) {
                powerzoom.zoomOut();
            } else if ($(this).hasClass('zoomResetButton') && $('.powerzoom_controls').hasClass('powerzoom-min')) {
                if (!$('.powerzoom_controls').hasClass('powerzoom-initial')){
                    $('.powerzoom_controls').addClass('powerzoom-initial');
                    $('.powerzoom-highres').hide().addClass('hidden');
                    $('.powerzoom-lowres').hide().fadeIn().removeClass('hidden');
                }
            } else if ($(this).hasClass('zoomResetButton')) {
                powerzoom.zoom(0);
            }

        });

        $('.powerzoom-highres').powerzoom().on('powerzoom', function (e, result) {
            min_max_zoom();
        });

        powerzoom.update();

    },

    detect_popup_hash: function() {
        //detect image_popup hash on load and
        //trigger click for relevant image popup
        var hash_segments = window.location.hash.split('/');
        if (hash_segments.length >= 3 && hash_segments[1] == 'image_popup'){
            $('a[data-fancybox-hash="' + hash_segments[2] + '"]').trigger('click');
        }

    }

}

window.galleries = window.galleries || {};
window.galleries.image_popup = image_popup
export default image_popup