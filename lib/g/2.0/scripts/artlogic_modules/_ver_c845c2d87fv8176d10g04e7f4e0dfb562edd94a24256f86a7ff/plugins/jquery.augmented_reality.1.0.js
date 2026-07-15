/**
 * Plugin based on template https://css-tricks.com/lodge/learn-jquery/28-building-complex-plugin/
 */

export default (function($) {
    $.ar_slider = function (el, options) {
        
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Find out the current browser
        if ($.browser.name) {
            var browserVersion = parseInt($.browser.version);
            var browserName = $.browser.name;
            if (browserVersion) {
                $('body').addClass('browser-' + browserName);
                $('body').addClass('browser-' + browserName + '-' + browserVersion);
            }
        };
        
        // Find out if device is handheld or desktop
        var handheld_ios = false
        var handheld_android = false
        var handheld_device = false
        
        base.handheld_ios_devices = function() {
            return (
                //Detect iPhone
                (navigator.platform.indexOf("iPhone") != -1) ||
                //Detect iPod
                (navigator.platform.indexOf("iPod") != -1) ||
                //Detect iPad
                (navigator.platform.indexOf("iPad") != -1) ||
                //Detect iPad ios 13+
                (navigator.platform.indexOf("MacIntel") != -1 && navigator.maxTouchPoints > 1)
            );
        };
        
        //Detect Android
        base.handheld_android_devices = function() {
            return (
                (navigator.userAgent.toLowerCase().indexOf("android") != -1)
            );
        };
        
        if (base.handheld_android_devices()) {
            handheld_android = true
            handheld_device = true
            $('body').addClass('handheld_android');
        } else if (base.handheld_ios_devices()) {
            handheld_ios = true
            handheld_device = true
            $('body').addClass('handheld_ios');
        };
        
        
        
        // Detect support for AR Quick Looks (ios only)
        var ios_ar_supported_device = false
        var test_anchor = document.createElement("a");
        
        if (typeof(test_anchor.relList) != 'undefined' && typeof(test_anchor.relList.supports("ar")) != 'undefined') {
            ios_ar_supported_device = true
            $('body').addClass('ar-supported');
        };

        // Detect support for AR on Android
        var android_ar_supported_device = false;
        if (handheld_android) {
            var testCanvas = document.createElement('canvas');
            var testGl = testCanvas.getContext('webgl2')

            if (testGl.getExtension('EXT_color_buffer_float')) {
                android_ar_supported_device = true;
            }
        }
        
        // Retrieve element AR_model_data
        var AR_model_data = base.$el.attr('data-ar_model');
        var AR_model_data_edit = AR_model_data.replace(/'/g, '"');
        var AR_model_data_parse = JSON.parse(AR_model_data_edit);
        
        var qrcode_for_artwork_page_on_mobile = AR_model_data_parse['qrcode_for_artwork_page_on_mobile']
        var AR_model_usdz_url = AR_model_data_parse['ar_model_usdz_url']
        var AR_model_gltf_url = AR_model_data_parse['ar_model_gltf_url']
        var AR_model_placement = AR_model_data_parse['ar_placement']
        
        base.init = function() {
            base.options = $.extend({}, $.ar_slider.defaultOptions, options);
            
            if (!$("#popup_slider_container.qr_code").length && handheld_device == false) {
                base.setup_qr_code_html();
                base.respond_to_qr_code_entry();
                // base.setup_slide_html();
            } else if (!$("#popup_slider_container").length && handheld_device == true) {
                if ((ios_ar_supported_device == true && handheld_ios) || (handheld_android && android_ar_supported_device)) {
                    // console.log("===passed ios and ios ar tests===")
                    try {
                        // Artlogic.import("galleries_js/model_viewer.js").then(() => {
                            const body = document.body;
                            const modelViewer = document.createElement('script'); 
                            modelViewer.type = 'module';
                            modelViewer.src = '/lib/g/2.0/scripts/artlogic_modules/galleries_js/model_viewer.js'; 
                            body.appendChild(modelViewer);
                            var ar_guidance_dismissed = base.get_local_storage_boolean();
                            if (ar_guidance_dismissed == false) {
                                base.setup_slide_html();
                            };
                            base.respond_to_qr_code_entry();
                        // });
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    // console.log("===failed ios and ios ar tests===")
                    base.respond_to_qr_code_entry();
                    $(base.$el).ar_slider_destroy();
                }
            };
            base.on_element_click();
            base.close_popup();
            base.set_button_loader();
        };
        
        // HTML INJECTION
        base.setup_slide_html = function() {
            
            var slide_html = ' <div id="popup_slider_container">\
                                    <div id="popup_slider_overlay"></div>\
                                    <div id="popup_slider_inner">\
                                    <div id="popup_slider_box" role="dialog" aria-modal="true" aria-label="AR popup slider" class="esc-key-listener-added focustrap-wrapper" data-popup-layer="1">\
                                    <div id="popup_slider_close_popup" class="close focustrap-focusable focustrap-item focustrap-first" role="button" tabindex="0" aria-label="Close" data-tabindex="0">\
                                        <a href="#" aria-hidden="true" tabindex="-1">Close</a>\
                                    </div>\
                                    <div id="popup_slider_slides">\
                                          <ul>\
                                            <li class="slide_1">\
                                                 <div class="content_wrapper">\
                                                    <ul>\
                                                        <li>\
                                                            <h2 class="popup_slider_main_header">AR viewer</h2>\
                                                         </li>\
                                                         <li>\
                                                            <h3 class="popup_slider_subtitle">Preview artworks in your own home.</h3>\
                                                        </li>\
                                                        <li>\
                                                             <div class="popup_slider_gif_container large ">\
                                                                <span class="ar-slide-gif main_image"></span>\
                                                             </div>\
                                                        </li>\
                                                        <li>\
                                                             <div class="popup_slider_description">\
                                                                <p>Opens your mobile device\'s built-in AR viewer. Results will depend greatly on the capabilities of your device.</p>\
                                                            </div>\
                                                        </li>\
                                                        <li class="popup_slider_buttons_container">\
                                                            <div class="button">\
                                                                 <a class="control_exit" role="button" href="#" tabindex="0"><span>Skip help and don\'t show again</span></a>\
                                                            </div>\
                                                             <div class="button">\
                                                                 <a class="control_next" role="button" href="#" tabindex="0">Next</a>\
                                                            </div>\
                                                        </li>\
                                                    </ul>\
                                                </div>\
                                            </li>\
                                            <li class="slide_2">\
                                                 <div class="content_wrapper">\
                                                     <ul>\
                                                         <li>\
                                                            <h2 class="popup_slider_main_header">Tips</h2>\
                                                         </li>\
                                                         <li>\
                                                            <div class="popup_slider_gif_container small">\
                                                                <span class="ar-slide-gif gif_animate light_bulb"></span>\
                                                            </div>\
                                                             <div class="popup_slider_description top">\
                                                                <p>Augmented reality works best in a <strong>well-lit</strong> room.</p>\
                                                            </div>\
                                                         </li>\
                                                         <li>\
                                                             <div class="popup_slider_gif_container large">\
                                                                <span class="ar-slide-gif gif_animate wall_template"></span>\
                                                            </div>\
                                                            <div class="popup_slider_description">\
                                                                <p>Use <strong>clear wall</strong>, with a view of where the wall meets the <strong>floor</strong>.</p>\
                                                            </div>\
                                                        </li>\
                                                        <li>\
                                                            <div class="popup_slider_gif_container large">\
                                                                <span class="ar-slide-gif gif_animate wall_scan"></span>\
                                                            </div>\
                                                            <div class="popup_slider_description bottom">\
                                                                <p>When asked to initially move your phone, <strong>scan the target wall and floor</strong>.</p>\
                                                            </div>\
                                                        </li>\
                                                        <li class="popup_slider_buttons_container">\
                                                            <div class="button">\
                                                                 <a class="control_open" role="button" tabindex="0"><span>Open AR Viewer</span></a>\
                                                            </div>\
                                                        </li>\
                                                    </ul>\
                                                </div>\
                                            </li>\
                                          </ul>\
                                    </div>\
                                    </div>\
                                    </div>\
                                </div>';
                                
            $('body').append(slide_html);               
        };
        
        base.setup_qr_code_html = function() {
            
            var qr_code_html = ' <div id="popup_slider_container" class="qr_code">\
                                    <div id="popup_slider_overlay"></div>\
                                    <div id="popup_slider_inner">\
                                    <div id="popup_slider_box" role="dialog" aria-modal="true" aria_label="QR code popup for viewing artworks in AR on a mobile device"  class="esc-key-listener-added focustrap-wrapper" data-popup-layer="1">\
                                    <div id="popup_slider_close_popup" class="close focustrap-focusable focustrap-item focustrap-first" role="button" tabindex="0" aria-label="Close" data-tabindex="0">\
                                        <a href="#" aria-hidden="true" tabindex="-1">Close</a>\
                                    </div>\
                                        <div class="qr_code_wrapper">\
                                            <div class="qr_code_image">\
                                                <span class="ar-qr_code-label">QR Code</span>\
                                                <span class="ar-qr_code-icon">\
                                                    <a class="nopopup" rel="ar">\
                                                        <img src="' + qrcode_for_artwork_page_on_mobile + '">\
                                                    </a>\
                                                </span>\
                                            </div>\
                                            <div class="qr_code_description">\
                                                <div class="description">\
                                                    Scan the QR code to open this work using your mobile device\'s built-in Augmented Reality (AR) viewer.\
                                                    <div class="note">\
                                                        This is only available on Android and iOS devices that support AR.\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    </div>\
                                </div>';
                                
            $('body').append(qr_code_html);          
        };
        
        base.inject_button_link_html = function() {
            
            if (!$('#view-in-ar-link').length && handheld_ios && ios_ar_supported_device) {
                if (AR_model_usdz_url && typeof(AR_model_usdz_url) != 'undefined') {
                    var button_link_html = '<div id="view-in-ar-link">\
                                                <a class="nopopup" rel="ar" href="' + AR_model_usdz_url + '">\
                                                    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">\
                                                </a>\
                                            </div>'
                    base.$el.before(button_link_html)          
                }
            }
        };

        base.inject_model_viewer_html = function() {
            if (!$('#ar-model-viewer-container').length && ((handheld_ios && ios_ar_supported_device) || (handheld_android && android_ar_supported_device))) {
                if ((handheld_ios && AR_model_usdz_url && typeof(AR_model_usdz_url) != 'undefined') || (handheld_android && AR_model_gltf_url && typeof(AR_model_gltf_url) != 'undefined')) {
                    // TODO Set ar-placement based on artwork settings
                    var model_viewer_html = '<div id="ar-model-viewer-container"><model-viewer id="ar-model-viewer" src="' + AR_model_gltf_url + '" ios-src="' + AR_model_usdz_url + '" ar ar-placement="' + AR_model_placement + '" ar-modes="scene-viewer quick-look"></model-viewer></div>'
                    base.$el.before(model_viewer_html) 
                }
            }
        };
        
        // Inject button-loader html
        base.set_button_loader = function () {
            $('.button a.control_open').each(function() {
                if (!$('.button_loader', this).length) {
                    $(this).append('<div class="button_loader"></div>');
                }
            });
            $('.button_loader').each(function() {
                if (!$('svg', this).length) {
                    $(this).append('<svg class="loader" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/></svg>');
                }
            });
        };
        
        // Click event for plugin element  
        base.on_element_click = function() {
            base.$el.off().click(function() {
                    if ($('li.slide_1').length) {
                        $('li.slide_1').css('display', 'block');
                    };
                    var ar_guidance_dismissed = base.get_local_storage_boolean();
                    
                    if (ar_guidance_dismissed == true) {
                        base.view_AR_model();
                    } else {
                        base.open_slides_popup();
                    };
            })
        };
        
        base.view_AR_model = function() {
            // if ($("#view-in-ar-link a").length) {
            //     $("#view-in-ar-link a").get(0).click();
            // };

            base.inject_model_viewer_html();

            var modelViewer = document.getElementById('ar-model-viewer');
            modelViewer.addEventListener('error', function (e) {
                console.error(e);
            });

            if (modelViewer.canActivateAR) {
                try {
                    modelViewer.activateAR();
                } catch (err) {
                    console.error(err);
                }
            } else {
                modelViewer.addEventListener('load', function (e) {
                    modelViewer.activateAR(); 
                });

                if (handheld_ios) {
                    modelViewer.addEventListener('error', function (e) {
                        console.log(e);
                        modelViewer.activateAR(); 
                    });
                }
            }
        };
        
        // QR code handling 
        base.respond_to_qr_code_entry = function() {
            if (window.location.hash) {
                if (window.location.hash == "#AR") {
                    if ((ios_ar_supported_device == true && handheld_ios)) {
                        setTimeout(function() {
                            base.view_AR_model();
                        }, base.options.splash_screen_timeout)
                    } else if (handheld_android && android_ar_supported_device) {
                        setTimeout(function () {
                            if (!$('#popup_slider_container').length) {
                                base.setup_slide_html();
                            }
                            base.open_slides_popup();
                        }, base.options.splash_screen_timeout)
                    } else {
                        setTimeout(function() {
                            h.prompt('<div class="ar_mobile_prompt">\
                                              <h3>Feature not supported on this device</h3>\
                                              <p>The Augmented Reality (AR) feature is currently only available on selected Android and iOS devices.</p>\
                                          </div>', {
                                buttons: {
                                    'Ok': true,
                                },
                            });
                        }, base.options.splash_screen_timeout)
                    }
                }
            }
        };

        base.open_qr_code_popup = function() {
            base.body.addClass('popup_slider_active');
            
            setTimeout(function() {
                base.body.addClass('popup_slider_visble');
                h.accessibility.on_popup_opening('#popup_slider_box', '#popup_slider_close_popup a', '#popup_slider_close_popup a');
            }, 50);
            
        };
        
        // Popup and slider actions
        base.open_slides_popup = function() {
            
            $('body').addClass('popup_slider_active');
            $('li.slide_2').css('display', 'none');
            
            setTimeout(function() {
                $('body').addClass('popup_slider_visble');
                $('li.slide_1 .popup_slider_main_header').focus();
                $('#popup_slider_slides ul li.slide_1 .content_wrapper').addClass('visible');
                //trap_element, first_focusable_element_override, close_button_element
                h.accessibility.on_popup_opening('#popup_slider_box', '#popup_slider_close_popup a', '#popup_slider_close_popup a');
            }, 50);
        
            
            $('.control_open').off().click(function() {
                $('#popup_slider_slides ul li.slide_2 .popup_slider_buttons_container .button').addClass('loading');
                
                setTimeout(function() {
                    $('#popup_slider_close_popup a').trigger('click');
                    $('#popup_slider_slides ul li.slide_2 .popup_slider_buttons_container .button').removeClass('loading');
                }, 3500);
                base.view_AR_model();
            });
            
            $('.control_exit').off().click(function() {
                base.set_local_storage_boolean();
                
                setTimeout(function() {
                    base.view_AR_model();
                    $('#popup_slider_container').ar_slider_destroy();
                },50)
            });
            
            $('.control_next').off().click(function () {
                base.next_slide();
            });
        };
        
        base.next_slide = function() {
            $('li.slide_2').css('display', 'block');
            $('li.slide_1').css('display', 'none');

            $('#popup_slider_slides ul li.slide_1 .content_wrapper').removeClass('visible');

            setTimeout(function() {
                $('#popup_slider_slides ul li.slide_2 .content_wrapper').addClass('visible');
                $('#popup_slider_close_popup').focus();
                $('#popup_slider_slides ul li.slide_2 .content_wrapper')
                    .delay(300)
                    .queue(function() {
                        $('#popup_slider_slides ul li .content_wrapper.visible ul li:first-child').addClass('animate_in');
                        $(this).dequeue();
                    })
                    .delay(500)
                    .queue(function() {
                        $('#popup_slider_slides ul li .content_wrapper.visible ul li:nth-child(2)').addClass('animate_in');
                        $(this).dequeue();
                    })
                    .delay(900)
                    .queue(function() {
                        $('#popup_slider_slides ul li .content_wrapper.visible ul li:nth-child(3)').addClass('animate_in');
                        $(this).dequeue();
                    })
                    .delay(1650)
                    .queue(function() {
                        $('#popup_slider_slides ul li .content_wrapper.visible ul li:nth-child(4)').addClass('animate_in');
                        $(this).dequeue();
                    })
                    .delay(250)
                    .queue(function() {
                        $('#popup_slider_slides ul li .content_wrapper.visible ul li:nth-child(5)').addClass('animate_in');
                        $(this).dequeue();
                    })
                ;
            }, 400);
        };
        
        base.exit_slider = function() {
            base.set_local_storage_boolean();
            base.view_AR_model();
        };

        base.close_popup = function() {
            
             $('#popup_slider_close_popup a').off().click(function() {
                 
                $('body').removeClass('popup_slider_visble');
                setTimeout(function() {
                    $('body').removeClass('popup_slider_active');
                    $('#popup_slider_slides ul li.slide_2 .content_wrapper').removeClass('visible');
                    $('#popup_slider_slides ul li .content_wrapper ul li.animate_in').each(function() {
                        $(this).removeClass('animate_in')
                    })
                }, 400);
                
                try {
                    h.accessibility.on_popup_closing();
                }
                catch(error) {
                    console.log(error);
                }
             })
        };

        // Local storage GET and SET
        base.set_local_storage_boolean = function() {
            var ar_guidance_dismissed = true;
            localStorage.setItem("ar_guidance_dismissed", JSON.stringify(ar_guidance_dismissed)); 
        };
        
        base.get_local_storage_boolean = function() {
            
            var browser_supports_local_storage = base.run_local_storage_test();
            
            if (browser_supports_local_storage == true) {
                var ar_guidance_dismissed = JSON.parse(localStorage.getItem("ar_guidance_dismissed"));
                
                if (ar_guidance_dismissed == true) {
                    return true
                } else {
                    return false
                }
            } else {
                console.log('local_storage not supported by browser')
            }
        };
        
        // Check browser supports local storage
        base.run_local_storage_test = function() {
            var test = 'test';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch(e) {
                return false;
            }
        };
        
        // Run initialise
        base.init();
    };
    
    // Destroy slider method
    $.ar_slider_destroy = function(el) {
        if ($(el).length) {
            $(el).each(function() {
                $(this).remove();
            })
        }
    };
    
    $.fn.ar_slider_destroy = function() {
        return this.each(function() {
            (new $.ar_slider_destroy(this))
        })
    };
    
    // Run plugin
    $.ar_slider.defaultOptions = {
        'splash_screen_timeout': 0
    };
    
    $.fn.ar_slider = function(options) {
        return this.each(function() {
            (new $.ar_slider(this, options))
        })
    };
    
})(jQuery);
