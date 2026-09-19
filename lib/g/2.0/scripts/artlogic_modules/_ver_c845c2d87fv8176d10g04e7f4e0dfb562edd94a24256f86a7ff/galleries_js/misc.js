var misc = {
            
    init: function() {
        window.galleries.misc.loaders();
        window.galleries.misc.extended_click_area();
    },
    
    loaders: function() {
        $('.button').each(function() {
            if (!$('.button_loader', this).length) {
                $(this).append('<div class="button_loader" aria-hidden="true"></div>');
            }
        });
        $('.loader_simple, .button_loader, .loader_basic').each(function() {
            if (!$('svg', this).length) {
                $(this).append('<svg class="loader" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"/></svg>');
            }
        });
    },
    
    extended_click_area: function() {
        $('.extended_click_area:not(.click_event_added)').each(function(){
            var link_element = $(this).closest('.item').length ? $(this).closest('.item').find('a:not(.click_area_exclude)') : $(this).closest('li').find('a:not(.click_area_exclude)');
            if (link_element.length) {
                $(this).addClass('click_event_added');
            } else {
                $(this).removeClass('extended_click_area');
            }
        }).click(function(){
            var link_element = $(this).closest('.item').length ? $(this).closest('.item').find('a:not(.click_area_exclude)') : $(this).closest('li').find('a:not(.click_area_exclude)');
            if (link_element.length) {
                link_element[0].click();
            } else {
                $(this).removeClass('extended_click_area');
            }
        });
    }
    
}

window.galleries = window.galleries || {};
window.galleries.misc = misc;
export default misc;