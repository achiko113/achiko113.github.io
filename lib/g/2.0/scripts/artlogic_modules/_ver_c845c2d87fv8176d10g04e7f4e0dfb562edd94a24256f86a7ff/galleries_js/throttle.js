var throttle = function(delay, callback) {
    var previousCall = new Date().getTime();
    return function() {
        var time = new Date().getTime();
        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

window.galleries = window.galleries || {};
window.galleries.throttle = throttle;
export default throttle;