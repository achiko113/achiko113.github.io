var global_analytics = {

    init: function() {

        var artwork_count = $('[data-record-type="artwork"]').length;
        // console.log("Artwork count: " + artwork_count);

        if (window.gtag) {
            gtag('event', 'artwork_viewed', {
                'dimension1': $('body').attr('date-site-name'),
                'metric1': artwork_count,
            });
        }

        if (window.ga) {
            var site_name = $('body').attr('data-site-name');
            ga('artlogic_tracker.send', 'event', 'artworks', 'view', {
                'dimension1':  site_name,
                'metric1': artwork_count
            });
        }

    },

    track_popup: function(){

        var artwork_count = $('#popup_content [data-record-type="artwork"]').length;
        // console.log("Artwork count: " + artwork_count);

        if (window.gtag) {
            gtag('event', 'artwork_viewed', {
                'dimension1': $('body').attr('date-site-name'),
                'metric1': artwork_count,
            });
        }

        if (window.ga) {
            var site_name = $('body').attr('data-site-name');
            ga('artlogic_tracker.send', 'event', 'artworks', 'view', {
                'dimension1':  site_name,
                'metric1': artwork_count
            });
        }

    }

}

window.galleries = window.galleries || {};
window.galleries.global_analytics = global_analytics;
export default global_analytics;