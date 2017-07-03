chrome.storage.sync.get({
	githubDomains: 'github.com',
	gitlabDomains: 'gitlab.com',
	bitbucketDomains: 'bitbucket.org'
}, function(data) {
	$('#githubDomains').val(data.githubDomains);
	$('#gitlabDomains').val(data.gitlabDomains);
	$('#bitbucketDomains').val(data.bitbucketDomains);
});

$('#save').click(function() {
	chrome.storage.sync.set({
		githubDomains: $('#githubDomains').val(),
		gitlabDomains: $('#gitlabDomains').val(),
		bitbucketDomains: $('#bitbucketDomains').val()
	});
});