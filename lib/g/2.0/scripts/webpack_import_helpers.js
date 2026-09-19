window.Artlogic = window.Artlogic || {};
Artlogic.import = function(src) {
    var token = window.ARTLOGIC_ASSET_SUFFIX || '';
    if (token) {
        var url = './artlogic_modules/' + token + '/' + src;
        return import(/* webpackIgnore: true */ url);
    }
    return import(/* webpackChunkName: "chunk" */'./artlogic_modules/'+src);
}

function secureEval(code) {
	return Function('"use strict";return (' + code + ');')();
}
window.secureEval = secureEval;