var cookie_notification = {

  init: function () {
      var cookie_settings = {
          time_to_wait: 2000
      };
      var custom_cookie_settings = $('#cookie_notification').data('cookie-notification-settings') || {};
      $.extend(cookie_settings, custom_cookie_settings);

      $('#cookie_notification').each(function () {
          var mode = 'notify';
          if ($(this).attr('data-mode')){
              mode = $(this).attr('data-mode');
          }
          if(mode == 'consent'){
              var has_preferences = window.galleries.cookie_notification.get_cookie_preferences();
              if(!has_preferences){
                  // Display the cookie notification after a set amount of time
                  setTimeout(function () {
                      $('#cookie_notification').addClass('active')
                  }, cookie_settings.time_to_wait)

                  // Accept btn event listener
                  $('#cookie_notification_accept').click(
                      window.galleries.cookie_notification.cookie_consent_accept_btn_callback
                  );

                  // Reject btn event listener
                  $('#cookie_notification_reject').click(
                      window.galleries.cookie_notification.cookie_consent_reject_btn_callback
                  );

                  window.galleries.cookie_notification.manage_cookies_popup.init();
              }
              else {
                  $(this).hide();
              }
              
          } else {
              var notification_cookie = h.getCookie('cookie_notification_dismissed');
              if (!notification_cookie) {
                  // Display the cookie notification after a set amount of time
                  setTimeout(function () {
                      $('#cookie_notification').addClass('active')
                  }, cookie_settings.time_to_wait)

                  // Accept btn event listener
                  $('#cookie_notification_accept').click(
                      window.galleries.cookie_notification.cookie_notification_accept_btn_callback
                  );

              }
              else {
                  $(this).hide();
              }
          }
          
      });

      
  },

  cookie_notification_accept_btn_callback: function (e) {
      h.setCookie('cookie_notification_dismissed', '1', 365);
      /* Display:none the banner once it's transformed off the screen 
          - do this instead of $.hide because it's janky */
      $('#cookie_notification').on('transitionend', function (te) {
          if (te.originalEvent.propertyName == 'transform') {
              $('#cookie_notification').hide();
          }
      });
      $('#cookie_notification').removeClass('active');
      e.preventDefault();
  },

  cookie_consent_accept_btn_callback: function (e) {

      // Set all cookie consent options to true as they have accepted all
      var cookie_consent = {
          'essential': true,
          'functionality': true,
          'statistics': true,
          'marketing': true
      }

      // h.setCookie('cookie_consent', JSON.stringify(cookie_consent), 365);
      window.galleries.cookie_notification.set_cookie_preferences(
        cookie_consent
      );
      window.galleries.cookie_notification.hide_cookie_notification_banner();
      e.preventDefault();
  },

  cookie_consent_reject_btn_callback: function (e) {

      // Set only essential cookies to true, reject all others
      var cookie_consent = {
          'essential': true,
          'functionality': false,
          'statistics': false,
          'marketing': false
      }

      window.galleries.cookie_notification.set_cookie_preferences(
        cookie_consent
      );
      window.galleries.cookie_notification.hide_cookie_notification_banner();
      e.preventDefault();
  },

  hide_cookie_notification_banner: function (e) {
      
      /* Display:none the banner once it's transformed off the screen 
          - do this instead of $.hide because it's janky */
      $('#cookie_notification').on('transitionend', function (te) {
          if (te.originalEvent.propertyName == 'transform') {
              $('#cookie_notification').hide();
          }
      });
      $('#cookie_notification').removeClass('active');
      
  },

  set_cookie_preferences: function (cookie_preferences) {

      if (g.has_local_storage()) {
          var today = new Date();
          today = today.toISOString().substr(0, 10);
          cookie_preferences['date'] = today;
          localStorage.setItem(
              "cookie_preferences",
              JSON.stringify(cookie_preferences)
          );
          var update_consent = {}
          for (const [key, value] of Object.entries(cookie_preferences)) {
            if (key == 'date') continue;
            if (value == true) update_consent[key] = 'granted'
            if (key == 'marketing' && value == true) {
                update_consent['ad_storage'] = 'granted'
                update_consent['ad_user_data'] = 'granted'
                update_consent['ad_personalization'] = 'granted'
                update_consent['analytics_storage'] = 'granted'
            }
          }
          
          if (window.gtag) {
            gtag('consent', 'update', update_consent)
          }

          window.archimedes.archimedes_core.analytics.track_campaigns.init();
      }

  },

  get_cookie_preferences: function(){
      var result = false;
      if(g.has_local_storage()){
          var cookie_preferences = localStorage.getItem('cookie_preferences') || "";
          if (cookie_preferences) {
              cookie_preferences = JSON.parse(cookie_preferences);
              if (cookie_preferences.date) {
                  var expires_on = new Date(cookie_preferences.date);
                  expires_on.setDate(expires_on.getDate() + 365);
                //   console.log('cookie preferences expire on', expires_on.toISOString());
                  var valid = expires_on > new Date();
                  if (valid){
                      result = cookie_preferences;
                  }
              }
          }
      }
      return result;
  },

  get_cookie_preference: function (category) {
      var result = false;
      try {
          var cookie_preferences = localStorage.getItem('cookie_preferences') || "";
          if (cookie_preferences) {
              cookie_preferences = JSON.parse(cookie_preferences);
              if (cookie_preferences.date) {
                  var expires_on = new Date(cookie_preferences.date);
                  expires_on.setDate(expires_on.getDate() + 365);
                //   console.log('cookie preferences expire on', expires_on.toISOString());
                  var valid = expires_on > new Date();
                  if (valid && cookie_preferences.hasOwnProperty(category) && cookie_preferences[category]) {
                      result = true;
                  }
              }
          }
      }
      catch(e) {
          console.warn('get_cookie_preference() failed');
          return result;
      }
      console.log('cookie preference', category, result);
      return result;
  },

  manage_cookies_popup: {

      init: function(){

          $('#cookie_notification_preferences').off()
              .click(function () {
                  window.galleries.cookie_notification.manage_cookies_popup.open();
              });

          $('#manage_cookie_preferences_close_popup_link a, #manage_cookie_preferences_popup_overlay')
              .off()
              .click(function () {
                  window.galleries.cookie_notification.manage_cookies_popup.close(true);
                  return false;
              })
              ;


          $('#cookie_preferences_form').submit(function(e){
              e.preventDefault();
              var cookie_consent = {};
              $('input', this).not(':input[type=button], :input[type=submit], :input[type=reset]').each(function(){
                  cookie_consent[$(this).attr('name')] = $(this).prop('checked') ? true : false;
              });
              window.galleries.cookie_notification.set_cookie_preferences(cookie_consent);
              window.galleries.cookie_notification.manage_cookies_popup.close(false);
          }); 

      },

      open: function(){
          $('body').addClass('manage_cookie_preferences_popup_active');
          $('#cookie_notification').removeClass('active');
          setTimeout(function () {
              $('body').addClass('manage_cookie_preferences_popup_visible');
              h.accessibility.on_popup_opening($('#manage_cookie_preferences_popup_box'), false, '#manage_cookie_preferences_close_popup_link a');
              window.galleries.cookie_notification.manage_cookies_popup.after_popup();
          }, 50);
      },

      close: function(reopen_notification){
          $('body').removeClass('manage_cookie_preferences_popup_visible');
          setTimeout(function () {
              $('body').removeClass('manage_cookie_preferences_popup_active');
              if(reopen_notification){
                  $('#cookie_notification').addClass('active');
              }
              else {
                  window.galleries.cookie_notification.hide_cookie_notification_banner();
              }
          }, 400);

          h.accessibility.on_popup_closing();
      },

      after_popup: function(){

      }

  }
  
}

window.galleries = window.galleries || {};
window.galleries.cookie_notification = cookie_notification;
export default cookie_notification;