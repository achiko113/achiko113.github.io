var additional = {
            
    init: function() {
        // Fix for IE6-7 image link problem..
        // Image links in record lists are unclickable in IE6/7
        if (navigator.userAgent.indexOf('MSIE 7') > -1 || navigator.userAgent.indexOf('MSIE 6') > -1) {

            $('div.records_list a span.image img').click(function() {
                var parent_a = $(this).parents('a');
                if (!parent_a.hasClass('image_popup')) {
                    window.location.href = parent_a.attr('href');
                }

            })

        }
        
        if ($('[data-main-content-record-id]').length) {
            var record_id_value = $('[data-main-content-record-id]').attr('data-main-content-record-id');
            if (record_id_value && typeof record_id_value != 'undefined') {
                $('body').addClass('page-content-record-id-' + String(record_id_value));
            }
        }
    }
    
}

window.galleries = window.galleries || {};
window.galleries.additional = additional;
export default additional;