import fancybox from '../plugins/fancybox-2.1.3.js';

var publications = {
    init: function() {
        //$(".publications_show_samples").click(function() {
            $("a.fancybox_gallery").fancybox();
        //    $("a.fancybox_gallery#sample_image_1").click();
        //})
    }
}

window.galleries = window.galleries || {};
window.galleries.publications = publications
export default publications