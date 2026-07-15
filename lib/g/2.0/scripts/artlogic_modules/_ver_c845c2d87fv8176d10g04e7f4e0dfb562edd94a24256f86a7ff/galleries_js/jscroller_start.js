import thumbnailScroller from '../plugins/thumbnailScroller.js'

var jscroller_start = {

    init: function(element, scroller_type) {

        $(element).thumbnailScroller({
            /* scroller type based on mouse interaction
            values: "hoverPrecise", "hoverAccelerate", "clickButtons"
            default: "hoverPrecise" */
            scrollerType: scroller_type,
            /* scroller orientation
            values: "horizontal", "vertical"
            default: "horizontal" */
            scrollerOrientation:"horizontal",
            /* scroll easing type only for "hoverPrecise" scrollers
            available values here: http://jqueryui.com/demos/effect/easing.html
            default: "easeOutCirc" */
            scrollEasing:"easeOutCirc",
            /* scroll easing amount only for "hoverPrecise" and "clickButtons" scrollers (0 for no easing)
            values: milliseconds
            default: 800 */
            scrollEasingAmount:800,
            /* acceleration value only for "hoverAccelerate" scrollers
            values: integer
            default: 2 */
            acceleration:1,
            /* scrolling speed only for "clickButtons" scrollers
            values: milliseconds
            default: 600 */
            scrollSpeed:800,
            /* scroller null scrolling area only for "hoverAccelerate" scrollers
            0 being the absolute center of the scroller
            values: pixels
            default: 0 */
            noScrollCenterSpace:80,
            /* initial auto-scrolling
            0 equals no auto-scrolling
            values: amount of auto-scrolling loops (integer)
            default: 0 */
            autoScrolling:0,
            /* initial auto-scrolling speed
            values: milliseconds
            default: 8000 */
            autoScrollingSpeed:2000,
            /* initial auto-scrolling easing type
            available values here: http://jqueryui.com/demos/effect/easing.html
            default: "easeInOutQuad" */
            autoScrollingEasing:"easeInOutQuad",
            /* initial auto-scrolling delay for each loop
            values: milliseconds
            default: 2500 */
            autoScrollingDelay:500,
            callbacks: {
                onInit: function() {
                    if ($('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled')) {
                        $('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled').attr('disabled', true);
                    } else {
                        $('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled').removeAttr('disabled');
                    }
                    if ($('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled')) {
                        $('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled').attr('disabled', true);
                    } else {
                        $('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled').removeAttr('disabled');
                    }
                },
                onScroll: function() {
                    if ($('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled')) {
                        $('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled').attr('disabled', true);
                    } else {
                        $('#ig_slideshow_thumbnails_container .jTscrollerPrevButton.disabled').removeAttr('disabled');
                    }
                    if ($('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled')) {
                        $('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled').attr('disabled', true);
                    } else {
                        $('#ig_slideshow_thumbnails_container .jTscrollerNextButton.disabled').removeAttr('disabled');
                    }
                }
            }
        });
    }

}

window.galleries = window.galleries || {};
window.galleries.jscroller_start = jscroller_start;
export default jscroller_start;