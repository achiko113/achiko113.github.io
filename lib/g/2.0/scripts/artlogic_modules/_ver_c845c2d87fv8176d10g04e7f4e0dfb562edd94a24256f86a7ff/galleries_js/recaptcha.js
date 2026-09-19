
export default (function(){
    window.recaptcha_success_callback_instance = null;
    window.recaptcha_success_callback = function() {};

    window.google_captcha_onload = function(token) {
        setTimeout(function() {
            try {
                if (!$('body').hasClass('protected-path-login-mode')) {
                    $('.contact_form_captcha_enabled').each(function() {
                        if (!$(this).hasClass('initialized')) {
                            let is_visible = $(this).hasClass('contact_form_captcha_visible')
                            
                            // only initialise captcha for the captcha element inside this form
                            // cos that's not how it used to work ¯\_(ツ)_/¯
                            let captcha_container = $(this).find('#contact_form_recaptcha_container')[0]
                            grecaptcha.render(captcha_container, { 
                            sitekey: '6LeQ5TQaAAAAAL0PpYABhN5kYFLmywEMGlK0OD2-', 
                            size: is_visible ? 'normal' : 'invisible',
                            badge: 'bottomright',
                            callback: function(token) {
                                
                                if (typeof window.recaptcha_error_timeout != 'undefined') {
                                    clearTimeout(window.recaptcha_error_timeout);
                                }
                                
                                $('input[name="g-recaptcha-response"]').val(token);
                                $('body').addClass('contact_form_captcha_challenge_passed');
                                window.recaptcha_success_callback(window.recaptcha_success_callback_instance);
                            },
                            expired_callback: function() {
                                h.alert('An error occurred, please refresh and try again. If you are still having difficulties please contact us.');
                            },
                            error_callback: function() {
                                h.alert('An error occurred, please refresh and try again. If you are still having difficulties please contact us.');
                            }
                            });
                        }
                        $(this).addClass('initialized');
                    });
                }
            } catch(err) {
            
            }
        }, 200, token);
    }

    if (window.recaptcha == undefined) {
        $.getScript('https://www.recaptcha.net/recaptcha/api.js?onload=google_captcha_onload');
    }
})();