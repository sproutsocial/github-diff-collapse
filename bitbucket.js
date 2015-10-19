function collapseDiff(diff, callback) {
	$(diff).find('.bpr-collapse-expand').text('Expand').addClass('bpr-is-collapsed');
	$(diff).find('.diff-content-container, .bpr-file-footer').hide(0, callback || $.noop);
}

function expandDiff(diff, callback) {
	$(diff).find('.bpr-collapse-expand').text('Collapse').removeClass('bpr-is-collapsed');
	$(diff).find('.diff-content-container, .bpr-file-footer').show(0, callback || $.noop);
}

function toggleDiff(diff) {
	var button = $(diff).find('.bpr-collapse-expand');
	if (button.hasClass('bpr-is-collapsed')) {
		expandDiff(diff);
	} else {
		collapseDiff(diff);
	}
}

function collapseAll() {
	$('.bb-udiff').each(function(index, element) {
		collapseDiff(element);
	});
}

function expandAll() {
	$('.bb-udiff').each(function(index, element) {
		expandDiff(element);
	});
}

function collapseAndScrollToNext(diff) {
	collapseDiff(diff, function() {
		var otherDiffs = $(diff).nextAll('.bb-udiff');
		if (otherDiffs.length <= 0) {
			return;
		}

		$('html, body').animate({
			scrollTop: otherDiffs.first().offset().top
		}, 0);
	});
}

function hideComments(diff) {
	$(diff).find('.bpr-hide-show-comments').text('Show Comments').addClass('bpr-is-hidden');
	$(diff).find('.comment-thread-container').hide();
}

function showComments(diff) {
	$(diff).find('.bpr-hide-show-comments').text('Hide Comments').removeClass('bpr-is-hidden');
	$(diff).find('.comment-thread-container').show();
}

function toggleComments(diff) {
	var button = $(diff).find('.bpr-hide-show-comments');
	if (button.hasClass('bpr-is-hidden')) {
		showComments(diff);
	} else {
		hideComments(diff);
	}
}

function hideAllComments() {
	$('.bb-udiff').each(function(index, element) {
		hideComments(element);
	});
}

function showAllComments() {
	$('.bb-udiff').each(function(index, element) {
		showComments(element);
	});
}

function addFileHeaderButtons(diff) {
	var otherButtons = $(diff).find('.diff-actions .aui-buttons').first();
	var collapseButton =
		'<div class="aui-buttons">' +
			'<a class="aui-button aui-button-light bpr-collapse-expand">Collapse</a>' +
		'</div>';

	var $collapseButton = $(collapseButton).insertBefore(otherButtons).click(function() {
		toggleDiff(diff);
	});

	var commentButton =
		'<div class="aui-buttons">' +
			'<a class="aui-button aui-button-light bpr-hide-show-comments">Hide Comments</a>' +
		'</div>';

	$(commentButton).insertBefore($collapseButton).click(function() {
		toggleComments(diff);
	});
}

function addFileFooterButton(diff) {
	var diffContainer = $(diff).find('.diff-content-container');
	var footer =
		'<div class="bpr-file-footer">' +
			'<span>Collapse</span>' +
		'</div>';

	$(footer).insertAfter(diffContainer).click(function() {
		collapseAndScrollToNext(diff);
	});
}

function hasGlobalHeaderButtons() {
	return ($('#bpr-global-actions').length > 0);
}

function addGlobalHeaderButtons() {
	var globalActions =
		'<div id="bpr-global-actions">' +
			'<div class="aui-buttons">' +
				'<button id="bpr-hide-comments" class="aui-button aui-button">Hide All Comments</button>' +
				'<button id="bpr-show-comments" class="aui-button aui-button">Show All Comments</button>' +
			'</div>' +
			'<div class="aui-buttons">' +
				'<button id="bpr-collapse-all" class="aui-button aui-button">Collapse All</button>' +
				'<button id="bpr-expand-all" class="aui-button aui-button">Expand All</button>' +
			'</div>' +
		'</div>';

	$(globalActions).insertBefore($('#compare'));

	$('#bpr-collapse-all').click(collapseAll);
	$('#bpr-expand-all').click(expandAll);

	$('#bpr-hide-comments').click(hideAllComments);
	$('#bpr-show-comments').click(showAllComments);
}

function shouldOverrideTableOfContentsClick() {
	var $summary = $('.commit-files-summary');
	if ($summary.length <= 0) {
		return false;
	}

	return !$summary.data('bpr-initialized');
}

function overrideTableOfContentsClick() {
	$('.commit-files-summary a[href|="#chg"]').each(function(index, element) {
		$(element).off('click.bpr').on('click.bpr', function() {
			var fileName = $(this).attr('href').slice(1);
			// Try to use jQuery, I dare you. ;)
			expandDiff(document.getElementById(fileName));
		});
	});

	$('.commit-files-summary').attr('data-bpr-initialized', true);
}

function setupDiffView(diffView) {
	$(diffView).each(function(index, element) {
		addFileHeaderButtons(element);
		addFileFooterButton(element);
	});
}

function setup() {
	$('.bb-udiff').each(function(index, element) {
		var $element = $(element);

		if (!$element.data('bpr-initialized')) {
			setupDiffView(element);
			$element.attr('data-bpr-initialized', true);
		}
	});

	if (!hasGlobalHeaderButtons()) {
		addGlobalHeaderButtons();
	}

	if (shouldOverrideTableOfContentsClick()) {
		overrideTableOfContentsClick();
	}
}

$(function() {
	// TODO: I'd like to make this a bit more efficient
	$(document).livequery('*', setup);
	setup();
});