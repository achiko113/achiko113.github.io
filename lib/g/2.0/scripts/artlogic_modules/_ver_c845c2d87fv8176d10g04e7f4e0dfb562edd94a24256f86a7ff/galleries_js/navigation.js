import debounce from './debounce.js';

var navigation = {

    init: function () {

        if ($('.navigation.navigation_expandable').length > 0) {
            window.galleries.navigation.expandable();
        }

        window.galleries.navigation.has_subnav();
        window.galleries.navigation.dropdown.init();

    },

    expandable: function () {

        $('.navigation.navigation_expandable').each(function () {
            var this_instance = $(this);
            $('ul > li', this).each(function () {
                if ($('.expandable_item_container ul li', this).length > 0) {
                    $('> a', this).click(function () {
                        $('.expandable_item_container', this_instance).slideUp();
                        $(this).parent().find('.expandable_item_container').slideDown();
                        return false;
                    });
                }
            });
            $('ul li .expandable_item_container', this).each(function () {
                if (!$(this).parent().hasClass('active')) {
                    $(this).hide();
                }
            });
        });

    },

    // This function needs to be called before any widths or heights are calculated for grids due to the class 'page_has_subnav' changing the position and size of a grid
    has_subnav: function () {
        if ($('#sub_nav.navigation ul li, #exhibitions_nav.navigation ul li, .list_grid_control.navigation ul li').length) {
            $('body').addClass('page_has_subnav');
        }
    },

    dropdown: {

        init: function () {
            if ($('#full_nav .ul_nested').length) {
                window.galleries.navigation.dropdown.dropdown_setup()

                $(window).on('resize', function () {
                    window.galleries.navigation.dropdown.dropdown_setup()
                });
            }
        },

        dropdown_setup: function () {
            window.galleries.navigation.dropdown.dropdown();
            window.galleries.navigation.dropdown.dropdown_position();
            window.galleries.navigation.dropdown.dropdown_mask();
        },

        dropdown_position: function () {
            $('#full_nav .ul_nested').each(function () {
                var $this = $(this);
                var parent = $this.closest('li');
                if ($this[0].getClientRects().length) {
                    if (window.innerWidth < $this[0].getClientRects()[0].right) {
                        parent.addClass('end-right');
                    } else if (0 > $this[0].getClientRects()[0].left) {
                        parent.addClass('end-left');
                    }
                }
            });
        },

        dropdown: function () {

            var is_mobile = $('#slide_nav_reveal:visible').length;

            if (is_mobile) {
                $('#full_nav li.top.has_dropdown_items').removeClass('has_dropdown_items').addClass('has_dropdown_items_mobile');
            } else {
                $('#full_nav li.top.has_dropdown_items_mobile').removeClass('has_dropdown_items_mobile').addClass('has_dropdown_items');
            }

            $('#full_nav li.top:not(.has_dropdown_items):not(.has_dropdown_items_mobile) .ul_nested').each(function () {

                var nested_list = $(this);
                var list_item = nested_list.closest('li');
                var item_link = list_item.find('> a');

                if (!is_mobile) {
                    list_item.addClass('has_dropdown_items');
                } else {
                    list_item.addClass('has_dropdown_items_mobile');
                }

                // add new list item in the nested list for the item link
                nested_list.prepend('<li class="nested"></li>');
                item_link.prependTo(nested_list.find('> li:first-child')).removeClass('top');
                list_item.prepend('<button class="dropdown-btn" aria-expanded="false" aria-haspopup="true">' + item_link.text() + '</button>');

                list_item.find('.dropdown-btn').click(function () {
                    var expanded = "";

                    list_item.siblings().removeClass('open');
                    list_item.toggleClass('open');

                    if (list_item.hasClass('open')) {
                        expanded = "true";
                    } else {
                        expanded = "false";
                    }

                    $(this)[0].setAttribute('aria-expanded', expanded);
                });

            });

            // only add hover listener when not on mobile
            if (!is_mobile) {
                $('#full_nav li.top .ul_nested').each(function () {
                    var nested_list = $(this);
                    var list_item = nested_list.closest('li');

                    list_item.mouseenter(function () {
                        if (!$(this).hasClass("open")) {
                            $("body").addClass("dropdown-expanded");
                            let liElem = this
                            $(this).find(".dropdown-btn").click();
                            $(this).mouseleave(function () {
                                $(liElem).removeClass("open");
                                $("body").removeClass("dropdown-expanded");
                            })
                        }
                    });
                })
            }

            $('#full_nav li.top .ul_nested').each(function () {
                const currentPath = window.location.pathname.replace(/\/$/, '');

                $(this).find('li a').each(function () {
                    const href = $(this).attr('href').replace(/\/$/, '');
                    if (href === currentPath) {
                        $(this).addClass('dropdown-active');
                    }
                });
            });
        },
        dropdown_mask: function () {

            if ($(window).width() > 1023 && $(".dropdown-mask").length) {

                $(".ul_top li.has_dropdown_items").on("mouseover", function () {
                    var isDropdownOpen = $(this).hasClass("open");
                    var dropdownHeight = $(".ul_nested").outerHeight() + $('header').outerHeight();
                    $("#header .inner").css('border-bottom-width', '0');
                    $(".dropdown-mask").height(isDropdownOpen ? dropdownHeight : 0).css('opacity', isDropdownOpen ? 1 : 0);

                    if (isDropdownOpen) {
                        $("body").addClass("dropdown-expanded");
                        $("body").addClass("dropdown-masked");
                    }
                });

                $(".ul_top li.has_dropdown_items").on("mouseleave", function () {
                    $(".dropdown-mask").height(0).css('opacity', 0);
                    $("#header .inner").css('border-bottom-width', '1px');
                    $("body").removeClass("dropdown-expanded");
                    $("body").removeClass("dropdown-masked");
                });
            }
        },
    }
}

window.galleries = window.galleries || {};
window.galleries.navigation = navigation;
export default navigation;