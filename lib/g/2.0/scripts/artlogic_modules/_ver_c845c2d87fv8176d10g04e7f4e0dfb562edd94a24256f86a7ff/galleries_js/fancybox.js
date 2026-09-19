var fancybox = {

    ajax_defaults: function() {
        return {
            type: 'ajax',
            autoSize: false,
            height: 'auto',
            width: 495,
            arrows: false,
            prevEffect: 'fade',
            nextEffect: 'fade',
            closeEffect: 'fade',
            openEffect: 'fade',
            wrapCSS: 'fancybox_ajax_popup',
            prevSpeed: 750,
            nextSpeed: 750,
            closeSpeed: 300,
            openSpeed: 750,
            afterShow: function() {

            }
        }
    }

}

window.galleries = window.galleries || {};
window.galleries.fancybox = fancybox;
export default fancybox;