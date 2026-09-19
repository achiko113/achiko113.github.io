import layout from './layout.js';

var artist_list_slideshow = {

    init: function() {
        if (h.element_exists('#artist_list_slideshow') && !$('#artist_list_slideshow').hasClass('no-slideshow')) {

            if ($('#artist_list_slideshow').hasClass('content_follow')) {
                window.galleries.layout.content_follower('#artist_list_slideshow', '#sidebar');
            }

            $('#artist_list_slideshow ul').cycle({
                fx:     'fade',
                speed:    400,
                timeout:  7000,
                pause:   0,
                before: function(cSlide, nSlide, options) {
                    $('#artist_list_slideshow_nav a').removeClass('active');
                    var link_id = nSlide.id.replace('artist_list_slideshow_', 'artist_list_');
                    $('#artist_list_slideshow_nav #' + link_id).addClass('active');
                },
                after: function(cSlide, nSlide, options) {
                    var link_id = nSlide.id.replace('artist_list_slideshow_', 'artist_list_');
                    $('#artist_list_slideshow_nav #' + link_id).addClass('active');
                },
                slides: '>',
                autoHeight: 'calc'
            });

            var onfunction = $('#artist_list_slideshow ul').on;
            if (onfunction) {
                // Method for jQuery Cycle 2 ONLY

                // Function fired directly before the slide changes
                $('#artist_list_slideshow ul').on('cycle-before', function(event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
                    $('#artist_list_slideshow_nav a').removeClass('active');
                    var link_id = $(incomingSlideEl).attr('id').replace('artist_list_slideshow_', 'artist_list_');
                    $('#artist_list_slideshow_nav #' + link_id).addClass('active');
                });
            }

            if ($('#artist_list_slideshow.slideshow_pause').length > 0) {
                $('#artist_list_slideshow ul').cycle('pause');
            }

            $('#artist_list_slideshow_nav a').mouseover(function () {
                if ($('#artist_list_slideshow').is(':visible')) {
                    $('#artist_list_slideshow ul').cycle('pause');
                    $('#artist_list_slideshow ul').cycle(parseInt($(this).attr('id').split('artist_list_item')[1] - 1));
                    return false;
                }
            });

        }
    }
}

window.galleries = window.galleries || {};
window.galleries.artist_list_slideshow = artist_list_slideshow;
export default artist_list_slideshow;