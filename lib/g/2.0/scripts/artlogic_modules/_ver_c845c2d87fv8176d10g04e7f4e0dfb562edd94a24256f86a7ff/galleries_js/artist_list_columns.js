import layout from './layout.js'
import artist_list_preview from './artist_list_preview.js'

var artist_list_columns = {

    init: function () {


        if ($('.artists_list_dynamic_columns').length) {

            window.galleries.artist_list_preview.vertically_centre_artist_list.init();

            //console.log("original_total_items:"+original_total_items);
            $('.artists_list_dynamic_columns .artist_list_section_wrapper').each(function (i) {

                var $this = $(this);
                var instance_number = (i + 1).toString();
                var list_original_id = '#artists_list_original_wrapper_' + instance_number;
                var list_formatted_id = '#artists_list_formatted_wrapper_' + instance_number;



                /*
                    1.  Format the column widths correctly. It takes the desktop column width as an 'ideal' size, and tries to maintain that as the
                        browser scales down. As each column becomes too small, the number of columns reduces.

                    2.  Distributes the items into each column correctly. The items flow downwards then are broken into the next column. E.g 15 items / 5 column grid:
                        A   D   G   J   M
                        B   E   H   K   N
                        C   F   I   L   O

                        --------------------------------------------------------

                        E.g. 17 items / 5 column grid

                        DISTRIBUTION METHOD A:
                        The script works out how to fill the columns as evenly as possible, then works out which columns should have more items.
                        Visually appears a bit like inline-block flowing (horizontal), although the items still actually flow vertically:

                        A   D   G   J   M
                        B   E   H   K   N
                        C   F   I   L   O
                        P   Q


                        DISTRIBUTION METHOD B:

                        A   E   I   M   Q
                        B   F   J   N
                        C   G   K   O
                        D   H   L   P

                        DISTRIBUTION METHOD C(enhanced from A) by Bao:

                        A   F   K   P
                        B   G   L   Q
                        C   H   M   R
                        D   I   N   S
                        E   J   O
                */

                //Take the lists and break them into a hidden original list and container for our reformatted version.
                $this.append('<div id="' + list_original_id.substring(1) + '" class="artists-list-original-wrapper">' + $this.html() + '</div>');
                $this.children('ul').remove();
                $this.append('<div id="' + list_formatted_id.substring(1) + '" class="artists-list-formatted-wrapper clearwithin"></div>');


                // Ideal column width is influenced by the font size to ensure bunching of columns does not occur.
                var ideal_column_width = 220;
                var font_size = parseInt($('.artists-list-original-wrapper h2').css('font-size'));
                ideal_column_width = ideal_column_width * (font_size / 13);

                $(window).resize(function () {

                    $(list_original_id).show();
                    $(list_formatted_id).html('');

                    var columns;
                    var column_fill_method = 'c'; //Option A, B or C, refer to above
                    var container_width = parseInt($this.width());

                    //How many desired columns fit within the container (at desktop size).
                    var initially_set_columns = Math.floor(container_width + 20) / $(list_original_id + ' > ul').outerWidth();

                    //How many columns actually fit within the container at the *current* viewport size.
                    var columns_that_fit = Math.floor(container_width / ideal_column_width);
                    //If we can use our desired amount, great - otherwise fit as many as possible in this viewport.
                    if (initially_set_columns >= columns_that_fit) {
                        columns = columns_that_fit;
                    } else {
                        columns = initially_set_columns;
                    }

                    // NEW CODE 2018
                    // THERE SHOULD ALWAYS BE AT LEAST 1 COLUMN
                    // THIS ATTEMPTS TO FIX A BUG WHERE WHEN THE SCREEN SIZE WAS < 387px THE LIST WOULD NOT RENDER. REMOVE THE FOLLOWING TO TEST.
                    if (columns < 1) {
                        columns = 1;
                    }
                    // END OF NEW CODE

                    var column_width = 1 / columns * 100;
                    var total_items = $(list_original_id).find('li').length;


                    if (column_fill_method == 'a') {
                        /*
                            DISTRIBUTION METHOD A:

                            A   D   G   J   M
                            B   E   H   K   N
                            C   F   I   L   O
                            P   Q

                        */
                        //Work out how many items would 'evenly' fill up the columns
                        var evenly_filled_items_number = Math.floor(total_items / columns);

                        // How many extra items are we left with? These to be evenly distributed across columns.
                        var remainder = total_items % columns;

                        var current_item_index = 0;

                        for (var i = 0; i < columns; i++) {
                            var extra_items_in_col = 0;
                            if (remainder > 0) {
                                extra_items_in_col = 1;
                                remainder = remainder - 1;
                            }
                            // Create columns with correct distribution.
                            $(list_formatted_id).append('<ul class="dynamic-column"></ul>');
                            $(list_original_id).find('li').slice(current_item_index, current_item_index + evenly_filled_items_number + extra_items_in_col).each(function() {
                                var this_li_html = $(this).clone().wrap('<div>').parent().html();
                                $(list_formatted_id+' ul:last-child').append(this_li_html);
                            });
                            current_item_index = current_item_index + evenly_filled_items_number + extra_items_in_col;
                        }

                    } else if(column_fill_method == 'c') {
                        /*
                        DISTRIBUTION METHOD C(enhanced from A) by Bao:

                        A   F   K   P
                        B   G   L   Q
                        C   H   M   R
                        D   I   N   S
                        E   J   O
                         */
                        // New code 2021
                        var evenly_filled_with_remainder = 0;
                        var remainder = total_items % columns;
                        var original_total_items = $(list_original_id).find('li').length;
                        //console.log("init col " + initially_set_columns);
                        //console.log("col fit " + columns);
                        //console.log("total items = " + total_items);
                        //console.log("item / col in Int = " + Math.floor(total_items / columns));
                        if (remainder > 0) {
                            //console.log("remainder = " + remainder);
                            //console.log("item / col in int + 1 = " + (Math.floor(total_items / columns) + 1));
                            evenly_filled_with_remainder = (Math.floor(total_items / columns) + 1);
                        } else {
                            evenly_filled_with_remainder = (Math.floor(total_items / columns));
                        }
                        //console.log("generate dynamic-column for formatting");
                        //console.log("evenly_filled_with_remainder" + evenly_filled_with_remainder);
                        for (var i = 0; i < Math.floor(columns); i++) {
                            $(list_formatted_id).append('<ul class="dynamic-column"></ul>');
                        }
                        var current_item_index = 0;
                        for (var column_index = 0; column_index < $(list_formatted_id).find(".dynamic-column").length; column_index++) {
                            //console.log("loop column_index" + column_index);
                            if ($(list_formatted_id).find(".dynamic-column").length == 1) {
                                //clone all artists to dynamic-column
                                $(list_original_id).find('li').clone().appendTo($(list_formatted_id).find(".dynamic-column"));

                            } else {
                                $(list_original_id).find('li').slice(current_item_index, current_item_index + evenly_filled_with_remainder).each(function () {
                                    /*clone artists evenly, and add 1 more artists to the end
                                    eg. 74 artists will split to 25/25/24,
                                    the original method A is 24/24/24, and add the remain artists to columns one by one.
                                    77 artists = 26 / 26 / 25
                                    79 artists = 27 / 27 / 25

                                     */
                                    $(list_formatted_id).find('.dynamic-column:nth-child(' + (column_index + 1) + ')').append($(this).clone());
                                    //console.log("run slice and clone to index " + column_index);
                                });
                            }
                            current_item_index = current_item_index + evenly_filled_with_remainder;

                        }
                    } else {

                        /*
                            DISTRIBUTION METHOD B:

                            A   E   I   M   Q
                            B   F   J   N
                            C   G   K   O
                            D   H   L   P

                        */
                        var evenly_filled_items_number = Math.ceil(total_items / columns);
                        var remainder = 0;

                        var current_item_index = 0;

                        for (var i = 0; i < columns; i++) {
                            var extra_items_in_col = 0;
                            if (remainder > 0) {
                                extra_items_in_col = 1;
                                remainder = remainder - 1;
                            }
                            // Create columns with correct distribution.
                            $(list_formatted_id).append('<ul class="dynamic-column"></ul>');
                            $(list_original_id).find('li').slice(current_item_index, current_item_index + evenly_filled_items_number + extra_items_in_col).each(function() {
                                var this_li_html = $(this).clone().wrap('<div>').parent().html();
                                $(list_formatted_id+' ul:last-child').append(this_li_html);
                            });
                            current_item_index = current_item_index + evenly_filled_items_number + extra_items_in_col;
                        }

                    }

                    $(list_formatted_id+' ul').css('width',column_width + '%');
                    
                    $(list_original_id).hide();


                    window.galleries.artist_list_preview.init();
                    if ($.pageload && typeof $.pageload != 'undefined') {
                        if ($.pageload.fn && $.pageload.fn != 'undefined') {
                            $.pageload.fn.pages.add_click_events();
                        }
                    }

                }).trigger('resize');
                window.galleries.layout.init();
            });


        }
    }
}

window.galleries = window.galleries || {};
window.galleries.artist_list_columns = artist_list_columns;
export default artist_list_columns;