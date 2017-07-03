function runIfValidDomain(domains, callback) {
	chrome.storage.sync.get({
		githubDomains: 'github.com',
		gitlabDomains: 'gitlab.com',
		bitbucketDomains: 'bitbucket.org'
	}, function(data) {
		const run = data[domains].split('\n').reduce(function(run, domain) {
			if (domain && window.location.href.indexOf(domain.trim()) >= 0) {
				return true;
			} else {
				return run;
			}
		}, false);

		if (run) {
			callback();
		}
	});
}