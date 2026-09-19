import browser from "../plugins/$.browser.min.js"

var device = {

    init: function() {

        // Find out the current browser

        if ($.browser.name) {
            var browserVersion = parseInt($.browser.version);
            var browserName = $.browser.name;
            if (browserVersion) {
                $('body').addClass('browser-' + browserName);
                $('body').addClass('browser-' + browserName + '-' + browserVersion);
            }
            if ($.browser.platform) {
                $('body').addClass('platform-' + $.browser.platform);
            }
            if ($.browser.platform == 'iphone' || $.browser.platform == 'ipad') {
                $('body').addClass('platform-ios');
            }
        }

        // Find out if this is the Android default browser and add a class to the body
        // This is NOT a very good way of testing for this browser, but there does not seem to be a conclusive way to do it
        var nua = navigator.userAgent;
        var is_android_default_browser = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
        if (is_android_default_browser) {
            $('body').addClass('browser-android-internet');
        }

        // Find outo if this is a high res device and add a class to the body
        // This allows us to change graphics to high-res versions on compatible devices
        if (window.devicePixelRatio > 1) {
            $('body').addClass('device-highres');
        }

        if (window.galleries.device.handheld()) {
            $('body').addClass('device-handheld');
        } else {
            $('body').addClass('device-desktop');
        }
        
        // Detect support for AR
        var test_anchor = document.createElement("a");
        if ($.browser.name && $.browser.name == 'safari' && test_anchor.relList.supports("ar")) {
            $('body').addClass('ar-supported');
        }
    },

    handheld: function() {

        /* Detect mobile device */
        return (
            //Uncomment to force for testing
            //true ||

            //Dev mode
            (window.location.search.indexOf("?handheld=1") != -1) ||
            //Detect iPhone
            (navigator.platform.indexOf("iPhone") != -1) ||
            //Detect iPod
            (navigator.platform.indexOf("iPod") != -1) ||
            //Detect iPad
            (navigator.platform.indexOf("iPad") != -1) ||
            //Detect iPad ios 13+
            (navigator.platform.indexOf("MacIntel") != -1 && navigator.maxTouchPoints > 1) ||
            //Detect Android
            (navigator.userAgent.toLowerCase().indexOf("android") != -1) ||
            //Detect Surface (ARM chip version e.g. low powered tablets) will also detect other windows tablets with the same chip
            (navigator.userAgent.toLowerCase().indexOf("arm;") != -1 && navigator.userAgent.toLowerCase().indexOf("windows nt") != -1) ||
            //Detect Opera Mini
            (navigator.userAgent.toLowerCase().indexOf("opera mini") != -1) ||
            //Detect Blackberry
            (navigator.userAgent.toLowerCase().indexOf("blackberry") != -1) ||
            //Detect webos
            (navigator.userAgent.toLowerCase().indexOf("webos") != -1) ||
            //Detect iemobile (old version of windows phone)
            (navigator.userAgent.toLowerCase().indexOf("iemobile") != -1)
        );

    }

}

window.galleries = window.galleries || {};
window.galleries.device = device;
export default device;