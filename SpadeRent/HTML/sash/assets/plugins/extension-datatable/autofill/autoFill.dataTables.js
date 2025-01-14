/*! DataTables styling wrapper for AutoFill
 * ©2018 SpryMedia Ltd - datatables.net/license
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		define( ['jquery', 'datatables.net-dt', 'datatables.net-autofill'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}
			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-dt')(root, $).$;
			}
			if ( ! $.fn.dataTable.AutoFill ) {
				require('datatables.net-autofill')(root, $);
			}
			return factory( $, root, root.document );
		};
	}
	else {
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
return $.fn.dataTable;
}));