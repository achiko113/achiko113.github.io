import pageload_plugin from '../plugins/pageload.js'
import layout from './layout.js';
import image_gallery from './image_gallery.js';
import image_popup from './image_popup.js';
import responsive from './responsive.js';
import misc from './misc.js';
import artworks from './artworks.js';
import contact_form_popup from './contact_form_popup.js';
import sharing from './sharing.js';

async function asyncCall() {
    try {
        var global_analytics = await Artlogic.import('galleries_js/global_a.js');
        window.galleries.global_analytics.track_popup();

    } catch (e) {
        console.warn(e);
    }
}


import mailinglist_signup_form_popup from './mailinglist_signup_form_popup.js';
import cycle from '../plugins/jquery.cycle2.min.js';
import ar_artworks from './ar_artworks.js';

var pageload = {

    init: function() {
        if ($('body').hasClass('pageload-splash-active') || $('body').hasClass('pageload-ajax-navigation-active')) {

            var site_name = '';
            //if ($('meta[property="og:site_name"]').length) {
            //    if ($('meta[property="og:site_name"]').attr('content') && typeof $('meta[property="og:site_name"]').attr('content') != 'undefined') {
            //        var site_name = $('meta[property="og:site_name"]').attr('content');
            //    }
            //}
            var ajax_navigation_active = $('body').hasClass('pageload-ajax-navigation-active');
            //if (site_name != 'London Original Print Fair') {
            //    var ajax_navigation_active = false;
            //}

            $.pageload({
                'splash_screen_enabled': $('body').hasClass('pageload-splash-active'),
                'splash_screen_always_enabled': ($('body').hasClass('pageload-ajax-navigation-active') && $('body').hasClass('pageload-splash-active') ? true : false),
                
                //'development_mode': true,
                //'development_mode_pause_splash_screen': true,

                'disable_ajax_param' : true,
                'popup_content_enabled': true,
                'popup_content_force_open': true,
                'body_classes_to_retain': '',
                'page_scroll_history': true,
                'ajax_navigation_enabled': $('body').hasClass('pageload-ajax-navigation-active'), 
                'splash_screen_primary_preload_images_selector': '#home_splash .content',
                'splash_screen_secondary_preload_images_selector': '#home_splash #home_splash_image_container',
                'splash_screen_click_to_close': $('body').hasClass('pageload-splash-pause') ? true : false,
                'content_area_selector': '#container',
                'preload_images_selector': '#slideshow li img, .parallax-image .parallax-image-inner .image, .feature_list .image, .header, #sidebar .image, .sidebar .image, #detail-slideshow .image, .svg, .fullscreen_slideshow .image',
                'splash_screen_delay_after_complete': (typeof $('#home_splash').attr('data-timeout') != 'undefined' ? $('#home_splash').attr('data-timeout') : 1500),
                'destroy_after_load': function() {
                    if (typeof $(window).parallax != 'undefined') {
                        $(window).parallax.destroy();
                    }
                    $('.parallax-mirror, #protected_path_login').remove();
                    
                    $('#slideshow ul, #mirror-slideshow ul, #ig_slideshow_thumbnails, #ig_slideshow, .image_gallery_multiple, #artist_list_slideshow ul, #list_preview_slideshow, #cover_page_slideshow ul').cycle('destroy');
                        
                    $('video').remove();
                    
                    window.galleries.layout.inview.destroy();
                    
                    if ($('body').hasClass('page-popup-active')) {
                        // A popup is open, close it
                        $.pageload.popup_close(true);
                    }
                    if (typeof fullpage_api != 'undefined') {
                        fullpage_api.destroy('all');
                    }
                    
                    window.galleries.pageload.destroy_after_load_callback();
                },
                'popup_after': function(original_click_element) {
                    $('#popup_content').scrollTop(0);
                    
                    $('#container').removeClass('scrolling-down scrolling-up');
                    if (typeof window.cart != 'undefined') {
                        window.cart.init();
                        // This should only be done if you are already interacting with the cart
                        window.cart.cart_summary.get_summary(false);
                    }
                            
                    if (h.element_exists('.image_gallery_multiple') && h.element_exists('#secondary_image_thumbnails')) {
                        window.galleries.image_gallery.standard();
                    }
                    if ($('#image_gallery.image_gallery_no_caption').length > 0) {
                        $('#popup_box').addClass('image_gallery_no_caption');
                    } else {
                        $('#popup_box').removeClass('image_gallery_no_caption');
                    }
                    
                    if (!$('#popup_container .records_list.tile_list .tile_list_formatted').length) {
                        window.galleries.responsive.tile_list_setup($('#popup_container'));
                    }
                    
                    if (!$('#popup_container .records_list.flow_list .flow_list_formatted').length) {
                        window.galleries.responsive.flow_list_setup($('#popup_container'));
                    }
                    
                    if ($('#popup_container .extended_click_area').length > 0) {
                        window.galleries.misc.extended_click_area();
                    }
                    
                    if ($("#popup_content").fitVids) {
                        $("#popup_content").fitVids({ ignore: '.video_inline'});
                    }
                    
                    if($('#popup_content #map_basic').length > 0) { 
                        $('#popup_content #map_basic').attr("id","map_basic_popup");
                        window.galleries.google_maps.init();
                    }
                    
                    
                    // Trigger AR quick look mode on hidden link
                    $('.view-in-ar').click(function() {
                        $(".ar-quick-look-wrapper a").get(0).click();
                    });
                    
                    $(window).resize(function() {
                        if ($('#popup_content #image_gallery.image_gallery_no_caption #image_container_wrapper').length) {
                            var screen_height = $(window).height();
                            $('#popup_content #image_gallery.image_gallery_no_caption #image_container_wrapper').css('min-height', screen_height);
                        }
                    });
                    
                    window.modules.sharing.init(true);
                    window.galleries.artworks.init();
                    window.galleries.contact_form_popup.init();
                    window.galleries.image_popup.init();
                    window.galleries.misc.loaders();
                    window.galleries.pageload.popup_after_callback();
                    
                    window.galleries.ar_artworks.init();
                    
                    if ($('.convelio-widget-button').length) {
                        Artlogic.import('galleries_js/shipping_widget.js')
                        .then(function(){
                            window.galleries.shipping_widget.init();
                        })
                        .catch(function(e){ console.error('Could not load shipping widget') });
                    }
                    // window.galleries.shipping_widget.init();

                    //window.galleries.global_analytics.track_popup();
                    asyncCall();
                    
                    $.pageload.refresh('#popup_box');
                    
                    $(window).trigger('resize');
                    
                    window.galleries.layout.inview.init(); // must come after resize!
                    
                    Artlogic.import('plugins/inview.js')
                    .then(function(inview){
                        if (typeof $.fn.lazyload.fire === "function") { 
                            $.fn.lazyload.fire($('#popup_content .lazyload_wrapper'));
                        }
                    })
                    
                    
                    if (typeof window.dynamicAR == "function") {
                        window.dynamicAR();
                    }

                    window.archimedes.archimedes_core.rewrite_proxy_dir_urls();

                },
                'popup_after_close': function() {
                    $('body').removeClass('popup-hidable-content user-distraction-free');
                    $('body').removeClass('content-reversed content-not-reversed');
                    $('.image_gallery_multiple').cycle('destroy');
                    
                    if (typeof fullpage_api != 'undefined') {
                        fullpage_api.destroy('all');
                    }

                    if (window.galleries.artworks.favourites !== undefined
                            && window.galleries.artworks.favourites.init !== undefined) {
                        window.galleries.artworks.favourites.init();
                    }
                    
                    // remove keyboard pagination listener
                    $(window).off('keydown.popup_pagination');

                    window.galleries.pageload.popup_after_close_callback();
                    
                },
                'before_load': function () {
                    $(document).off('mouseover.exitintent');
                    $(document).off('mouseout.exitintent');
                    if (typeof exit_intent_timeout != 'undefined') {
                        clearTimeout(exit_intent_timeout);
                    }
                    $('body.slide-nav-open').removeClass('slide-nav-open');
                    
                    $('#responsive_slide_nav_wrapper .navigation ul li.item-visible').removeClass('item-visible');
                    // remove instances of AR slider
                    if ($('#popup_slider_container').length) {
                        $('#popup_slider_container').ar_slider_destroy();
                    }
                    // remove instances of AR links
                    if ($('#view-in-ar-link').length) {
                        $('#view-in-ar-link').ar_slider_destroy();
                    }
                    // Close any open fancybox overlays
                    if (typeof $.fancybox == 'function' && $('body').hasClass('fancybox-lock')) {
                        $.fancybox.close();
                    }
                    window.galleries.pageload.before_load_callback();

                    return Promise.resolve().then(() => {
                        $('body').removeClass('slide-nav-active');
                    });
                },
                'after_load_complete': function() {
                    $('.jsSubmit').css('display','block');
                    $('.nojsSubmit').css('display','none');
                    
                    if ($('.formRow.form_row.captchaFormRow').length) {
                        location.reload(true);
                    }

                    window.galleries.pageload.after_load_complete_callback();

                    window.galleries.pageload.language();
                    return Promise.resolve().then(() => {
                        if ($('.hero_section.parallax-element').length){
                            $(window).trigger('resize');
                        } 
                    });
                },
                'on_page_transition': function() {
                    window.galleries.pageload.on_page_transition_callback();
                    return Promise.resolve().then(() => {
                        $('body').removeClass('type-fullscreen layout-hero-header');
                    });
                },
                'splash_screen_out': function() {
                    window.galleries.mailinglist_signup_form_popup.auto_popup();
                },
                'pageview': function() {
                    window.galleries.pageload.pageview_callback();
                }
                
            });
        }
    },
    
    pageview_callback: function() {
        
    },
    
    popup_after_callback: function() {
        
    },
    
    popup_after_callback: function() {
        
    },
    
    popup_after_close_callback: function() {
                
    },
    
    destroy_after_load_callback: function() {
        
    },
    
    before_load_callback: function() {
        
    },
    
    after_load_complete_callback: function() {

    },
    
    on_page_transition_callback: function() {
        
    },
    language: function () {
        const html_language = document.documentElement.lang
        const active_language = document.querySelector("#translations_nav ul li.active")?.getAttribute("data-language");
        if(active_language != html_language){
            document.documentElement.lang = active_language;
        }
    }

}

window.galleries = window.galleries || {};
window.galleries.pageload = pageload
export default pageload