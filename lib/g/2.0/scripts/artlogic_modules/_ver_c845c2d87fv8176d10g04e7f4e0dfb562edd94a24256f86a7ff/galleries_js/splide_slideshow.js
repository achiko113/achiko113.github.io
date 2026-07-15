
let splide_slideshow = {

    init: () => {
        let $slideshow = $('.slideshow.splide').first()

        // hacky way to ensure it doesn't run
        // dynamic_modules_fallback loads all modules
        // disregarding conditions from galleries_js_modules
        if (!$slideshow.length) return;

        let interval = $slideshow.data('splide-interval')
        let custom_pagination = $slideshow.hasClass('pagination_gallery_locations');
        let show_arrows = $slideshow.hasClass('show-arrows')

        let splide_options = {
            interval: interval, //ms
            arrows: show_arrows,
        }

        if ($slideshow.hasClass('fullscreen_vertical')){
            $('body').addClass('type-fullscreen');
            splide_options = {
                ...splide_options,
                type: 'slide',
                direction   : 'ttb',
                height: '100vh',
                wheel       : true,
                releaseWheel: true,
                waitForTransition: true,
                speed: 700,
            }
        } else {
            splide_options = {
                ...splide_options,
                type: 'fade',
                rewind: true,
                pauseOnHover: false,
                autoplay: true,
            }
        }

        let splide = new Splide( '.slideshow', splide_options);
        
        if (custom_pagination) {
            let locations = $slideshow.data('custom-pagination').split(',')
            splide.on( 'pagination:mounted', function ( data ) {
                data.items.forEach( function ( item ) {
                    item.button.textContent = String( locations[item.page] );
                });
            });
        }

        if ($slideshow.hasClass('fullscreen') && !$slideshow.hasClass('split')){
            splide.on('active', function(data) {
                if (data.slide.classList.contains('fullscreen-slide-image-light')){
                    $slideshow.addClass('slide-light')
                    $('body').addClass('fullscreen-slide-light')
                    $slideshow.removeClass('slide-dark')
                    $('body').removeClass('fullscreen-slide-dark')
                } else if (data.slide.classList.contains('fullscreen-slide-image-dark')) {
                    $slideshow.addClass('slide-dark')
                    $('body').addClass('fullscreen-slide-dark')
                    $slideshow.removeClass('slide-light')
                    $('body').removeClass('fullscreen-slide-light')
                } else {
                    $slideshow.addClass('slide-dark')
                    $('body').addClass('fullscreen-slide-dark')
                    $slideshow.removeClass('slide-light')
                    $('body').removeClass('fullscreen-slide-light')
                }
            })
        }

        splide.mount();
    }
}

window.galleries = window.galleries || {};
window.galleries.splide_slideshow = splide_slideshow;
export default splide_slideshow;