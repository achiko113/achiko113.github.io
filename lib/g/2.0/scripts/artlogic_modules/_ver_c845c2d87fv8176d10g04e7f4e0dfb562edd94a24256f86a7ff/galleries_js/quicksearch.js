var quicksearch = {

    init: function() {
        
        if ($('.header_quick_search').length) {
            $('.header_quick_search .inputField')
                .off()
                .each(function() {
                    if ($(this).attr('data-default-value') && !$(this).val()) {
                        $(this).val($(this).attr('data-default-value'));
                    }
                    if ($('.header_quick_search').hasClass('header_quick_search_reveal')) {
                        //$(this).attr('data-width', '68');
                        //$(this).width(0);
                    }
                })
                .focus(function(){
                    if ($(this).val() == $(this).attr('data-default-value')){
                        $(this).val( '' ).closest('.header_quick_search').addClass('active');
                        $('#top_nav').addClass('header_quick_search_reveal_open');
                        $('body').addClass('header_quick_search_open');
                    }
                })
                .blur(function(){
                    if ($(this).val() == ''){
                        if ($(this).closest('.header_quick_search').hasClass('header_quick_search_reveal')) {
                            //$(this).animate({'width': '0'});
                        }
                        $(this).val($(this).attr('data-default-value')).closest('.header_quick_search').removeClass('active');
                        $('#top_nav').removeClass('header_quick_search_reveal_open');
                        $('body').removeClass('header_quick_search_open');
                    }
                })
            ;
            $('.header_quick_search .header_quicksearch_btn').click(function() {
                if (!$(this).closest('.header_quick_search').find('.header_quicksearch_field').val() || $(this).closest('.header_quick_search').find('.header_quicksearch_field').val() == $(this).closest('.header_quick_search').find('.header_quicksearch_field').attr('data-default-value')) {

                    if ($(this).closest('.header_quick_search').hasClass('header_quick_search_reveal')) {
                        //$('#header_quicksearch_field').animate({'width': $('#header_quicksearch_field').attr('data-width') + 'px'});
                    }
                    $(this).closest('.header_quick_search').find('.header_quicksearch_field').select().focus();
                    return false;
                } else {
                    $(this).closest('.header_quick_search').find('form')[0].submit()
                }

                $(this).closest('form').submit();
                return false;
            });
        }

        $('#quicksearch_field')
            .each(function() {
                if ($(this).attr('data-default-value') && !$(this).val()) {
                    $(this).val($(this).attr('data-default-value'));
                }
            })
            .click(function() {
                if ($('#quicksearch_field').val() == $('#quicksearch_field').attr('data-default-value') || $('#quicksearch_field').val() == 'Search...' || $('#quicksearch_field').val() == 'Recherche...') {
                    $('#quicksearch_field').val('');
                }
                $('#quicksearch_field').addClass('active');
            })
        ;

        $('#quicksearch_btn').click(function() {
            if (!$('#quicksearch_field').val() || $('#quicksearch_field').val() == $('#quicksearch_field').attr('data-default-value')) {
                h.alert('You have not entered a search term!');
                $('#quicksearch_field').select();
            } else {
                $('#quicksearch_form')[0].submit()
            }
        });

    }

    }

window.galleries = window.galleries || {};
window.galleries.quicksearch = quicksearch
export default quicksearch