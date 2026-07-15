import ar_slider from '../plugins/jquery.augmented_reality.1.0.js'

var ar_artworks = {
    
    init: function () {
        // Triggers /plugins/augmented_reality/1.0/jquery.augmented_reality.1.0.js
        if ($('.view-in-ar-button').length) {
            var splash_screen_timeout = 0
            if ($('#home_splash').attr('data-timeout') && $('#home_splash').attr('data-timeout') != 'undefined') {
                splash_screen_timeout = parseInt($('#home_splash').attr('data-timeout')) + 2500;
            };
            $('.view-in-ar-button').ar_slider({ splash_screen_timeout: splash_screen_timeout });
        }
    },
}

window.galleries = window.galleries || {};
window.galleries.ar_artworks = ar_artworks;
export default ar_artworks;
