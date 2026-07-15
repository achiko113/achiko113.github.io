import fancyboxPlugin from '../plugins/fancybox-2.1.3.js';
import fancybox from './fancybox.js';
import misc from './misc.js'

var contact_form_popup = {

    init: function() {


        window.galleries.contact_form_popup.inline();
        window.galleries.contact_form_popup.custom();

        $('a[href$="/contact/form/"], .website_contact_form')
            .off()
            .addClass('website_contact_form')
            .addClass('link-no-ajax')
            .click(function() {
                window.galleries.contact_form_popup.on_button_click();

                // For accessibility - tracks which element to refocus on
                try {
                    h.accessibility.global_variables.element_to_refocus_to = $(this);
                } catch(error) {
                    console.error(error);
                }

                if (window.gtag) {
                    gtag('event', 'contact_form_popup', {});
                }

                if (window.ga) {
                    // Track the click in Analytics
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': 'Contact form popup',
                        'eventAction': window.location.pathname,
                        'eventLabel': $(document).attr('title')
                    });
                    // Track the click in second Analytics account
                    ga('tracker2.send', {
                        'hitType': 'event',
                        'eventCategory': 'Contact form popup',
                        'eventAction': window.location.pathname,
                        'eventLabel': $(document).attr('title')
                    });
                    ga('artlogic_tracker.send', {
                        'hitType': 'event',
                        'eventCategory': 'Contact form popup',
                        'eventAction': window.location.pathname,
                        'eventLabel': $(document).attr('title')
                    });
                }

                var form_options = {
                    'item_id': typeof $(this).attr('data-contact-form-item-id') != 'undefined' ? $(this).attr('data-contact-form-item-id') : '',
                    'item_table': typeof $(this).attr('data-contact-form-item-table') != 'undefined' ? $(this).attr('data-contact-form-item-table') : '',
                    'gallery_id': typeof $(this).attr('data-contact-form-gallery-id') != 'undefined' ? $(this).attr('data-contact-form-gallery-id') : '',
                    'gallery_email_address': typeof $(this).attr('data-contact-form-to') != 'undefined' ? $(this).attr('data-contact-form-to') : '',
                    'gallery_email_address_bcc': typeof $(this).attr('data-contact-form-to-bcc') != 'undefined' ? $(this).attr('data-contact-form-to-bcc') : '',
                    'form_heading': typeof $(this).attr('data-contact-form-heading') != 'undefined' ? $(this).attr('data-contact-form-heading') : '',
                    'form_button_label': typeof $(this).attr('data-contact-form-button-label') != 'undefined' ? $(this).attr('data-contact-form-button-label') : '',
                    'hide_additional_field_content': $(this).attr('data-contact-form-hide-context') && typeof $(this).attr('data-contact-form-hide-context') != 'undefined' ? ($(this).attr('data-contact-form-hide-context') == '1' ? true : false) : false,
                    'additional_field_content': typeof $(this).attr('data-contact-form-details') != 'undefined' ? $(this).attr('data-contact-form-details') : '',
                    'additional_field_image': $(this).attr('data-contact-form-image'),
                    'additional_field_parent_id': $(this).attr('data-contact-form-parent-id'),
                    'additional_field_type': $(this).attr('data-contact-form-type'),

                    'additional_terms_url': typeof $(this).attr('data-contact-form-additional-terms-url') != 'undefined' ? $(this).attr('data-contact-form-additional-terms-url') : '',
                    'additional_terms_label': typeof $(this).attr('data-contact-form-additional-terms-label') != 'undefined' ? $(this).attr('data-contact-form-additional-terms-label') : '',
                    'stock_number': $(this).attr('data-contact-form-stock-number') || '',
                    'default_message': typeof $(this).attr('data-contact-form-default-message') != 'undefined' ? $(this).attr('data-contact-form-default-message') : ''
                };

                if ($('#contact_form_overlay').length > 0) {

                    // Existing form on the page

                    window.galleries.contact_form_popup.form_setup(form_options);

                    if (form_options.additional_field_type && typeof form_options.additional_field_type != 'undefined') {
                        $('body').addClass('contact-form-overlay-type-' + form_options.additional_field_type);
                        $('#contact_form_overlay').addClass('form-type-container-' + form_options.additional_field_type);
                    } else {
                        $("body").removeClass (function (index, className) {
                            return (className.match (/(^|\s)contact-form-overlay-type-\S+/g) || []).join(' ');
                        });
                        $("#contact_form_overlay").removeClass (function (index, className) {
                            return (className.match (/(^|\s)form-type-container-\S+/g) || []).join(' ');
                        });
                    }

                    $('body').addClass('contact-form-init');

                    if (typeof contact_form_overlay_timeout != 'undefined') {
                        clearTimeout(contact_form_overlay_timeout);
                    }
                    var contact_form_overlay_timeout = setTimeout(function() {
                        if (!$('#contact_form_overlay').hasClass('active')) {
                            $('#contact_form_overlay').addClass('active');
                            $('body, html').addClass('contact-form-overlay-open');
                            h.accessibility.on_popup_opening('#contact_form_overlay', '#contact_form_header', '#contact_form_overlay_close a');
                            h.accessibility.role_button();
                        }
                    }, 50);

                    $('#contact_form_overlay_close a, #contact_form_overlay .overlay-bg').off().click(function() {
                        if ($('#contact_form_overlay').hasClass('active')) {
                            if (typeof contact_form_overlay_close_timeout != 'undefined') {
                                clearTimeout(contact_form_overlay_close_timeout);
                            }
                            var contact_form_overlay_close_timeout = setTimeout(function() {
                                $('body').removeClass('contact-form-init');
                            }, 600);
                            $('#contact_form_overlay').removeClass('active');
                            $('body, html').removeClass('contact-form-overlay-open');

                            h.accessibility.on_popup_closing();
                        }
                        return false;
                    });

                    if ($('.contact_form_captcha_enabled').length > 0) {
                        if (typeof grecaptcha != 'undefined') {
                            $.getScript('https://www.recaptcha.net/recaptcha/api.js?onload=google_captcha_onload', function(){
                                grecaptcha.reset();
                            });
                        }
                    }

                    window.galleries.contact_form_popup.after_popup_callback();

                } else {

                    // Open in fancybox popup

                    var form_url_params = '?modal=1';
                    if (form_options.additional_field_parent_id) {
                        var form_url_params = form_url_params + '&id=' + form_options.additional_field_parent_id;
                    }

                    var url_prefix = '';
                    if (typeof window.archimedes.proxy_dir != 'undefined') {
                        var url_prefix = window.archimedes.proxy_dir;
                    }

                    if (window.location.search && typeof window.location.search != 'undefined') {
                        if (window.location.search.indexOf('_holding_preview_uid') > -1) {
                            var form_url_params = form_url_params + '&' + window.location.search.replace('?', '');
                        }
                    }

                    $.fancybox.open(
                        url_prefix + '/contact/form/' + form_url_params,
                        {
                            type: 'ajax',
                            autoSize: false,
                            height: 'auto',
                            width: 420,
                            arrows: false,
                            prevEffect: 'fade',
                            nextEffect: 'fade',
                            closeEffect: 'fade',
                            openEffect: 'fade',
                            wrapCSS: 'fancybox_ajax_popup',
                            prevSpeed: 750,
                            nextSpeed: 750,
                            closeSpeed: 200,
                            padding: 25,
                            openSpeed: 400,
                            overlayColor: 'transparent',
                            keys: {close: null},
                            afterLoad: function() {
                                $('.fancybox-overlay').addClass('fancybox-overlay-ajax');
                                $('.fancybox-overlay').addClass('fancybox-contact-form');
                                setTimeout(function() {
                                    if (form_options.form_heading && typeof form_options.form_heading != 'undefined') {

                                        if ($('#contact_form #contact_form_header[data-default-label]').length == 0) {
                                            $('#contact_form #contact_form_header').attr('data-default-label', $('#contact_form #contact_form_header').text());
                                        }
                                        $('#contact_form #contact_form_header').text(form_options.form_heading);
                                    } else if ($('#contact_form #contact_form_header[data-default-label]').length > 0) {
                                      
                                        $('#contact_form #contact_form_header').text($('#contact_form #contact_form_header').attr('data-default-label'));
                                    }

                                    if (form_options.form_button_label && typeof form_options.form_button_label != 'undefined') {
                                        if ($('#contact_form #contactFormSubmit > a[data-default-label]').length == 0) {
                                            $('#contact_form #contactFormSubmit > a').attr('data-default-label', $('#contact_form #contactFormSubmit > a').text());
                                        }
                                        $('#contact_form #contactFormSubmit > a').text(form_options.form_button_label);
                                    } else if ($('#contact_form #contactFormSubmit > a[data-default-label]').length > 0) {
                                        $('#contact_form #contactFormSubmit > a').text($('#contact_form #contactFormSubmit > a').attr('data-default-label'));
                                    }
                                }, 20, form_options.form_heading);
                            },
                            afterShow: function() {
                                window.galleries.contact_form_popup.form_setup(form_options);

                                h.accessibility.on_popup_opening('.fancybox-opened .fancybox-skin', false, '.fancybox-wrap .fancybox-close');
                                $('.fancybox-wrap .fancybox-skin').attr({role: "dialog", 'aria-modal': true, 'aria-labelledby': "contact_form_header"});
                                // Make the close link element act like a button
                                $('.fancybox-skin a[title="Close"], .fancybox-skin a[title="Previous"], .fancybox-skin a[title="Next"]').attr("role", "button");
                                h.accessibility.role_button();

                                window.galleries.contact_form_popup.after_popup_callback();
                            },

                            afterClose: function () {
                                h.accessibility.on_popup_closing();
                            }
                        }
                    );
                }

                return false;
            })
        ;
        if( $('#contact_form').length ){

            window.galleries.contact_form_popup.after_popup();
            $('#contact_form .link a, #contact_form .button a').off('click.contactform').on('click.contactform', function() {
                window.galleries.contact_form_popup.submit_form($(this).closest('#contact_form'));
                return false;
            });
            $('#contact_form_inline #contact_form').attr('role', 'region');

            if ($('.contact_form_captcha_enabled').length > 0) {
                if (typeof google_captcha_onload != 'undefined') {
                    Artlogic.import('galleries_js/recaptcha.js').then(function (module) {
                        google_captcha_onload();
                    });
                }
            }

        }

    },

    form_setup: function(form_options) {
        $('#contact_form form').find('*').filter(':input:visible:first').focus();
        window.galleries.contact_form_popup.after_popup();
        $('#contact_form #contact_form_item_preview').hide();
        $('#contact_form #contact_form_item_preview .inner').html('');
        $('#f_terms_accepted_additional').html('');
        if($('#contact_form #contact_form_header').text() == ''){
            //default value if it is null
            $('#contact_form #contact_form_header').text('Enquiry form');
        }
        if (form_options.additional_field_content || form_options.gallery_email_address || form_options.gallery_id != '') {
            if ($('#contact_form #contact_form_item_preview').length) {
                if (form_options.additional_field_content) {
                    $('#contact_form #contact_form_item_preview .inner').html('<div class="content">' + decodeURIComponent(form_options.additional_field_content) + '</div>');
                }
                if (form_options.additional_field_image) {
                    var website_domain = '';
                    if (form_options.additional_field_image.substr(0,7) != 'http://' && form_options.additional_field_image.substr(0,8) != 'https://') {
                        var website_domain = 'http://' + document.location.host;
                    }
                    $('#contact_form #contact_form_item_preview .inner').prepend('<div class="image"><img src="' + website_domain + form_options.additional_field_image + '" alt="' + jQuery(decodeURIComponent(form_options.additional_field_content)).text() + '"/></div>');
                }
                if (form_options.hide_additional_field_content) {
                    $('#contact_form #contact_form_item_preview').hide();
                } else {
                    if ($('#contact_form_overlay').length > 0) {
                        $('#contact_form #contact_form_item_preview').show();
                    } else {
                        $('#contact_form #contact_form_item_preview').slideDown(function() {
                            if ($(window).height() < $('.fancybox-wrap').height()) {
                                $.fancybox.update();
                            }
                        });
                    }
                }
            } else {
                $('#contact_form #f_message').val(form_options.additional_field_content);
            }

            if (form_options.additional_terms_url != '') {
                var additional_terms_html = '';
                var link_label = 'Privacy Policy';
                if (form_options.additional_terms_label != '') {
                    link_label = form_options.additional_terms_label;
                }
                $('#f_terms_accepted_additional').closest('label').addClass('additional-terms-enabled');
                $('#f_terms_accepted_additional').html('<span class="f_terms_separator">and</span> <a href="' + form_options.additional_terms_url + '" target="_blank">' + link_label + '</a>');
            }

            $('#contact_form #f_item_id').val(form_options.item_id);
            $('#contact_form #f_item_table').val(form_options.item_table);
            $('#contact_form #f_gallery_id').val(form_options.gallery_id);
            $('#contact_form #f_gallery_email_address').val(form_options.gallery_email_address);
            $('#contact_form #f_gallery_email_address_bcc').val(form_options.gallery_email_address_bcc);
            $('#contact_form #f_item_stock_number').val(form_options.stock_number);

            if (form_options.default_message) {
                $('#contact_form #f_message').val(form_options.default_message);
            }

            if (form_options.form_heading && typeof form_options.form_heading != 'undefined') {
                if ($('#contact_form #contact_form_header[data-default-label]').length == 0) {
                    $('#contact_form #contact_form_header').attr('data-default-label', $('#contact_form #contact_form_header').text());
                }
                $('#contact_form #contact_form_header').text(form_options.form_heading);
            } else if ($('#contact_form #contact_form_header[data-default-label]').length > 0) {
                $('#contact_form #contact_form_header').text($('#contact_form #contact_form_header').attr('data-default-label'));
            }

            if (form_options.form_button_label && typeof form_options.form_button_label != 'undefined') {
                if ($('#contact_form #contactFormSubmit > a[data-default-label]').length == 0) {
                    $('#contact_form #contactFormSubmit > a').attr('data-default-label', $('#contact_form #contactFormSubmit > a').text());
                }
                $('#contact_form #contactFormSubmit > a').text(form_options.form_button_label);
            } else if ($('#contact_form #contactFormSubmit > a[data-default-label]').length > 0) {
                $('#contact_form #contactFormSubmit > a').text($('#contact_form #contactFormSubmit > a').attr('data-default-label'));
            }

            $('#contact_form #f_product').val(encodeURIComponent(($('#contact_form #contact_form_item_preview .inner').length ? $('#contact_form #contact_form_item_preview .inner').html() : $('#contact_form #contact_form_item_preview').html())));
            let contact_form_header = $('#contact_form #contact_form_header').text()
            if(contact_form_header == ''){
                $('#contact_form #form_type').val('Enquiry form');
            } else {
                $('#contact_form #form_type').val(contact_form_header);
            }
            $('#contact_form #email_type').val('enquiry-form');
            if (form_options.additional_field_type && typeof form_options.additional_field_type != 'undefined') {
                $('#contact_form #form_type_name').val(form_options.additional_field_type);
                $('#contact_form').addClass('form-type-' + form_options.additional_field_type);
            } else {
                $('#contact_form #form_type_name').val('enquiry');
                $("#contact_form").removeClass (function (index, className) {
                    return (className.match (/(^|\s)form-type-\S+/g) || []).join(' ');
                });
            }
        }
        // If the contact/enquiry form contains work/product info, set focus to the form header instead of first input field
        if ($('#contact_form #contact_form_item_preview:visible').length && $('#contact_form_header').length) {
            $('#contact_form_header')[0].focus({preventScroll:true});
        }
    },

    custom: function() {

        $('#contact_form_custom').each(function() {
            $('#contact_form_custom .link a, #contact_form_custom .button:not(.custom_contact_form_button) a').off('click.contactform').on('click.contactform', function() {
                window.galleries.contact_form_popup.submit_form($(this).closest('#contact_form'));
                return false;
            });
        });

    },

    after_inline_callback: function() {

    },

    inline: function() {

        var url_prefix = '';
        if (typeof window.archimedes.proxy_dir != 'undefined') {
            var url_prefix = window.archimedes.proxy_dir;
        }
        $('#contact_form_inline, .section-contact.page-form').each(function() {
            $.ajax({
                url: url_prefix + "/contact/form/",
                data: 'modal=1&inline=1',
                cache: false,
                dataType: 'html',
                success: function(data) {
                    $('#contact_form_inline').html(data);
                    window.galleries.contact_form_popup.after_popup();
                    $('#contact_form .link a, #contact_form .button:not(.custom_contact_form_button) a').off('click.contactform').on('click.contactform', function() {
                        window.galleries.contact_form_popup.submit_form($(this).closest('#contact_form'));
                        return false;
                    });
                    $('#contact_form_inline #contact_form').attr('role', 'region');

                    if ($('.contact_form_captcha_enabled').length > 0) {
                        if (typeof google_captcha_onload != 'undefined') {
                            Artlogic.import('galleries_js/recaptcha.js').then(function (module) {
                                google_captcha_onload();
                            });
                        }
                    }
                    window.galleries.contact_form_popup.after_inline_callback();
                }
            });
        });




    },

    after_popup_callback: function() {

    },

    after_popup: function() {

        window.archimedes.archimedes_core.analytics.track_campaigns.set_forms();

        window.galleries.misc.loaders();

        $('#contact_form .link a, #contact_form .button:not(.custom_contact_form_button) a').off('click.contactform').on('click.contactform', function() {
            var instance = $(this).closest('#contact_form');
            if (!instance.hasClass('submitting')) {
                window.galleries.contact_form_popup.submit_form(instance);
            }
            return false;
        });

        if ($('.contact_form_captcha_enabled').length > 0) {
            if (typeof google_captcha_onload != 'undefined') {
                Artlogic.import('galleries_js/recaptcha.js').then(function (module) {
                    google_captcha_onload();
                });
            }
        }

    },

    submit_form: function(instance) {

        if (instance) {

            var data = {};

            var field_validation_error = false;


            $('input, select, textarea', instance).each(function() {
                if ($(this).closest('.form_row').hasClass('form_row_required')) {
                    let field_invalid = false;
                    if ($(this).is(':checkbox') && $(this).closest('form').find('input[name="' + $(this).attr('name') + '"]')) {
                        var checked = $(this).closest('form').find('input[name="' + $(this).attr('name') + '"]:checked').length > 0;
                        if (!checked || typeof checked == 'undefined') {
                            field_validation_error = true;
                            field_invalid = true;
                        }
                    } else if ($(this).is(':checkbox')) {
                        var checked = $(this).is(':checked');
                        if (!checked || typeof checked == 'undefined') {
                            field_validation_error = true;
                            field_invalid = true;
                        }
                    } else if ($(this).is(':radio')) {
                        var checked_radio = $('input[name="' + $(this).attr('name') + '"]:checked').val();
                        if (!checked_radio || typeof checked_radio == 'undefined') {
                            field_validation_error = true;
                            field_invalid = true;
                        }
                    } else if ($(this).is(':text') || $(this).is('textarea')) {
                        if ($(this).val() == '') {
                            field_validation_error = true;
                            field_invalid = true;
                        }
                    }
                    if (field_invalid) {
                        $(this).attr('aria-invalid', "true");
                        $(this).attr('aria-errormessage', "error");
                    } else {
                        $(this).removeAttr('aria-invalid');
                        $(this).removeAttr('aria-errormessage');
                    }
                }
                if ($(this).is(':checkbox') && $(this).closest('form').find('input[name="' + $(this).attr('name') + '"]')) {
                    // Multi checkboxes
                    var checked_options = $(this).closest('form').find('input[name="' + $(this).attr('name') + '"]:checked');
                    var checked_values = $.map(checked_options, function(n, i){
                        return n.value;
                    }).join(', ');
                    data[$(this).attr('name')] = checked_values;
                } else if ($(this).is(':radio')) {
                    var checked_radio = $('input[name="' + $(this).attr('name') + '"]:checked').val();
                    if (!checked_radio || typeof checked_radio == 'undefined') {
                        var checked_radio = '';
                    }
                    data[$(this).attr('name')] = checked_radio;
                } else if ($(this).attr('name') == 'f_message') {
                    data[$(this).attr('name')] = $(this).val().replace(/\n/g, '<br />');
                } else {
                    data[$(this).attr('name')] = $(this).val().replace(/\n/g, '<br />');
                }
            });

            if (field_validation_error) {
                $(instance).removeClass('submitting');

                // For accessibility - tracks which element to refocus on
                try {
                    h.accessibility.global_variables.element_to_refocus_to = $('#contactFormSubmit a');
                } catch(error) {
                    console.error(error);
                }

                var alert_heading = $('#contact_form[data-field-alert-heading]').length ? $('#contact_form[data-field-alert-heading]').attr('data-field-alert-heading') : 'Sorry';
                var alert_content = $('#contact_form[data-field-alert-content]').length ? $('#contact_form[data-field-alert-content]').attr('data-field-alert-content') : 'Please fill in all the required fields.';
                var alert_content_terms = $('#contact_form[data-field-alert-terms-content]').length ? $('#contact_form[data-field-alert-terms-content]').attr('data-field-alert-terms-content') : 'Please fill in all the required fields and agree to the terms and conditions.';

                if ($('#f_terms_accepted', instance).length && !$('#f_terms_accepted', instance).is(':checked')) {
                    h.alert('<h2>' + alert_heading + '</h2>' + alert_content_terms + '');
                } else {
                    h.alert('<h2>' + alert_heading + '</h2>' + alert_content + '');
                }
                //$('.error_row', instance).text('Please fill in all the required fields');
                //window.galleries.effects.pulsate($('.error_row', instance));
                return;
            }

            $(instance).addClass('submitting');
            $('.button', instance).addClass('loading');

            window.archimedes.archimedes_core.analytics.track_campaigns.save_form_data($(instance));

            // Process captcha

            if ($(instance).find('form').hasClass('contact_form_captcha_enabled')) {
                if (!$('body').hasClass('contact_form_captcha_challenge_passed')) {
                    var captcha_error = '<h2>Sorry</h2>An error occurred, please refresh this page and try again. If you continue to have problems please contact us for support.';
                    if (typeof grecaptcha != 'undefined') {
                        window.recaptcha_success_callback_instance = instance;
                        window.recaptcha_success_callback = function(instance) {
                            window.galleries.contact_form_popup.submit_form(instance);
                        };
                        try {
                            grecaptcha.execute();
                        } catch(error_message) {
                            h.alert(captcha_error);
                            $(instance).removeClass('submitting');
                            $('.button', instance).removeClass('loading');
                            $.ajax({
                                url: "/api/process_js_error/",
                                data: 'type=captcha&message=Captcha error on page ' + window.location.pathname + ' Error message: ' + error_message + '&fullurl=' + window.location.href,
                                cache: false
                            });
                        }
                    } else {
                        h.alert(captcha_error);
                        $(instance).removeClass('submitting');
                        $('.button', instance).removeClass('loading');
                        var error_message = 'Unknown error - grecaptcha may be undefined'
                        $.ajax({
                            url: "/api/process_js_error/",
                            data: 'type=captcha&message=Captcha error on page ' + window.location.pathname + ' Error message: ' + error_message + '&fullurl=' + window.location.href,
                            cache: false
                        });
                    }
                    return;

                } else {
                    $('body').removeClass('contact_form_captcha_challenge_passed');
                }
            }

            //data = encodeURI(data); // Encode form data so that unicode characters work
            data['originating_page'] = encodeURIComponent(window.location.pathname + window.location.search);

            var url_prefix = '';
            if (typeof window.archimedes.proxy_dir != 'undefined') {
                url_prefix = window.archimedes.proxy_dir;
            }

            $.ajax({
                url: url_prefix + "/contact/form/process/",
                data: data,
                cache: false,
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    $('.button', instance).removeClass('loading');
                    $(instance).removeClass('submitting');
                    if (data['success'] == 1) {
                        window.galleries.contact_form_popup.after_submit_success();

                        if ($('#contact_form_overlay').length > 0) {
                            $('#contact_form_overlay_close a').trigger('click');
                            if (typeof $('#contact_form_overlay').attr('data-confirmation-heading') != 'undefined' && typeof $('#contact_form_overlay').attr('data-confirmation-message') != 'undefined') {
                                var confirmation_message = $('#contact_form_overlay').attr('data-confirmation-message');
                                if ($('#form_type_name').length && typeof $('#form_type_name').val() != 'undefined') {
                                    if (typeof $('#contact_form_overlay').attr('data-confirmation-message-' + $('#form_type_name').val()) != 'undefined') {
                                        confirmation_message = $('#contact_form_overlay').attr('data-confirmation-message-' + $('#form_type_name').val());
                                    }
                                }
                                h.alert('<h2>' + $('#contact_form_overlay').attr('data-confirmation-heading') + '</h2>' + confirmation_message);
                            } else {
                                h.alert('<h2>Thank you</h2> Your enquiry has been sent.')
                            }
                        } else {
                            $.fancybox((url_prefix + '/contact/form/?modal=1&complete=1'), window.galleries.fancybox.ajax_defaults());
                        }

                        $('input[type="text"], select, textarea', instance).not('.campaign_tracking_autofilled').each(function() {
                            $(this).val('');
                        });

                        if (window.fbq && typeof window.fbq != 'undefined') {
                            // Track in Facebook Pixel
                            fbq('track', 'Lead');
                        }

                        if (window.gtag) {
                            gtag('event', 'contact_form_submit', {
                                'success': true,
                            });
                        }

                        if (window.ga) {
                            // Track in Analytics
                            ga('send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            // Track in second Analytics account
                            ga('tracker2.send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            ga('artlogic_tracker.send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit success',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                        }

                        if ($('.contact_form_captcha_enabled').length > 0) {
                            if (typeof grecaptcha != 'undefined') {
                                $.getScript('https://www.recaptcha.net/recaptcha/api.js?onload=google_captcha_onload', function(){
                                    grecaptcha.reset();
                                });
                            }
                        }

                        window.galleries.contact_form_popup.after_submit();
                    } else {
                        var error_message = '';
                        if (data['error_message'] && typeof data['error_message'] != 'undefined') {
                            var error_message = data['error_message'];
                        }
                        if (error_message) {
                            h.alert(error_message);
                        } else {
                            h.alert('<h2>Sorry</h2>An error occurred. Please try again.');
                        }

                        if (data['error_type'] && data['error_type'] == 'email_validation') {
                            $('input#f_email', instance).attr('aria-invalid', "true");
                            $('input#f_email', instance).attr('aria-errormessage', "error");
                        } else if (data['error_type']) {
                            // unknown error type, does not highlight any label
                        }

                        if (window.gtag) {
                            gtag('event', 'contact_form_submit', {
                                'success': false,
                            });
                        }

                        if (window.ga) {
                            // Track in Analytics
                            ga('send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            // Track in second Analytics account
                            ga('tracker2.send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                            ga('artlogic_tracker.send', {
                                'hitType': 'event',
                                'eventCategory': 'Contact form submit error',
                                'eventAction': window.location.pathname,
                                'eventLabel': $(document).attr('title')
                            });
                        }

                        if ($('.contact_form_captcha_enabled').length > 0) {
                            if (typeof grecaptcha != 'undefined') {
                                $.getScript('https://www.recaptcha.net/recaptcha/api.js?onload=google_captcha_onload', function(){
                                    grecaptcha.reset();
                                });
                            }
                        }

                    }
                }
            });
        }

    },
    
    on_button_click: function() {

    },

    after_submit_success: function() {

    },

    after_submit: function() {

    }

}

window.galleries = window.galleries || {};
window.galleries.contact_form_popup = contact_form_popup
export default contact_form_popup