import fancyboxPlugin from '../plugins/fancybox-2.1.3.js';

var mailinglist_signup_form_popup = {

  init: function() {
      
      $('#mailinglist_signup_close_popup_link, #mailinglist_signup_close_popup_link a, #mailing_list_popup_overlay')
          .off()
          .click(function() {
              window.galleries.mailinglist_signup_form_popup.close();
              return false;
          })
      ;

      $('a.mailinglist_signup_popup_link')
          .off()
          .click(function() {
              // For accessibility - tracks which element to refocus on
              try {
                  h.accessibility.global_variables.element_to_refocus_to = $(this);
              } catch(error) {
                  console.error(error);
              }
              if ($('body').hasClass('slide-nav-active')) {
                  $('#top_nav_reveal').trigger('click');
              }
              
              window.galleries.mailinglist_signup_form_popup.open();
              
              return false;
          })
      ;
      
      if (!$('body').hasClass('splash-loader-active')) {
          window.galleries.mailinglist_signup_form_popup.auto_popup();
      }
      if ($('#mailing_list_popup_container').hasClass('auto_popup_exit')) {
          // Exit intent
          if (!h.getCookie('shown_mailing_list_popup_exit_intent')) {
              setTimeout(function() {
                  var exit_intent_timeout;
                  $(document).off('mouseout.exitintent').on("mouseout.exitintent", function(evt) {
                      exit_intent_timeout = setTimeout(function() {
                          if(evt.toElement === null && evt.relatedTarget === null) {
                              $(evt.currentTarget).off('mouseout.exitintent');
                              $(evt.currentTarget).off('mouseover.exitintent');
                              window.galleries.mailinglist_signup_form_popup.auto_popup(true, 'exit_intent');
                          }
                      }, 750);
                  });
                  $(document).off('mouseover.exitintent').on("mouseover.exitintent", function(evt) {
                      if (typeof exit_intent_timeout != 'undefined') {
                          clearTimeout(exit_intent_timeout);
                      }
                  });
              }, 2000);
          }
      }
                  
                                              //
                                              // DEPRICATED METHOD
                                              //
                                              $('a#mailinglist_signup_popup_link')
                                                  .click(function() {
                              
                                                      $.fancybox.open(
                                                          '/contact/mailinglist_signup/?modal=1',
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
                                                              openSpeed: 400,
                                                                padding: 25,
                                                              afterShow: function() {
                                                                  window.galleries.mailinglist_signup_form_popup.after_popup();
                                                              }
                                                          }
                                                      );
                              
                                                      return false;
                                                  })
                                              ;
      
  },
  
  open: function() {
      
      $('body').addClass('mailing_list_popup_active');
      setTimeout(function() {
          $('body').addClass('mailing_list_popup_visible');
          h.accessibility.on_popup_opening($('#mailing_list_popup_box'), $('#mailing_list_popup_box').find('input[type!="hidden"]:first'), '#mailinglist_signup_close_popup_link a');
          window.galleries.mailinglist_signup_form_popup.after_popup();
      }, 50);
      
  },
  
  close: function() {
      
      $('body').removeClass('mailing_list_popup_visible');
      setTimeout(function() {
          $('body').removeClass('mailing_list_popup_active');
      }, 400);
      
      h.accessibility.on_popup_closing();
      
  },
  
  auto_popup: function(instant, context_name) {
      instant = typeof instant != 'undefined' ? instant : false;
      context_name = typeof context_name != 'undefined' ? '_' + context_name : '';
      if ($('#mailing_list_popup_container').hasClass('auto_popup')) {
          var timeout = 1000;
          var expiry = 3600;
          
          if ($('#mailing_list_popup_container').attr('data-timeout')) {
              timeout = parseFloat($('#mailing_list_popup_container').attr('data-timeout'))*1000;
          }
          
          if ($('#mailing_list_popup_container').attr('data-cookie-expiry')){
              expiry = parseFloat($('#mailing_list_popup_container').attr('data-cookie-expiry'));
          }
          
          if (typeof mailing_list_popup_timeout != 'undefined') {
              clearTimeout(mailing_list_popup_timeout);
          }
          
          if (window.location.search == '?mailings_popup_forced=1') {
              timeout = 2000;
          }
          if (instant) {
              timeout = 0;
          }
          
          var mailing_list_popup_timeout = setTimeout(function() {
              if (!$('body').hasClass('protected-path-login-mode')) {
                  if(instant || !h.getCookie('shown_mailing_list_popup' + context_name) || window.location.search == '?mailings_popup_forced=1'){
                      
                      var element_in_focus = $(':focus');
                      if (element_in_focus.length < 1) {
                          element_in_focus = $('#logo a');
                      }
                      
                      try {
                          h.accessibility.global_variables.element_to_refocus_to = element_in_focus;
                      } catch(error) {
                          console.error(error);
                      }
                      
                      window.galleries.mailinglist_signup_form_popup.open();
                      
                      $(document).off('mouseover.exitintent');
                      $(document).off('mouseout.exitintent');
                      
                      h.setCookie('shown_mailing_list_popup' + context_name, 'true', '', expiry); // Set cookie for chosen seconds
                  }
              }
          }, timeout);
      }
  },

  after_popup: function() {
        if (typeof google_captcha_onload != 'undefined') { 
            google_captcha_onload();
        }
  }

}

window.galleries = window.galleries || {};
window.galleries.mailinglist_signup_form_popup = mailinglist_signup_form_popup;
export default mailinglist_signup_form_popup;