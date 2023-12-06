(function($) {
	"use strict";
	var btnFinish = $('<button></button>').text('Finish')
		.addClass('btn btn-primary')
		.on('click', function(){ alert('Finish Clicked'); });
	var btnCancel = $('<button></button>').text('Cancel')
		.addClass('btn btn-secondary')
		.on('click', function(){ $('#smartwizard-3').smartWizard("reset"); });
	$('#smartwizard').smartWizard({
			selected: 0,
			theme: 'default',
			transitionEffect:'fade',
			showStepURLhash: true,
			toolbarSettings: {
							  toolbarButtonPosition: 'end',
							  toolbarExtraButtons: [btnFinish, btnCancel]
							}
	});
	$('#smartwizard-1').smartWizard({
			selected: 0,
			theme: 'arrows',
			transitionEffect:'fade',
			showStepURLhash: false,
			toolbarSettings: {
							  toolbarExtraButtons: [btnFinish, btnCancel]
							}
	});
	$('#smartwizard-2').smartWizard({
			selected: 0,
			theme: 'circles',
			transitionEffect:'fade',
			showStepURLhash: false,
			toolbarSettings: {
							  toolbarExtraButtons: [btnFinish, btnCancel]
							}
	});
	$('#smartwizard-3').smartWizard({
			selected: 0,
			theme: 'dots',
			transitionEffect:'fade',
			showStepURLhash: false,
			toolbarSettings: {
							  toolbarExtraButtons: [btnFinish, btnCancel]
							}
	});
})(jQuery);