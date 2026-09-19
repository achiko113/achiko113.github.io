/**
 * jQuery RoomView by Artlogic
 *
 * Copyright 2018, Artlogic Media Ltd, http://www.artlogic.net/
 */
 

export default ( function( $, window, document, undefined ) {

	"use strict";

		// Create the defaults once
		var pluginName = "roomView",
			defaults = {
				furniture_type: "chair", // Options: 'chair', 'measure', 'leathersofa'
				wall_type: "standard", // Options: 'standard', 'concrete', 'brick'
				floor_type: "standard", // Options: 'standard', 'wood'
                hanging_height_cm: 140,   // Runs horizontally through the * middle * of the work
                custom_room_html: null,
                verbose_mode: false,
                minimum_top_margin: 150,
                minimum_left_margin: 50,
                hanging_ratio: 0.30,
                floor_height: 100,
                
                before_open: function() {}
			};
		
		// Furniture settings
		
		var defaults = $.extend( {}, defaults, {
		    default_furniture_item: 'chair',
		    furniture_items: {
    		  //  'chair': {
    		  //      classname_suffix: 'chair',
    		  //      furniture_width_cm: 85
    		  //  }, ///OLD WHITE CHAIR
    		    'bench': {
    		        classname_suffix: 'bench',
    		        furniture_width_cm: 300
    		    },
    		    'chair': {
    		        classname_suffix: 'chair',
    		        furniture_width_cm: 148
    		    },   
    		  //  'chair2': {
    		  //      classname_suffix: 'chair2',
    		  //      furniture_width_cm: 85
    		  //  },
    		    'chair2': {
    		        classname_suffix: 'chair2',
    		        furniture_width_cm: 148
    		    },
    		    'mobler_chair': {
    		        classname_suffix: 'mobler_chair',
    		        furniture_width_cm: 122
    		    },
    		    'madsens_chair': {
    		        classname_suffix: 'madsens_chair',
    		        furniture_width_cm: 140
    		    },
    		    'raffles_sofa': {
    		        classname_suffix: 'raffles_sofa',
    		        furniture_width_cm: 340,
    		        artwork_minimum_floor_clearance: 200
    		    },
    		    'chesterfield_sofa': {
    		        classname_suffix: 'chesterfield_sofa',
    		        furniture_width_cm: 350,
    		        artwork_minimum_floor_clearance: 200
    		    },
    		    'leathersofa': {
    		        classname_suffix: 'leathersofa',
    		        furniture_width_cm: 350,
    		        artwork_minimum_floor_clearance: 200
    		    },
    		    'measure': {
    		        classname_suffix: 'measure',
    		        furniture_width_cm: 200
    		    },
    		    'custom_chair': {
    		        classname_suffix: 'custom_chair',
    		        furniture_width_cm: 148
    		    }
    		}
		});

		// The actual plugin constructor
		function Plugin ( element, options ) {
            this.element = element;
            
			this.settings = $.extend( {}, defaults, options );
			
			if (this.settings.furniture_type && this.settings.furniture_type in this.settings.furniture_items) {
			    var furniture_settings = this.settings.furniture_items[this.settings.furniture_type];
			    furniture_settings['id'] = this.settings.furniture_type;
			} else {
			    var furniture_settings = this.settings.furniture_items[this.settings.default_furniture_item];
			    furniture_settings['id'] = this.settings.default_furniture_item;
			}
			this.settings = $.extend({}, this.settings, {
			    furniture_settings: furniture_settings
			});
			
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
                $roomview_element.removeClass('roomview-initialised');

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
                
                instance.inject_room(instance, $roomview_element);
                instance.create_placeholder_artwork(instance, $roomview_element);
                instance.button(instance, $roomview_element);

                //////TODO MAKE THIS BETTER/////////////////
                $( window ).resize(function() {
                    if ($('body.roomview-active').length ){
                    console.log('removeClass room-css-transitions');
                        $('img.roomview-image').removeClass('room-css-transitions');
                        var $roomview_element = $('.roomview-image.roomview-active-element');
                        var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                        
                        instance.scale_artwork(instance, $roomview_element, $roomview_room);
                    
                        // Scale the wrapper if the image doesnt fit in the viewport
                        instance.scale_wrapper(instance, $roomview_element, $roomview_room);
                    }
                });
                var resizeTimer;
                $(window).on('resize', function(e) {
                  clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(function() {
                    if ($('body.roomview-active').length ){
                    console.log('removeClass room-css-transitions');
                        $('img.roomview-image').removeClass('room-css-transitions');
                        var $roomview_element = $('.roomview-image.roomview-active-element');
                        var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                        
                        instance.scale_artwork(instance, $roomview_element, $roomview_room);
                        
                        // Scale the wrapper if the image doesnt fit in the viewport
                        instance.scale_wrapper(instance, $roomview_element, $roomview_room);
                    }
                  }, 300);
                });
                ////////////////////////////////////////

                if (!$('.roomview-close').length) {
                    var close_html = '<div class="roomview-close"><a href="#" role="button">Close</a></div>';
                    $('body').append(close_html);
                    $('.roomview-close').click(function(e) {
                        e.preventDefault();
                        instance.close_roomview();
                    });
               }    

            },

			inject_room: function(instance, $roomview_element) {
                var room_html = instance.return_room_html(instance)
                if (!$roomview_element.hasClass('roomview-initialised')) {
                    //$('body').append(room_html);
                    $roomview_element.after(room_html);
                    $roomview_element.addClass('roomview-initialised');
                }
            },

			button: function(instance, $roomview_element) {
                var button_rel = $roomview_element.attr('data-roomview-id');
                var $button = $('.roomview-button[data-roomview-id='+button_rel+']');

                $button.click(function() {
                    if (instance.settings.verbose_mode == true){
                    }
                    instance.open({
                        furniture_type: $(this).attr('data-roomview-furniture-type') && typeof $(this).attr('data-roomview-furniture-type') != 'undefined' ? $(this).attr('data-roomview-furniture-type') : '',
                        wall_type: $(this).attr('data-roomview-wall-type') && typeof $(this).attr('data-roomview-wall-type') != 'undefined' ? $(this).attr('data-roomview-wall-type') : ''
                    });
                });
            },
            
		    open: function(options) {
                var instance = this;
                var $roomview_element = $(this.element);
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                
                var button_rel = $(instance).attr('data-roomview-id');
                
                // Reset scene
                $roomview_room.find('.wall').attr('class', '').addClass('wall wall-type-' + instance.settings.wall_type);
                $roomview_room.find('.floor').attr('class', '').addClass('floor floor-type-' + instance.settings.floor_type);
                $roomview_room.find('.roomview-object').addClass('roomview-object-hidden');
                $roomview_room.find('.roomview-object.furniture-type-' + instance.settings.furniture_type + '').removeClass('roomview-object-hidden');
                instance.settings.furniture_settings = instance.settings.furniture_items[instance.settings.furniture_type];
                var furniture_settings_for_scale = instance.settings.furniture_items[instance.settings.furniture_type];
                
                // Set custom scene attributes if supplied
                if (options && typeof options != 'undefined') {
                    if (options.wall_type && options.wall_type != '') {
                        $roomview_room.find('.wall').attr('class', '').addClass('wall wall-type-' + options.wall_type);
                    }
                    if (options.floor_type && options.floor_type != '') {
                        $roomview_room.find('.floor').attr('class', '').addClass('floor floor-type-' + options.floor_type);
                    }
                    if (options.furniture_type && options.furniture_type != '') {
                        $roomview_room.find('.roomview-object').addClass('roomview-object-hidden');
                        $roomview_room.find('.roomview-object.furniture-type-' + options.furniture_type + '').removeClass('roomview-object-hidden');
                        instance.settings.furniture_settings = instance.settings.furniture_items[options.furniture_type];
                        
                        var furniture_settings_for_scale = instance.settings.furniture_items[options.furniture_type];
                    }
                }
                
                instance.scale_placeholder_artwork(instance, $roomview_element, furniture_settings_for_scale);
                
                instance.settings.before_open(button_rel, $(this));
                $('body').addClass('roomview-active');
                $('.draginner').css({'transform': 'none', 'transition': 'none'});
                $roomview_element.addClass('roomview-active-element');
                instance.scale_artwork(instance, $roomview_element, $roomview_room);
                $roomview_room.css('opacity',1).addClass('roomview-active');
                try {
                    h.accessibility.on_popup_opening('.roomview-close', '.roomview-close a', '.roomview-close');
                }
                catch(error) {
                    console.error(error);
                }
		    },

			return_room_html: function(instance) {

                if (instance.settings.custom_room_html) {

                    var room_html = instance.settings.custom_room_html;

                } else {
                    var room_html = '<div data-roomview-element-id="' + $(instance.element).attr('data-roomview-id') + '" class="room-wrapper">';
                    room_html +=        '<div class="room">';
                    room_html +=            '<div class="wall wall-type-'+instance.settings.wall_type+'">';
                    room_html +=                '<div class="wall-texture"></div>';
                    room_html +=                '<div class="wall-inner">';
                    
                    var value;
                    Object.keys(instance.settings.furniture_items).forEach(function(key) {
                        var furniture_options = instance.settings.furniture_items[key];
                        var hidden_classname = instance.settings.furniture_settings.id == furniture_options.id ? '' : ' roomview-object-hidden';
                        room_html += '<div class="roomview-object furniture-type-' + furniture_options.classname_suffix + '' + hidden_classname + '" data-object-cm-width="' + furniture_options.furniture_width_cm + '" data-object-name="' + furniture_options.id + '"></div>';
                    });
                    
                    room_html +=                '</div>';
                    room_html +=            '</div>';
                    room_html +=        '<div class="floor floor-type-'+instance.settings.floor_type+'"></div>';
                    room_html +=    '</div>';
                    room_html += '</div>';
                    
                }
                return room_html;
            },

            close_roomview: function() {
                // Not instance-based for the moment... close ALL instances
                $('body').removeClass('roomview-active roomview-artwork-switched');
                    console.log('addClass room-css-transitions');
                $('.roomview-image.roomview-active-element').addClass('room-css-transitions');
                $('.roomview-image.roomview-active-element').removeClass('roomview-active-element').css('transform','translateY(0) scale(1)');
                $('.draginner').css({'transform': '', 'transition': ''});
                $('.room-wrapper').css('opacity',0).removeClass('roomview-active');
                try {
                    h.accessibility.on_popup_closing();
                }
                catch(error) {
                    console.error(error);
                }
                setTimeout(function() {
                    $('.roomview-image').removeClass('roomview-artwork-scaled');
                }, 600);
            },

			create_placeholder_artwork: function(instance, $roomview_element) {
			    
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
                
                if (!$roomview_room.find('.wall').find('.placeholder-artwork').length ){
                    var $wall = $roomview_room.find('.wall-inner');
                    $roomview_element.clone().removeClass('roomview-image').addClass('placeholder-artwork').appendTo($wall);
                }
  
                instance.scale_placeholder_artwork(instance, $roomview_element);
            },

			scale_placeholder_artwork: function(instance, $roomview_element, furniture_settings) {
			    
                // SCALE DUMMY ARTWORK
                var $roomview_room = $('[data-roomview-element-id="' + $roomview_element.attr('data-roomview-id') + '"]');
               
                // Create a scale ratio
                var object_px = $roomview_room.find('.roomview-object:not(.roomview-object-hidden)').width();
                var object_width_cm = $roomview_room.find('.roomview-object:not(.roomview-object-hidden)').attr('data-object-cm-width');

      
                // console.log(furniture_settings);
                if (typeof furniture_settings != undefined && furniture_settings) {
                    
                    if (typeof furniture_settings.furniture_width_cm != undefined && furniture_settings.furniture_width_cm){
                        object_width_cm = furniture_settings.furniture_width_cm
                    }                    
                    if (typeof furniture_settings.classname_suffix != undefined && furniture_settings.classname_suffix){
                        var suffix = furniture_settings.classname_suffix;
                        object_px = $('.roomview-object.furniture-type-'+suffix).width();
                    }
                }

                // Work out px size of scaled artwork
                var artwork_width_cm = $roomview_element.attr('data-roomview-artwork-cm-width');
         
                
                var artwork_scale = object_px / object_width_cm;
                var dummy_artwork_px = artwork_width_cm * artwork_scale;

                // Apply size
                $roomview_room.find('.placeholder-artwork').width(dummy_artwork_px);

                // Set hanging height
                var eyeline_height = instance.settings.hanging_height_cm; // add data-attribute override
                var eyeline_height = eyeline_height * artwork_scale;
                var bottom = eyeline_height - ( $roomview_room.find('.placeholder-artwork').height() * (1 - instance.settings.hanging_ratio));
                
                var minimum_artwork_bottom_value = (instance.settings.visual_mode == 'photo' ? 20 : 80) + (instance.settings.furniture_settings.artwork_minimum_floor_clearance && typeof instance.settings.furniture_settings.artwork_minimum_floor_clearance != 'undefined' ? instance.settings.furniture_settings.artwork_minimum_floor_clearance : 0);
                
                if (bottom < minimum_artwork_bottom_value) {
                    var bottom = minimum_artwork_bottom_value;
                }
                
                // Adjust positioning of artwork to centre of eyeline
                $roomview_room.find('.placeholder-artwork').css({
                    'bottom' : bottom
                });
                
                // Scale the wrapper if the image doesnt fit in the viewport
                instance.scale_wrapper(instance, $roomview_element, $roomview_room);
                
            },
            
            scale_wrapper: function(instance, $roomview_element, $roomview_room) {
                

                // Scale if top of artwork is being cut off
                
                var $wall_texture = $roomview_room.find('.wall-texture');
                var $floor = $roomview_room.find('.floor');
                
                // Reset transform before we start
                $roomview_room.css('transform','');
                $wall_texture.attr('style','');
                $floor.attr('style','');
                
                var scaled_artwork_top_target = $roomview_room.find('.placeholder-artwork')[0].getBoundingClientRect().top;
                var scaled_artwork_left_target = $roomview_room.find('.placeholder-artwork')[0].getBoundingClientRect().left;
                
                function runScale(new_scene_scale_ratio) {
                    $roomview_room.css('transform', 'scale(' + new_scene_scale_ratio + ')');
                    
                    ////////////////////////////////////////////////
                    // ENSURE THAT WALL ALWAYS FILLS THE SCREEN
                    ////////////////////////////////////////////////
                    var wall_texture_bounds = $wall_texture[0].getBoundingClientRect();
                    var wall_unscaled_px_height = $wall_texture.height();
                    var wall_unscaled_px_width = $wall_texture.width();
                    
                    /// HEIGHT
                    var scaled_wall_bottom = wall_texture_bounds.bottom;  ///TARGET AREA TO COVER
                    var scaled_wall_height = wall_texture_bounds.height;  
                    var height_scale_ratio = scaled_wall_bottom / scaled_wall_height;
                    var new_unscaled_px_height = wall_unscaled_px_height * height_scale_ratio;
                    
                    /// WIDTH
                    var scaled_wall_width= wall_texture_bounds.width;  ///TARGET AREA TO COVER
                    var width_scale_ratio = $(window).width() / scaled_wall_width;
                    var new_unscaled_px_width = wall_unscaled_px_width * width_scale_ratio;

                    $wall_texture.height(new_unscaled_px_height).width(new_unscaled_px_width);
                    $floor.width(new_unscaled_px_width);
                }
                
                function scaleHeight() {
                    
                    var amount_off_screen = scaled_artwork_top_target;
                    var viewport_height = $(window).height();
                    
                    var new_target_viewport_height = viewport_height - (amount_off_screen) + (instance.settings.minimum_top_margin); // Removed *2 from both amount_off_screen and minimum_top_margin as we now align to the bottom so it doesnt need to be doubled for top and bottom
                    var new_scene_scale_ratio = viewport_height / new_target_viewport_height;
                    
                    runScale(new_scene_scale_ratio);
                }
                
                function scaleWidth() {
                    
                    var amount_off_screen = scaled_artwork_left_target;
                    var viewport_width = $(window).width();
                    
                    var new_target_viewport_width = viewport_width - (2 * amount_off_screen) + (2 * instance.settings.minimum_left_margin);
                    var new_scene_scale_ratio = viewport_width / new_target_viewport_width;
                    
                    runScale(new_scene_scale_ratio);
                }
                
                // 1. Check if the height or width is overflowing the screen
                // 2. If it is overflowing, scale using that axis.
                // 3. After scaling check if the other axis is overlaping, and if it is scale by that axis instead
                if (scaled_artwork_top_target < instance.settings.minimum_top_margin) {
                    scaleHeight();
                    if ($roomview_room.find('.placeholder-artwork')[0].getBoundingClientRect().left < instance.settings.minimum_left_margin) {
                        scaleWidth();
                    }
                } else if (scaled_artwork_left_target < instance.settings.minimum_left_margin) {
                    scaleWidth();
                    if ($roomview_room.find('.placeholder-artwork')[0].getBoundingClientRect().top < instance.settings.minimum_top_margin) {
                        scaleHeight();
                    }
                }
                
            },
            
            scale_artwork: function(instance, $roomview_element, $roomview_room) {
                
                // Scale the wrapper if the image doesnt fit in the viewport
                instance.scale_wrapper(instance, $roomview_element, $roomview_room);
                
                if (instance.settings.verbose_mode == true){
                    console.log('scale_artwork');
                }
                if (!$roomview_element.hasClass('roomview-initialised')){
                    return
                }
                
                var $placeholder_artwork = $roomview_room.find('img.placeholder-artwork');
                var placeholder_artwork_bounds = $placeholder_artwork[0].getBoundingClientRect();
                var roomview_element_bounds = $roomview_element[0].getBoundingClientRect();


                if ($roomview_element.hasClass('roomview-artwork-scaled')) {
                    
                    /// RE-SCALE artwork when it is already scaled

                    //if ($roomview_element.hasClass('roomview-artwork-scaled roomview-initialised')){
                    if (instance.settings.verbose_mode == true){
                        console.log('Artwork in scale mode - adjust position');
                    }
                    console.log('removeClass room-css-transitions');
                    $roomview_element.removeClass('room-css-transitions');

                    // Calculate the Scale
                    var unscaled_artwork_px_height = $roomview_element.height();
                    var dummy_artwork_px_height =  placeholder_artwork_bounds.height;
                    var final_visible_artwork_scale = dummy_artwork_px_height / unscaled_artwork_px_height;

                    //Get the current transform
                    var current_transformation = $roomview_element.css('transform');
                    var transform_values = current_transformation.split('(')[1];
                    transform_values = transform_values.split(')')[0];
                    transform_values = transform_values.split(',');

                    var current_transformation_Y = transform_values[5];
                    var current_transformation_X = transform_values[4];

                    //Work out how much distance to transition Y
                    //Work out the difference between the target and the visible
                    var scaled_artwork_top_target = placeholder_artwork_bounds.top;
                    var scaled_artwork_top_current = roomview_element_bounds.top;
                    var scaled_artwork_top_difference = scaled_artwork_top_target - scaled_artwork_top_current;

                    var adjustment_distance_Y = parseFloat(current_transformation_Y) + scaled_artwork_top_difference;

                    //Work out how much distance to transition X
                    //Work out the difference between the target and the visible
                    var scaled_artwork_left_target = placeholder_artwork_bounds.left;
                    var scaled_artwork_left_current = roomview_element_bounds.left;
                    var scaled_artwork_left_difference = scaled_artwork_left_target - scaled_artwork_left_current;

                    var adjustment_distance_X = parseFloat(current_transformation_X) + scaled_artwork_left_difference;

                    $roomview_element.addClass('roomview-artwork-scaled').css('transform','translateY('+adjustment_distance_Y+'px) translateX('+adjustment_distance_X+'px) scale('+final_visible_artwork_scale+')');

                } else {


                    ///TRANSITION FROM FULL-SIZE ARTWORK TO SCALED
                    
                    
                    if (instance.settings.verbose_mode == true){
                        console.log('Scale from full size');
                    }
                    // Calculate the Scale
                    var unscaled_artwork_px_height = $roomview_element.height();
                    var dummy_artwork_px_height =  placeholder_artwork_bounds.height;
                    var final_visible_artwork_scale = dummy_artwork_px_height / unscaled_artwork_px_height;

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
                    
                    console.log('addclass room-css-transitions');
                    $roomview_element.addClass('room-css-transitions');
                    $roomview_element.addClass('roomview-artwork-scaled').css('transform','translateY('+adjustment_distance_Y+'px) translateX('+adjustment_distance_X+'px) scale('+final_visible_artwork_scale+')');
                    
                    $roomview_room.find('.room').addClass('animate');
                    
                    setTimeout(function() {
                        $roomview_room.find('.room').removeClass('animate');
                    }, 10, $roomview_room);
                    
                    setTimeout(function() {
                        $('body').addClass('roomview-artwork-switched');
                    }, 1000, $roomview_element);
                    
                }
                
            }

		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[pluginName] = function ( options ) {
            return this.each(function () {
                if (typeof options === "string") {
                    var args = Array.prototype.slice.call(arguments, 1),
                        plugin = $.data(this, 'plugin_' + pluginName);
                    plugin[options].apply(plugin, args);
                } else if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName,
                    new Plugin( this, options ));
                }
            });
        };


} )( jQuery, window, document )