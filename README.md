# github-diff-collapse

## What is it?

It's a simple Chrome extension that adds a few niceties to GitHub's diff views.
The main idea is that it allows you to collapse the diff for a file to make
the page easier to navigate.

## Features

The feature set is pretty small now (although useful). Note that these features should apply
to any GitHub diff view (PRs, commit pages, branch comparisons, etc). If they don't, file an issue.

- Collapse/expand a single diff by using the button in the diff header
- Collapse a diff by using the button at the end of the file (this will collapse the diff
and position the page at the start of the next diff)
- Collapse/expand all diffs by using the buttons near the top of the page
- Expand a diff when the filename is clicked in teh table of contents (where it says `X changed files`)

## Bugs & Feature Requests

Just file an issue for any bugs for feature requests. If you want it, file an issue.
We'll weed them out as necessary.

## Installation

One day we'll have this on the the Chrome web store, but for now you can find the latest build
in the repository (`github-diff-collapse.crx`). Just download it and open it - Chrome will take care of the rest.