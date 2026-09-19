/*
* jQuery Background video plugin for jQuery
* ---
* Copyright 2011, Victor Coulon (http://victorcoulon.fr)
* Released under the MIT, BSD, and GPL Licenses.
* based on jQuery Plugin Boilerplate 1.3
* 
*
* Additional Artlogic customisation - responsive resize, mute setting
*
*/

export default (function($) {

  $.backgroundVideo = function(el, options) {
      
    var defaults = {
      videoid: "video_background",
      autoplay: true,
      loop: true,
      preload: true,
      muted:true,
      container: window,
    }

    var plugin = this;

    plugin.settings = {}

    var init = function() {
      plugin.settings = $.extend({}, defaults, options);
      plugin.settings.container_width = $(plugin.settings.container).width();
      plugin.settings.container_height = $(plugin.settings.container).height();
      plugin.el = el;
      buildVideo();
    }

    var buildVideo = function () {
      var html = '',
          preloadString = '',
          autoplayString = '',
          loopString = '',
          mutedString = '',
          _preload = plugin.settings.preload,
          _autoplay = plugin.settings.autoplay,
          _loop = plugin.settings.loop,
          _muted = plugin.settings.muted;

      if (_preload) {
        preloadString = 'preload="auto"';
      } else {
        preloadString = '';
      }

      // if (_autoplay) {
      //   autoplayString = '';
      // } else {
      //   autoplayString = '';
      // }

      if (_loop) {
        loopString = 'loop="true"';
      } else {
        loopString = '';
      }

      if (_muted) {
        mutedString = 'muted="true"';
      } else {
        mutedString = 'muted="false"';
      }

      html += '<video id="'+plugin.settings.videoid+'"' + preloadString + autoplayString + loopString + mutedString;

      if (plugin.settings.poster) {
        html += ' poster="' + plugin.settings.poster + '" ';
      }

      html += 'style="display:none;position:fixed;top:0;left:0;bottom:0;right:0;z-index:-100;width:100%;height:100%;">';
      if (plugin.settings.types && plugin.settings.types.length) {
          for(var i=0; i < plugin.settings.types.length; i++) {
            html += '<source src="'+plugin.settings.path+plugin.settings.filename+'.'+plugin.settings.types[i]+'" type="video/'+plugin.settings.types[i]+'" />';
          }
      } else {
          html += '<source src="'+plugin.settings.path+plugin.settings.filename+'" type="video/mp4" />';
      }
      html += 'bgvideo</video>';
      plugin.el.prepend(html);
      plugin.videoEl = document.getElementById(plugin.settings.videoid);
      plugin.$videoEl = $(plugin.videoEl);
      setProportion(plugin.settings.container_width,plugin.settings.container_height);
      plugin.$videoEl.off().get(0).oncanplay = function() {
        plugin.$videoEl.fadeIn(2000);
        setTimeout(function() {
          plugin.$videoEl.addClass('active');
          if ($('#slideshow.fullscreen_video').length) {
            $('#slideshow.fullscreen_video').addClass('video_can_play');
            $('#slideshow.fullscreen_video .video_pause_button .pause_symbol').removeClass('paused')
          }
        }, 400);
      };
      setProportion(plugin.settings.container_width,plugin.settings.container_height);
      
    }

    var setProportion = function (container_width, container_height) {
      var proportion = getProportion(container_width, container_height);
      plugin.$videoEl.width(proportion*plugin.settings.width);
      plugin.$videoEl.height(proportion*plugin.settings.height);

      if (typeof plugin.settings.align !== 'undefined') {
        centerVideo(container_width, container_height);
      }
    }

    var getProportion = function (container_width, container_height) {
      var windowWidth = container_width;
      var windowHeight = container_height;
      var windowProportion = windowWidth / windowHeight;
      var origProportion = plugin.settings.width / plugin.settings.height;
      var proportion = windowHeight / plugin.settings.height;

      if (windowProportion >= origProportion) {
        proportion = windowWidth / plugin.settings.width;
      }

      return proportion;
    }

    var centerVideo = function(container_width, container_height) {
      var centerX = ((container_width >> 1) - (plugin.$videoEl.width() >> 1)) | 0;
      var centerY = ((container_height >> 1) - (plugin.$videoEl.height() >> 1)) | 0;

      if (plugin.settings.align == 'centerXY') {
        plugin.$videoEl.css({ 'left': centerX, 'top': centerY });
        return;
      }

      if (plugin.settings.align == 'centerX') {
        plugin.$videoEl.css('left', centerX);
        return;
      }

      if (plugin.settings.align == 'centerY') {
        plugin.$videoEl.css('top', centerY);
        return;
      }
    }

    init();

    $(window).resize(function() { setProportion($(plugin.settings.container).width(), $(plugin.settings.container).height()); });


    plugin.$videoEl.on('ended', function(){
        this.play();
    });

    //Additional muting for IE9
    if (plugin.settings.muted) {
        var vid = document.getElementById(plugin.settings.videoid);
        vid.muted = true;
    }

    if (plugin.settings.autoplay) {
      var vid = document.getElementById(plugin.settings.videoid);
      
      if (vid) {
        vid.play(0);
      } else {
        return;
      }
    }

  }
})(jQuery);