var image_attributes = {

    init: function() {
        const $img = $('img[data-responsive-src][data-mobile-responsive-src]');
        const render_img = window.galleries.debounce(200,() => image_attributes.set_image_src($img));
        render_img();
        $(window).on('resize', render_img);


    },
    parse_image_attributes: function(attributes) {
        try {
            return JSON.parse(attributes.replace(/'/g, '"'));
        } catch (e) {
            console.error("Invalid responsive src JSON", e);
            return {};
        }
    },
    get_closest_breakpoints: function(breakpoints, width) {
        const sorted = Object.keys(breakpoints)
            .map(Number)
            .sort((a, b) => a - b);
        let closest = sorted[0];
        for (let i = 1; i < sorted.length; i++) {
            if (width >= sorted[i]) {
                closest = sorted[i];
            } else {
                break;
            }
        }
        return breakpoints[closest];
    },
    set_image_src: function($img, threshold = 768) {
        const width = $(window).width();
        const isMobile = width <= threshold;
        
        $img.each(function () {
            let $this_img = $(this)

            const desktopSrcs = image_attributes.parse_image_attributes($this_img.attr('data-responsive-src'));
            const mobileSrcs = image_attributes.parse_image_attributes($this_img.attr('data-mobile-responsive-src'));
            
            const responsiveSrc = isMobile ? mobileSrcs : desktopSrcs;
            const selectedSrc = image_attributes.get_closest_breakpoints(responsiveSrc, width);
            
            if (selectedSrc && $this_img.attr('src') !== selectedSrc) {
                $this_img.attr('src', selectedSrc);
                $this_img.removeClass("slider_image_init_hide");
            }
        })
    }
}

window.galleries = window.galleries || {};
window.galleries.image_attributes = image_attributes;
export default image_attributes;
