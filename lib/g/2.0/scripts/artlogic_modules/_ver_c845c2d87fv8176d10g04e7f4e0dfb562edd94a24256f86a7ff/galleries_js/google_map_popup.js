import fancyboxPlugin from '../plugins/fancybox-2.1.3.js';
import google_maps from './google_maps.js';

var google_map_popup = {

  init: function() {

      $('#footer .website_map_popup')
          .addClass('website_map_popup')
          .click(function() {
              
              // For accessibility - tracks which element to refocus on
              try {
                  h.accessibility.global_variables.element_to_refocus_to = $(this);
              } catch(error) {
                  console.error(error);
              }
              
              var dataLatLng = $(this).attr("data-latlng");
              var dataZoom = $(this).attr("data-zoom");
              var dataUrl = $(this).attr('href');
              var dataTitle = $(this).attr("data-title");
              
              $.fancybox(
                  {
                      type: 'html',
                      content: '<div id="map_basic_popup" class="google-map" data-latlng="' + dataLatLng + '" data-url="' + dataUrl + '" data-title="' + dataTitle + '" data-zoom="' + dataZoom + '" style=""></div>',
                      autoSize: false,
                      width: '90%',
                      height: '90%',
                      arrows: false,
                      padding: 0,
                      prevEffect: 'fade',
                      nextEffect: 'fade',
                      closeEffect: 'fade',
                      openEffect: 'fade',
                      prevSpeed: 750,
                      nextSpeed: 750,
                      closeSpeed: 300,
                      openSpeed: 750,
                      beforeShow: function () {
                          window.galleries.google_maps.init();
                      },
                      afterLoad: function () {
                          $(".fancybox-overlay").addClass("no_max_height fancybox-overlay-html");
                      },
                      afterShow: function() {
                          h.accessibility.on_popup_opening('.fancybox-opened .fancybox-skin', '.fancybox-wrap .fancybox-close', '.fancybox-wrap .fancybox-close');
                          $('.fancybox-skin #map_basic').attr({role: "dialog", 'aria-modal': true});
                          // Make the close link element act like a button
                          $('.fancybox-skin a.fancybox-close').attr("role", "button");
                          h.accessibility.role_button();
                      },
                      afterClose: function () {
                          h.accessibility.on_popup_closing();
                      }

                  }
              );

              return false;
          })
      ;

  }

}

window.galleries = window.galleries || {};
window.galleries.google_map_popup = google_map_popup;
export default google_map_popup;