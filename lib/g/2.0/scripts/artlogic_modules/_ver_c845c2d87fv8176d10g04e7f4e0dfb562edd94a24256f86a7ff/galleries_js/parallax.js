import parallaxPlugin from '../plugins/parallax.js'
import device from './device.js';

var parallax = {

    init: function() {
        if (!window.galleries.device.handheld()) {
            $('.parallax-element').each(function() {
                $('body').addClass('page-parallax-animate');
                $(this).parallax({imageSrc: $(this).attr('data-image-src')});
                setTimeout(function() {
                    $('body').removeClass('page-parallax-animate')
                }, 50);
            });
        }
        $(window).resize(function(){
            if (($(window).width() <= 767 || window.galleries.device.handheld()) && $('#hero_header').length) {
                $('#hero_header').addClass('parallax-disabled');
            } else if ($('#hero_header').length) {
                $('#hero_header').removeClass('parallax-disabled');
            }
        });
    }

}

window.galleries = window.galleries || {};
window.galleries.parallax = parallax;
export default parallax;