(function() {
	runIfValidDomain('gitlabDomains', function() {
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

	function setup() {
		if ($('.gpr-global-button-group').length === 0) {
			addHeaderButtons();
		}

		addFooterButtons();
	}

	function addHeaderButtons() {
		var newButtons =
			'<div class="btn-group gpr-global-button-group">' +
			'<a id="gpr-hide-all-comments" class="btn btn-default">Hide All Comments</a>' +
			'<a id="gpr-show-all-comments" class="btn btn-default">Show All Comments</a>' +
			'<a id="gpr-collapse-all" class="btn btn-default">Collapse All</a>' +
			'<a id="gpr-expand-all" class="btn btn-default">Expand All</a>' +
			'</div>';

		$(newButtons).insertAfter($('.files-changed').first());

		$('#gpr-hide-all-comments').click(hideAllComments);
		$('#gpr-show-all-comments').click(showAllComments);
		$('#gpr-collapse-all').click(collapseAll);
		$('#gpr-expand-all').click(expandAll);
	}

	function hideAllComments() {
		$('.js-toggle-diff-comments.active').toArray().forEach(function(element) {
			element.click();
		});
	}

	function showAllComments() {
		$('.js-toggle-diff-comments:not(.active)').toArray().forEach(function(element) {
			element.click();
		});
	}

	function collapseAll() {
		$('.diff-toggle-caret.fa-caret-down').toArray().forEach(function(element) {
			element.click();
		});
	}

	function expandAll() {
		$('.diff-toggle-caret.fa-caret-right').toArray().forEach(function(element) {
			element.click();
		});
	}

	function addFooterButtons() {
		$('.diff-file').toArray().forEach(function(diff) {
			addFooterButton($(diff));
		});
	}

	function addFooterButton($diff) {
		if ($diff.find('.gpr-footer-collapse-row').length > 0) {
			return;
		}

		var html =
			'<tr class="gpr-footer-collapse-row">' +
			'<td colspan="3">' +
			'<button>Collapse</button>' +
			'</td>' +
			'</tr>';

		var dom = $(html).insertAfter($diff.find('table.code tr:last-of-type'));

		dom.find('button').click(function() {
			$diff.find('.diff-toggle-caret.fa-caret-down')[0].click();
		});
	}
})();