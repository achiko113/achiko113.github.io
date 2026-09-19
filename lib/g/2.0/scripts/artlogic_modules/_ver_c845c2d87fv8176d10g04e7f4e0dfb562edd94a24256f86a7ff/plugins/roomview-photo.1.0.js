//Panzoom
/**
 * Panzoom for panning and zooming elements using CSS transforms
 * Copyright Timmy Willison and other contributors
 * https://github.com/timmywil/panzoom/blob/master/MIT-License.txt
 */
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),"function"!=typeof window.CustomEvent&&(window.CustomEvent=function(e,t){t=t||{bubbles:!1,cancelable:!1,detail:null};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n})},function(e,t,n){"use strict";n.r(t);var r;n(0);function o(e,t){for(var n=e.length;n--;)if(e[n].pointerId===t.pointerId)return n;return-1}function a(e,t){var n;if(t.touches){n=0;for(var r=0,i=t.touches;r<i.length;r++){var l=i[r];l.pointerId=n++,a(e,l)}}else(n=o(e,t))>-1&&e.splice(n,1),e.push(t)}function i(e){for(var t,n=(e=e.slice(0)).pop();t=e.pop();)n={clientX:(t.clientX-n.clientX)/2+n.clientX,clientY:(t.clientY-n.clientY)/2+n.clientY};return n}function l(e){if(e.length<2)return 0;var t=e[0],n=e[1];return Math.sqrt(Math.pow(Math.abs(n.clientX-t.clientX),2)+Math.pow(Math.abs(n.clientY-t.clientY),2))}function u(e,t,n,o){r[e].split(" ").forEach((function(e){t.addEventListener(e,n,o)}))}function c(e,t,n){r[e].split(" ").forEach((function(e){t.removeEventListener(e,n)}))}r="function"==typeof window.PointerEvent?{down:"pointerdown",move:"pointermove",up:"pointerup pointerleave pointercancel"}:"function"==typeof window.TouchEvent?{down:"touchstart",move:"touchmove",up:"touchend touchcancel"}:{down:"mousedown",move:"mousemove",up:"mouseup mouseleave"};var p=!!document.documentMode,s=document.createElement("div").style,d=["webkit","moz","ms"],f={};function m(e){if(f[e])return f[e];if(e in s)return f[e]=e;for(var t=e[0].toUpperCase()+e.slice(1),n=d.length;n--;){var r=""+d[n]+t;if(r in s)return f[e]=r}}function h(e,t){return parseFloat(t[m(e)])||0}function v(e,t,n){void 0===n&&(n=window.getComputedStyle(e));var r="border"===t?"Width":"";return{left:h(t+"Left"+r,n),right:h(t+"Right"+r,n),top:h(t+"Top"+r,n),bottom:h(t+"Bottom"+r,n)}}function g(e,t,n){e.style[m(t)]=n}function b(e){var t=e.parentNode,n=window.getComputedStyle(e),r=window.getComputedStyle(t),o=e.getBoundingClientRect(),a=t.getBoundingClientRect();return{elem:{style:n,width:o.width,height:o.height,top:o.top,bottom:o.bottom,left:o.left,right:o.right,margin:v(e,"margin",n),border:v(e,"border",n)},parent:{style:r,width:a.width,height:a.height,top:a.top,bottom:a.bottom,left:a.left,right:a.right,padding:v(t,"padding",r),border:v(t,"border",r)}}}function y(e,t){return 1===e.nodeType&&(" "+function(e){return(e.getAttribute("class")||"").trim()}(e)+" ").indexOf(" "+t+" ")>-1}var w=/^http:[\w\.\/]+svg$/;var x=function(){return(x=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},S={animate:!1,canvas:!1,cursor:"move",disablePan:!1,disableZoom:!1,disableXAxis:!1,disableYAxis:!1,duration:200,easing:"ease-in-out",exclude:[],excludeClass:"panzoom-exclude",handleStartEvent:function(e){e.preventDefault(),e.stopPropagation()},maxScale:4,minScale:.125,overflow:"hidden",panOnlyWhenZoomed:!1,relative:!1,setTransform:function(e,t,n){var r=t.x,o=t.y,a=t.scale,i=t.isSVG;if(g(e,"transform","scale("+a+") translate("+r+"px, "+o+"px)"),i&&p){var l=window.getComputedStyle(e).getPropertyValue("transform");e.setAttribute("transform",l)}},startX:0,startY:0,startScale:1,step:.3};function O(e,t){if(!e)throw new Error("Panzoom requires an element as an argument");if(1!==e.nodeType)throw new Error("Panzoom requires an element with a nodeType of 1");if(!function(e){var t=e.ownerDocument,n=e.parentNode;return t&&n&&9===t.nodeType&&1===n.nodeType&&t.documentElement.contains(n)}(e))throw new Error("Panzoom should be called on elements that have been attached to the DOM");t=x(x({},S),t);var n=function(e){return w.test(e.namespaceURI)&&"svg"!==e.nodeName.toLowerCase()}(e),r=e.parentNode;r.style.overflow=t.overflow,r.style.userSelect="none",r.style.touchAction="none",(t.canvas?r:e).style.cursor=t.cursor,e.style.userSelect="none",e.style.touchAction="none",g(e,"transformOrigin","string"==typeof t.origin?t.origin:n?"0 0":"50% 50%");var p,s,d,f,h,v,O=0,P=0,M=1,E=!1;function z(t,n,r){if(!r.silent){var o=new CustomEvent(t,{detail:n});e.dispatchEvent(o)}}function X(t,r){var o={x:O,y:P,scale:M,isSVG:n};return requestAnimationFrame((function(){"boolean"==typeof r.animate&&(r.animate?function(e,t){g(e,"transition",m("transform")+" "+t.duration+"ms "+t.easing)}(e,r):g(e,"transition","none")),r.setTransform(e,o,r)})),z(t,o,r),z("panzoomchange",o,r),o}function Y(){if(t.contain){var n=b(e),r=n.parent.width-n.parent.border.left-n.parent.border.right,o=n.parent.height-n.parent.border.top-n.parent.border.bottom,a=r/(n.elem.width/M),i=o/(n.elem.height/M);"inside"===t.contain?t.maxScale=Math.min(a,i):"outside"===t.contain&&(t.minScale=Math.max(a,i))}}function C(n,r,o,a){var i=x(x({},t),a),l={x:O,y:P,opts:i};if(!i.force&&(i.disablePan||i.panOnlyWhenZoomed&&M===i.startScale))return l;if(n=parseFloat(n),r=parseFloat(r),i.disableXAxis||(l.x=(i.relative?O:0)+n),i.disableYAxis||(l.y=(i.relative?P:0)+r),"inside"===i.contain){var u=b(e);l.x=Math.max(-u.elem.margin.left-u.parent.padding.left,Math.min(u.parent.width-u.elem.width/o-u.parent.padding.left-u.elem.margin.left-u.parent.border.left-u.parent.border.right,l.x)),l.y=Math.max(-u.elem.margin.top-u.parent.padding.top,Math.min(u.parent.height-u.elem.height/o-u.parent.padding.top-u.elem.margin.top-u.parent.border.top-u.parent.border.bottom,l.y))}else if("outside"===i.contain){var c=(u=b(e)).elem.width/M,p=u.elem.height/M,s=c*o,d=p*o,f=(s-c)/2,m=(d-p)/2,h=(-(s-u.parent.width)-u.parent.padding.left-u.parent.border.left-u.parent.border.right+f)/o,v=(f-u.parent.padding.left)/o;l.x=Math.max(Math.min(l.x,v),h);var g=(-(d-u.parent.height)-u.parent.padding.top-u.parent.border.top-u.parent.border.bottom+m)/o,y=(m-u.parent.padding.top)/o;l.y=Math.max(Math.min(l.y,y),g)}return l}function T(e,n){var r=x(x({},t),n),o={scale:M,opts:r};return!r.force&&r.disableZoom||(o.scale=Math.min(Math.max(e,r.minScale),r.maxScale)),o}function A(e,t,n){var r=C(e,t,M,n),o=r.opts;return O=r.x,P=r.y,X("panzoompan",o)}function j(e,t){var n=T(e,t),r=n.opts;if(r.force||!r.disableZoom){e=n.scale;var o=O,a=P;if(r.focal){var i=r.focal;o=(i.x/e-i.x/M+O*e)/e,a=(i.y/e-i.y/M+P*e)/e}var l=C(o,a,e,{relative:!1,force:!0});return O=l.x,P=l.y,M=e,X("panzoomzoom",r)}}function N(e,n){var r=x(x(x({},t),{animate:!0}),n);return j(M*Math.exp((e?1:-1)*r.step),r)}function L(t,r,o){var a=b(e),i=a.parent.width-a.parent.padding.left-a.parent.padding.right-a.parent.border.left-a.parent.border.right,l=a.parent.height-a.parent.padding.top-a.parent.padding.bottom-a.parent.border.top-a.parent.border.bottom,u=r.clientX-a.parent.left-a.parent.padding.left-a.parent.border.left-a.elem.margin.left,c=r.clientY-a.parent.top-a.parent.padding.top-a.parent.border.top-a.elem.margin.top;n||(u-=a.elem.width/M/2,c-=a.elem.height/M/2);var p={x:u/i*(i*t),y:c/l*(l*t)};return j(t,x(x({animate:!1},o),{focal:p}))}j(t.startScale,{animate:!1}),setTimeout((function(){Y(),A(t.startX,t.startY,{animate:!1})}));var _=[];function I(e){if(!function(e,t){for(var n=e;null!=n;n=n.parentNode)if(y(n,t.excludeClass)||t.exclude.indexOf(n)>-1)return!0;return!1}(e.target,t)){a(_,e),E=!0,t.handleStartEvent(e),p=O,s=P,z("panzoomstart",{x:O,y:P,scale:M},t);var n=i(_);d=n.clientX,f=n.clientY,h=M,v=l(_)}}function W(e){if(E&&void 0!==p&&void 0!==s&&void 0!==d&&void 0!==f){a(_,e);var n=i(_);if(_.length>1)L(T((l(_)-v)*t.step/80+h).scale,n);A(p+(n.clientX-d)/M,s+(n.clientY-f)/M,{animate:!1})}}function Z(e){1===_.length&&z("panzoomend",{x:O,y:P,scale:M},t),function(e,t){if(t.touches)for(;e.length;)e.pop();else{var n=o(e,t);n>-1&&e.splice(n,1)}}(_,e),E&&(E=!1,p=s=d=f=void 0)}function q(){u("down",t.canvas?r:e,I),u("move",document,W,{passive:!0}),u("up",document,Z,{passive:!0})}function D(){c("down",t.canvas?r:e,I),c("move",document,W),c("up",document,Z)}return t.disablePan||q(),{destroy:D,getPan:function(){return{x:O,y:P}},getScale:function(){return M},getOptions:function(){return function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}(t)},pan:A,reset:function(e){var n=x(x(x({},t),{animate:!0,force:!0}),e);M=T(n.startScale,n).scale;var r=C(n.startX,n.startY,M,n);return O=r.x,P=r.y,X("panzoomreset",n)},setOptions:function(n){for(var o in void 0===n&&(n={}),n)n.hasOwnProperty(o)&&(t[o]=n[o]);n.hasOwnProperty("cursor")&&(e.style.cursor=n.cursor),n.hasOwnProperty("overflow")&&(r.style.overflow=n.overflow),(n.hasOwnProperty("minScale")||n.hasOwnProperty("maxScale")||n.hasOwnProperty("contain"))&&Y(),n.hasOwnProperty("disablePan")&&(n.disablePan?D():q())},setStyle:function(t,n){return g(e,t,n)},zoom:j,zoomIn:function(e){return N(!0,e)},zoomOut:function(e){return N(!1,e)},zoomToPoint:L,zoomWithWheel:function(e,n){e.preventDefault();var r=x(x({},t),n),o=(0===e.deltaY&&e.deltaX?e.deltaX:e.deltaY)<0?1:-1;return L(T(M*Math.exp(o*r.step/3),r).scale,e,r)}}}O.defaultOptions=S;var P=O;window.Panzoom=P}]);




/*
 *  jquery-boilerplate - v4.0.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;export default ( function( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "roomViewPhoto",
		
			defaults = {
				// propertyName: "value",
				zoom_enabled: true,
				zoom_scrollwheel_enabled: true,
				before_open: function() {}
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;

			// jQuery has an extend method which merges the contents of two or
			// more objects, storing the result in the first object. The first object
			// is generally empty as we don't want to alter the default options for
			// future instances of the plugin
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
		    
			init: function() {

                var instance = this;
                var element = this.element;
                var $roomview_element = $(this.element);
                
                //Ensure that the init class is cleared if someone hammers refresh
                // $roomview_element.removeClass('roomview-initialised');


                // Check that the image has loaded
                // (.one so the event handler doesn't run more than once)
                $roomview_element.one("load", function() {
                    if (instance.settings.verbose_mode == true) {
                        console.log('image loaded, running setup');
                    }
                    
                    instance.setup(instance, $roomview_element);
                    
                }).each(function() {
                    if(this.complete) $(this).trigger('load');
                });
				
			},
			
			setup: function(instance, $roomview_element) {
		
                if (!$roomview_element.hasClass('roomview-initialised')) {
                	$roomview_element.addClass('roomview-initialised');
                	instance.inject_room(instance, $roomview_element);
                	instance.create_placeholder_artwork(instance, $roomview_element);

                    if ($('#cms-frontend-toolbar-container').length) {
                        try {
                            window.roomview.init();
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }

                instance.button(instance, $roomview_element);
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                var $scene_wrapper = $roomview_room.find('.roomview-scene-wrapper');
                
                if ($('.roomview-close').length) {
                    $('.roomview-close').off("click.roomviewClose").on("click.roomviewClose" ,function(e) {
                        e.preventDefault();
                        instance.close_roomview(instance, $roomview_element);
                    });
                }
			},
			
			inject_room: function(instance, $roomview_element) {
            	var room_html = instance.return_room_html(instance)
                $roomview_element.after(room_html);
            },

			return_room_html: function(instance) {
			    
			    var zoom_controls = '';

			    
                //src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                var room_html = '<div data-roomview-element-id="' + $(instance.element).attr('data-roomview-id') + '" class="room-wrapper">';
                    room_html +=        '<div class="roomview-zoom-wrapper">';
                	room_html +=            '<div class="roomview-scene-wrapper">';
            	    room_html +=                '<div class="roomview-scene-background"><img class="scene-background-image" alt=""/></div>';
                    room_html +=			    '<div class="roomview-scene-user-area">';
                    room_html +=			        '<div class="roomview-hang-line"></div><div class="roomview-scene-hang-area"><div class="roomview-scene-artwork"><div class="roomview-hang-line"></div></div></div>';
                	room_html +=			    '</div>';
                	room_html +=            '</div>';
                	room_html +=        '</div>';
                	room_html +=        '<div class="roomview-zoom-footer"><div class="roomview-zoom-buttons"><div class="roomview-zoom-buttons-inner"><button class="roomview-zoom-button roomview-zoom-out">Zoom out</button> <input class="roomview-zoom-range" type="range" name="zoom" min="1" max="3" step="0.001" value="1"><button class="roomview-zoom-button roomview-zoom-in">Zoom in</button></div> <div class="roomview-zoom-buttons-inner"><button class="roomview-zoom-button roomview-zoom-reset hidden">Reset</button></div></div></div>';
                	room_html +=        '<div class="roomview-close"><a href="#" role="button">Close</a></div>';
                	room_html +=        '<div id="roomview-prev-button" class="roomview-nav roomview-prev"><a href="#" role="button">Previous</a></div>';
                	room_html +=        '<div id="roomview-next-button" class="roomview-nav roomview-next"><a href="#" role="button">Next</a></div>';
	                room_html += '</div>';
                
                return room_html;
            },
            
			create_placeholder_artwork: function(instance, $roomview_element) {

                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                if (!$roomview_room.find('.roomview-scene-artwork').find('.placeholder-artwork').length ){
                    var $wall = $roomview_room.find('.roomview-scene-artwork');
                    var override_class = $roomview_element.hasClass('roomview-image-override') ? ' placeholder-artwork-override' : '';
                    $roomview_element.clone().removeClass('roomview-image roomview-photo-image roomview-image-override').addClass('placeholder-artwork' + override_class).appendTo($wall);
                }
                
                // think this is redundant
                // instance.scale_placeholder_artwork(instance, $roomview_element);
            },

			button: function(instance, $roomview_element) {
                var button_rel = $roomview_element.attr('data-roomview-id');
                var $buttons = $('.roomview-button[data-roomview-id='+button_rel+']');
                
                //Pass all settings from button to instance
                $buttons.each(function(){
                    
                    var $button = $(this);
                    $button.click(function(e) {
                        e.preventDefault();

                        if (!$button.hasClass('active')) {

                            $button.addClass('active');
                            $('body').addClass('roomview-prevent-conflicts');
                            
                            setTimeout(function() {
                                if ($roomview_element.closest('.image_gallery_multiple').length) {
                                    // If image is within a slideshow, check we are on the first image in the slidshow otherwise switch to it
                                    if (!$roomview_element.closest('.image_gallery_multiple').find('.item:not(.cycle-sentinel):eq(0)').hasClass('cycle-slide-active')) {
                                        $('.image_gallery_multiple').cycle(0);
                                    }
                                }
                                $('.image_hover_zoom').css('pointer-events', 'none');
                                $button.addClass('loading');
                                instance.open($button,  {
                                    scene_scale_width: $button.attr('data-scene-scale-width') && typeof $button.attr('data-scene-scale-width') != 'undefined' ? $button.attr('data-scene-scale-width') : '',
                                    scene_bg_width: $button.attr('data-scene-image-width') && typeof $button.attr('data-scene-image-width') != 'undefined' ? $button.attr('data-scene-image-width') : '',
                                    scene_bg_height: $button.attr('data-scene-image-height') && typeof $button.attr('data-scene-image-height') != 'undefined' ? $button.attr('data-scene-image-height') : '',
                                    scene_bg_image: $button.attr('data-scene-image') && typeof $button.attr('data-scene-image') != 'undefined' ? $button.attr('data-scene-image') : '',
                                    user_defined_area_data: $button.attr('data-scene-position') && typeof $button.attr('data-scene-position') != 'undefined' ? $button.attr('data-scene-position') : '',
                                    hang_position_y: $button.attr('data-hang-y') && typeof $button.attr('data-hang-y') != 'undefined' ? $button.attr('data-hang-y') : '0.5',
                                    disable_auto_zoom: $button.attr('data-disable-auto-zoom') && typeof $button.attr('data-disable-auto-zoom') != 'undefined' ? $button.attr('data-disable-auto-zoom') : false,
                                    previous_id: $button.attr('data-prev-id') && typeof $button.attr('data-prev-id') != 'undefined' ? $button.attr('data-prev-id') : '',
                                    next_id: $button.attr('data-next-id') && typeof $button.attr('data-next-id') != 'undefined' ? $button.attr('data-next-id') : '',
                                });
                            }, 200);
                        }

                    });
                });
                

            },
            
		    open: function($button, options) {
                var already_running = $('body').hasClass('roomview-running');

                $('body').addClass('roomview-running');
		    	
                var instance = this;
                var $roomview_element = $(this.element);
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                var $scene_wrapper = $roomview_room.find('.roomview-scene-wrapper');
                var button_rel = $(instance).attr('data-roomview-id');
                  
		        var $bg_image = $scene_wrapper.find('.scene-background-image');
		    	var current_src = $bg_image.attr('src');

                if (already_running) {
                    var open_mode = 'transition';
                } else {
                    var open_mode = current_src == options.scene_bg_image ? 'reopen' : 'new';
                }
		    	
		    	if (open_mode == 'new') {
		    	    $bg_image.attr('src', '');
		    	}
     
                instance.settings.before_open(button_rel, $(this));

                // Set custom scene attributes if supplied
                if (options && typeof options != 'undefined') {
                    if ((options.scene_bg_width && options.scene_bg_width != '') && (options.scene_bg_height && options.scene_bg_height != '') && (options.scene_bg_image && options.scene_bg_image != '')) {
                    	
                        if (open_mode != 'transition') {
                            $scene_wrapper.attr('data-scene-image-width', options.scene_bg_width);
                            $scene_wrapper.attr('data-scene-image-height', options.scene_bg_height);

                            //Always perfectly fit screen
                            instance.fillscreen(instance, $roomview_element, $scene_wrapper, options.scene_bg_width, options.scene_bg_height);
            
                            //Set boundary of usable wall space
                            instance.set_user_defined_area(instance, $roomview_element, $scene_wrapper, options.user_defined_area_data);
                            
                            //Place 
                            instance.scale_placeholder_artwork(instance, $roomview_element, options.scene_scale_width, $scene_wrapper, options);

                            instance.set_hang_line(instance, $scene_wrapper, options.hang_position_y);
                        }
                        
                        setTimeout(function() {
                               
                            if (open_mode != 'transition') {
                                if (instance.settings.zoom_enabled == true){
                                    instance.zoom(instance, $roomview_element, $roomview_room, $scene_wrapper, !Boolean(options['disable_auto_zoom']));
                                }
                                $(window).on("resize", function() { instance.fillscreen(instance, $roomview_element, $scene_wrapper) });
                            }
                                    	
                            setTimeout(function() {

                            	if (open_mode == 'reopen') {
                            	    //If already in place, just open
                            	    $button.removeClass('loading');
                                    instance.show(instance, options, $roomview_element, $roomview_room, $scene_wrapper);
                                    
                            	} else if (open_mode == 'transition') {
                                    var $bg_wrapper = $scene_wrapper.find('.roomview-scene-background');
                                    var new_bg = '<img class="scene-background-image scene-background-image-temp">';
                                    var loading = '<div class="roomview-transition-loading">';
                                    loading += '<svg class="loader" viewBox="25 25 50 50">';
                                    loading += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10"></circle>';
                                    loading += '</svg>';
                                    loading += '</div>';
                                    $scene_wrapper.append(new_bg);
                                    $roomview_room.append(loading);

                                    var $new_bg = $scene_wrapper.find('.scene-background-image.scene-background-image-temp');

                                    $button.removeClass('loading');
                                    $new_bg.attr('src', options.scene_bg_image);

                                    $new_bg.one("load", function() {
                                        $new_bg.removeClass('scene-background-image-temp');
                                        $bg_image.addClass('roomview-nav-artwork-animated-fade');
                                        $('.roomview-zoom-wrapper').addClass('roomview-nav-artwork-animated-zoom');
                                        var $old_bg = $bg_image;

                                        setTimeout(function () {
                                            $bg_wrapper.append($bg_image);
                                            $old_bg.remove()
                                            $('.roomview-zoom-wrapper').removeClass('roomview-nav-artwork-animated-zoom');
                                            $roomview_room.removeClass('roomview-transition');
                                        }, 1000);

                                        $('.roomview-transition-loading').remove();
                                        $bg_image = $new_bg;

                                        $scene_wrapper.attr('data-scene-image-width', options.scene_bg_width);
                                        $scene_wrapper.attr('data-scene-image-height', options.scene_bg_height);

                                        var $temp_element = $roomview_room.find('.roomview-scene-user-area').clone();

                                        instance.fillscreen(instance, $roomview_element, $scene_wrapper, options.scene_bg_width, options.scene_bg_height);
                        
                                        instance.set_user_defined_area(instance, $roomview_element, $scene_wrapper, options.user_defined_area_data);
                                        
                                        instance.scale_placeholder_artwork(instance, $roomview_element, options.scene_scale_width, $scene_wrapper, options, true, $temp_element);

                                        instance.set_hang_line(instance, $scene_wrapper, options.hang_position_y);

                                        if (instance.settings.zoom_enabled == true || !Boolean(options['disable_auto_zoom'])){
                                            instance.zoom(instance, $roomview_element, $roomview_room, $scene_wrapper, !Boolean(options['disable_auto_zoom']), true);
                                        }
                                        $(window).on("resize", function() { instance.fillscreen(instance, $roomview_element, $scene_wrapper) });
                                    });
                                    
                                } else {
                            	    //If new src, wait for load of new src then open
                                    $bg_image.on('load', function() {
                                        $button.removeClass('loading');
                                        instance.show(instance, options, $roomview_element, $roomview_room, $scene_wrapper);
                                    });
                                    $bg_image.attr('src', options.scene_bg_image);
                            	}
                                
                            }, 100);
                            
                        }, 100);
                        
                        instance.nav_setup(instance, $roomview_element, options.previous_id, options.next_id);
                    }
                }
		    },

            nav_setup: function(instance, $roomview_element, previous_id, next_id) {
                $('#roomview-prev-button').off('click');
                $('#roomview-next-button').off('click');

                $('#roomview-prev-button').on('click', function() {
                    instance.switch_view(instance, $roomview_element, previous_id);
                });

                $('#roomview-next-button').on('click', function() {
                    instance.switch_view(instance, $roomview_element, next_id);
                });
            },

            switch_view: function(instance, $roomview_element, new_view_id) {
                //$roomview_element not correct at this point... work out why but in the meantime, get it again
                var $roomview_element = $('.roomview-image.roomview-active-element');
                var instance_id = $roomview_element.attr('data-roomview-id');
                var $roomview_room = $('[data-roomview-element-id="' + instance_id + '"]');
                $roomview_room.addClass('roomview-transition');

                var $buttons = $('.roomview-button[data-roomview-id='+instance_id+']');
                $buttons.removeClass('active');

                $('#' + new_view_id).click();
            },
		    
			show: function(instance, options, $roomview_element, $roomview_room, $scene_wrapper) {
			    
			    var open_timeout = 20;
			    
			    if ($roomview_element.hasClass('roomview-image-override')) {
			        $('body').addClass('roomview-override-switched');
			        open_timeout = 500; //Time to fade in override artwork
			    }
                setTimeout(function() {
                    $('body').addClass('roomview-active roomview-active-2');
                    $roomview_element.addClass('roomview-active-element');
                    instance.scale_artwork(instance, $roomview_element, $roomview_room);
                    $roomview_room.addClass('roomview-active');
                    
                    //Block fancybox popups from bubbling up and opening
                    var $fancybox_link = $roomview_element.closest('.image_popup');
                    if ($fancybox_link.length){
                        $fancybox_link.attr('disabled')
                        
                        //This namespaced click is removed on close
                        $fancybox_link.on("click.preventPopups", function(e) { 
                            e.preventDefault();
                            e.stopPropagation();
                        });  
                        
                    }
                    
                    try {
                        h.accessibility.on_popup_opening('.room-wrapper', '.roomview-close a', '.roomview-close');
                    } catch(error) {
                        console.error(error);
                    }
                    
                }, open_timeout, $roomview_room);
                    
			},
			fillscreen: function(instance, $roomview_element, $scene_wrapper, imageWidth, imageHeight) {
				
                var imageWidth = $scene_wrapper.attr('data-scene-image-width');
                var imageHeight = $scene_wrapper.attr('data-scene-image-height');
				
				var availableHeight = window.innerHeight;
				var availableWidth = window.innerWidth;
				
				var scaleX = availableWidth / imageWidth;
				var scaleY = availableHeight / imageHeight;
				
				// if (proportional) {
					scaleX = Math.min(scaleX, scaleY);
					scaleY = scaleX;
				
				$scene_wrapper.width(imageWidth * scaleX).height(imageHeight * scaleY);
			},

            set_hang_line: function (instance, $scene_wrapper, height) {
                var line = $scene_wrapper.find('.roomview-hang-line');

                var new_height = 100 - height * 100;

                line.css('top', new_height + '%');
            },
			
			set_user_defined_area: function(instance, $roomview_element, $scene_wrapper, user_defined_area_data) {
   
                if (user_defined_area_data && user_defined_area_data.length) {
                    var user_defined_obj = JSON.parse(user_defined_area_data);
                }
                var user_width = (user_defined_obj.width) * 100 + '%';
                var user_height = (user_defined_obj.height) * 100 + '%';
                var user_top = (user_defined_obj.top) * 100 + '%';
                var user_left = (user_defined_obj.left) * 100 + '%';
                $scene_wrapper.find('.roomview-scene-user-area').css({'top':user_top, 'left':user_left, 'width':user_width, 'height':user_height});
			},	
            
            scale_placeholder_artwork: function(instance, $roomview_element, scene_scale_width, $scene_wrapper, options, animated=false, $temp_element=null) {
			    
                // SCALE DUMMY ARTWORK
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
       
                // Work out % size of scaled artwork
                var artwork_width_cm = $roomview_element.attr('data-roomview-artwork-cm-width');
                var dummy_artwork_width_pc = (artwork_width_cm / scene_scale_width * 100).toString() + '%';
                
                
                
                
                // if ($roomview_element.closest('.image').data('width') && $roomview_element.closest('.image').data('height')) {
                //     $scene_wrapper.addClass('hangheight-enabled');
                //     var placeholder_height_ratio = $roomview_element.closest('.image').data('height') / $roomview_element.closest('.image').data('width');
                //     console.log(placeholder_height_ratio);
                    
                    
                // } else {
                //     console.log('Image stats must be enabled for hang height to work.');
                // }

                var scene_width = options.scene_bg_width;
           
                //var shadow_scale = scene_width / 12000;
                // var proportional_shadow = "0 "+(4*shadow_scale)+"px "+(6*shadow_scale)+"px rgba(0, 0, 0, 0.1), 0 "+(8*shadow_scale)+"px "+(30*shadow_scale)+"px rgba(0, 0, 0, 0.18), "+(27*shadow_scale)+"px "+(40*shadow_scale)+"px "+(38*shadow_scale)+"px rgba(125, 119, 119, 0.06), "+(5*shadow_scale)+"px "+(23*shadow_scale)+"px "+(7*shadow_scale)+"px rgba(142, 133, 133, 0.1)";
                
                // Polyfill for .endsWith() due to not being supported by IE11
                if (!String.prototype.endsWith) {
                    String.prototype.endsWith = function(search, this_len) {
                        if (this_len === undefined || this_len > this.length) {
                          this_len = this.length;
                        }
                        return this.substring(this_len - search.length, this_len) === search;
                    };
                }
                
                var roomview_scene_artwork_url = $roomview_room.find('.roomview-scene-artwork img').attr('src');
                var image_is_png = false;
                
                if (roomview_scene_artwork_url && typeof roomview_scene_artwork_url !== 'undefined' && roomview_scene_artwork_url.endsWith('.png')) {
                    image_is_png = true;
                }
                
                var filter_shadow = true;
                var shadow_scale = scene_width / 3500;
                
                if (filter_shadow && image_is_png) {
                    
                    var proportional_shadow =   "drop-shadow(0 "+(1*shadow_scale).toFixed(1)+"px "+(1*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10) )" +
                                                "drop-shadow(0 "+(2*shadow_scale).toFixed(1)+"px "+(2*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10) )" +
                                                "drop-shadow(0 "+(4*shadow_scale).toFixed(1)+"px "+(4*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10) )" +
                                                "drop-shadow(0 "+(6*shadow_scale).toFixed(1)+"px "+(6*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10) )" +
                                                "drop-shadow(0 "+(8*shadow_scale).toFixed(1)+"px "+(8*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10) )"
                                                
                                                
                    // Apply styles
                    $roomview_room.find('.roomview-scene-artwork img').css({
                        '-webkit-filter': proportional_shadow,
                        'filter': proportional_shadow
                    });
                    
                } else {
                    
                    var proportional_shadow =   "0 "+(1*shadow_scale).toFixed(1)+"px "+(1*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10), " +
                                                "0 "+(2*shadow_scale).toFixed(1)+"px "+(2*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10), " +
                                                "0 "+(4*shadow_scale).toFixed(1)+"px "+(4*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10), " +
                                                "0 "+(6*shadow_scale).toFixed(1)+"px "+(8*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10), " +
                                                "0 "+(8*shadow_scale).toFixed(1)+"px "+(16*shadow_scale).toFixed(1)+"px rgba(0,0,0,0.10)"
                    // Apply styles
                    $roomview_room.find('.roomview-scene-artwork img').css({
                        'box-shadow': proportional_shadow
                    });                            
                }
                
                // console.log(proportional_shadow);
                
                // Apply styles
                if (animated) {
                    $roomview_room.find('.roomview-scene-user-area').css('visibility', 'hidden');
                }

                $roomview_room.find('.roomview-scene-artwork').css({
                    'width': dummy_artwork_width_pc
                });
                
                var height_pc = $roomview_room.find('.placeholder-artwork').height() / $roomview_room.find('.roomview-scene-user-area').height() * 100;
                height_pc = height_pc.toString();
                // console.log(height_pc)
                var hang_position = '0.5'
                var hang_position = options.hang_position_y;
                
                // console.log(hang_position);
                // console.log('---------------');
                // Apply styles
                $roomview_room.find('.roomview-scene-hang-area').css({
                    'flex-basis': 'calc((100% * '+ hang_position +') + ('+ height_pc +'% / 2))'
                });

                if (animated) {
                    var $original_element = $roomview_room.find('.roomview-scene-user-area');

                    $temp_element.appendTo($roomview_room.find('.roomview-scene-wrapper'));
                    $temp_element.addClass('roomview-nav-artwork-animated-size');
                    $temp_element.css('top', $original_element.css('top'));
                    $temp_element.css('left', $original_element.css('left'));
                    $temp_element.css('width', $original_element.css('width'));
                    $temp_element.css('height', $original_element.css('height'));

                    $temp_element.find('.roomview-scene-hang-area').addClass('roomview-nav-artwork-animated-size').css({
                        'flex-basis': $original_element.find('.roomview-scene-hang-area').css('flex-basis')
                    });

                    $temp_element.find('.roomview-scene-hang-area').find('.roomview-scene-artwork').addClass('roomview-nav-artwork-animated-size').css({
                        'width': $original_element.find('.roomview-scene-hang-area').find('.roomview-scene-artwork').css('width')
                    });

                    setTimeout(function () {
                        $original_element.css('visibility', 'visible');
                        $temp_element.remove();
                    }, 1000);
                }
            },	
            
            
            scale_artwork: function(instance, $roomview_element, $roomview_room, direction) {
                
                // Scale the wrapper if the image doesnt fit in the viewport
                //instance.scale_wrapper(instance, $roomview_element, $roomview_room);
                
                if (instance.settings.verbose_mode == true){
                    console.log('scale_artwork');
                }
                if (!$roomview_element.hasClass('roomview-initialised')){
                    return
                }
                
                var $placeholder_artwork = $roomview_room.find('img.placeholder-artwork');
                var placeholder_artwork_bounds = $placeholder_artwork[0].getBoundingClientRect();
                var roomview_element_bounds = $roomview_element[0].getBoundingClientRect();
                var unscaled_artwork_px_height = $roomview_element.height();
                var dummy_artwork_px_height =  placeholder_artwork_bounds.height;
                var dummy_artwork_px_width =  placeholder_artwork_bounds.width;
                
                
                    var destination_scale = dummy_artwork_px_height / unscaled_artwork_px_height;
    
                    // Get the new centred (/2) Y offset of the visible artwork once scaled 
                    var scaled_visible_artwork_offset_Y = ( unscaled_artwork_px_height - dummy_artwork_px_height ) / 2;
    
                    //Work out how much distance to transition Y
                    var scaled_artwork_top_target = placeholder_artwork_bounds.top;
                    var unscaled_artwork_top = roomview_element_bounds.top;
                    var scaled_artwork_top_difference = scaled_artwork_top_target - unscaled_artwork_top;
                    var adjustment_distance_Y = scaled_artwork_top_difference - scaled_visible_artwork_offset_Y;
    
    
                    var unscaled_artwork_px_width = $roomview_element.width();
                    var dummy_artwork_px_width =  placeholder_artwork_bounds.width;
    
                    // Get the new centred (/2) X offset of the visible artwork once scaled 
                    var scaled_visible_artwork_offset_X = ( unscaled_artwork_px_width - dummy_artwork_px_width ) / 2;
    
                    //Work out how much distance to transition X
                    var scaled_artwork_left_target = placeholder_artwork_bounds.left;
                    var unscaled_artwork_left = roomview_element_bounds.left;
                    var scaled_artwork_left_difference = scaled_artwork_left_target - unscaled_artwork_left;
                    var adjustment_distance_X = scaled_artwork_left_difference - scaled_visible_artwork_offset_X;
                
                
                if (direction == 'out') {
                    
                    $roomview_room.find('.room').removeClass('animate');
                    $roomview_element.removeClass('room-css-transitions');
                    $roomview_element.css('transform','translateY('+adjustment_distance_Y+'px) translateX('+adjustment_distance_X+'px) scale('+destination_scale+')');

                } else {

                    $roomview_element.addClass('room-css-transitions');
                    $roomview_element.addClass('roomview-artwork-scaled').css('transform','translateY('+adjustment_distance_Y+'px) translateX('+adjustment_distance_X+'px) scale('+destination_scale+')');
                    
                    $roomview_room.find('.room').addClass('animate');
                    
                    setTimeout(function() {
                        $roomview_room.find('.room').removeClass('animate');
                    }, 10, $roomview_room);
                    
                    setTimeout(function() {
                        $('body').addClass('roomview-artwork-switched');
                    }, 900, $roomview_element);
                    
                    setTimeout(function() {
                        $('body').addClass('roomview-artwork-switched-2');
                        $roomview_element.removeClass('room-css-transitions');
                        $roomview_element.css('transform','none');
                    }, 1700, $roomview_element);
                    
                }
                
            },

            close_roomview: function(instance, $roomview_element) {
 
                //$roomview_element not correct at this point... work out why but in the meantime, get it again
                var $roomview_element = $('.roomview-image.roomview-active-element');
                // console.log($roomview_element);
                var instance_id = $roomview_element.attr('data-roomview-id');
                var $roomview_room = $('[data-roomview-element-id="' + instance_id + '"]');
                
                
                // console.log($roomview_room);
                
                instance.scale_artwork(instance, $roomview_element, $roomview_room, 'out');
                
                // // Not instance-based for the moment... close ALL instances
                
                // $('.roomview-image.roomview-active-element').addClass('room-css-transitions');
                // $('.roomview-image.roomview-active-element').removeClass('roomview-active-element').css('transform','translateY(0) scale(1)');
                setTimeout(function() {
                    $('.room-wrapper').removeClass('roomview-active');
                    $('body').addClass('roomview-animate-close');
                    $('body').removeClass('roomview-artwork-switched');
                    $('body').addClass('roomview-artwork-switched-2');
                    $roomview_element.addClass('room-css-transitions');
                    $roomview_element.css('transform','translateY(0) translateX(0) scale(1)');
                     
                }, 30, $roomview_room);
                
                // $('.roomview-image').removeClass('roomview-artwork-scaled');
                
                setTimeout(function() {
                    var elem = $roomview_room.find('.roomview-zoom-wrapper')[0];
                    
                     var $buttons = $('.roomview-button[data-roomview-id='+instance_id+']');
                     $buttons.removeClass('active');
                     
                    $('.roomview-zoom-wrapper').each(function() {
                        var elem = this;
                        var panzoom = Panzoom(elem);
                        panzoom.destroy();
                    });
                        

                    $('.roomview-zoom-range').val(1);
                    $('body').removeClass('roomview-active roomview-animate-close');
                    $roomview_element.removeClass('room-css-transitions');
                    $roomview_element.css('transform','none');
                    $('body').removeClass('roomview-prevent-conflicts');
                }, 800);
                
                setTimeout(function() {
                    $('body').removeClass('roomview-override-switched');
                    $('body').removeClass('roomview-active-2');
                    $roomview_element.closest('.image_popup').off("click.preventPopups");
                    $('body').removeClass('roomview-running');
                    $('.image_hover_zoom').css('pointer-events', 'inherit');
                    try {
                        h.accessibility.on_popup_closing();
                    }
                    catch(error) {
                        console.error(error);
                    }
                }, 1000);
                
            },            
            
            zoom: function(instance, $roomview_element, $roomview_room, $scene_wrapper, do_initial_zoom=true, transition=false) {
                
                
                var initial_zoom = 'cover'; //Zoom to fill screen initially
                var max_initial_zoom = 5;
                
                var startX = 0;
                var startY = 0;
                var disableXAxis = false; 
                var disableYAxis = false;
                var startScale = 1;    

                if (initial_zoom == 'cover' && do_initial_zoom) {
                    
                    // SETUP INITIAL ZOOM LEVEL /////////////////

    				var imageWidth = $scene_wrapper.width();
    				var imageHeight = $scene_wrapper.height();
    				var availableHeight = window.innerHeight;
    				var availableWidth = window.innerWidth;
    				// console.log('--------------');
    				// console.log(window.innerHeight);
    				// console.log(window.innerWidth);
    				// console.log(imageWidth);
    				// console.log(imageHeight);
    				var scaleX = availableWidth / imageWidth;
    				var scaleY = availableHeight / imageHeight;
    				
                    //Which direction do we need to scale in order to fit the screen ?
    				var scale_to_fit = Math.max(scaleX, scaleY);
    				var scale_to_fit_axis = scaleX > scaleY ? 'fit_width' : 'fit_height';
    				
    				
    			    // Fill the screen up to max_initial_zoom
    				if (scale_to_fit > 1) {
    				    startScale = Math.min(max_initial_zoom, scale_to_fit);
    				    // var startScale = scale_to_fit;
    				} else {
    				    startScale = 1; 
    				}
    				// console.log(max_initial_zoom);
    				// console.log(scale_to_fit);
    				// console.log(startScale);
    			
                    var $placeholder = $('.roomview-scene-artwork');
                    var $zoomWrapper = $('.roomview-zoom-wrapper');
                    var placeholder_left = 0;
                    var placeholder_top = 0;
                    $zoomWrapper.height(availableHeight);
                    var half_window_height = availableHeight / 2;
                    var half_window_width = availableWidth / 2;
                    var placeholder_height = $placeholder.height();
                    var placeholder_width = $placeholder.width();
                    
                    
                    // Previous method of retriving postion with getBoundingClientRect
                    // var placeholder_pos = $roomview_room.find('.placeholder-artwork')[0].getBoundingClientRect();
       
                    // if (scale_to_fit == 'fit_width') {
                    //     var half_window_height = $(window).height() / 2;
                    //     var startY = half_window_height - placeholder_pos.top - (placeholder_pos.height / 2);
                    //     var disableXAxis = true; 
                    // } else if (scale_to_fit == 'fit_height') {
                    //     var startX = ($(window).width() / 2) - placeholder_pos.left - (placeholder_pos.width / 2);
                    //     var disableYAxis = true; 
                    // }
       
 
                    //New method of calculating placeholder offset. Slower, but better support and more robust than
                    var $hangwrapper = $placeholder.closest('.roomview-scene-hang-area');
                    $hangwrapper.add($hangwrapper.parentsUntil($zoomWrapper)).each(function(){
                        // placeholder_left += $(this).position().left;
                        placeholder_top += $(this).position().top;
                    });
                    
                    
                    var $artworkwrapper = $placeholder.closest('.roomview-scene-artwork');
                    $artworkwrapper.add($artworkwrapper.parentsUntil($zoomWrapper)).each(function(){
                        placeholder_left += $(this).position().left;
                        // placeholder_top += $(this).position().top;
                    });
                    
                    
                    var placeholder_x = placeholder_left + (placeholder_width / 2); // centre of placeholder
                    var placeholder_y = placeholder_top + (placeholder_height / 2); // centre of placeholder
    
                    
                    ///Prevent the scale from being so close that artworks are initially cut off, for example a really landscape artwork on a mobile screen. 
                    ///Tradeoff is that you lose the perfect zoom of the scene, but at this is the less disorientating option.         
                    var artwork_fit_screen_ratio_width =  (placeholder_width*startScale) / availableWidth;
                    var artwork_fit_screen_ratio_height =  (placeholder_height*startScale) / availableHeight;
                    var artwork_fit_screen_worst_fit = Math.max(artwork_fit_screen_ratio_width, artwork_fit_screen_ratio_height);
                    var modify_start_scale = Math.max(artwork_fit_screen_worst_fit, 1);
                    startScale = startScale / modify_start_scale;
     
                        
                    /* NOTE: panzoom methods (zoom(), reset(), etc) should allow any target (e.g startY or startX), and panzoom will compensate 
                    & ensure that zoom area remains contained. Unfortunately this is VERY flaky, so we do some maths here to ensure default X and Y 
                    are limited correctly. See the Math.min lines below - if target (e.g. placeholder_y) moves the zoom too far off screen, use the max possible instead */
                    
                    if (scale_to_fit_axis == 'fit_width') {
                        
                        var available_offset_y = half_window_height - (half_window_height / startScale);
                        var placeholder_offset_y = half_window_height - placeholder_y; // Placeholder offset from screen center
                        
                        if (placeholder_y > half_window_height) {
                            //Pull in the minus direction towards the center (up)
                            available_offset_y = 0 - available_offset_y; // Max offset before moving off the edge of bg 
                            startY = Math.max(placeholder_offset_y, available_offset_y);
                        } else {
                            //Pull in the plus direction towards the center (down)
                            startY = Math.min(placeholder_offset_y, available_offset_y);
                        }

                        disableXAxis = true; 
                        
                    } else if (scale_to_fit_axis == 'fit_height') {

                        var available_offset_x = 0;
                        var placeholder_offset_x = half_window_width - placeholder_x; // Placeholder offset from screen center

                        if (placeholder_x > half_window_width) {
                            //Pull in the minus direction towards the center (left)
                            available_offset_x = 0 - (half_window_width - (half_window_width / startScale)); // Max offset before moving off the edge of bg 
                            startX = Math.max(placeholder_offset_x, available_offset_x);
                        } else {
                            //Pull in the plus direction towards the center (right)
                            available_offset_x = half_window_width - (half_window_width / startScale); // Max offset before moving off the edge of bg 
                            startX = Math.min(placeholder_offset_x, available_offset_x);
                        }

                        disableYAxis = true; 

                    }
                
                }
 
                
                // SETUP INITIAL ZOOM MAX /////////////////
			    var maxScale = Math.round(startScale * 3);
                $('.roomview-zoom-range').attr('max', maxScale);
                			    
		        // SETUP TRANSTION SPEED /////////////////
                var transition_time = 200;

                
                // INIT PANZOOM /////////////////
                
                var $elem = $roomview_room.find('.roomview-zoom-wrapper');
                var elem = $elem[0];
                /*
                    panOnlyWhenZoomed = false:
                    THIS SEEMS TO FIX BUG WITH INITIAL X AND Y BEING WRONG SOMETIMES... but breaks the zoom out and doesn't allow initial panning

                    panOnlyWhenZoomed = true:
                    when going from a zoomed out room to a zoomed in one with css transitions it breaks whilst false, so make true
                */
                var panOnlyWhenZoomed = transition;
                
                var panzoom = Panzoom(elem, {
                    maxScale: maxScale,
                    startScale: startScale,
                    contain: 'outside',
                    minScale: 1,
                    // transition: true,
                    duration: transition_time,
                    step: 0.5,
                    startY: startY,
                    startX: startX,
                    focal: { x:startX , y:startY }, // IS THIS WORKING?
                    disableYAxis: disableYAxis,
                    disableXAxis: disableXAxis,
                    //disableXAxis: true
                    // easing: 'linear'
                    panOnlyWhenZoomed: panOnlyWhenZoomed,
                });

                //Repair positioning bug in panzoom
                panzoom.setStyle('transform', 'scale('+startScale+') translate('+startX+'px, '+startY+'px)');
                
                
                var currentPan = panzoom.getPan();
                // console.log(currentPan);

                var $range = $roomview_room.find('.roomview-zoom-range');
                var range = $range[0];
                var zoomIn = $roomview_room.find('.roomview-zoom-in')[0];
                var zoomOut = $roomview_room.find('.roomview-zoom-out')[0];
                var $zoomReset = $roomview_room.find('.roomview-zoom-reset');
                var zoomReset = $roomview_room.find('.roomview-zoom-reset')[0];
                var $zoomResetParent = $roomview_room.find('.roomview-zoom-reset').closest('.roomview-zoom-buttons-inner');
                
                $zoomResetParent.addClass('hidden');
                $range.val(startScale);
                
                
                
                //ZOOM IN ////////////////////////////
                
                zoomIn.addEventListener('click', function(e) {
                    panzoom.zoomIn({ animate: true, focal: {x:startX,y:startY}});
                    var currentScale = panzoom.getScale();
                    var currentPan = panzoom.getPan();
                  
                  
                    if (currentScale == startScale && currentPan.x == startX && currentPan.y == startY) {
                        panzoom.setOptions({disableYAxis: disableYAxis,disableXAxis: disableXAxis});
                    } else {
                        panzoom.setOptions({disableYAxis: false, disableXAxis: false});
                    }
                    
                    instance.zoom_update_range_ui(panzoom, $range,currentScale);
                    instance.zoom_update_reset_ui(panzoom, startScale, $zoomResetParent,currentScale);
                    
                });
                
                
                //ZOOM OUT ////////////////////////////
                
                zoomOut.addEventListener('click', function(e) {
                    panzoom.zoomOut({ animate: true, focal: {x:startX,y:startY}});
                    var currentScale = panzoom.getScale();
                    var currentPan = panzoom.getPan();
                  
                  
                    if (currentScale == startScale && currentPan.x == startX && currentPan.y == startY) {
                        panzoom.setOptions({disableYAxis: disableYAxis,disableXAxis: disableXAxis});
                    } else {
                        panzoom.setOptions({disableYAxis: false, disableXAxis: false});
                    }
                    
                    
                    instance.zoom_update_range_ui(panzoom, $range,currentScale);
                    instance.zoom_update_reset_ui(panzoom, startScale, $zoomResetParent,currentScale);
                });
                
                
                //ZOOM RESET ////////////////////////////
                
                zoomReset.addEventListener('click', function(e) {
                    
                    var currentScale = panzoom.getScale();
                    var currentPan = panzoom.getPan();
                  
                    if (currentScale < startScale) {
                        //BUG in reset() when reset zooms *IN* back to the start position. So we do a manual transition instead and silently set the zoom and pan afterwards
                        panzoom.setStyle('transform', 'scale('+startScale+') translate('+startX+'px, '+startY+'px)');
                        setTimeout(function() {
                            panzoom.zoom(startScale, { animate: false});
                            panzoom.pan(startX, startY, { animate: false });
                        }, transition_time + 50);
                        
                    } else {
                        panzoom.reset(); 
                    }

                    //Check these again to update UI after reset
                    currentScale = panzoom.getScale();
                    currentPan = panzoom.getPan();
                    panzoom.setOptions({disableYAxis: disableYAxis, disableXAxis: disableXAxis});
                    instance.zoom_update_range_ui(panzoom, $range, currentScale);
                    instance.zoom_update_reset_ui(panzoom, startScale, $zoomResetParent,currentScale);
                });
                
                //ZOOM RANGE ////////////////////////////
                
                range.addEventListener('input', function(e) {
                    panzoom.zoom(e.target.valueAsNumber, { animate: false});
                    var currentScale = panzoom.getScale();
                    var currentPan = panzoom.getPan();
                  
                  
                    if (currentScale == startScale && currentPan.x == startX && currentPan.y == startY) {
                        panzoom.setOptions({disableYAxis: disableYAxis,disableXAxis: disableXAxis});
                    } else {
                        panzoom.setOptions({disableYAxis: false, disableXAxis: false});
                    }
                    instance.zoom_update_reset_ui(panzoom, startScale, $zoomResetParent,currentScale);
                });
                
                
                
                
                // range.addEventListener('change', function(e) {
                //     panzoom.zoom(e.target.valueAsNumber, { animate: true });
                // });
                
                
                
                // // Bind to mousewheel
                // elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
                // // Bind to shift+mousewheel
                // elem.parentElement.addEventListener('wheel', function (event) {
                //   if (!event.shiftKey) return
                //   // Panzoom will automatically use `deltaX` here instead
                //   // of `deltaY`. On a mac, the shift modifier usually
                //   // translates to horizontal scrolling, but Panzoom assumes
                //   // the desired behavior is zooming.
                //   panzoom.zoomWithWheel(event)
                // })
                
      
                //ZOOM MOUSEWHEEL ////////////////////////////
                          
                if (instance.settings.zoom_scrollwheel_enabled == true){      
                    elem.parentElement.addEventListener('wheel', function (event) {
                      // Panzoom will automatically use `deltaX` here instead
                      // of `deltaY`. On a mac, the shift modifier usually
                      // translates to horizontal scrolling, but Panzoom assumes
                      // the desired behavior is zooming.
                        panzoom.zoomWithWheel(event, {animate: true, step:0.10, duration: 30});
                        var currentScale = panzoom.getScale();
                        
                        
                        if (currentScale == startScale && currentPan.x == startX && currentPan.y == startY) {
                            panzoom.setOptions({disableYAxis: disableYAxis,disableXAxis: disableXAxis});
                        } else {
                            panzoom.setOptions({disableYAxis: false, disableXAxis: false});
                        }
                        
                        instance.zoom_update_reset_ui(panzoom, startScale, $zoomResetParent,currentScale);
                        instance.zoom_update_range_ui(panzoom, $range,currentScale);
                    });
                }
                
            },
            zoom_update_reset_ui: function(panzoom, startScale, $zoomResetParent,currentScale) {
                // var currentScale = panzoom.getScale();
                if (currentScale != startScale) {
                    $zoomResetParent.removeClass('hidden');
                } else {
                    $zoomResetParent.addClass('hidden');
                }
            },            
            zoom_update_range_ui: function(panzoom, $range, currentScale) {
                // var currentScale = panzoom.getScale();
                $range.val(currentScale + '');
            },
            
            
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );