var prevent_user_image_save = {
    init: function() {
        if ( $('body.prevent_user_image_save').length > 0 ) {
            $('.image a, .records_list a, .image-wrapper a').attr('draggable', 'false');
            $('img').css({"-webkit-touch-callout": "none","-webkit-user-select":"none","-moz-user-select":"none","-ms-user-select":"none","user-select":"none"});
        }
    }
}

window.galleries = window.galleries || {};
window.galleries.prevent_user_image_save = prevent_user_image_save;
export default prevent_user_image_save