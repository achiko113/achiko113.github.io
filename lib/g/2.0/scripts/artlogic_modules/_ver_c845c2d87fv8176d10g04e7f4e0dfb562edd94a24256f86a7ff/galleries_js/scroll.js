import sub_navigation from './sub_navigation.js';
import scroll_sections from './scroll_sections.js'
import throttle from './throttle.js';
import debounce from './debounce.js';

var scroll = {

    last_scroll_position: 0,
    scrolling_down_offset: 50,
            
  init: function() {
      
    //   var last_scroll_position = 0;
    //   var scrolling_down_offset = 50;
      $(window).on('scroll', window.galleries.throttle(50, function() {
          window.galleries.scroll.run();
      }));
      $(window).on('scroll', window.galleries.debounce(200, function() {
          window.galleries.scroll.run();
      }));
      window.galleries.scroll.run();
      
  },
  
  run: function() {
      var scroll_top = $(window).scrollTop();
      if (scroll_top > 0) {
          if (this.last_scroll_position > scroll_top) {
              if (this.last_scroll_position + 5 > scroll_top) {
                  if (!$('body').hasClass('window-forced-scroll-up')) {
                      if (!$('body').hasClass('page-popup-active') && !$('body').hasClass('overlay-open') && !$('body').hasClass('slide-nav-open')) {
                          $('#container').addClass('scrolling-up');
                          $('#container').removeClass('scrolling-down');
                          window.galleries.sub_navigation.enable_page_header(scroll_top, 'up');
                      }
                  }
              }
          } else {
              if (scroll_top > this.last_scroll_position) {
                  if (scroll_top > this.scrolling_down_offset) {
                      if (!$('body').hasClass('page-popup-active') && !$('body').hasClass('overlay-open') && !$('body').hasClass('slide-nav-open')) {
                          $('#container').removeClass('scrolling-up');
                          $('#container').addClass('scrolling-down');
                          window.galleries.sub_navigation.enable_page_header(scroll_top, 'down');
                      }
                  }
              }
          }
      } else {
          $('#container').removeClass('scrolling-down scrolling-up');
      }
      if ($('body').hasClass('page-popup-visible')) {
          $('#container').removeClass('page-top page-top-proximity');
      } else {
          if ($(window).scrollTop() > 40) {
              if ($('#container').hasClass('page-top')) {
                  $('#container').removeClass('page-top');
              }
              if (!$('#container').hasClass('page-scroll')) {
                  $('#container').addClass('page-scroll');
              }
              if ($('#top_nav #full_nav .top.open').length) {
                $('#top_nav #full_nav .top.open').removeClass('open');
              }
          } else {
              if (!$('#container').hasClass('page-top')) {
                  $('#container').addClass('page-top');
              }
              if ($('#container').hasClass('page-scroll')) {
                  $('#container').removeClass('page-scroll');
              }
          }
      }
      
      if ($('.record-page-content-combined').length) {
          window.galleries.scroll_sections.subnav_active_change();
      }
      
      this.last_scroll_position = $(window).scrollTop();
      
  }
  
}

window.galleries = window.galleries || {};
window.galleries.scroll = scroll;
export default scroll;