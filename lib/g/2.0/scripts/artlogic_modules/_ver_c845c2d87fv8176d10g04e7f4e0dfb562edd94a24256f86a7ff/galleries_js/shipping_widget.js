
var shipping_widget = {

    init: function() {
        if ($('.convelio-widget-button').length) {
            $('.convelio-widget-button[data-public-key]').each(function() {
                $(this).find('a').off().click(function() {
                    var convelio_button_instance = $(this).closest('.convelio-widget-button');
                    var current_item = {
                        length: parseInt($(convelio_button_instance).data('width')),
                        height: parseInt($(convelio_button_instance).data('height')),
                        width: parseInt($(convelio_button_instance).data('depth')),
                        weight: ($(convelio_button_instance).data('weight') && typeof $(convelio_button_instance).data('weight') != 'undefined' && $(convelio_button_instance).data('weight') != '0' ? $(convelio_button_instance).data('weight') : false), // optional
                        quantity: 1,
                        value: {
                        amount: $(convelio_button_instance).data('amount'),
                        currency_code: $(convelio_button_instance).data('currency_code'), // can be 'EUR', 'USD' or 'GBP'
                        },
                        name: $(convelio_button_instance).data('name'),
                        description: $(convelio_button_instance).data('description'), // optional
                        packing_type: $(convelio_button_instance).data('is_packed') && typeof $(convelio_button_instance).data('is_packed') != 'undefined' ? 'wood_crated' : 'not_packed', // optional, can be 'not_packed' or 'wood_crated'
                        type: 'artwork',
                        measurement_system: 'metric' // optional, can be 'metric' or 'us'
                    };
                    
                    var gallery_address = {
                        street: $(convelio_button_instance).attr('data-address-street'),
                        city: $(convelio_button_instance).attr('data-address-city'),
                        postcode: $(convelio_button_instance).attr('data-address-postcode'),
                        state: $(convelio_button_instance).attr('data-address-state'),
                        country: $(convelio_button_instance).attr('data-address-country'),
                        country_code: $(convelio_button_instance).attr('data-address-country-code')
                    };
                    
                    var pickup_contact = {
                        email: $(convelio_button_instance).attr('data-address-email'),
                        phone: $(convelio_button_instance).attr('data-address-phone'),
                        first_name: $(convelio_button_instance).attr('data-address-contact-first-name'),
                        last_name: $(convelio_button_instance).attr('data-address-contact-last-name')
                    };
                    
                    var convelio_object = {
                        publicApiKey: $(convelio_button_instance).attr('data-public-key'),
                        companyName: $(convelio_button_instance).attr('data-company-name'), 
                        item: current_item,
                        pickupAddress: gallery_address,
                        pickupContact: pickup_contact,
                        customerReferenceNumber: typeof $(convelio_button_instance).attr('data-ref-no') != 'undefined' ? $(convelio_button_instance).attr('data-ref-no') : ''
                    };
                    
                    console.log('## Convelio widget');
                    console.log(convelio_object);
                    
                    window.CVOQW.settings(convelio_object);
                    
                    CVOQW.open();
                    return false;
                });
            });
        }
    }
    
}

if (window.CVOQW == undefined) {
    $.getScript('https://storage.googleapis.com/widget-convelio-com/cvoqw.js');
}

window.galleries = window.galleries || {};
window.galleries.shipping_widget = shipping_widget;
export default shipping_widget;
