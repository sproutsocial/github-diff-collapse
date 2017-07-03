(function() {
	function collapseDiff(fileDiv, callback) {
		$(fileDiv).find('button.js-details-target[aria-expanded=true]').click();

		if (callback) {
			callback();
		}
	}

	function expandDiff(fileDiv, callback) {
		$(fileDiv).find('button.js-details-target[aria-expanded=false]').click();

		if (callback) {
			callback();
		}
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

	function hideAllComments() {
		$('input.js-toggle-file-notes:checked').click();
	}

	function showAllComments() {
		$('input.js-toggle-file-notes:not(:checked)').click();
	}

	function hideWhitespaceChanges() {
		if (window.location.search.indexOf('w=1') < 0) {
			if (window.location.search) {
				window.location.href = window.location.href + '&w=1';
			} else {
				window.location.href = window.location.href + '?w=1';
			}
		}
	}

	function collapseAndScrollToNext(fileDiv) {
		collapseDiff(fileDiv, function() {
			var otherDiffs = $(fileDiv).nextAll('.file');
			if (otherDiffs.length <= 0) {
				return;
			}

			var toolbar = $('.pr-toolbar');
			var toolbarOffset = (toolbar.hasClass('is-stuck') ? toolbar.height() : 0);

			$('html, body').animate({
				scrollTop: otherDiffs.first().offset().top - toolbarOffset
			}, 0);
		});
	}

	function addFileFooterButton(fileDiv) {
		var blobWrapper = $(fileDiv).find('.blob-wrapper, .render-wrapper');
		var footer =
			'<div class="gpr-file-footer">' +
			'<span>Collapse</span>' +
			'</div>';

		$(footer).insertAfter(blobWrapper).click(function() {
			collapseAndScrollToNext(fileDiv);
		});
	}

	function hasGlobalHeaderButtons() {
		return ($('#gpr-collapse-all, #gpr-expand-all').length > 0);
	}

	function addGlobalHeaderButtons() {
		if ($('#toc .btn-group').length === 0) {
			addPullRequestGlobalHeaderButtons();
		} else {
			addCommitDiffGlobalHeaderButtons();
		}
	}

	function addCommitDiffGlobalHeaderButtons() {
		var oldButtons = $('#toc .btn-group').first();
		var newButtons =
			'<div class="btn-group right gpr-button-group">' +
			'<a id="gpr-collapse-all" class="btn btn-sm">Collapse All</a>' +
			'<a id="gpr-expand-all" class="btn btn-sm">Expand All</a>' +
			'</div>';

		$(newButtons).insertAfter(oldButtons);

		$('#gpr-collapse-all').click(collapseAll);
		$('#gpr-expand-all').click(expandAll);
	}

	function addPullRequestGlobalHeaderButtons() {
		var oldButtons = $('#files');

		var whitespaceButton = '';
		if (window.location.search.indexOf('w=1') < 0) {
			whitespaceButton = '<a id="gpr-hide-whitespace" class="btn btn-sm">Hide Whitespace Changes</a>';
		}

		var newButtons =
			'<div class="btn-group gpr-global-button-group">' +
			whitespaceButton +
			'<a id="gpr-hide-all-comments" class="btn btn-sm">Hide All Comments</a>' +
			'<a id="gpr-show-all-comments" class="btn btn-sm">Show All Comments</a>' +
			'<a id="gpr-collapse-all" class="btn btn-sm">Collapse All</a>' +
			'<a id="gpr-expand-all" class="btn btn-sm">Expand All</a>' +
			'</div>';

		$(newButtons).insertBefore(oldButtons);

		$('#gpr-hide-whitespace').click(hideWhitespaceChanges);
		$('#gpr-hide-all-comments').click(hideAllComments);
		$('#gpr-show-all-comments').click(showAllComments);
		$('#gpr-collapse-all').click(collapseAll);
		$('#gpr-expand-all').click(expandAll);
	}

	function setupDiffView(diffView) {
		$(diffView).find('.file').each(function(index, element) {
			addFileFooterButton(element);
		});
	}

	function setup() {
		$('.diff-view').each(function(index, element) {
			var $element = $(element);
			if ($element.data('gpr-initialized')) {
				return;
			}

			setupDiffView(element);

			$element.attr('data-gpr-initialized', true);
		});

		if (!hasGlobalHeaderButtons()) {
			addGlobalHeaderButtons();
		}
	}

	runIfValidDomain('githubDomains', function() {
		$(function() {
			// All the timeouts!
			var setupTimer = null;
			var debouncedSetup = function() {
				if (setupTimer) {
					clearTimeout(setupTimer);
				}

				setupTimer = setTimeout(function() {
					setupTimer = null;
					setup();
				}, 500);
			};

			setTimeout(function() {
				debouncedSetup();

				setTimeout(function() {
					$(document).livequery('*', debouncedSetup);
				}, 1000);
			}, 500);
		});
	});
})();