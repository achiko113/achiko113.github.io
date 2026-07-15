import effects from './effects.js';

var mailing_list_form = {

    _send_url: '/mailing-list/signup/',
    _error_messages: '',

    init: function() {
        var self = this;
        $('#mailing_list_form, .mailing_list_form')
            .off()
            .each(function() {
                $('.field', this)
                    .each(function() {
                        $(this).val($(this).attr('data-default-value'));
                    })
                    .focus(function() {
                        if ($(this).val() == $(this).attr('data-default-value')) {
                            $(this).addClass('active').val('');
                        }
                    })
                    .blur(function() {
                        if ($(this).val() == '') {
                            $(this).removeClass('active').val($(this).attr('data-default-value'));
                        }
                    })
                ;
                $('.submit_button', this).click(function() {
                    $(this).closest('form').submit();
                    return false;
                });
                $('input, textarea', this).keypress(function(event) {
                    if (event.which == 13) {
                        $(this).closest('form').submit();
                        return false;
                    }
                });
            })
            .submit(function(e){
                e.preventDefault();
                $('.submit_button', this).closest('.button').addClass('loading');
                if ($("#mailing_list_form, #artlogic_mailinglist_signup_form").hasClass("submit_disabled")) {
                    return false;
                } else {
                    $("#mailing_list_form, #artlogic_mailinglist_signup_form").addClass("submit_disabled");
                }
                self._submit_form($(this).closest('form'));
            })
        ;
    },

    _form_data: function(instance) {

        var data = {}
        $('input, textarea, select', instance).each(function() {
            if ($(this).val() != $(this).attr('data-default-value')) {
                if($(this).attr('type')=='checkbox'){
                    if ($(this).prop('checked')) {
                        (data[$(this).attr('name')]) ? data[$(this).attr('name')] += ','+$(this).val() :  data[$(this).attr('name')] = $(this).val();
                    }
                } else {
                    data[$(this).attr('name')] = $(this).val();
                }
            } else {
                data[$(this).attr('name')] = '';
            }
        });
        return data;
    },

    _clear_form_data: function(instance) {
        //:not([type="hidden"] added new by DC - prevent hidden fields from being cleared as they ofter contain static campaign data etc
        $('input:not([type="checkbox"], [type="hidden"], [type="submit"]), textarea', instance).each(function() {
            $(this).val($(this).attr('data-default-value'));
        });
        $('input[type="checkbox"]', instance).each(function() {
            if ($(this).attr('data-autoset') && typeof $(this).attr('data-autoset') != 'undefined') {
                // Dont reset this as it was auto set as checked
            } else {
                $(this).prop('checked', false);
            }
        });
        $('.error', instance).text('').hide();
    },

    _mandatory_fields: function(instance) {
        var self = this,
            flag = true;
        $('input[type!="hidden"], textarea', instance).each(function(i) {
            var currentInput = $('input[type!="hidden"], textarea', instance).eq(i);
            if (currentInput.attr('required') && (currentInput.val() == '' || currentInput.val() == currentInput.attr('data-default-value'))) {
                currentInput.addClass('required-field');
                currentInput.attr('aria-invalid', "true");
                currentInput.attr('aria-errormessage', "error");
                flag = false;
            } else {
                currentInput.removeClass('required-field');
                currentInput.removeAttr('aria-invalid');
                currentInput.removeAttr('aria-errormessage');
            }
        });
        if (!flag) {
            var error_message = $(instance).attr('data-field-error') && typeof $(instance).attr('data-field-error') != 'undefined' ? $(instance).attr('data-field-error') : 'Please fill in all required fields.';
            self._set_error(error_message);
            return false;
        }
        if ($('input[name="terms_accepted"]', instance).length && !$('input[name="terms_accepted"]', instance).is(':checked')) {
            var error_message = $(instance).attr('data-terms-error') && typeof $(instance).attr('data-terms-error') != 'undefined' ? $(instance).attr('data-terms-error') : 'Please agree to the terms and conditions.';
            self._set_error(error_message);
            return false;
        }
        return flag;
    },

    _email_is_valid: function(instance) {
        var self = this,
            flag = false,
            email = self._form_data(instance)['email'],
            $emailfield = $("input#email", instance).first();
        
        if (!self._form_data(instance)['email']) {
            flag = false;
        } else if (email.indexOf('@') > -1 && email.split('@')[1].indexOf('.') > -1 && email.indexOf(' ') == -1) {
            flag = true;
        }
        
        /* Set error message */
        if (!flag) {
            $emailfield.attr('aria-invalid', "true");
            $emailfield.attr('aria-errormessage', "error");
            self._set_error('Please enter a valid email address.');
            return false
        }
        $emailfield.removeAttr('aria-invalid');
        $emailfield.removeAttr('aria-errormessage');
        return flag;


    },

    _emails_match: function(instance) {

        // We are NOT matching the emails on this form
        return true;

        var self = window.galleries.mailing_list_form,
            flag = false;

        self._form_data(instance)['email2'] == self._form_data(instance)['email'] ? flag = true : flag = false;

        /* Set error message */
        if (!flag) {
            self._set_error('Your email addresses do not match.');
        }
        return flag;
    },

    _email_not_exists: function(instance) {
        
        // Depricated function - not currently used
        
        var self = window.galleries.mailing_list_form,
            flag = false;

        $.ajax({
            url: '/mailing-list/artlogicmailings/email_exists/',
            type: "POST",
            dataType: 'json',
            data: {'email': self._form_data(instance)['email']},
            success: function(data){
                flag = data['exists'] ? flag = false : flag = true;
            },
            error: function(jqXHR,textStatus,errorThrown){
                console.log(errorThrown);
            },
            async: false
        });

        /* Set error message */
        if (!flag) {
            self._set_error('Your email address already exists on our mailing list.');
        }
        return flag;
    },

    _run_captcha: function(instance) {
        let is_visible = instance.hasClass('contact_form_captcha_visible')
        
        if (is_visible) {
            window.galleries.mailing_list_form._send_form(instance);
        } else {
            window.recaptcha_success_callback_instance = instance;
            window.recaptcha_success_callback = function(instance) {
                window.galleries.mailing_list_form._send_form(instance);
            };
            try {
                grecaptcha.execute();
            } catch(error_message) {
                this._set_error('<h2>Sorry</h2>An error with captcha occurred, please refresh this page and try again. If you continue to have problems please contact us for support.')
            }
        }
    },

    _set_error: function(error) {
        this._error_messages = error;
    },

    _display_error: function(instance) {
        $('.submit_button', instance).closest('.button').removeClass('loading');
        
        var self = this;
        var error_messages_str = '' + self._error_messages + ''
        var error_heading = $(instance).attr('data-field-error-heading') && typeof $(instance).attr('data-field-error-heading') != 'undefined' ? '<h2>' + $(instance).attr('data-field-error-heading') + '</h2>' : '';
        if (error_heading && typeof error_heading != 'undefined') {
            error_messages_str = '' + error_heading + '' + error_messages_str;
        }
        if ($(instance).hasClass('popup_error')) {
            h.alert(error_messages_str);
        } else {
            var error_element = $('.error', instance);
            if (!error_element.length) {
                // Fall back to error container outside the mailing list form
                error_element = $('.error');
            }
            
            $(error_element).html(error_messages_str);
            window.galleries.effects.pulsate($(error_element));
            $(error_element).focus();
        }
        
        //var error_heading = $(instance).attr('data-field-error-heading') && typeof $(instance).attr('data-field-error-heading') != 'undefined' ? '<h2>' + $(instance).attr('data-field-error-heading') + '</h2>' : '';
        //h.alert(error_heading + error_messages_str);
    },

    _submit_form: function(instance) {
        var self = this
        if (self._mandatory_fields(instance) && self._email_is_valid(instance) && self._emails_match(instance)) {
            // ensure that captcha is enabled on this exact form, not enabled globally
            if ($(instance).closest('form').hasClass('contact_form_captcha_enabled') && typeof grecaptcha != 'undefined') {
                // captcha callback runs the actual submission form
                self._run_captcha(instance)
            }else {
                self._send_form(instance)
            }
        } else {
            self._display_error(instance);
            $("#mailing_list_form, #artlogic_mailinglist_signup_form").removeClass("submit_disabled");
        }
    },

    _send_form: function(instance) {
        var self = this;
        
        if (self._mandatory_fields(instance) && self._email_is_valid(instance) && self._emails_match(instance)) {
            $.ajax({
                url: self._send_url,
                type: "POST",
                dataType: 'json',
                data: self._form_data(instance),
                success: function(data) {
                    
                    $('.submit_button', instance).closest('.button').removeClass('loading');
                    
                    if (data.success) {
                        self._after_submit(instance);

                        if (window.gtag) {
                            gtag('event', 'mailing_list_submit', {
                                'success': true,
                            });
                        }
                        
                        if (window.ga) {
                            // Track in Analytics
                            ga('send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            // Track in second Analytics account
                            ga('tracker2.send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            ga('artlogic_tracker.send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                        }
                        
                        if (data.already_exists) {
                            var thanks_message_heading = $(instance).attr('data-field-exists-heading') && typeof $(instance).attr('data-field-exists-heading') != 'undefined' ? $(instance).attr('data-field-exists-heading') : 'Thank you';
                            var thanks_message_content = $(instance).attr('data-field-exists-content') && typeof $(instance).attr('data-field-exists-content') != 'undefined' ? $(instance).attr('data-field-exists-content') : 'You are already on our mailing list';
                        } else {
                            var thanks_message_heading = $(instance).attr('data-field-thanks-heading') && typeof $(instance).attr('data-field-thanks-heading') != 'undefined' ? $(instance).attr('data-field-thanks-heading') : 'Thank you';
                            var thanks_message_content = $(instance).attr('data-field-thanks-content') && typeof $(instance).attr('data-field-thanks-content') != 'undefined' ? $(instance).attr('data-field-thanks-content') : 'You have been added to our mailing list';
                        }
                        h.alert('<h2>' + thanks_message_heading + '</h2> ' + thanks_message_content + '.');
                        self._clear_form_data(instance);
                        
                        if ($('body').hasClass('mailing_list_popup_active')) {
                            window.galleries.mailinglist_signup_form_popup.close();
                        }
                        
                    } else {

                        if (window.gtag) {
                            gtag('event', 'mailing_list_submit', {
                                'success': false,
                            });
                        }
                        
                        if (window.ga) {
                            // Track in Analytics
                            ga('send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            // Track in second Analytics account
                            ga('tracker2.send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            ga('artlogic_tracker.send', {
                                'hitType': 'event',
                                'eventCategory': 'Mailing list submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                        }
                        
                        self._set_error('There was a problem adding you to the mailing list, please check the form and try again.');
                        if (data.error_message) {
                            self._set_error(data.error_message);
                        }
                        self._display_error(instance);
                    }
                    $("#mailing_list_form, #artlogic_mailinglist_signup_form").removeClass("submit_disabled");
                    if (typeof grecaptcha != 'undefined') {
                        grecaptcha.reset();
                    }
                }
            });
        } else {
            self._display_error(instance);
            if (typeof grecaptcha != 'undefined') {
                grecaptcha.reset();
            }
            $("#mailing_list_form, #artlogic_mailinglist_signup_form").removeClass("submit_disabled");
        }
    },
    
    _after_submit: function(instance) {
        
    }
}

window.galleries = window.galleries || {};
window.galleries.mailing_list_form = mailing_list_form
export default mailing_list_form