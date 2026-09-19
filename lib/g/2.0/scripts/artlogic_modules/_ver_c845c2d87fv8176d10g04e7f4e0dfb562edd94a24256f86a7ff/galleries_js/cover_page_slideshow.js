var cover_page_slideshow = {

    init: function() {

        $('#cover_page_slideshow').each(function() {
            
            var cycleSpeed = 1200;
            if ($('#cover_page_slideshow').attr('data-cycle-speed-setting'))  {
                var cycleSpeed = $("#cover_page_slideshow").attr('data-cycle-speed-setting');
            }

            var cycleFx = 'fade';
            if ($('#cover_page_slideshow').attr('data-cycle-fx-setting'))  {
                var cycleFx = $("#cover_page_slideshow").attr('data-cycle-fx-setting');
            }

            var startingSlide = 0;
            if ($('#cover_page_slideshow .item.item_starting_slide').length) {
                var startingSlide = $('#cover_page_slideshow .item.item_starting_slide').index();
            }

            var slideshowtimeout = 6000;
            if ($("#cover_page_slideshow").attr('data-cycle-timeout-setting'))  {
                var slideshowtimeout = parseInt($("#cover_page_slideshow").attr('data-cycle-timeout-setting'));
            }

            $('body').addClass('type-cover-page type-fullscreen');

            $('#cover_page_slideshow ul').cycle({
                fx:       cycleFx,
                //loader: 'wait',
                speed:    cycleSpeed,
                timeout:  slideshowtimeout,
                pause:    0,
                slides: '.item',
                //autoHeight: 'calc',
                autoHeight: false,
                swipe: true,
                startingSlide: startingSlide
            });
            window.galleries.cover_page_slideshow.cover_page_pager();
            window.galleries.cover_page_slideshow.cover_page_caption();
        });

    },
    cover_page_pager: function() {
        var $pager = $('#cover_page_slideshow_number');
        var onfunction = $('#cover_page_slideshow').on;
        if (onfunction) {
            $('#cover_page_slideshow').on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                var next_number = (optionHash.nextSlide + 1).toString();
                $pager.find('.pager-number-current').text(next_number);
            });
        }
        $('#cover_page_slideshow_button_prev').click(function() {
            $('#cover_page_slideshow ul').cycle('pause');
            $('#cover_page_slideshow ul').cycle('prev');
        });
        $('#cover_page_slideshow_button_next').click(function() {
            $('#cover_page_slideshow ul').cycle('pause');
            $('#cover_page_slideshow ul').cycle('next');
        });
    },
    cover_page_caption: function() {
        
        var $caption = $('#cover_page_slideshow_pager');
        var onfunction = $('#cover_page_slideshow').on;
        if (onfunction) {
            $('#cover_page_slideshow').on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                var this_instance = $caption.closest('#cover_page_slideshow_container').find('#cover_page_slideshow ul');
                var this_caption = ($(incomingSlideEl, this_instance).attr('data-rel') && typeof $(incomingSlideEl, this_instance).attr('data-rel') != 'undefined' ? $(incomingSlideEl, this_instance).attr('data-rel') : $(incomingSlideEl, this_instance).attr('rel'));
                if (this_caption && typeof this_caption != 'undefined') {
                    var this_caption = this_caption.replace(/\n/g,'');
                }
                $('#cover_page_slideshow_caption .content').html(this_caption);
            });

        }
    }
}

window.galleries = window.galleries || {};
window.galleries.cover_page_slideshow = cover_page_slideshow;
export default cover_page_slideshow;