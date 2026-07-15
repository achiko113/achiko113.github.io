import fancyboxPlugin from '../plugins/fancybox-2.1.3.js';

var feature_popup_forced = window.location.search.includes('feature_popup_forced=1');

var feature_popup = {

  init: function() {

      $('#feature_popup_close_popup_link, #feature_popup_signup_close_popup_link a')
          .off()
          .click(function() {
              window.galleries.feature_popup.close();
              return false;
          })
      ;

      $('a.feature_popup_link')
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

              window.galleries.feature_popup.open();


              return false;
          })
      ;


      if (!$('body').hasClass('splash-loader-active')) {

          if ($('#feature_popup_container').hasClass('auto_popup')) {
              window.galleries.feature_popup.auto_popup(false, ('id_' + $('#feature_popup_container').attr('data-popup-id')));
          }
      }


      if ($('#feature_popup_container').hasClass('auto_popup_exit')) {
          // Exit intent
          if (!h.getCookie('shown_feature_popup_exit_intent')) {
              setTimeout(function() {
                  var exit_intent_timeout;
                  $(document).off('mouseout.exitintent').on("mouseout.exitintent", function(evt) {
                      exit_intent_timeout = setTimeout(function() {
                          if(evt.toElement === null && evt.relatedTarget === null) {
                              $(evt.currentTarget).off('mouseout.exitintent');
                              $(evt.currentTarget).off('mouseover.exitintent');
                              window.galleries.feature_popup.auto_popup(true, 'exit_intent');
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

  },

  open: function() {

      $('body').addClass('feature_popup_active');

      setTimeout(function() {
          $('body').addClass('feature_popup_visible');


          if (typeof h.accessibility != 'undefined') {
              h.accessibility.on_popup_opening($('#feature_popup_box'), $('#feature_popup_box').find('input[type!="hidden"]:first'), '#feature_popup_close_popup_link a');
          }

          window.galleries.feature_popup.after_popup();



          if (typeof $.fn.lazyload.fire === "function") {
            $.fn.lazyload.fire($('#feature_popup_content .lazyload_wrapper'));
          }
      }, 50);

  },

  close: function() {

      $('body').removeClass('feature_popup_visible');
      setTimeout(function() {
          $('body').removeClass('feature_popup_active');
      }, 400);


      if (typeof h.accessibility != 'undefined') {
          h.accessibility.on_popup_closing();
      }

  },

  current_path_popup: function() {

      //check the current path
      var current_path = window.location.pathname;

      var obj_to_return = {'id': null, 'has_popup': false, 'filepaths': ''}

      //check our popup directory
      var popup_placements = JSON.parse(document.getElementById('feature_popup_directory').value);


      //Do we have a popup for this path?
      for(let i = 0; i < popup_placements.length; i++) {

          let obj = popup_placements[i];

          if (obj.filepaths.includes(current_path)) {

            obj_to_return = {'id': obj.id, 'has_popup': true, 'filepaths': obj.filepaths}

            break; //dont allow multiple popups on one page
          }

      }

      return obj_to_return
  },

  // load_dynamic_popup_content_then_auto_popup: function(popup_id) {

  //     var constructed_url = "/feature_popups/" + popup_id + '/'
  //     // Do ajax call here for popup and replace content
  //     $.ajax({
  //         url: constructed_url,
  //         data: 'modal=1&inline=1',
  //         cache: false,
  //         dataType: 'html',
  //         success: function(data) {
  //             $('#feature_popup_dynamic_content').html(data);
  //             window.galleries.feature_popup.auto_popup(false, ('id_' + popup_id));
  //         }
  //     });
  // },


  auto_popup: function(instant, context_name) {



      instant = typeof instant != 'undefined' ? instant : false;
      context_name = typeof context_name != 'undefined' ? '_' + context_name : '';

      if ($('#feature_popup_container').hasClass('auto_popup')) {

          var timeout = 1000;
          var expiry = 3600;

          if ($('#feature_popup_container').attr('data-timeout')) {
              timeout = parseFloat($('#feature_popup_container').attr('data-timeout'))*1000;
          }

          if ($('#feature_popup_container').attr('data-cookie-expiry')){
              expiry = parseFloat($('#feature_popup_container').attr('data-cookie-expiry'));
          }

          if (typeof feature_popup_timeout != 'undefined') {
              clearTimeout(feature_popup_timeout);
          }

          if (feature_popup_forced) {
              timeout = 1000;
          }
          if (instant) {
              timeout = 0;
          }


          var feature_popup_timeout = setTimeout(function() {

              if (!$('body').hasClass('protected-path-login-mode')) {

                  if(instant || !h.getCookie('shown_feature_popup' + context_name) || feature_popup_forced){

                      var element_in_focus = $(':focus');
                      if (element_in_focus.length < 1) {
                          element_in_focus = $('#logo a');
                      }

                      try {
                          h.accessibility.global_variables.element_to_refocus_to = element_in_focus;
                      } catch(error) {
                          console.error(error);
                      }

                      window.galleries.feature_popup.open();

                      $(document).off('mouseover.exitintent');
                      $(document).off('mouseout.exitintent');

                      h.setCookie('shown_feature_popup' + context_name, 'true', '', expiry); // Set cookie for chosen seconds
                  }
              }
          }, timeout);
      }
  },

  after_popup: function() {

  }

}

window.galleries = window.galleries || {};
window.galleries.feature_popup = feature_popup;
export default feature_popup;