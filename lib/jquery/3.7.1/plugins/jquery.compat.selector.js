/*!
 * jQuery 3 compatibility shim: restores $.fn.selector
 *
 * jQuery 3.0 removed the .selector property on jQuery objects. Some plugins
 * still in production use (notably fancybox 2.1.3 loaded by lib-g) check
 * `this.selector` to decide between direct binding and document-level event
 * delegation. Without .selector they fall back to direct binding, which
 * misses dynamically-added elements such as slick carousel clones.
 *
 * This shim restores .selector to its jQuery 1.x behaviour:
 *   - $('.foo').selector  === '.foo'
 *   - $('.foo').find('.bar').selector  === ''   (matches jQuery 3 no-tracking)
 *
 * No-op when .selector is already present (e.g. jQuery 1.x).
 */
(function ($) {
    if (!$ || !$.fn) { return; }
    if ('selector' in $.fn) { return; }

    // Default property on the prototype so $.fn.selector !== undefined.
    $.fn.selector = '';

    // Wrap $.fn.init so each new jQuery instance carries .selector when
    // created via $('selector string'). Other init forms (DOM nodes,
    // jQuery objects, functions) leave .selector at the default ''.
    var origInit = $.fn.init;
    var wrappedInit = function (selector, context, root) {
        var instance = origInit.apply(this, arguments);
        if (typeof selector === 'string') {
            instance.selector = selector;
        } else if (selector && typeof selector.selector === 'string') {
            instance.selector = selector.selector;
        }
        return instance;
    };
    wrappedInit.prototype = $.fn;
    $.fn.init = wrappedInit;
})(window.jQuery);
