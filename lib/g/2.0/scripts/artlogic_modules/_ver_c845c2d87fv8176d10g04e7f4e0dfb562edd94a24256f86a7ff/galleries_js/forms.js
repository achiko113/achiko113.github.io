var forms = {
        
    init: function() {
        
        $('.form').each(function() {
            if ($(this).hasClass('form_layout_hidden_labels')) {
                $('.form_row input[type="text"], .form_row input[type="email"], .form_row input[type="phone"], .form_row input[type="password"], .form_row textarea', this)
                    .each(function() {
                        var field_label = $(this).siblings('label').text();
                        if (field_label) {
                            $(this).attr('data-default-value', field_label).val(field_label);
                            $(this).attr('placeholder', field_label).val(field_label);
                            if ($(this).val() != '' && $(this).val() != $(this).attr('data-default-value')) {
                                $(this).addClass('active');
                            } else {
                                $(this).val($(this).attr('data-default-value'));
                            }
                        }
                    })
                    .change(function() {
                        $(this).closest('.form_row').removeClass('error');
                        if ($(this).val() != '' && $(this).val() != $(this).attr('data-default-value')) {
                            $(this).addClass('active');
                        }
                    })
                    .focus(function() {
                        $(this).removeClass('required-field');
                        $(this).closest('.form_row').removeClass('error');
                        if ($(this).val() == $(this).attr('data-default-value')) {
                            $(this).addClass('active');
                            $(this).val('');
                        }
                    })
                    .blur(function() {
                        $(this).attr('data-default-value', $(this).parent().find('label').text());
                        if ($(this).val() == '' || $(this).val() == $(this).attr('data-default-value')) {
                            $(this).val($(this).attr('data-default-value'));
                            $(this).removeClass('active');
                        }
                    })
                ;
            } 
        });
        
    }

}

window.galleries = window.galleries || {};
window.galleries.forms = forms
export default forms