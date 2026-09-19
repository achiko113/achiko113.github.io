var artwork_filters = {
    
    init: function() {
        
        Artlogic.import('galleries_js/pageload_load_more_pagination.js');
        
        window.galleries.artwork_filters.checked_items();
        window.galleries.artwork_filters.clear_filters();
        window.galleries.artwork_filters.range_slider();
        window.galleries.artwork_filters.responsive_filter_btn();
        // Responsive show/hide filter menu handler
        $('.artwork-filter-responsive-btn').off('click.filters').on('click.filters', function(e){
            $('#artwork-filter-panel').toggleClass('show')
        });
        
        // Individual filter item click handler
        if ($('.filters_panel').hasClass('filters_enable_autosubmit')) {
            $('#filterpanel_form input').off('change.filters').not('[type="text"]').not(".fp-ignore-autosubmit").on('change.filters', function(e){
                window.galleries.artwork_filters.checked_items();
                window.galleries.artwork_filters.processUniqueOptionCheckbox($(this));
                if ($('#filterpanel_form').data('artworks_api_enabled') === true) {
                    window.galleries.artwork_filters.load_works_api();
                } else {
                    window.galleries.artwork_filters.load_works();
                }
            });
        } else {
            // bind the unique option processor for non autosubmit, non dropdown selections
            // fixes issue with users being able to select multiple sort options
            // in the case where 'panel above grid' or 'sidebar panel' is used and 'show submit button' is enabled
            $('#filterpanel_form input').off('change.filters').not('[type="text"]').not(".fp-ignore-autosubmit").on('change.filters', function(e) {
                window.galleries.artwork_filters.processUniqueOptionCheckbox($(this));
            })
        }
        
        $('#filterpanel_form .fp-button-submit, #filterpanel_form .fp-keyword-submit').off('click.filters').on('click.filters', function() {
            window.galleries.artwork_filters.checked_items();
            window.galleries.artwork_filters.processUniqueOptionCheckbox($(this));
            $('body').addClass('artwork-filters-active');
            if ($('#filterpanel_form').data('artworks_api_enabled') === true) {
                window.galleries.artwork_filters.load_works_api();
            } else {
                window.galleries.artwork_filters.load_works();
            }
            return false;
        });
        
        $('#filterpanel_form input[type="text"]').off('keypress.filters')
            .on('keypress.filters', function(event) {
                if (event.which == 13) {
                    event.preventDefault();
                    $('#filterpanel_form .fp-button-submit').trigger('click');
                    return false;
                }
            })
        ;
        
        $('#filterpanel_form label').on('click', function(e) {
            // Prevents a bug where the checkbox click event was triggered twice.
            e.stopPropagation();
        });
        
        // /**
        //  * OPEN/CLOSE THE FILTER LIST CONTAINER
        //  */
        var isTouch = false;
        $('.fp-module').on('touchstart', function(e) {
            isTouch = true;
        }).on('mouseover', function(e) {
            if (!isTouch) {
                $('.fp-module').removeClass('visible');
                $(this).addClass('visible');
            }
        }).on('mouseout', function(e) {
            if (!isTouch) {
                $(this).removeClass('visible');
            }
        }).on('click', function(e) {
            if (isTouch && $(this).hasClass('visible') && !$(e.target).hasClass('fp-textfield')) {
                $(this).removeClass('visible');
            }
        });
        $('.fp-legend').on('click', function(e){
            
            if(!$(this).closest('.fp-module').hasClass('visible')){
                // Prevent the window handler from being triggered.
                e.stopPropagation();
                // Hide any already open panels
                $('.fp-module').removeClass('visible');
                // Show the list attached to the clicked heading
                $(this).closest('.fp-module').toggleClass('visible');
              
                // Clicking anywhere else on the page will close the opened group
                $(window).one('click', function(e){
                    if (!$(e.target).hasClass('fp-textfield')) {
                        $('.fp-module').removeClass('visible');
                    }
                });
            } else {
                // No need to do anything as the click listener on window will remove the visible class.
                return;
            }
        });
        
        if (typeof window.site != 'undefined') {
            if (typeof window.site.filter_ui != 'undefined') {
                window.site.filter_ui();
            }
        }

        window.galleries.artwork_filters.after_setup_callback();
    },

    after_setup_callback: function() {
                
    },
    
    checked_items: function(){
        
        $('#filterpanel_form input[type="text"]')
            .each(function() {
                if ($(this).val() != '') {
                    $(this).closest('.fp-module').addClass('active');
                } else {
                    $(this).closest('.fp-module').removeClass('active');
                }
            })
        ;
        $('#filterpanel_form .fp-module').each(function(){
            if ($(this).find('input[type="checkbox"]').length) {
                var checked_count = $(this).find('input[type="checkbox"]:checked').length;
                if(checked_count > 0) {
                    $(this).addClass('active');
                    $(this).find('.group-count').html('('+ String(checked_count) + ')');
                } else {
                    $(this).removeClass('active');
                    $(this).find('.group-count').html('');
                }
            }
        });
        
    },          
    
    range_slider: function() {
        
        $('.multi-range-slider').not('.initialised').each(function() {
            
            var $this = $(this);
            
            $this.addClass('initialised');
            
            var html5Slider = $this[0];
            
            //Slider absolute max and min
            var slider_min = parseFloat($this.attr('data-min'));
            var slider_max = parseFloat($this.attr('data-max'));
            
            //Set the absolute max and min as default handle start positions
            var start_min = slider_min;
            var start_max = slider_max;
            
            //If we are suppying start positions on load, use these instead
            var received_starting_values = false;
            if ($this.attr('data-start-min') && typeof $this.attr('data-start-min') != 'undefined') {
                start_min = parseFloat($this.attr('data-start-min'));
                received_starting_values = true;
            }
            if ($this.attr('data-start-max') && typeof $this.attr('data-start-max') != 'undefined') {
                start_max = parseFloat($this.attr('data-start-max'));
                received_starting_values = true;
            }
            
            //Create the start variable
            var start = [start_min, start_max];
            
            // //Define the form inputs that the slider values get placed into
            var $min_input = $this.closest('.multi-range-slider-wrap').find('.slider_min');
            var $max_input = $this.closest('.multi-range-slider-wrap').find('.slider_max');
            
            if ($min_input.val() == '') {
                $min_input.attr('disabled',true);
            }
            if ($max_input.val() == '') {
                $max_input.attr('disabled',true);
            }
            
            //default range without steps.. probably best suited to dimensions
            var range = {
                'min': slider_min,  
                'max': slider_max
            }
            var step = 1;
            //default range without steps.. probably best suited to dimensions
            if ($this.hasClass('multi-range-price')){
                var step = 100;
                /* 
                    CREATE DYNAMIC RANGES BASED ON MAX VALUE
                */
                var rounded_slider_max = Math.ceil(slider_max/100000)*100000; // Round up the max value to the nearest 100,000
                var rules = [0, 500, 5000, 10000, 50000, 100000, 300000, 500000, 750000, 1000000]; // list of predefined steps. These need to match the obect keys in rule_dict
                var rule_dict = {
                    0       : [0, 100],
                    500     : [500, 500],
                    5000    : [5000, 1000],
                    10000   : [10000, 10000],
                    50000   : [50000, 10000],
                    100000  : [100000, 10000],
                    300000  : [300000, 50000],
                    500000  : [500000, 30000],
                    750000  : [750000, 40000],
                    1000000 : [1000000, 50000]
                }
                
                var rules_target;
                for (var i = 0; i < rules.length; i++) {
                    // Loop through the rules array until we find the one with a key greater than the price max.
                    if(rules[i] >= rounded_slider_max) {
                        // store the index of the key so we can use only the items in the rules dict upto and including that index...
                        rules_target = i;
                        break;
                    }
                }
                
                // The range object we'll pass to NoUI
                var dynamic_range = {};
                
                if(rules_target){
                    // Just the items from rules dict that we need...
                    var rules_slice = rules.slice(0, rules_target+1);
                    
                    // Calculate the percentage 'steps' we're going to use 
                    var dynamic_steps = Math.round(100 / rules_slice.length);
                    
                    // dynamic_range.min = []
                    for (var i = 0; i < rules_slice.length; i++) {
                        if(i == 0) {
                            dynamic_range.min = rule_dict[rules_slice[i]];
                        } else if(i == rules_slice.length-1) {
                            dynamic_range.max = rule_dict[rules_slice[i]];
                        } else {
                            dynamic_range[dynamic_steps * i + '%'] = rule_dict[rules_slice[i]];
                            
                        }
                    }
                    
                    if(!received_starting_values){
                        start = [start_min, dynamic_range.max[0]];
                    }
                }
            
                var range = {
                    'min': [0,100],  //Minimum value, step size
                    '10%': [500,500], // So, above 500, jump in steps of 500
                    '40%': [5000,1000],  // Above5000, jump in steps of 1000  etc etc                 		
                    '50%': [10000,10000],
                    '80%': [300000,50000],
                    'max': [Math.ceil(slider_max/100000)*100000,50000]  //round up to the nearest 100000
                }
            }

            Artlogic.import('plugins/nouislider.js')
                .then(function() {
                    //Create the slider
                    noUiSlider.create(html5Slider, {
                        start: start,
                        step: step,
                        connect: true,
                        range: dynamic_range || range
                    });
                    
                    var format = 'dimensions';
                    //Listener. Places the slider values into the inputs
                    
                    
                    
                    html5Slider.noUiSlider.on('update', function( values, handle, format ) {
                    
                        var value = values[handle];
                        var target = $(this)[0].target;
                        var target_parents = $(target).parents('.fp-module-content');
                        
                        var min_label = parseInt(values[0]);
                        var max_label = parseInt(values[1]);
                        
                        target_parents.find('.slider_label .min').text(min_label);
                        target_parents.find('.slider_label .max').text(max_label);
                        
                    });
                    
                    html5Slider.noUiSlider.on('change', function( values, handle, format ) {
                    
                        var value = values[handle];
                        var target = $(this)[0].target;
                        var target_parents = $(target).parents('.fp-module-content');
                        
                        var min_label = parseInt(values[0]);
                        var max_label = parseInt(values[1]);
                        
                        target_parents.find('.slider_label .min').text(min_label);
                        target_parents.find('.slider_label .max').text(max_label);
                        
                        var value = values[handle];
                        
                        if ( handle ) {
                         
                            // $max_input.attr('disabled',false);
                            $max_input[0].value = value.replace('.00', '')
                            // $min_input.trigger('change'); //DC Unsure why these are here and are triggering multiple ajax calls
                            
                            if (Math.round(slider_min) == Math.round(value) && Math.round(slider_max) == Math.round(value)) {
                                $min_input.attr('disabled',true);
                                $max_input.attr('disabled',true);
                            } else {
                                $min_input.removeAttr('disabled');
                                $max_input.removeAttr('disabled');
                            }
                            
                           $max_input.trigger('change.filters');
                           
                        } else {
                        
                            // $min_input.attr('disabled',false);
                            $min_input[0].value = value.replace('.00', '');
                            // $min_input.trigger('change'); //DC Unsure why these are here and are triggering multiple ajax calls
                            
                            if (Math.round(slider_min) == Math.round(value) && Math.round(slider_max) == Math.round(value)) {
                                $min_input.attr('disabled',true);
                                $max_input.attr('disabled',true);
                            } else {
                                $min_input.removeAttr('disabled');
                                $max_input.removeAttr('disabled');
                            }
                            
                            $min_input.trigger('change.filters');
                        }
                        
                        if (window.ga || window.gtag) {
                            var filter_value = false;
                            if (handle == 0) {
                                filter_value = $min_input.val();
                                $min_input.trigger('change');
                            } else if (handle == 1) {
                                filter_value = $max_input.val();
                                $max_input.trigger('change');
                            }

                            if (filter_value) {
                                var filter_key = $(target_parents).closest('.fp-module').find('.fp-legend button').text().replace(/^\s+|\s+$/g, '');

                                if (window.ga) {
                                    var analyticsdata = {
                                        'hitType': 'event',
                                        'eventCategory': 'Artwork Filters',
                                        'eventAction': filter_key + ': ' + filter_value,
                                        'eventLabel': ''
                                    };
                                    ga('send', analyticsdata);
                                }

                                if (window.gtag) {
                                    gtag('event', 'artwork_filters', {
                                        'filter_key': filter_key,
                                        'filter_value': filter_value,
                                    });
                                }
                            }
                        }                        
                    });

                    $(html5Slider.noUiSlider.target).find('.noUi-handle').each(function () {
                        
                        var $handle = $(this);
                        
                        $handle.on('keydown', function (e) {
                        
                            var values = html5Slider.noUiSlider.get();
                            
                            var value_index = 1;
                            
                            if ($handle.hasClass('noUi-handle-lower')) {
                                value_index = 0;
                            }

                            if (e.which === 37) {
                                values[value_index] = String(parseFloat(values[value_index]) - 10);
                                html5Slider.noUiSlider.set(values);
                            }
                        
                            if (e.which === 39) {
                                values[value_index] = String(parseFloat(values[value_index]) + 10);
                                html5Slider.noUiSlider.set(values);
                            }
                        });
                                                
                    });
                })
                .catch(function(){ console.log('Could not load nouislider.js') })
            ;
            
            
        
        });

    },
    
    processUniqueOptionCheckbox: function(instance) {
        if (instance && instance.length) {
            if (instance.closest('.unique-option-parent').length) {
                instance.closest('.unique-option-parent').find('input').not(instance).prop('checked', false);
            }
        }
    },
    
    processRangeCheckbox: function(){
        /**
         * This function requires: data-min and data-max to be set on the checkbox input and 2 hidden inputs, .range_min and .range_max to be added as children of .range_parent. The hidden inputs need to be disabled by default.
         * For all the selected checkboxes find the data-min and data-max values(which should be set on the input element). 
         * Assign the min/max values to relevant array selectedMins/selectedMaxs and then use the ARRAY.sort() func to order them in ascending order.
         * Set the min value as the FIRST item in the sorted selectedMins array. Set the max value as the LAST item in the selectedMaxs array.
         * Assign these to the hidden inputs so they are passed when the form is serialized/submitted.
         */
        $('.range-parent').each(function(){
            var selectedRanges = $(this).find('input:checked');
            
            if(!selectedRanges.length){ 
                $(this).find('.range_min, .range_max').attr('disabled', true); // Disable the min and max fields so the empty values aren't sent when the form is submitted.
                return; // Don't bother to process if there aren't any checked checkboxes
            } 
            
            // Remove the disabled attribute for the min and max inputs as a checkbox is selected
            $(this).find('.range_min, .range_max').removeAttr('disabled');
            
            var parent = $(this).closest('.range-parent');
            var selectedMins = [];
            var selectedMaxs = [];
            for (var i = 0; i < selectedRanges.length; i++) {
                selectedMins.push(parseInt( ($(selectedRanges[i]).data('min') || 0) ));
                selectedMaxs.push(parseInt( ($(selectedRanges[i]).data('max') || 100000000) ));
            }
            // Order the min and max arrays in ascending order
            var selectedMinsSorted = selectedMins.sort(function(a,b){return a-b}); // By default the sort is alphabetical, the weird callback function forces it to sort numerically.
            var selectedMaxsSorted = selectedMaxs.sort(function(a,b){return a-b}); // By default the sort is alphabetical, the weird callback function forces it to sort numerically.
            
            var minValue = selectedMinsSorted[0];
            var maxValue = selectedMaxsSorted[selectedMaxsSorted.length - 1]; // the last item
            
            // Update the hidden inputs with the corresponding values
            $(this).find('.range_min').val(minValue).trigger('change');
            $(this).find('.range_max').val(maxValue).trigger('change');
        });  
    },
    
    load_works: function($filterPanelForm) {
        /**
         * Serializes and submits the form.
         * The result will be loaded into the inner_content_selector element.
         */
        if(typeof $filterPanelForm == 'undefined') {
            $filterPanelForm = $('#filterpanel_form');
        }
        
        var pathToSubmitForm = $filterPanelForm.attr('data-action') && typeof $filterPanelForm.attr('data-action') != 'undefined' ? $filterPanelForm.attr('data-action') : $filterPanelForm.attr('action');
        if (pathToSubmitForm){
            window.galleries.artwork_filters.processRangeCheckbox();
            window.galleries.artwork_filters.processUniqueOptionCheckbox();
            
            var serializedArray = $filterPanelForm.serializeArray();
            var serializedObject = serializedArray.reduce(function(obj, param) {
                if (!obj[param.name]) {
                    obj[param.name] = param.value;
                } else {
                    obj[param.name] = obj[param.name] + ',' + param.value;
                }
                return obj;
            }, {});
            var serializedForm = '';
            Object.keys(serializedObject).forEach(function(k) {
                if (serializedObject[k]) {
                    serializedForm += (serializedForm.length ? '&' : '') + k + '=' + serializedObject[k];
                }
            });
            // var serializedForm = $filterPanelForm.serialize();
            var keyword = $('input.fp-textfield').attr('name');
            if (keyword && keyword.length) {
                // Remove empty '&keyword=' parameter from the query string.
                serializedForm = serializedForm.replace(new RegExp('(&?' + keyword + '=)(&|$)', 'g'), "$2");
                serializedForm = serializedForm.replace(/^&?/, "");
                serializedForm = serializedForm.replace(/&?$/, "");;
            }

            if(serializedForm.length){
                var updated_url = pathToSubmitForm + '?' + serializedForm;
            } else {
                var updated_url = pathToSubmitForm
            }

        }   
        
        if ($('.filter_results').length && !$('.filter_results_no_results').length) {
            var incoming_content_type = 'inner';
            var pushstate = false;
        } else {
            var incoming_content_type = 'standard';
            var pushstate = true;
        }
        
        $.pageload.load(updated_url, pushstate, function(new_page_inner_content, element_href, new_page_main_content) {
                        
            if (new_page_inner_content) {
                $('.filter_results')
                    .addClass('filter_transition')
                    .delay(400)
                    .queue(function() {

                        history.replaceState({'ajaxPageLoad': true}, null, updated_url);
                        
                        var full_html = $(new_page_main_content);
                        var results_html = full_html.find('.filter_results').html();
                        var pagestats_id = full_html.find('.filter_results').attr('data-pagestats-id');
                        var page_stats = full_html.find('.filter_results_pagination').html();
                        
                        $('.filter_results').html(results_html).attr('data-pagestats-id', pagestats_id);
                        // we remove initialised & scatter-list-initialised classes to allow for the grid to get setup again
                        $('.filter_results').removeClass('filter_transition initialised scatter-list-initialised');
                        
                        $('.filter_results_pagination').remove();
                        if (page_stats && typeof page_stats != 'undefined') {
                            $('.filter_results').after('<div class="filter_results_pagination"></div>');
                            $('.filter_results_pagination').append(page_stats);
                        }
                        
                        window.galleries.responsive.records_lists();
                        window.galleries.pageload_load_more_pagination.init();
                        if (window.cart && typeof window.cart != 'undefined') {
                            window.cart.init();
                        }
                        
                        window.galleries.misc.init();
                        window.galleries.responsive.tile_list_append_refresh($('.filter_results'));
                        window.galleries.layout.inview.init();
                        
                        $(window).trigger('scroll');
                        $(window).trigger('resize');
                        
                        $.pageload.refresh();
                        
                        $(this).dequeue();
                    })
                ;
            }
        }, null, null, null, incoming_content_type);

    },

    load_works_api: function(url) {
        /**
         * Serializes and submits the form.
         * The result will be loaded into the inner_content_selector element.
         */
            
        $('body').addClass('ajax-loading loader-active ajax-initial-loading');
            
        var $filterPanelForm = $('#filterpanel_form');

        var pathToSubmitForm = $filterPanelForm.attr('data-action') && typeof $filterPanelForm.attr('data-action') != 'undefined' ? $filterPanelForm.attr('data-action') : $filterPanelForm.attr('action');
        if (pathToSubmitForm && url == undefined){
            window.galleries.artwork_filters.processRangeCheckbox();
            window.galleries.artwork_filters.processUniqueOptionCheckbox();

            var serializedForm = $filterPanelForm.serialize();
            var keyword = $('input.fp-textfield').attr('name');
            if (keyword && keyword.length) {
                // Remove empty '&keyword=' parameter from the query string.
                serializedForm = serializedForm.replace(new RegExp('(&?' + keyword + '=)(&|$)', 'g'), "$2");
                serializedForm = serializedForm.replace(/^&?/, "");
                serializedForm = serializedForm.replace(/&?$/, "");
            }

            var queryString = '';

            if(serializedForm.length){
                var updated_url = pathToSubmitForm + '?' + serializedForm;
                // Update the query string in the url bar so the selection of
                // filters can be shared as a link.
                queryString = '?' + serializedForm;
                $('#artworks_filter_panel').data('query_string', serializedForm);
            } else {
                var updated_url = pathToSubmitForm
            }

            // if (queryString != window.location.search) {
            //     window.history.pushState(
            //         "object or string",
            //         window.title,
            //         window.location.pathname + queryString
            //     );
            // }
            
            if (queryString && queryString != '') {
                $('#filterpanel_form').addClass('forced-hash-change');
                window.location.hash = queryString.replace('?', 'filters=');
                $('body').addClass('artwork-filters-active');
            }
        } else {
            var updated_url = url;
        }

        if (window.archimedes.proxy_dir && typeof window.archimedes.proxy_dir !='undefined' && updated_url.indexOf('lang=') == -1) {
            var lang_code = window.archimedes.proxy_dir.replace('/', '');
            updated_url = updated_url.indexOf('?') > -1 ? updated_url + '&lang=' + lang_code : updated_url + '?lang=' + lang_code;
        }

        $.get(updated_url, function(html) {
            if (html) {
                $('.filter_results')
                    .addClass('filter_transition')
                    .delay(400)
                    .queue(function() {
                        $('#artworks_grid_ajax').removeClass('loader_simple');
                        $('.filter_results').html(html);
                        $('.filter_results').removeClass('filter_transition');
                        
                        if ($('.filter_results .list_no_results_message').length > 0) {
                            $('.filter_results').addClass('filter_results_no_results_found');
                        } else {
                            $('.filter_results').removeClass('filter_results_no_results_found');
                        }

                        window.galleries.responsive.records_lists();
                        window.galleries.pageload_load_more_pagination.init();
                        if (window.cart && typeof window.cart != 'undefined') {
                            window.cart.init();
                        }

                        window.galleries.misc.init();
                        window.galleries.responsive.tile_list_append_refresh($('.filter_results'));
                        window.galleries.layout.inview.init();
                        window.galleries.contact_form_popup.init();
                        $(window).trigger('scroll');
                        $(window).trigger('resize');

                        $('.filter_results').find('.filter_results_pagination')
                                            .find('a.ps_link')
                                            .click(function(event) {
                            event.preventDefault();
                            var url = $(this).attr('href');
                            $(this).attr('href', '#');

                            window.galleries.artwork_filters.checked_items();
                            window.galleries.artwork_filters.processUniqueOptionCheckbox();
                            window.galleries.artwork_filters.load_works_api(url);
                        });

                        window.galleries.artwork_filters.load_works_api_after_callback();
                        $.pageload.refresh('#artworks_grid_ajax');
                        
                    
                        //Quick method to check if scrollup is needed - probably improve this later
                        var header_height = ($('.header-fixed-wrapper').length ? $('.header-fixed-wrapper').height() : 0);
                
                        
                        if (!$filterPanelForm.hasClass('disable-autoscroll')) {
                            var buffer = 100;
                            
                            var top_of_results = $(".filter_results").offset().top;
                            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight() - buffer;
                            var top_of_screen = $(window).scrollTop() - buffer;
                            
                            if ((top_of_screen > top_of_results)){ 
                                $("html, body").animate({scrollTop: top_of_results - header_height - 60}, 500, function() {
                                    $('#artworks_grid_ajax').focus();
                                });
                            } else if (top_of_results > bottom_of_screen){ 
                                $("html, body").animate({scrollTop: top_of_results - header_height - 60}, 500, function() {
                                    $('#artworks_grid_ajax').focus();
                                });
                            }
                        }

                        $('body').removeClass('ajax-loading loader-active ajax-initial-loading');
                        
                        $(this).dequeue();
                    })
                ;
            }
        });

        if (window.gtag) {
            gtag('event', 'artwork_filters', {
                'updated_url': updated_url,
            });
        }

        if (window.ga) {
            // Track the click in Analytics
            ga('send', {
                'hitType': 'event',
                'eventCategory': 'Artwork filters',
                'eventAction': updated_url,
                'eventLabel': $(document).attr('title')
            });
            // Track the click in second Analytics account
            ga('tracker2.send', {
                'hitType': 'event',
                'eventCategory': 'Artwork filters',
                'eventAction': updated_url,
                'eventLabel': $(document).attr('title')
            });
            ga('artlogic_tracker.send', {
                'hitType': 'event',
                'eventCategory': 'Artwork filters',
                'eventAction': updated_url,
                'eventLabel': $(document).attr('title')
            });
        }
    },

    load_works_api_after_callback: function() {

    },

    clear_filters: function(){
        
        $('.clear_filters').on('click', function(e){
            e.preventDefault();
            $('#filterpanel_form input[type="checkbox"]').not('.fp-ignore-autosubmit').prop('checked', false);
            $('#filterpanel_form input[type="hidden"]').val('');
            $('#filterpanel_form input[type="text"]').val('');
            $('#filterpanel_form .multi-range-slider').each(function() {
                $(this)[0].noUiSlider.set([$(this).attr('data-min'), $(this).attr('data-max')]);
            });
            $('#filterpanel_form').find('.group-count').html('');
            if (window.location.hash.startsWith('#filters=')) {
                window.location.hash = '#filters=';
            }
            if ($('#filterpanel_form').data('artworks_api_enabled') === true) {
                window.galleries.artwork_filters.load_works_api();
            } else {
                window.galleries.artwork_filters.load_works();
            }
            $('body').removeClass('artwork-filters-active');
            return false;
        });
        
    },
    
    responsive_filter_btn: function() {
        
        $('.artwork-filter-open-btn').on('click', function() {
            console.log('open responsive');
            if($('#filterpanel_form').hasClass('open')){
                $('#filterpanel_form').removeClass('open');
                $('#filterpanel_form').attr('style','')
            } else {
                $('#filterpanel_form').addClass('open');
                window.galleries.helpers.animate_height($('#filterpanel_form'));
            }
        });
        
    }
    
};

window.galleries = window.galleries || {};
window.galleries.artwork_filters = artwork_filters;
export default artwork_filters;