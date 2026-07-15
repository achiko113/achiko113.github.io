var google_maps = {
            
  init: function(map_id) {
      
      if(typeof map_id == "undefined") {
          var map_id = '[id*="map_basic"]';
      }
      if($(map_id).length > 0) { 
          // FIXME: not sure these should be here!
          // var new_styles = [{"featureType":"landscape","stylers":[{"visibility":"simplified"},{"color":"#2b3f57"},{"weight":0.1}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"hue":"#ff0000"},{"weight":0.4},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"weight":1.3},{"color":"#FFFFFF"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":3}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":1.1}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":0.4}]},{},{"featureType":"road.highway","elementType":"labels","stylers":[{"weight":0.8},{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"color":"#ffffff"},{"weight":0.7}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"color":"#6c5b7b"}]},{"featureType":"water","stylers":[{"color":"#f3b191"}]},{"featureType":"transit.line","stylers":[{"visibility":"on"}]}]
          var new_styles=[{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d0d2d2"}]},{"featureType":"road","stylers":[{"visibility":"simplified"},{"color":"#efefef"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"simplified"},{"color":"#f6f1ec"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#585a5b"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#eff0ef"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efefef"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#d0e2c9"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"transit.station.bus","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#a5c8ea"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#e0e2e0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#afafaf"}]},{"featureType":"poi.school","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{}];
          if($('body').hasClass('theme-preset_dark_mode')){
              console.log('dark theme map')
              new_styles = [{"featureType": "all","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "all","elementType": "geometry","stylers": [{"visibility": "off"},{"weight": "1.34"}]},{"featureType": "all","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#ffffff"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "all","stylers": [{"visibility": "off"},{"color": "#34302d"}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#222223"},{"lightness": "0"},{"visibility": "simplified"},{"gamma": "1"}]},{"featureType": "landscape.man_made","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"visibility": "off"},{"saturation": "-100"},{"lightness": "-100"},{"gamma": "0.00"},{"weight": "2.20"}]},{"featureType": "landscape.man_made","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "poi.attraction","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "all","stylers": [{"visibility": "simplified"},{"weight": "1.00"},{"color": "#ffffff"}]},{"featureType": "road","elementType": "geometry","stylers": [{"visibility": "simplified"},{"color": "#434343"}]},{"featureType": "road","elementType": "labels","stylers": [{"visibility": "simplified"}]},{"featureType": "road","elementType": "labels.text.fill","stylers": [{"visibility": "on"},{"color": "#8a8a8a"}]},{"featureType": "road","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#333333"},{"weight": "3"}]},{"featureType": "road.highway","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType":"transit.station.bus","stylers":[{"visibility":"off"}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#525358"},{"lightness": "0"},{"visibility": "on"}]}];
          }
          
          //In IE11 Google IS defined - incorrectly - as some random meta value. Further check for google.maps when google happens to exist already.
          if((typeof google == "undefined") || (typeof google != "undefined" && typeof google.maps == "undefined")) {

              console.info('window.google was not found, loading script...');
              $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBOUBY0_1OPrX16l05nPOhBIbc78wb66dI&sensor=false', function(){
                  // CALLBACK FUNCTION!!!
                  console.log('LOADED');
                  window.galleries.google_maps.google_map_setup(map_id);
              });
          } else {
              console.info('window.google was found');
              window.galleries.google_maps.google_map_setup(map_id);
          }
          
      }
      
  },
  
  google_map_setup: function(map_id) {
      if($(map_id).length > 0) { 
          
          // FIXME: not sure these should be here!
          // var new_styles = [{"featureType":"landscape","stylers":[{"visibility":"simplified"},{"color":"#2b3f57"},{"weight":0.1}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"hue":"#ff0000"},{"weight":0.4},{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"weight":1.3},{"color":"#FFFFFF"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":3}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":1.1}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#f55f77"},{"weight":0.4}]},{},{"featureType":"road.highway","elementType":"labels","stylers":[{"weight":0.8},{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"color":"#ffffff"},{"weight":0.7}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"color":"#6c5b7b"}]},{"featureType":"water","stylers":[{"color":"#f3b191"}]},{"featureType":"transit.line","stylers":[{"visibility":"on"}]}]
          //var new_styles = [{"featureType": "all","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "all","elementType": "geometry","stylers": [{"visibility": "off"},{"weight": "1.34"}]},{"featureType": "all","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#ffffff"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "all","stylers": [{"visibility": "off"},{"color": "#34302d"}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#222223"},{"lightness": "0"},{"visibility": "simplified"},{"gamma": "1"}]},{"featureType": "landscape.man_made","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"visibility": "off"},{"saturation": "-100"},{"lightness": "-100"},{"gamma": "0.00"},{"weight": "2.20"}]},{"featureType": "landscape.man_made","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "poi.attraction","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "all","stylers": [{"visibility": "simplified"},{"weight": "1.00"},{"color": "#ffffff"}]},{"featureType": "road","elementType": "geometry","stylers": [{"visibility": "simplified"},{"color": "#434343"}]},{"featureType": "road","elementType": "labels","stylers": [{"visibility": "simplified"}]},{"featureType": "road","elementType": "labels.text.fill","stylers": [{"visibility": "on"},{"color": "#8a8a8a"}]},{"featureType": "road","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#333333"},{"weight": "3"}]},{"featureType": "road.highway","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 19}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#525358"},{"lightness": "0"},{"visibility": "on"}]}];
          var new_styles=[{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#d0d2d2"}]},{"featureType":"road","stylers":[{"visibility":"simplified"},{"color":"#efefef"}]},{"featureType":"landscape.man_made","stylers":[{"visibility":"simplified"},{"color":"#f6f1ec"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#585a5b"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#eff0ef"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#efefef"},{"visibility":"on"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#d0e2c9"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"transit.station.bus","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#a5c8ea"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#e0e2e0"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#afafaf"}]},{"featureType":"poi.school","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{}];
          if($('body').hasClass('theme-preset_dark_mode')){
              new_styles = [{"featureType": "all","elementType": "all","stylers": [{"visibility": "on"}]},{"featureType": "all","elementType": "geometry","stylers": [{"visibility": "off"},{"weight": "1.34"}]},{"featureType": "all","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#ffffff"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#000000"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "all","stylers": [{"visibility": "off"},{"color": "#34302d"}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#222223"},{"lightness": "0"},{"visibility": "simplified"},{"gamma": "1"}]},{"featureType": "landscape.man_made","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry","stylers": [{"visibility": "off"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"visibility": "off"},{"saturation": "-100"},{"lightness": "-100"},{"gamma": "0.00"},{"weight": "2.20"}]},{"featureType": "landscape.man_made","elementType": "geometry.stroke","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},{"featureType": "poi.attraction","elementType": "all","stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "all","stylers": [{"visibility": "simplified"},{"weight": "1.00"},{"color": "#ffffff"}]},{"featureType": "road","elementType": "geometry","stylers": [{"visibility": "simplified"},{"color": "#434343"}]},{"featureType": "road","elementType": "labels","stylers": [{"visibility": "simplified"}]},{"featureType": "road","elementType": "labels.text.fill","stylers": [{"visibility": "on"},{"color": "#8a8a8a"}]},{"featureType": "road","elementType": "labels.text.stroke","stylers": [{"visibility": "off"},{"color": "#333333"},{"weight": "3"}]},{"featureType": "road.highway","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "transit","elementType": "labels","stylers": [{"visibility": "on"}]},{"featureType": "transit.station.bus","elementType": "labels","stylers": [{"visibility": "off"}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#525358"},{"lightness": "0"},{"visibility": "on"}]}];
          }
          // if(typeof google == "undefined") {
          //     $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBOUBY0_1OPrX16l05nPOhBIbc78wb66dI&sensor=false', function(){
          //         // CALLBACK FUNCTION!!!
          //         // CALLBACK FUNCTION!!!
          //         // CALLBACK FUNCTION!!!
          //         // CALLBACK FUNCTION!!!
          //     });
          // }
          $(map_id).each(function(){
            
              if (window.artlogic_map_data && window.artlogic_map_data.locations && window.artlogic_map_data.locations.length) {
                  
                  var locations = window.artlogic_map_data.locations;
                  var map_styles = window.artlogic_map_data.styles;
                  var bounds  = new google.maps.LatLngBounds();
                  var map = new google.maps.Map(this, {//document.getElementById("map_area"), {
                      zoom: 18,
                      styles: map_styles,
                      mapTypeId: google.maps.MapTypeId.ROADMAP,
                      disableDefaultUI: true,
                      backgroundColor: '#f8f8f8',
                      panControl: false,
                      zoomControl: false,
                      zoomControlOptions: {
                      style: google.maps.ZoomControlStyle.SMALL,
                      position: google.maps.ControlPosition.LEFT_TOP
                      },
                      scaleControl: false,
                      streetViewControl: false,
                      overviewMapControl: false,
                      scrollwheel: false,
                      draggable: true,
                      mapTypeControl: false,
                      fullscreenControl: false
                  });
                  
                  function placeMarker(data) {
                      var latLng = new google.maps.LatLng(data.lat, data.long);
                      var marker = new google.maps.Marker({
                          position: latLng,
                          icon: data.icon,
                          map: map,
                          title: data.title
                      });

                      // Increase the bounds to this marker
                      var bounds_loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                      bounds.extend(bounds_loc);
                      
                      return marker;
                  }
                  
                  
                  locations.forEach(function(location) {
                      var lat_lng_split = location.map_lat_lng.split(',');
                      var lat = lat_lng_split[0];
                      var long = lat_lng_split.length === 2 ? lat_lng_split[1].trim() : '';
                      var html = '<div class="infowindow">'+
                          '<h3>'+location.name+'</h3>'+
                          '<span class="infowindow-content">'+(location.address || '')+(location.map_link ? '<a class="map_link" target="_blank" href="'+location.map_link+'">Open map</a>' : '')+'</span>'+
                          '</div>';
                      
                      var marker = placeMarker({
                          lat: lat,
                          long: long,
                          title: location.name,
                          icon: window.artlogic_map_data.marker_icon
                      });
                      
                      var infowindow = new google.maps.InfoWindow({
                          content: html
                      });
                      
                      marker.addListener("click", () => {
                          if (location.show_info_window) {
                              infowindow.open({
                                  anchor: marker,
                                  map,
                                  shouldFocus: false,
                              });
                          } else if (location.map_link) {
                              window.open(location.map_link, '_blank').focus();
                          }
                      });
                  });
              
                  //Set mimimum zoom as the bounds function tends to zoom in as tightly as possible - zooms too much
                  google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                      map.setZoom(map.getZoom() - 1);
                      if (map.getZoom() > 18) {
                          map.setZoom(18);
                      }
                  });
                  map.fitBounds(bounds);
                  map.panToBounds(bounds); 
              
                  
              } else if ($(this).attr('data-latlng') && typeof $(this).attr('data-latlng') !== 'undefined') {
                  
                  var lat = $(this).attr('data-latlng').split(',')[0];
                  var lng = $(this).attr('data-latlng').split(',')[1];
                  var map_title = $(this).attr('data-title');
                  var map_link = $(this).attr('data-url');
                  var map_zoom = parseInt($(this).attr('data-zoom'));
                  var zoomcontrol = (typeof $(this).data("zoomcontrol") != 'undefined' ? $(this).data("zoomcontrol") : true);
                  var custom_styles = (typeof $(this).attr("data-custom-styles") != 'undefined' ? $(this).attr("data-custom-styles") : false);
                  if (custom_styles) {
                      new_styles = JSON.parse(custom_styles);
                  }
                  
                  //locations
                  var position = new google.maps.LatLng(lat, lng);
  
                  //center on location
                  var center = new google.maps.LatLng(lat, lng);
  
                  //map options
                  var myOptions = {
                    zoom: map_zoom,
                    center: center,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    panControl: false,
                    //panControl: true,
                    //panControlOptions: {
                    //    position: google.maps.ControlPosition.TOP_RIGHT
                    //},
                    zoomControl: zoomcontrol,
                    zoomControlOptions: {
                      style: google.maps.ZoomControlStyle.SMALL,
                      position: google.maps.ControlPosition.LEFT_TOP
                    },
                    scaleControl: false,
                    streetViewControl: false,
                    overviewMapControl: false,
                    scrollwheel: false,
                    draggable: true,
                    styles: new_styles,
                    mapTypeControl: false,
                    fullscreenControl: false
                  }
                  //insert the map into the id on page using map options etc
                  // map_id = 'map_basic';
                  var map = new google.maps.Map(this, myOptions);
                  
                  var marker_icon = '';
                  if (window.artlogic_map_data && window.artlogic_map_data.marker_icon) {
                    marker_icon = window.artlogic_map_data.marker_icon
                  }
                  
                  //each marker config
                  var marker = new google.maps.Marker({
                      position: position,
                      map: map,
                      url: map_link,
                      title: map_title,
                      icon: marker_icon
                  });
                  
                  if (map_link != '') {
                      google.maps.event.addListener(marker, 'click', function() {
                          window.open(
                              marker.url,
                              '_blank'
                          );
                      });
                  }
              } else {
                  console.log('Requires data-latlng to render map.')
              }
          });
          
      }
  }
  
}

window.galleries = window.galleries || {};
window.galleries.google_maps = google_maps;
export default google_maps;