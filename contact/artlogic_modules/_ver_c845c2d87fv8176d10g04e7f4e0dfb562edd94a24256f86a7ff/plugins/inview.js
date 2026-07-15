/**
 * jQuery InView by Artlogic
 * jQuery LazyLoad by Artlogic
 *
 * Copyright 2018, Artlogic Media Ltd, http://www.artlogic.net/
 */

export default (function(){
    (function($) {

        $.fn.inview = function(user_options) {

            if (!this.length) {
                return
            }

            // Default options
            var default_elements = '.inview_element, .hide-off-screen, .inview_autoplay_video';
            var elements = this.add(default_elements);
            var selectors = default_elements + ', ' + this.selector;
            var options = {
                'elements': elements,
                'selectors': selectors,
                'lazyload': true,
                'lazyload_selector': '.image',
                'lazyload_quantity_to_load_in_advance': 0,
                'lazyload_loader_html': false,
                'rootMargin': '0px',
                'threshold': [0, 0.1, 0.3, 0.5, 0.7, 1]
            };

            // Extend options
            $.extend(options, user_options);
            $.fn.inview.options = options;

            // Setup aliases
            $.fn.inview.destroy = function() {
                $.fn.inview.functions.destroy();
            };
            $.fn.inview.refresh = function(element_context) {

            };

            // Plugin functions
            $.fn.inview.functions = {
                init: function() {
                    if ($.fn.inview.options.lazyload) {
                        $($.fn.inview.options.lazyload_selector).lazyload({
                            'loader_html': $.fn.inview.options.lazyload_loader_html
                        });
                    }

                    var elements = $.fn.inview.options.elements;

                    // SETUP THE OBSERVER
                    var artlogic_observer = new IntersectionObserver($.fn.inview.functions.callback, $.fn.inview.options);

                    // Watch the targets
                    $(elements).each(function() {
                        // UNBIND OBSERVERS IF THEY ARE ALREADY RUNNING
                        artlogic_observer.unobserve($(this).get(0));
                        // OBSERVE ELEMENTS
                        artlogic_observer.observe($(this).get(0));
                    });
                },

                callback: function(entries, observer, force) {
                    force = force && typeof force != 'undefined' ? force : false;

                    entries.forEach(function(entry) {

                        var $entry = !force ? $(entry.target) : $(entry);
                        var ratio_onscreen = entry.intersectionRatio;
                        var is_autoplay_video = false;
                        
                        if ($('body').hasClass('website-editor-mode') && $entry.hasClass('panel')) {
                            $entry.attr('data-ratio-onscreen', ratio_onscreen.toFixed(3));
                            $entry.trigger('change.inview');
                        }
                        if ($entry.hasClass('inview_autoplay_video')) {
                            is_autoplay_video = true;
                        }
                        
                        if ( ratio_onscreen < 0.05 && !force) {
                            if (entry.boundingClientRect.top >= 0){
                                //Scrolling down
                                $entry.addClass('animate-from-bottom').removeClass('animate-from-top');
                            } else {
                                //Scrolling up
                                $entry.addClass('animate-from-top').removeClass('animate-from-bottom');
                            }
                            $entry.removeClass('visible');
                            
                            if (is_autoplay_video && !$entry.hasClass('video-paused')) {
                                $entry.get(0).pause();
                                $entry.addClass('video-paused').removeClass('video-playing');
                            }
                            if ($.fn.inview.after_not_visible && typeof($.fn.inview.after_not_visible) === "function" && typeof($.fn.inview.after_visible) !== "undefined") {
                                $.fn.inview.after_not_visible($entry, entry);
                            }
                            
                        } else {
                            $entry.trigger('inview.visible');
                            $entry.addClass('visible');
                            if ($.fn.inview.options.lazyload) {
                                var lazy_load_context = $($.fn.inview.options.lazyload_selector);
                                var lazy_load_element = $entry.find($.fn.inview.options.lazyload_selector).not('.loaded, .loading');
                                var position_of_lazy_load_element = lazy_load_context.index($entry.find($.fn.inview.options.lazyload_selector));

                                var lazy_load_element_to_fire = lazy_load_element;

                                // Automatically load further elements in advance
                                if (position_of_lazy_load_element > 0 && $.fn.inview.options.lazyload_quantity_to_load_in_advance > 0) {
                                    var adjacent_lazy_load_elements = lazy_load_context.slice(position_of_lazy_load_element, position_of_lazy_load_element + $.fn.inview.options.lazyload_quantity_to_load_in_advance);
                                    lazy_load_element_to_fire = adjacent_lazy_load_elements;
                                }
                                if (lazy_load_element_to_fire.length) {
                                    $.fn.lazyload.fire(lazy_load_element_to_fire);
                                }
                            }
                            
                            if (is_autoplay_video && !$entry.hasClass('video-playing')) {
                                var playPromise = $entry.get(0).play();
                                
                                if (playPromise !== undefined) {
                                playPromise.then(function (_) {
                                    // Automatic playback started!
                                    // Show playing UI.
                                    $entry.addClass('video-autoplay-init');
                                    $entry.addClass('video-playing').removeClass('video-paused');
                                    
                                }).catch(function (error) {// Auto-play was prevented
                                    // Show paused UI.
                                    $entry.addClass('video-paused').removeClass('video-paused');
                                });
                                }
                            }
                            
                            if ($.fn.inview.after_visible && typeof($.fn.inview.after_visible) === "function" && typeof($.fn.inview.after_visible) !== "undefined") {
                                $.fn.inview.after_visible($entry, entry);
                            }
                            
                        }

                        ///// DEACTIVATE EXPENSIVE STUFF WHEN OUT OF SITE
                        if ($entry.hasClass('hide-off-screen')) {
                            if (entry.isIntersecting) {
                                $entry.removeClass('hidden-off-screen');
                            } else {
                                $entry.addClass('hidden-off-screen');
                            }
                        }

                    });
                },

                destroy: function() {
                    if (typeof artlogic_observer == 'undefined') {
                        var artlogic_observer = false;
                    }
                    if (artlogic_observer && typeof artlogic_observer != 'undefined') {
                        var elements = $.fn.inview.options.elements;
                        $(elements).each(function() {
                            // UNBIND OBSERVERS IF THEY ARE ALREADY RUNNING
                            artlogic_observer.unobserve($(this).get(0));
                        });
                    }
                },
            };

            // Initialise plugin
            $.fn.inview.functions.init();

        };


        $.fn.lazyload = function(user_options) {

            if (!this.length) {
                return
            }

            // Default options
            var elements = this;
            var options = {
                'elements': elements,
                'loader_html': false
            };

            // Extend options
            $.extend(options, user_options);
            $.fn.lazyload.options = options;

            // Setup aliases
            $.fn.lazyload.fire = function(element, callback) {
                $.fn.lazyload.functions.fire(element, callback);
            };

            // Plugin functions
            $.fn.lazyload.functions = {

                init: function() {
                    $($.fn.lazyload.options.elements).each(function() {
                        // Only process lazy load images if they do not already have a loading class
                        if (!$(this).hasClass('lazyload_initialized')) {
                            if ($(this).find('img').length && !$(this).hasClass('loading') && !$(this).hasClass('lazyload_initialized')) {
                                if ($.fn.lazyload.options.loader_html) {
                                    $(this).append($.fn.lazyload.options.loader_html);
                                }
                            }
                            $(this).addClass('lazyload_wrapper lazyload_initialized');

                            if ($(this).find('img[data-src]').length == 0) {
                                $(this).addClass('lazyload_invalid');
                            }

                            // Set the size of the image container as a placeholder for lazyload
                            if (!$(this).hasClass('loaded')) {
                                var item_width = $(this).width();
                                var item_height = $(this).height();
                                var image_width = $(this).attr('data-width');
                                var image_height = $(this).attr('data-height');
                                var image_width_proportional = 0;
                                var image_height_proportional = 0;
                                if ((image_width && typeof image_width != 'undefined') && (image_height && typeof image_height != 'undefined')) {
                                    image_width_proportional = item_width / image_width;
                                    var image_width_ratio = image_width / image_height;
                                    if ($(this).hasClass('lazyload_disable_min_height')) {
                                        // May want to disable setting the min height, for example if the element uses a pseudo element to set a min height.
                                        image_height_proportional = false;
                                    } else {
                                        image_height_proportional = image_height * image_width_proportional;
                                    }
                                    if (image_height_proportional && (image_height_proportional <= item_height)) {
                                        $(this).css('height', image_height_proportional);
                                    } else if (image_height_proportional && (image_height_proportional > item_height)) {
                                        if ($(this).closest('#image_container').length) {
                                            // Override for artwork detail
                                            $(this).css('height', image_height_proportional);
                                        } else {
                                            $(this).css('height', '100%');
                                        }
                                    }
                                    if (image_width == '400' && image_height == '400') {
                                        $(this).addClass('lazyload-fallback-dimensions');
                                    }
                                } else {
                                    $(this).addClass('lazyload-fallback-dimensions');
                                }
                            }
                        }
                    });
                    // Trigger parallax resize event as sometimes the parallax position is calculated
                    // before the heights are added to the image elements which causes it to be out of position
                    $(window).trigger('resize.px.parallax');
                },
                
                is_json: function(str){
                        try {
                            JSON.parse(str.replace(/'/g, '"'));
                        } catch (e) {
                            return false;
                        }
                        return true;
                    
                },

                fire: function(element, callback) {
                    var selector = element;
                    callback = typeof callback != 'undefined' ? callback : false;
                    
                    $(element).each(function() {
                        if (!$(this).hasClass('lazyload_invalid') && (!$(this).hasClass('loaded') || $(this).hasClass('loading'))) {
                            if ($(this).find('img[data-src]').length) {
                                
                                var element_height_before_load = $(element).height();

                                if ($(this).hasClass('lazy_use_img_width')) {
                                    var physical_image_width = $(this).find('img[data-src]').width();
                                } else {
                                    var physical_image_width = $(this).width();
                                }

                                $(this).addClass('loading');

                                $(this).find('img[data-src]').each(function() {

                                    var $img = $(this);

                                    if ($img.attr('data-responsive-src')) {

                                        if($.fn.lazyload.functions.is_json($img.data('responsive-src'))) {

                                            var scale = window.devicePixelRatio || 1;

                                            var load_image_width = physical_image_width * scale;

                                            // Work out the available image sizes
                                            var responsive_map = $img.data('responsive-src')
                                            // Parse object from h.image_tag and replace single quotes with double quotes.
                                            // Note that data attributes object from h.image_tag won't allow strings and objects to be concatanted hence need to replace quotes and parse
                                            var responsive_map_clean = JSON.parse(responsive_map.replace(/'/g, '"'));
                                            var responsive_size_array = Object.keys(responsive_map_clean);


                                            //Choose the appropriate the image url - at least target load_image_width else fall back to largest
                                            var process_closest = responsive_size_array.filter(function(item) {
                                                return item > load_image_width;
                                            });

                                            var closest = (typeof process_closest !== 'undefined' && process_closest.length) ? process_closest[0] : responsive_size_array[responsive_size_array.length - 1];

                                            // If responsive option, use it! Else fall back to the data-src

                                            var responsive_img_url = responsive_map_clean[closest.toString()].length ? responsive_map_clean[closest.toString()] : $img.attr('data-src');
                                            var image_src = responsive_img_url;
                                        }

                                    } else {
                                        image_src = $img.attr('data-src');
                                    }
                                
                                    $(this)
                                        .on('load', function() {
                                            $(element).trigger('change.lazyload');
                                            $(this).trigger('change.lazyload');
                                            if ($(element).hasClass('loading')) {
                                                $(this)
                                                    .delay(100)
                                                    .queue(function() {
                                                        $(element).removeClass('loading').addClass('loaded');
                                                        $(element).css('height', '');
                                                        $(this).dequeue();
                                                    })
                                                    .delay(500)
                                                    .queue(function() {
                                                        $(element).removeClass('loading-init');
                                                        $(element).find('.loader').remove();
                                                        var element_height_after_load = $(element).height();
                                                        // Trigger a resize if the loaded image size is larger or smaller than the image container to fix layout issues
                                                        // There is a 5px buffer in height change to prevent a reload if its only a tiny change which wouldn't effect the layout (also helps with rounding issues).
                                                        // This check + resize doesn't currently work on grids
                                                        if (element_height_after_load > (element_height_before_load + 5) || element_height_after_load < (element_height_before_load - 5)) {
                                                            $(window).trigger('resize');
                                                        }
                                                        //add a new class checking to disable reset height.
                                                        //if we don't disable it, the image will overlapped the title and descriptions in listing
                                                        if (!$(this).closest('.records_list').hasClass("grid_dynamic_disable_lazyload_height") &&
                                                            $(this).closest('.lazyload_wrapper').hasClass('lazyload-fallback-dimensions')) {
                                                            $(this).closest('.lazyload_wrapper').css('min-height', '0');
                                                        }

                                                        $(element).find('.hover-element').each(function(_key, value) {
                                                            var $hover_elem = $(value);
                                                            var src = $hover_elem.data('bg-src');
                                                            $('<img/>').attr('src', src).on('load', function () {
                                                                $(this).remove(); // prevent memory leaks
                                                                $hover_elem.css('background-image', 'url(' + src + ')');
                                                                $hover_elem.addClass('hover-loaded')
                                                            });
                                                        })
                                                        
                                                        if (callback) {
                                                            callback();
                                                        }
                                                        
                                                        $(element).trigger('change.lazyload-complete');
                                                        
                                                        $(this).dequeue();
                                                    })
                                                ;
                                            }
                                        })
                                        .each(function() {
                                            var instance = $(this);
                                            if(instance.complete) {
                                                $(instance).trigger('load');
                                            }
                                        })
                                    ;
    
                                    $(this).attr('src', image_src);
                                });
                            } else {
                                // Doesn't seem to be setup to be a lazy-load image, instantly add the loaded classnames
                                $(element).removeClass('loading').addClass('loaded');
                            }
                        }
                    });
                }

            };

            // Initialise plugin
            $.fn.lazyload.functions.init();

        };

    })(window.jQuery);
})();