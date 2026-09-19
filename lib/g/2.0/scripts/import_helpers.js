// Import functions for browsers
window.Artlogic = window.Artlogic || {};
Artlogic.import = function(src) {
	if (typeof window.System != 'undefined' && typeof __webpack_require__ == 'undefined') {
		return System.import('./artlogic_modules/'+src);
	} else {
		// Non-webpack import helper - eval is used to prevent IE11 throwing a reserved word error
		return secureEval("import('./artlogic_modules/"+src+"')");
	}	
}

function secureEval(code) {
	return Function('"use strict";return (' + code + ')')();
}