var plugin_tweaks = {

    init: function() {
        $('#mc_embed_signup .mc-field-group #mce-EMAIL').not('[name]').attr('name', 'EMAIL');
        if ($('body').hasClass('page-param-type-simplified')) {
            $('#mc_embed_signup > form[target="_blank"]').each(function() {
                // $(this).submit(function() {
                //     window.parent.$.fancybox.close();
                // });
            });
        }
    }

}

window.galleries = window.galleries || {};
window.galleries.plugin_tweaks = plugin_tweaks;
export default plugin_tweaks;