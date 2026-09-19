/*!
 * Artlogic Parallax
 * This file is heavily edited to work primarily with parallax on template and gallery sites
 * This will only work with one parallax instance on each page, but is modified to accept slideshows and other elements in addition to just a single image within the parallax area
 * To use the original functionality of parallax.js, please use parallax.original.js located in the same folder.
 *
 * parallax.js v1.3.1 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2015 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */


export default (function ( $, window, document, undefined ) {
    window.parallax_init_callback = function() {};
    window.parallax_resize_callback = function() {};

  // Polyfill for requestAnimationFrame
  // via: https://gist.github.com/paulirish/1579671

    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                 || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
          };

        if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
          };
    }());

  // Parallax Constructor

    function Parallax(element, options) {
        var self = this;

        if (typeof options == 'object') {
            delete options.refresh;
            delete options.render;
            $.extend(this, options);
        }

        this.$element = $(element);

        this.id = '';
        if (this.$element.attr('id')) {
            this.id = 'parallax-' + this.$element.attr('id');
        }
        this.color = '#000000';
        if (this.$element.attr('data-color')) {
            this.color = this.$element.attr('data-color');
        }
        this.opacity = '1';
        if (this.$element.attr('data-opacity')) {
          this.opacity = this.$element.attr('data-opacity');
        }

        if (!this.imageSrc && this.$element.is('img')) {
            this.imageSrc = this.$element.attr('src');
        }

        var positions = (this.position + '').toLowerCase().match(/\S+/g) || [];

        if (positions.length < 1) {
            positions.push('center');
        }
        if (positions.length == 1) {
            positions.push(positions[0]);
        }

        if (positions[0] == 'top' || positions[0] == 'bottom' || positions[1] == 'left' || positions[1] == 'right') {
            positions = [positions[1], positions[0]];
        }

        if (this.positionX != undefined) positions[0] = this.positionX.toLowerCase();
        if (this.positionY != undefined) positions[1] = this.positionY.toLowerCase();

        self.positionX = positions[0];
        self.positionY = positions[1];

        if (this.positionX != 'left' && this.positionX != 'right') {
            if (isNaN(parseInt(this.positionX))) {
                this.positionX = 'center';
            } else {
                this.positionX = parseInt(this.positionX);
            }
        }

        if (this.positionY != 'top' && this.positionY != 'bottom') {
            if (isNaN(parseInt(this.positionY))) {
                this.positionY = 'center';
            } else {
                this.positionY = parseInt(this.positionY);
            }
        }

        this.position =
        this.positionX + (isNaN(this.positionX)? '' : 'px') + ' ' +
        this.positionY + (isNaN(this.positionY)? '' : 'px');

        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        }

        if (navigator.userAgent.match(/(Android)/)) {
        }

        this.$mirror = $('<div />').prependTo('body');
        this.$slider = $('<img />').prependTo(this.$mirror);

        this.$mirror.addClass('parallax-mirror').attr({id: this.id, role: "complementary"}).css({
            visibility: 'hidden',
            zIndex: this.zIndex,
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'hidden',
            background: this.color
        });
        
        this.$slider.fadeTo(0, this.opacity).addClass('parallax-slider').attr('alt', 'Placeholder image').one('load', function() {
            if (!self.naturalHeight || !self.naturalWidth) {
                self.naturalHeight = this.naturalHeight || this.height || 1;
                self.naturalWidth  = this.naturalWidth  || this.width  || 1;
            }
            self.aspectRatio = self.naturalWidth / self.naturalHeight;

            Parallax.isSetup || Parallax.setup();
            Parallax.sliders.push(self);
            Parallax.isFresh = false;
            Parallax.requestRender();
        });

        this.$slider[0].src = this.imageSrc;

        if (this.naturalHeight && this.naturalWidth || this.$slider[0].complete) {
        this.$slider.trigger('load');
        }

    };


  // Parallax Instance Methods

  $.extend(Parallax.prototype, {
    speed:    0.2,
    bleed:    0,
    zIndex:   0,
    iosFix:   true,
    androidFix: true,
    position: 'center',
    overScrollFix: false,

    refresh: function() {
      if (this.$element.hasClass('parallax-loaded')) {
          var element_display_status = this.$element.css('display');
          this.$element.css('display', 'block');
      }

      this.cmsToolbarHeight = $('#cms-frontend-toolbar-container').height();
      this.originalElementOffsetTop = this.$element.offset().top;
      this.boxWidth        = this.$element.outerWidth();
      this.boxHeight       = this.$element.outerHeight() + this.bleed * 2; // previously this.$element.outerHeight() + this.bleed * 2 + this.$element.offset().top - this.bleed
      this.boxOffsetTop    = this.$element.offset().top - this.bleed; // previously 0
      this.boxOffsetLeft   = this.$element.offset().left;
      this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;

      var winHeight = Parallax.winHeight;
      var docHeight = Parallax.docHeight;
      var maxOffset = Math.min(this.boxOffsetTop, docHeight - winHeight);
      var minOffset = Math.max(this.boxOffsetTop + this.boxHeight - winHeight, 0);
      var imageHeightMin = this.boxHeight + (maxOffset - minOffset) * (1 - this.speed) | 0;
      var imageOffsetMin = (this.boxOffsetTop - maxOffset) * (1 - this.speed) | 0;

      if (imageHeightMin * this.aspectRatio >= this.boxWidth) {
        this.imageWidth    = imageHeightMin * this.aspectRatio | 0;
        this.imageHeight   = imageHeightMin;
        this.offsetBaseTop = imageOffsetMin;

        var margin = this.imageWidth - this.boxWidth;

        if (this.positionX == 'left') {
          this.offsetLeft = 0;
        } else if (this.positionX == 'right') {
          this.offsetLeft = - margin;
        } else if (!isNaN(this.positionX)) {
          this.offsetLeft = Math.max(this.positionX, - margin);
        } else {
          this.offsetLeft = - margin / 2 | 0;
        }
      } else {
        this.imageWidth    = this.boxWidth;
        this.imageHeight   = this.boxWidth / this.aspectRatio | 0;
        this.offsetLeft    = 0;

        var margin = this.imageHeight - imageHeightMin;

        if (this.positionY == 'top') {
          this.offsetBaseTop = imageOffsetMin;
        } else if (this.positionY == 'bottom') {
          this.offsetBaseTop = imageOffsetMin - margin;
        } else if (!isNaN(this.positionY)) {
          this.offsetBaseTop = imageOffsetMin + Math.max(this.positionY, - margin);
        } else {
          this.offsetBaseTop = imageOffsetMin - margin / 2 | 0;
        }
      }

      if (this.$element.hasClass('parallax-loaded')) {
        this.$element.css('display', '');
      }
      
      var scrollTop = Parallax.scrollTop;
      var mirrorTop = this.boxOffsetTop;
      this.originalOffsetTop = this.offsetBaseTop - mirrorTop * (1 - this.speed);
    },

    render: function() {
      var scrollTop    = Parallax.scrollTop;
      var scrollLeft   = Parallax.scrollLeft;
      var overScroll   = this.overScrollFix ? Parallax.overScroll : 0;
      var scrollBottom = scrollTop + Parallax.winHeight;

      //console.log('2222#########################');
      //console.log('boxOffsetBottom ' + this.boxOffsetBottom);
      //console.log('scrollTop ' + this.scrollTop);
      //console.log('boxOffsetTop ' + this.boxOffsetTop);
      //console.log('scrollBottom ' + this.scrollBottom);
      
      //console.log(this.boxOffsetBottom > scrollTop && this.boxOffsetTop < scrollBottom);

      if (this.boxOffsetBottom > scrollTop && this.boxOffsetTop < scrollBottom) {
        //console.log('visible');
        this.visibility = 'visible';
          this.mirrorTop = this.boxOffsetTop  - scrollTop;
          this.mirrorLeft = this.boxOffsetLeft - scrollLeft;
          this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed);

          this.slideshowOffsetTop = 0 - this.mirrorTop * (1 - this.speed);
          this.$mirror.css({
            transform: 'translate3d(0px, 0px, 0px)',
            visibility: this.visibility,
            top: this.mirrorTop - overScroll,
            left: this.mirrorLeft,
            height: this.boxHeight,
            width: this.boxWidth
          });
      } else {
        //console.log('hidden');
        this.visibility = 'hidden';
        this.$mirror.css({
            visibility: this.visibility
        });
      }

      var parallax_before_load = this.visibility == 'visible' && !$(this.$element).hasClass('parallax-loaded');
      
      if (parallax_before_load) {
          $(this.$element).addClass('parallax-loaded');
          if ($(this.$element).find('.hero-parallax-element').length) {
              var element_id = $(this.$element).find('.hero-parallax-element').parent().attr('id');
              var original_element_class = (typeof $(this.$element).find('.hero-parallax-element').parent().attr('class') != 'undefined' ? $(this.$element).find('.hero-parallax-element').parent().attr('class') : '');
              if (element_id == 'slideshow' || element_id == 'hero_parallax_content') {
                  this.$slider.css({
                    opacity: 0
                  });
                  this.$mirror.append('<div id="mirror-' + element_id + '" class="hero-parallax-element-mirror ' + original_element_class + '" style="opacity:' + this.opacity + ';">' + $(this.$element).find('.hero-parallax-element').parent().html() + '</div>');
                  this.$mirror.find('.hero-parallax-element').removeClass('hero-parallax-element');
                  this.$mirror.find('.fullscreen_slideshow_video').remove();
                  if (element_id == 'slideshow') {
                        this.$mirror.html(function(index,html){

                            // regular expressions: looks for pattern "home-image-slide" or "hero-slide" with "g" = globally, replaced by mirror-slide to prevent duplicated ids
                            return html.replace(/home-image-slide|hero-slide/g,"mirror-slide");
                        });
                      //console.log("mirror a slideshow");
                    window.galleries.slideshow.init();
                  }
              }
          }
      }

      if (this.$mirror.find('.hero-parallax-element-mirror').length) {
          var mirror_element_height = this.imageHeight;

          var mirror_container_height = this.$mirror.height();
          var mirror_element_height = mirror_container_height + this.$mirror.offset().top;
          if (mirror_element_height > $(window).height()) {
                var mirror_element_height = $(window).height()
          }
          
          //if (this.boxHeight > this.imageHeight) {
          //    var mirror_element_height = this.boxHeight;
          //}
          this.$mirror.find('.hero-parallax-element-mirror').css({
            transform: 'translate3d(0px, 0px, 0px)',
            top: this.slideshowOffsetTop,
            height: mirror_element_height
            //height: this.boxHeight - this.originalOffsetTop
          });
          this.$slider.css({
            opacity: 0
          });
      } else {
          this.$slider.css({
            transform: 'translate3d(0px, 0px, 0px)',
            position: 'absolute',
            top: this.offsetTop,
            left: this.offsetLeft,
            height: this.imageHeight,
            width: this.imageWidth,
            maxWidth: 'none'
          });
      }

      if (parallax_before_load) {
          parallax_init_callback();
      }

    }
  });


  // Parallax Static Methods

  $.extend(Parallax, {
    scrollTop:    0,
    scrollLeft:   0,
    winHeight:    0,
    winWidth:     0,
    docHeight:    1 << 30,
    docWidth:     1 << 30,
    sliders:      [],
    isReady:      false,
    isFresh:      false,
    isBusy:       false,

    setup: function() {
      if (this.isReady) return;

      var $doc = $(document), $win = $(window);

      $win.on('scroll.px.parallax load.px.parallax', function() {
          var scrollTopMax  = Parallax.docHeight - Parallax.winHeight;
          var scrollLeftMax = Parallax.docWidth  - Parallax.winWidth;
          Parallax.scrollTop  = $win.scrollTop();
          // Removed the 'maximum' rule for scrolltop, this would cause problems if the height increased on a very short page:
          //    Parallax.scrollTop  = Math.max(0, Math.min(scrollTopMax,  $win.scrollTop()));
          Parallax.scrollLeft = Math.max(0, Math.min(scrollLeftMax, $win.scrollLeft()));
          Parallax.overScroll = Math.max($win.scrollTop() - scrollTopMax, Math.min($win.scrollTop(), 0));
          Parallax.requestRender();
        })
        .on('resize.px.parallax load.px.parallax', function() {
          Parallax.winHeight = $win.height();
          Parallax.winWidth  = $win.width();
          Parallax.docHeight = $doc.height();
          Parallax.docWidth  = $doc.width();
          Parallax.isFresh = false;
          Parallax.requestRender();
          parallax_resize_callback();
        });

      this.isReady = true;

      $(window).trigger('resize.px.parallax');
    },

    configure: function(options) {
      if (typeof options == 'object') {
        delete options.refresh;
        delete options.render;
        $.extend(this.prototype, options);
      }
    },

    refresh: function() {
      $.each(this.sliders, function(){this.refresh()});
      this.isFresh = true;
    },

    render: function() {
        this.isFresh || this.refresh();
      $.each(this.sliders, function(){this.render()});
    },

    requestRender: function() {
      var self = this;

      if (!this.isBusy) {
        this.isBusy = true;
        window.requestAnimationFrame(function() {

          self.render();
          self.isBusy = false;
        });
      }
    },
    
    destroy: function(){
        Parallax.sliders = []
        this.isReady = false;
        // delete Parallax
        // Parallax = null;
        $('body').addClass('parallax-destroyed');
        $('.parallax-mirror').each(function() {
            $(this).remove();
        });
    }
  });



    function ParallaxDestroy(element, options) {}


  // Parallax Plugin Definition
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var options = typeof option == 'object' && option;

      if (this == window || this == document || $this.is('body')) {
        Parallax.configure(options);
      }
      else if (!$this.data('px.parallax')) {
        options = $.extend({}, $this.data(), options);
        $this.data('px.parallax', new Parallax(this, options));
      }else if($('body').hasClass('parallax-destroyed')){
        options = $.extend({}, $this.data(), options);
        $this.data('px.parallax', new Parallax(this, options));
        $('body').removeClass('parallax-destroyed')
      }
      if (typeof option == 'string') {
        Parallax[option]();
      }
    })
  };

  var old = $.fn.parallax;

  $.fn.parallax             = Plugin;
  $.fn.parallax.Constructor = Parallax;
  $.fn.parallax.destroy      = Parallax.destroy;
  $.fn.parallax.setup      = Parallax.setup;
  //$.fn.parallax_destroy     = ParallaxDestroy;


  // Parallax No Conflict

  $.fn.parallax.noConflict = function () {
    $.fn.parallax = old;
    return this;
  };


  // Parallax Data-API

  $(document).on('ready.px.parallax.data-api', function () {
      $('[data-parallax="scroll"]').parallax();
  });
  
  window.onbeforeunload = function() {
    if (!$('body').hasClass('cms-frontend-toolbar-fallback-mode')) {
        // Stop mousewheel when navigating away from the page
        // mousewheel on OSX allows users to scroll on Chrome even when jquery events do not fire
        $('body').on("mousewheel.parallax", function() {
            return false;
        });
        // Remove mousewheel event after set amount of time
        window.setTimeout(function() {
            $('body').off("mousewheel.parallax");
        }, 5000);
    }
    //$('.parallax-mirror').fadeOut(150);
    //$('body').addClass('device-handheld');
    //$('.parallax-loaded').removeClass('.parallax-loaded');
    //$('.hero-parallax-element').removeClass('hero-parallax-element');
    //$('body').css('overflow', 'hidden');
  }

}(jQuery, window, document));