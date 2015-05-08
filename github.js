function collapseDiff(fileDiv, callback) {
	$(fileDiv).find('.file-header .gpr-collapse-expand').text('Expand').addClass('gpr-is-collapsed');
	$(fileDiv).find('.blob-wrapper, .gpr-file-footer').hide(0, callback || $.noop);
}
 
function expandDiff(fileDiv, callback) {
	$(fileDiv).find('.file-header .gpr-collapse-expand').text('Collapse').removeClass('gpr-is-collapsed');
	$(fileDiv).find('.blob-wrapper, .gpr-file-footer').show(0, callback || $.noop);
}
 
function toggleDiff(fileDiv) {
	var button = $(fileDiv).find('.file-header .gpr-collapse-expand');
	if (button.hasClass('gpr-is-collapsed')) {
		expandDiff(fileDiv);
	} else {
		collapseDiff(fileDiv);
	}
}
 
function collapseAll() {
	$('.diff-view .file').each(function(index, element) {
		collapseDiff(element);
	});
}
 
function expandAll() {
	$('.diff-view .file').each(function(index, element) {
		expandDiff(element);
	});
}

function collapseAndScrollToNext(fileDiv) {
	collapseDiff(fileDiv, function() {
		var otherDiffs = $(fileDiv).nextAll('.file');
		if (otherDiffs.length <= 0) {
			return;
		}

		$('html, body').animate({
			scrollTop: otherDiffs.first().offset().top
		}, 0);
	});
}
 
function addFileHeaderButton(fileDiv) {
	var viewButton = $(fileDiv).find('.file-header .file-actions a.btn:first-of-type');
	var collapseButton = '<a class="btn btn-sm gpr-collapse-expand">Collapse</a>';
 
	$(collapseButton).insertBefore(viewButton).click(function() {
		toggleDiff(fileDiv);
	});
}

function addFileFooterbutton(fileDiv) {
	var blobWrapper = $(fileDiv).find('.blob-wrapper');
	var footer =
		'<div class="gpr-file-footer">' +
			'<span>Collapse</span>' +
		'</div>';

	$(footer).insertAfter(blobWrapper).click(function() {
		collapseAndScrollToNext(fileDiv);
	});
}
 
function addGlobalHeaderButtons() {
	var oldButtons = $('#toc .btn-group');
	var newButtons =
		'<div class="btn-group right gpr-button-group">' +
			'<a id="gpr-collapse-all" class="btn btn-sm">Collapse All</a>' +
			'<a id="gpr-expand-all" class="btn btn-sm">Expand All</a>' +
		'</div>';
 
	$(newButtons).insertAfter(oldButtons);
 
	$('#gpr-collapse-all').click(collapseAll);
	$('#gpr-expand-all').click(expandAll);
}

function overrideTableOfContentsClick() {
	$('#toc .content a[href|="#diff"]').each(function(index, element) {
		$(element).click(function() {
			var diffName = $(this).attr('href').slice(1);
			var fileDiv = $('a[name="' + diffName + '"]').nextAll('.file').first();
			expandDiff(fileDiv);
		});
	});
}

function setupDiffView(diffView) {
	$(diffView).find('.file').each(function(index, element) {
		var $element = $(element);
		if ($element.data('gpr-initialized')) {
			return;
		}

		addFileHeaderButton(element);
		addFileFooterbutton(element);

		$element.data('gpr-initialized', true);
	});
}

function setup() {
	$('.diff-view').each(function(index, element) {
		var $element = $(element);

		if (!$element.data('gpr-initialized')) {
			setupDiffView(element);
			$element.data('gpr-initialized', true);
		}
	});

	var $toc = $('#toc');
	if (!$toc.data('globalHeaderButtonsAdded')) {
		addGlobalHeaderButtons();
		$toc.data('globalHeaderButtonsAdded', true);
	}

	if (!$toc.data('tableOfContentsOverridden')) {
		overrideTableOfContentsClick();
		$toc.data('tableOfContentsOverridden', true);
	}	
}
 
$(function() {
	// TODO: I'd like to make this a bit more efficient
	$(document).livequery('*', setup);
	setup();
});