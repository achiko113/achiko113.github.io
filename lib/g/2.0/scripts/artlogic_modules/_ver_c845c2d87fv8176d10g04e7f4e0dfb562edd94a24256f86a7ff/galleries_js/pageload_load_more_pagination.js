import pageload_plugin from '../plugins/pageload.js';
import responsive from './responsive.js';
import layout from './layout.js';

var pageload_load_more_pagination = {
            
    // Dynamically loads in new items into a records_list, rather than traditional pagination

    init: function() {
        
        var verbose_mode = false;
        
        if (($('body').hasClass('pageload-ajax-navigation-active')) && $('.page_stats').length && $('.ajax_load_more_pagination_enabled').length) {
            
            window.galleries.pageload_load_more_pagination.setup(verbose_mode);
        }
    },

    setup: function (verbose_mode) {

        $('.page_stats').each(function(i, element) {
            
            var $this = $(this),
            
                incoming_url = $this.find('.ps_next').attr('href');
                var page_stats_id = $this.attr('id'),
                corresponding_list_ref = $this.attr('id'),
                $list = $('[data-pagestats-id="'+corresponding_list_ref+'"]')
                var ajax_load_more_auto = $this.hasClass('pagination_type_ajax_load_more_auto');

                if (!$list.length && verbose_mode){
                    console.log("Can't find a corresponding list that relates to your pagination. Supply 'data-pagestats-id' to list that matches your page_stats_id.")
                }
                

            if (typeof page_stats_id !== 'undefined' && $list.length){
                
                // Hide the original pagination 
                $this.addClass('hidden'); 
                $this.find('.list-ajax-load-more-wrapper').remove();
                
                if (typeof incoming_url !== 'undefined'){
                    
                    // Create our new dynamic button
                    $this.after('<div class="list-ajax-load-more-wrapper ' + (ajax_load_more_auto ? 'list-ajax-load-more-auto': '') + ' clearwithin"><button class="list-ajax-load-more button button_compact" data-list="'+page_stats_id+'" data-url="'+incoming_url+'" aria-label="Load more items"><span class="list-ajax-load-more-label">Load more</span></button></div>');
                    
                    $this.next('.list-ajax-load-more-wrapper').find('.list-ajax-load-more')
                        .on("click", function(e) { 
                            e.preventDefault();
                            var $button = $(this),
                                incoming_url = $button.attr('data-url'); // URL detected at this level, later may be data-attr or any value
                                corresponding_list_ref = $button.data('list'),
                                $list = $('[data-pagestats-id="'+corresponding_list_ref+'"]')
                            //Load the new records
                            window.galleries.pageload_load_more_pagination.load_content($button, incoming_url, $list, verbose_mode);
                        })
                    ;
                    window.galleries.layout.inview.init('.list-ajax-load-more-auto');
                    $this.next('.list-ajax-load-more-wrapper')
                        .on('inview.visible', function() {
                            console.log($('.list-ajax-load-more', this));
                            if (!$('.list-ajax-load-more', this).hasClass('loading')) {
                                $('.list-ajax-load-more', this).trigger('click');
                            }
                        })
                    ;
                }
                
                // If this URL already has a skip value, prepend a load previous button
                if (window.location.search && typeof window.location.search != 'undefined') {
                    if (window.location.search.indexOf('skip=') != -1) {
                        $list.before('<div class="list-ajax-load-previous-wrapper clearwithin"><button class="list-ajax-load-previous button button_compact" data-list="'+page_stats_id+'" aria-label="Load previous items"><span class="list-ajax-load-previous-label">Load previous items</span></button></div>');
                            
                        $('.list-ajax-load-previous').on("click", function(e) { 
                            e.preventDefault();
                            //Load the initial records list
                            $.pageload.load(window.location.pathname, true, function() {
                                
                            });
                        });
                    }
                }
            }
        });

    },

    load_content: function ($button, incoming_url, $list, verbose_mode) {
        
        $button.addClass('loading');
        
        var incoming_content_type = 'inner',
            current_button_offset = $button.offset().top - ($(window).height() / 3),
            corresponding_list_ref = $list.data('pagestats-id'),
            inner_content_selector = '[data-pagestats-id="'+corresponding_list_ref+'"]';
            
        $.pageload.load(incoming_url, true, function(new_page_inner_content, href, new_page_main_content) {
            
            $button.removeClass('loading');
            console.warn('var declaration changes here')
            if (new_page_inner_content) {

                var $new_page_inner_content = $(new_page_main_content);
                
                var updated_url = $new_page_inner_content.find('.page_stats#'+corresponding_list_ref).find('.ps_next').attr('href'),
                    $new_list = $new_page_inner_content.find('[data-pagestats-id="'+corresponding_list_ref+'"]'),
                    $new_list_items = $new_list.find('li').addClass('ajax-loaded-list-item');
                    
                if ($list.hasClass('tile_list')){
                    $list.find('.tile_list_original ul').append($new_list_items);
                } else if ($list.hasClass('flow_list')) {
                    $list.find('.flow_list_original ul').append($new_list_items);
                } else {
                    $list.find('ul').append($new_list_items);
                }
                
                if (updated_url){
                    $button.attr('data-url', updated_url);
                } else {
                    $button.attr('data-url', '');
                    $button.addClass('disabled');
                    $button.closest('.list-ajax-load-more-wrapper').addClass('disabled');
                }

                //General resets
                if ($list.hasClass('tile_list')){
                    window.galleries.responsive.tile_list_append_refresh($list);
                } else if ($list.hasClass('flow_list')) {
                    window.galleries.responsive.flow_list_append_refresh($list);
                }
                window.galleries.layout.inview.init();
                $(window).trigger('resize');
                $(window).trigger('scroll');
                
                setTimeout(function() {
                    if (!$list.hasClass('no_scroll_after_load')) {
                        $('html,body').stop().animate({
                            scrollTop: current_button_offset
                        }, 800, 'easeInOutQuad', function() {
                            //Refresh pageload only on the new list items
                            $.pageload.refresh('.ajax-loaded-list-item:not(.pageload-refreshed)');
                            $('.ajax-loaded-list-item').addClass('pageload-refreshed');
                        });
                    } else {
                        //Refresh pageload only on the new list items
                        $.pageload.refresh('.ajax-loaded-list-item:not(.pageload-refreshed)');
                        $('.ajax-loaded-list-item').addClass('pageload-refreshed');
                        $list.removeClass('no_scroll_after_load')
                    }
                }, 100);


            }
            
        }, null, null, null, incoming_content_type, inner_content_selector);
    }
    }

window.galleries = window.galleries || {};
window.galleries.pageload_load_more_pagination = pageload_load_more_pagination;
export default pageload_load_more_pagination;