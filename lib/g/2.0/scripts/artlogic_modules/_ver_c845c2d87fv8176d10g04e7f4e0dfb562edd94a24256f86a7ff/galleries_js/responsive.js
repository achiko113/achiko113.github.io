import layout from './layout.js';

var responsive = {

    init: function () {
        if ($('body').hasClass('site-responsive')) {
            window.galleries.responsive.navigation();
            window.galleries.responsive.records_lists();
        }
    },

    navigation: function () {

        if ($('body').hasClass('responsive-nav-slide-nav')) {

            if (!$('#responsive_slide_nav_wrapper').length) {
                $('#header .navigation').wrapAll('<div id="responsive_slide_nav_wrapper"></div>');
            }
            if (!$('#slide_nav_reveal').length) {
                $('<div id="slide_nav_reveal" tabindex="0" role="button">Menu</div>').appendTo('#header .inner');
            }

            if ($('#top_nav ul.topnav li').length == 0 && $('#topnav_translations ul li').length == 0 && $('#header.topnav_dropdown_header').length == 0) {
                $('#slide_nav_reveal').hide();
            }


            // CUSTOM TIMING
            var li_class_delay = 80;

            var custom_delay_attr = $('#responsive_slide_nav_wrapper').attr('data-nav-items-animation-delay');
            if (typeof custom_delay_attr !== typeof undefined && custom_delay_attr !== false) {
                if (custom_delay_attr) {
                    li_class_delay = parseInt(custom_delay_attr);
                }
            }

            $('#top_nav_reveal, #slide_nav_reveal').click(function (e) {

                e.preventDefault();

                // For accessibility - tracks which element to refocus on
                try {
                    h.accessibility.global_variables.element_to_refocus_to = $(this);
                } catch (error) {
                    console.error(error);
                }

                $('.has_dropdown_items_mobile.open').find("a").off('click.pageload');
                $('.has_dropdown_items_mobile.open').removeClass('open');

                if ($('body').hasClass('slide-nav-open')) {
                    $('body').removeClass('slide-nav-open');
                    setTimeout(function () {
                        $('body').removeClass('slide-nav-active');
                    }, 400);
                    $('#responsive_slide_nav_wrapper ul li, .header_social_links_mobile, #topnav_search').removeClass('item-visible');
                    // if the nav is closed allow fullpage.js vertical slideshow to scroll
                    if (typeof window.fullpage_api != 'undefined') {
                        window.fullpage_api.setAllowScrolling(true);
                    }
                    h.accessibility.on_popup_closing('#slide_nav_reveal');
                    // Accessibility - iOS fix - remove aria-hidden attributes once the mobile nav has been closed
                    $('#header .inner > *:not(.header-ui-wrapper)').attr('aria-hidden', 'false');
                    $('#slide_nav_reveal').attr('aria-hidden', 'false');
                    $('#main_content').attr('aria-hidden', 'false');
                    $('#footer').attr('aria-hidden', 'false');
                } else {
                    $('body').addClass('slide-nav-active');
                    setTimeout(function () {
                        $('body').addClass('slide-nav-open');
                    }, 10);
                    h.accessibility.on_popup_opening('#responsive_slide_nav_wrapper', '#top_nav .topnav a:first-of-type', '#top_nav_reveal');

                    // Accessibility - iOS fix - hide all other elements other than the nav menu from the screen reader
                    $('#header .inner > *:not(.header-ui-wrapper)').attr('aria-hidden', 'true');
                    $('#slide_nav_reveal').attr('aria-hidden', 'true');
                    $('#main_content').attr('aria-hidden', 'true');
                    $('#footer').attr('aria-hidden', 'true');

                    // if the nav is open don't allow fullpage.js vertical slideshow to scroll
                    if (typeof fullpage_api != 'undefined') {
                        window.fullpage_api.setAllowScrolling(false);
                    }

                    var delay = 0;
                    $('#responsive_slide_nav_wrapper ul li:not(.nested), .header_social_links_mobile, #topnav_search').each(function () {
                        var $li = $(this);
                        setTimeout(function () {
                            $li.addClass('item-visible');
                        }, delay += li_class_delay);
                    });
                }
            });

            // trigger above click function if the enter or space keys are pressed (for accessibility)
            $('#top_nav_reveal, #slide_nav_reveal').keydown(function (event) {
                var curElement = document.activeElement;
                if ($(this)[0] === curElement && (event.keyCode === 13 || event.keyCode === 32)) {
                    event.preventDefault();
                    $(this).click();
                }
            });

        } else {

            // Initialise the menu button

            $('#top_nav_reveal').click(function () {
                ///$('.parallax-mirror').animate({'margin-top': '300px'}, 300);
                if ($('.topnav').css('display') == 'none') {
                    $('.topnav, #translations_nav, #header_quick_search').slideDown();
                    $('#header').addClass('responsive-nav-open');
                } else {
                    $('.topnav, #translations_nav, #header_quick_search').slideUp(function () {
                        $(this).attr('style', '');
                    });
                    $('#header').removeClass('responsive-nav-open');
                }
                return false;
            });


        } // end of if

    },

    records_lists: function () {
        $('.records_list').not('.columns_list').not('.tile_list').not('.flow_list').not('.reading_list').not('.records_list_noprocess').each(function () {

            if ($('> ul', this).length) {
                // Remove extra ULs in lists, these are not responsive friendly
                if ($('> ul', this).length > 1) {
                    $('> ul', this).replaceWith(function () {
                        return $(this).html();
                    });
                    $(this).wrapInner('<ul></ul>');
                }

                // Remove whitespace between list items (removes space between inline-block elements)
                if ($('> ul > li', this).length > 1) {
                    $(this).html($(this).html().replace(/>\s+</g, '><'));
                    if (typeof window.cart != 'undefined') {
                        window.cart.add_to_cart($('.store_item .store_item_add_to_cart'));
                        window.cart.add_to_wishlist($('.add_to_wishlist'));
                        window.cart.remove_from_wishlist($('.wishlist_button .store_item_remove_from_wishlist'));
                    }
                }

                $(this).find('.records_list').each(function () {
                    // Run the same commands for any nested elements
                    if ($('> ul', this).length > 1) {
                        $('> ul', this).replaceWith(function () {
                            return $(this).html();
                        });
                        $(this).wrapInner('<ul></ul>');
                    }
                    if ($('> ul > li', this).length > 1) {
                        $(this).html($(this).html().replace(/>\s+</g, '><'));
                    }
                });

                if ($('body.site-lib-version-1-0').length || !$('body[class*="site-lib-version"]').length) {
                    $('> ul > li', this).each(function () {
                        $('.image', this).wrap('<span class="outer"></span>');
                        $('.image', this).wrap('<span class="image_wrapper"></span>');
                        $('.outer', this).prepend('<span class="fill"></span>');
                    });
                }
            }
        });

        $('.records_list.columns_list').each(function () {
            // Remove whitespace between list items (removes space between inline-block elements)
            $(this).html($(this).html().replace(/>\s+</g, '><'));
        });

        // Run the archimedes core init again, as removing spaces between elements will have removed any javascript events on the modified grid
        if (typeof window.archimedes != 'undefined') {
            window.archimedes.archimedes_core.process_links();
        }
        h.accessibility.init();

        $(".records_list ul").each(function () {
            var item_count = $(this).children('li').length;
            $(this).closest('.records_list').addClass('record-count-' + item_count);
        });

        window.galleries.responsive.tile_list_setup();
        window.galleries.responsive.flow_list_setup();
        window.galleries.responsive.grid_dynamic_layout();
        var resize_timeout;
        var last_window_width = $(window).width();


        $(window).resize(function () {
            clearTimeout(resize_timeout);
            resize_timeout = setTimeout(function () {
                window.galleries.layout.init();

                if ($(window).width() !== last_window_width) {
                    last_window_width = $(window).width();
                    window.galleries.responsive.tile_list_init();
                    window.galleries.responsive.tile_list_after_resize();
                    window.galleries.responsive.flow_list_init();
                    window.galleries.responsive.flow_list_after_resize();
                }
                window.galleries.responsive.grid_dynamic_layout();

                if ($('.records_list.flow_list, .records_list.tile_list').length) {
                    if (window.cart && typeof window.cart != 'undefined') {
                        window.cart.add_to_cart($('.records_list.flow_list .store_item .store_item_add_to_cart , .records_list.tile_list .store_item .store_item_add_to_cart'));
                        window.cart.add_to_wishlist($('.records_list.flow_list .add_to_wishlist, .records_list.tile_list .add_to_wishlist'));
                        window.cart.remove_from_wishlist($('.records_list.flow_list .wishlist_button .store_item_remove_from_wishlist, .records_list.tile_list .wishlist_button .store_item_remove_from_wishlist'));
                    }
                }
            }, 400);
        });


        // Depricated in 2.0
        window.galleries.responsive.dynamic_grid_image_size();
        $(window).resize(function () {
            // Depricated in 2.0
            window.galleries.responsive.dynamic_grid_image_size();
        });


        if ($('.records_list.flow_list, .records_list.tile_list').length) {
            if (window.cart && typeof window.cart != 'undefined') {
                window.cart.add_to_cart($('.records_list.flow_list .store_item .store_item_add_to_cart , .records_list.tile_list .store_item .store_item_add_to_cart'));
                window.cart.add_to_wishlist($('.records_list.flow_list .add_to_wishlist, .records_list.tile_list .add_to_wishlist'));
                window.cart.remove_from_wishlist($('.records_list.flow_list .wishlist_button .store_item_remove_from_wishlist, .records_list.tile_list .wishlist_button .store_item_remove_from_wishlist'));
            }
        }
    },

    tile_list_setup: function (context) {

        if (context && typeof context != 'undefined') {
            var context = context;
        } else {
            var context = 'body';
        }
        $('.records_list.tile_list', context).each(function () {
            var original_html = $(this).html();
            $(this).html('');
            $(this).append('<div class="tile_list_formatted"></div>');
            $(this).append('<div class="tile_list_original"></div>');
            $('.tile_list_original', this).html(original_html).css('visibility', 'hidden');
        });
        window.galleries.responsive.tile_list_init(context);
    },

    tile_list_init: function (context, force) {


        if (context && typeof context != 'undefined') {
            var context = context;
        } else {
            var context = 'body';
        }

        if (force && typeof force != 'undefined') {
            var force = force;
        } else {
            var force = false;
        }

        $('.records_list.tile_list', context).each(function () {

            if ($('.tile_list_original ul', this).length) {

                // Check if the script has already been run before and set variables
                if ($(this).hasClass('initialised')) {
                    var init_rerun = true;
                    var existing_formatted_list_column_count = $('.tile_list_formatted ul', this).length;
                } else {
                    $(this).addClass('initialised');
                    init_rerun = false;
                }

                // Start initialising the new list

                var init_allowed = true;

                $('.tile_list_original', this).removeClass('hidden');

                var tile_list_instance = $(this);
                var $tile_list_formatted = $('.tile_list_formatted', tile_list_instance);
                var tile_list_width = $(this).width();
                var tile_list_column_width = Math.floor($('.tile_list_original ul', this)[0].getBoundingClientRect().width + parseInt($('.tile_list_original ul', this).css('margin-left')) + parseInt($('.tile_list_original ul', this).css('margin-right')));
                var column_count = 3;
                var column_count_calculated = Math.floor(tile_list_width / tile_list_column_width);
                if (column_count_calculated < 7) {
                    column_count = column_count_calculated;
                }

                if (init_rerun && !force) {
                    // If the script is being run again, check if the column count is different to before. If not, stop the list from being rebuilt.
                    if (existing_formatted_list_column_count == column_count) {
                        init_allowed = false;
                    }
                }

                var caption_heights = [];
                $('.tile_list_original li:not(.hidden)', this).each(function () {
                    var orginal_item_caption_height = $(this).find('.content').outerHeight();
                    if (orginal_item_caption_height) {
                        caption_heights.push(orginal_item_caption_height);
                    } else {
                        caption_heights.push(0);
                    }
                });

                $('.tile_list_original', this).addClass('hidden');

                if (init_allowed) {
                    var columns = {};
                    $.each(Array(column_count), function (index, value) {
                        columns[index] = {'height': 0, 'objects': []};
                    });

                    $('.tile_list_original li:not(.hidden)', this).each(function (index) {
                        if ($(this).attr('data-width') && $(this).attr('data-height')) {
                            var data_width = $(this).attr('data-width');
                            var data_height = $(this).attr('data-height');
                        } else {
                            var data_width, data_height = '400';
                            console.warn('tile_list_init: Width and height of each image is required as a data attribute for this script to work.');
                        }
                        var caption_height = caption_heights[index];
                        var height_to_width_factor = parseInt(data_width) / tile_list_column_width;
                        var relative_item_height = Math.ceil((parseInt(data_height) / height_to_width_factor) + caption_height);
                        var lowest_height_index = 0;
                        if (columns[0] && typeof columns[0] != 'undefined') {
                            var loop_current_lowest_height = columns[0]['height'];
                            $.each(columns, function (index, value) {
                                if ((value.height < loop_current_lowest_height)) {
                                    lowest_height_index = index;
                                    loop_current_lowest_height = value.height;
                                }
                            });
                            columns[lowest_height_index]['height'] = columns[lowest_height_index]['height'] + relative_item_height;
                            columns[lowest_height_index]['objects'].push($(this).clone().find('.video_inline').remove().end());
                            // console.log('column ', lowest_height_index, '. height ', caption_height, $(this).text());
                        }
                    });

                    // console.log(columns);

                    // Generate formatted tile list
                    $tile_list_formatted.html('');
                    $.each(columns, function (index, value) {
                        $tile_list_formatted.append('<ul></ul>');
                        $tile_list_formatted.find('ul:last-child').append(value.objects);
                    });

                    window.galleries.responsive.tile_list_after_init();

                }

                // Scatter list functions
                if ($(this).hasClass('scatter_list')) {
                    window.galleries.responsive.tile_list_scatter();
                }

                // Process formatted tile list
                $tile_list_formatted.each(function () {
                    var $this = $(this);

                    $this.find('ul:last-child').addClass('last');

                    // Video inline not currently supported
                    $this.find('.video_inline').remove();

                    // Set the size of the image container as a placeholder for lazyload
                    $this.find('li').each(function () {
                        window.galleries.responsive.set_item_min_height($(this));
                    });

                });

            }

        });
    },

    set_item_min_height: function ($element) {
        // Set the size of the image container as a placeholder for lazyload
        var item_width = $element.find('.image').width();
        var image_width = $element.attr('data-width');
        var image_height = $element.attr('data-height');
        var image_width_proportional = 0;
        var image_height_proportional = 0;
        if (image_width && image_height) {
            image_width_proportional = item_width / image_width;
            image_height_proportional = image_height * image_width_proportional;
            if (image_height_proportional) {
                $element.find('.image').css('min-height', image_height_proportional);
            }
        }
    },

    tile_list_append_refresh: function (tile_list_instance) {

        //Refreshes the visible tile list (tile_list_formatted) after manually appending list items to the tile_list_original, for example after list-ajax-load-more button is used
        var column_count = tile_list_instance.find('.tile_list_formatted ul').length;
        var $tile_list_formatted = $('.tile_list_formatted', tile_list_instance);

        var tile_list_column_width = $tile_list_formatted.first('ul').width();
        var columns = {};
        $.each(Array(column_count), function (index, value) {
            columns[index] = {'height': 0, 'objects': []};
        });


        // Work out columns with all items in tile_list_original, not just the incoming ones.
        // This ensures that we retain all of the correct column heights - exactly as if we were building the list from scratch.

        //TODO this code that sorts items into columns is basically a duplication of the same funcationality in tile_list_init.
        $('.tile_list_original li', tile_list_instance).each(function (index) {

            if ($(this).attr('data-width') && $(this).attr('data-height')) {
                var data_width = $(this).attr('data-width');
                var data_height = $(this).attr('data-height');
            } else {
                var data_width, data_height = '400';
                console.warn('tile_list_init: Width and height of each image is required as a data attribute for this script to work.');
            }
            var height_to_width_factor = parseInt(data_width) / tile_list_column_width;
            var relative_item_height = Math.ceil(parseInt(data_height) / height_to_width_factor);
            var lowest_height_index = 0;
            if (columns[0] && typeof columns[0] != 'undefined') {
                var loop_current_lowest_height = columns[0]['height'];
                $.each(columns, function (index, value) {
                    if ((value.height < loop_current_lowest_height)) {
                        lowest_height_index = index;
                        loop_current_lowest_height = value.height;
                    }
                });
                columns[lowest_height_index]['height'] = columns[lowest_height_index]['height'] + relative_item_height;
                columns[lowest_height_index]['objects'].push($(this).clone().find('.video_inline').remove().end());
            }
        });


        $.each(columns, function (index, value) {

            var $formatted_column = $tile_list_formatted.find('ul:eq(' + index + ')');

            //Check how many items are already in the visible column
            var existing_items_in_visible_col = $formatted_column.find('li').length;

            //Append all items in column object from the existing length to the total length
            $formatted_column.append(value.objects.slice(existing_items_in_visible_col, value.objects.length));

            $tile_list_formatted.find('.video_inline').remove();
            $tile_list_formatted.find('li').each(function () {
                window.galleries.responsive.set_item_min_height($(this));
            });

        });

    },

    tile_list_after_init: function () {
        Artlogic.import('galleries_js/layout.js').then(function (m) {
            window.galleries.layout.init();
        })
    },

    tile_list_after_resize: function () {
        Artlogic.import('galleries_js/layout.js').then(function (m) {
            window.galleries.layout.init();
        })
        Artlogic.import('galleries_js/contact_form_popup.js').then(function (m) {
            window.galleries.contact_form_popup.init();
        })
        $('.tile_list .click_event_added').removeClass('click_event_added');
        Artlogic.import('galleries_js/misc.js').then(function (m) {
            window.galleries.misc.extended_click_area();
        })
        if (typeof $.pageload != 'undefined') {
            if (typeof $.pageload.refresh == 'function') {
                $.pageload.refresh('.tile_list');
            } else {
                console.warn('Failed to run pageload.refresh')
            }
        }
        Artlogic.import('galleries_js/artworks.js').then(function (m) {
            if (window.galleries.artworks.favourites !== undefined && window.galleries.artworks.favourites.init !== undefined) {
                window.galleries.artworks.favourites.init();
            }
        })

    },

    flow_list_setup: function (context) {
        if (context && typeof context != 'undefined') {
            var context = context;
        } else {
            var context = 'body';
        }
        $('.records_list.flow_list', context).each(function () {
            var original_html = $(this).html();
            $(this).html('');
            $(this).append('<div class="flow_list_formatted"></div>');
            $(this).append('<div class="flow_list_original"></div>');
            $('.flow_list_original', this).html(original_html).css('visibility', 'hidden');
        });
        window.galleries.responsive.flow_list_init(context);
    },

    flow_list_format: function ($flow_list_formatted, target_height, column_count, row_class_to_target) {

        var row_heights = [];
        var tallest_height = 0;
        var cur_tallest_height = 0;
        var row_count = 0;

        // row_class_to_target is a class which has been added to specific rows and only those rows should be formatted
        // For example when ajax load more button is pressed we only want to format the new/modified rows.
        row_class_to_target = (typeof row_class_to_target !== 'undefined') ? row_class_to_target : '.flow_list_row';

        // Process formatted flow list
        $flow_list_formatted.find(row_class_to_target).each(function () {

            var $this = $(this);
            row_count += 1;
            var items = $this.find("li");
            var total_margin = 0;
            var items_array = items.get();
            var combinedWidth = items_array.reduce(function (sum, item) {  // .get returns the jQuery object's elements as an array

                var scaled_width;
                if ("width" in item.dataset && "height" in item.dataset) {
                    var data_width = item.dataset.width;
                    var data_height = item.dataset.height;
                    var scale_ratio = target_height / data_height;
                    var scaled_width = data_width * scale_ratio;
                    var style = window.getComputedStyle(item);
                    var marginLeft = parseInt(style.getPropertyValue('margin-left'));
                    var marginRight = parseInt(style.getPropertyValue('margin-right'));

                    total_margin += (marginLeft + marginRight);

                } else {
                    console.warn('flow_list_init: Width and height of each image is required as a data attribute for this script to work.');
                }

                return sum + scaled_width;

            }, 0);

            var diff = ($this.width() - total_margin) / combinedWidth;
            var final_item_height = (target_height - 1) * diff; // 999 allows 1 px of wiggle room, in case it's too wide by subpixels

            // Add all of the rows except the last one to the row_heights list.
            // When we calculate the average row height later, we don't want to use the last row as it can be an anomaly
            if (row_count != $flow_list_formatted.find(row_class_to_target).length) {
                row_heights.push(final_item_height);
            }

            // Get the current tallest height or if no current tallest - get target height
            var cur_tallest_height = ((tallest_height) ? tallest_height : target_height);

            if (((items_array.length < (column_count - 1) || column_count == 2 && items_array.length == 1) && final_item_height > cur_tallest_height) && !$(this).closest('.flow_list').hasClass('expand-single-item')) {

                // - For the last row, use the average height of the other rows to determine the height if there are not enough items to fill all the columns
                // - We check against (column_count - 1) because we want the items to fill the full width of the row if there is only one less item.
                // - If the column number is set to 2, we don't want a singular item on the last row to go full width because it would be too big. Therefore we use the average height.

                var total = 0;
                for (var i = 0; i < row_heights.length; i++) {
                    total += row_heights[i];
                }
                var average_row_height = total / row_heights.length;
                final_item_height = average_row_height

            } else {
                if (final_item_height > tallest_height) {
                    tallest_height = final_item_height;
                }
            }

            items.find('.image').height(final_item_height);
            items_array.forEach(function (item, index) {
                var final_height_scale = final_item_height / item.dataset.height;
                if($(item).parent().find("li").length == 1){
                    if(item.dataset.width <= $(item).find('.image').width()){


                        $(item).width(item.dataset.width);
                        $(item).height('auto');
                        $(item).find('.image').height('auto');
                    }else{
                        $(item).width(item.dataset.width * final_height_scale);

                    }

                }else{

                    $(item).width(item.dataset.width * final_height_scale);

                }
            });

            $this.find('ul:last-child').addClass('last');
            // Video inline not currently supported
            $this.find('.video_inline').remove();
            $this.removeClass('row_requires_formatting');
        });

    },

    flow_list_create_rows: function (flow_list_formatted_instance, list_items_to_be_added, column_count) {

        // TO DO: add in some logic that when a setting is turned on, the quantity of images added to a row depend on the image proportions within the row.
        // For example if there are 4 columns but there are 2 lanscape images next to each other, set the column number to 2 for that row.

        var columns = {};
        var column_split = Math.ceil(list_items_to_be_added.length / column_count);

        if (column_split) {
            $.each(Array(column_split), function (index, value) {
                columns[index] = {'objects': []};
            });
        }

        list_items_to_be_added.each(function () {
            var lowest_height_index = 0;
            if (columns[0] && typeof columns[0] != 'undefined') {
                $.each(columns, function (index, value) {
                    if ((this.objects.length < column_count)) {
                        lowest_height_index = index;
                        return false;
                    }
                });
                columns[lowest_height_index]['objects'].push($(this).clone().find('.video_inline').remove().end());
            }
        });

        $.each(columns, function (index, value) {
            flow_list_formatted_instance.append('<ul class="flow_list_row row_requires_formatting"></ul>');
            flow_list_formatted_instance.find('ul:last-child').append(value.objects);
        });

    },

    flow_list_init: function (context) {
        if (context && typeof context != 'undefined') {
            var context = context;
        } else {
            var context = 'body';
        }

        $('.records_list.flow_list', context).each(function () {

            var $flow_list = $(this);
            var $flow_list_original = $('.flow_list_original ul', this);
            var init_rerun
            var existing_formatted_list_column_count

            if ($flow_list_original.length) {
                // Check if the script has already been run before and set variables
                if ($(this).hasClass('initialised')) {
                    init_rerun = true;

                    existing_formatted_list_column_count = $('.flow_list_formatted ul.flow_list_row:first li', this).length;

                } else {
                    $(this).addClass('initialised');
                    init_rerun = false;
                }

                // Start initialising the new list
                var init_allowed = true;
                $flow_list_original.removeClass('hidden');
                var flow_list_instance = $(this);
                var $flow_list_formatted = $('.flow_list_formatted', flow_list_instance);
                var flow_list_width = $flow_list.width();
                var item_widths = $flow_list_original.find('li').first().width();
                var number_of_items_in_grid = $flow_list_original.find('li').length;
                var column_count_calculated = Math.round((flow_list_width / item_widths) * 10) / 10;
                var column_count = column_count_calculated;

                // If we can't detect any columns, do not initialise
                if (!column_count) {
                    init_allowed = false
                }

                // If there are less items in the grid that the number of columns, set the column number to the number of items
                // This needs to be done to stop the grid from trying to be formatted on resize etc
                if (column_count > number_of_items_in_grid) {
                    column_count = number_of_items_in_grid
                }
                $flow_list_formatted.attr('data-column-count', column_count);

                if (init_rerun) {
                    // If the script is being run again, check if the column count is different to before. If not, stop the list from being rebuilt.
                    if (existing_formatted_list_column_count == column_count) {
                        init_allowed = false;
                    }
                }

                $flow_list_original.addClass('hidden');

                var target_height = 600; //MOSTLY ARBITRARY - JUST A UNIFYING NUMBER. IS THE MAX HEIGHT OF

                if (init_allowed) {

                    $flow_list_formatted.html('');
                    window.galleries.responsive.flow_list_create_rows($flow_list_formatted, $flow_list_original.find('li'), column_count);
                    window.galleries.responsive.flow_list_format($flow_list_formatted, target_height, column_count);
                    window.galleries.responsive.flow_list_after_init();

                } else {
                    //just run the formatting to ensure the sizes are correct
                    window.galleries.responsive.flow_list_format($flow_list_formatted, target_height, column_count);
                }
            }
        });

    },

    flow_list_append_refresh: function (flow_list_instance) {

        // This function gets called when new items get appended to the list - for example when the ajax load more button gets pressed.

        var $flow_list_original = $('.flow_list_original', flow_list_instance);
        var $flow_list_formatted = $('.flow_list_formatted', flow_list_instance);
        var column_count = $flow_list_formatted.attr('data-column-count');
        var last_row_column_count = $flow_list_formatted.find('ul:last li').length;
        var $last_row_before_new_content = $flow_list_formatted.find('ul:last');
        var $ajax_loaded_list_items = $flow_list_original.find('ul li.ajax-loaded-list-item').not(".pageload-refreshed");

        // Work out if the last row before adding the new items needs new items added to it to fill the row and then adds them.
        // For example if the last row had 2 items and the column count was 4, we would need to add 2 of the new ajax loaded items into that already existing row to fill it.
        if (last_row_column_count < column_count) {

            // Don't scroll list position if we are adding new items to the last row.
            flow_list_instance.addClass('no_scroll_after_load');
            // Add class so width & height of existing items in the last row can be transitioned
            $last_row_before_new_content.find('li').addClass('transition_size');
            // Calculate how many new items need to be added to the previously last row.
            var number_of_items_required_to_complete_last_row = column_count - last_row_column_count;
            // Get the required amount of items from the new ajax loaded items list.
            var items_to_fill_spaces = $ajax_loaded_list_items.slice(0, number_of_items_required_to_complete_last_row);

            // Insert the new items into what previously was the existing last row.
            items_to_fill_spaces.clone().insertAfter($last_row_before_new_content.find('li:last'));

            // Add a class to this row so we know it requires reformatting it because the items within it have changed.
            $last_row_before_new_content.addClass('row_requires_formatting');

            // Set the ajax loaded list of items to not include the ones which have just been added to the existing row.
            $ajax_loaded_list_items = $ajax_loaded_list_items.slice(number_of_items_required_to_complete_last_row);

            // Remove class once size has transitioned
            setTimeout(function () {
                $flow_list_formatted.find('li.transition_size').removeClass('transition_size');
            }, 1500);
        }

        window.galleries.responsive.flow_list_create_rows($flow_list_formatted, $ajax_loaded_list_items, column_count);
        window.galleries.responsive.flow_list_format($flow_list_formatted, 600, column_count, '.flow_list_row.row_requires_formatting');

    },

    flow_list_after_init: function () {
        window.galleries.layout.init();
    },
    flow_list_after_resize: function () {

        window.galleries.layout.init();
        $(window).trigger('resize');
    },

    tile_list_scatter: function () {

        /*
            Scatter items are 'pulled' out of place to create a random effect.
            The maximum they can deviate is the margin/padding of the column, this prevents them from touching.
        */
        var max_x_pull = ($('.tile_list_formatted ul').outerWidth(true) - $('.tile_list_formatted ul').outerWidth(false)) / 2;
        var min_x_pull = -max_x_pull;

        $('.tile_list_formatted ul').each(function () {
            var $this = $(this);
            var y_pull = window.galleries.responsive.tile_list_scatter_bounds((min_x_pull / 2), (max_x_pull * 2));
            $this.css({
                'padding-top': y_pull + 'px'
            });
        });

        $('.tile_list_formatted ul li').each(function () {
            var $this = $(this);
            var x_pull = window.galleries.responsive.tile_list_scatter_bounds(min_x_pull, max_x_pull);
            if (!$this.find('.wrap_inner').length) {
                $this.wrapInner('<div class="wrap_inner"></div');
            }
            $this.attr('data-x-pull', x_pull);
            $this.find('.wrap_inner').css({
                'transform': 'translateX(' + x_pull + 'px )',
                'margin-bottom': max_x_pull * 2
            });
        });

        if (!$('.tile_list').hasClass('scatter-list-initialised')) {
            window.setTimeout(function () {
                $('.tile_list').addClass('scatter-list-initialised');
            }, 1000);
        }

    },

    tile_list_scatter_bounds: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    grid_dynamic_layout: function () {

        $('.records_list.set_minimum_heights_per_row, .records_list.set_minimum_heights_per_item').each(function () {
            $(this).addClass("grid_dynamic_disable_lazyload_height");
            var initial_rows = $(this).attr('data-initial-rows') && typeof $(this).attr('data-initial-rows') != 'undefined' ? $(this).attr('data-initial-rows') : false;
            var row_number = 0;
            var row_offset = 0;

            $('li', this).each(function () {
                $(this).find('.image > span').css('min-height', '');
                var item_width = $(this).find('.image').width();
                var image_width = $(this).attr('data-width');
                var image_height = $(this).attr('data-height');
                var image_width_proportional = 0;
                var image_height_proportional = 0;
                if (image_width && image_height) {
                    image_width_proportional = item_width / image_width;
                    image_height_proportional = image_height * image_width_proportional;
                    if (image_height_proportional) {
                        $(this).find('.image').css('min-height', image_height_proportional);
                        $(this).find('.image > span').css('min-height', image_height_proportional);
                    }
                }
                $(this).removeClass('revealable');
            });
            
            if ($(this).hasClass('set_minimum_heights_per_row')) {
                $('li', this).each(function () {
                    // Find adjacent elements
                    var offset_top = $(this).offset().top;
                    var this_image_height = $(this).find('.image').height();
                    if (offset_top > row_offset) {
                        row_number = row_number + 1;
                        row_offset = offset_top;
                    }
                    $(this).parent().find('li').each(function () {
                        if ($(this).offset().top == offset_top) {
                            $(this).attr('data-row-number', row_number);
                            if ($(this).find('.image').height() < this_image_height) {
                                $(this).find('.image').css('min-height', this_image_height);
                                $(this).find('.image > span').css('min-height', this_image_height);
                            }
                        }
                    });
                });
            }
            $('li', this).not('.revealed').each(function () {
                // Hide revealable elements

                var row_number = $(this).attr('data-row-number');
                if (row_number && parseInt(row_number) > parseInt(initial_rows)) {
                    $(this).addClass('revealable');
                }
            });
        });

    },

    dynamic_grid_image_size: function () {
        // Depricated in 2.0
        if ($('body').hasClass('responsive-layout-forced-image-lists')) {
            var selector_context = $('body.responsive-layout-forced-image-lists .records_list.image_list, body.responsive-layout-forced-image-lists .records_list.detail_list');
            $(selector_context).each(function () {
                $('li', this).each(function () {

                    // Save the original style as a data tag if it already has one
                    var image_span_el = $('.image > span', this);
                    if (typeof image_span_el.attr('data-style') !== typeof undefined && image_span_el.attr('data-style') !== false) {
                        var image_span_el_original_style = image_span_el.attr('data-style');
                    } else {
                        if (typeof image_span_el.attr('style') != typeof undefined && image_span_el.attr('style') != false) {
                            var image_span_el_original_style = image_span_el.attr('style');
                        } else {
                            var image_span_el_original_style = '';
                        }
                        image_span_el.attr('data-style', image_span_el_original_style);
                    }

                    // Add the dynamic heights for each image element if required
                    if ($('.fill', this).css('display') == 'block') {
                        var image_wrapper_height = $('.image_wrapper', this).height();
                        $('.image', this).attr('style', 'height:' + image_wrapper_height + 'px !important;');
                        $('.image > span', this).attr('style', 'height:' + image_wrapper_height + 'px !important;' + image_span_el_original_style);
                        $('.image span > img', this).attr('style', 'max-height:' + image_wrapper_height + 'px !important;');
                    } else if ($('.image, .image > span', this).attr('style')) {
                        if ($('.image, .image > span', this).attr('style').indexOf('height') > -1) {
                            //$('.image', this).attr('style', '');
                            //we need the min-height in .image to remain so that the image doesn't overlap when the window on load
                            //style= '' commented out by Bao
                            //probably we don't need this function anymore, not sure who is using it
                            //it also said Depricated in 2.0 at the top.
                            //we should find a solution for v1.0 rather than keep it here but running by every 2.0 site, it will overlapped the image
                            $('.image > span:not(.hover-element)', this).attr('style', image_span_el_original_style);
                        }
                        // Only remove the style if we haven't added focal point data which positions the image with object-position
                        var image_style = $('.image img', this).attr('style');
                        if (image_style && typeof image_style !== 'undefined' && image_style.indexOf('object-position') == -1) {
                            $('.image img', this).attr('style', '');
                        }
                    }
                });
            });
        }

    },

}

window.galleries = window.galleries || {};
window.galleries.responsive = responsive;
export default responsive;