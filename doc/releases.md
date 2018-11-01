Releasing
=========

We release our web-apps in containers on a server running the [Dokku PaaS](http://dokku.viewdocs.io/dokku/).

One-Time Setup
--------------

To be able to release, you first need to setup your keys so that you can push to the Dokku server.  Once that is setup for you, then you need to add git remotes for each app that you want to release.  On your machine, that looks something like this:

```
git remote add prod-tools user@my.server.edu:mc-tools
git remote add prod-topics user@my.server.edu:mc-topics
git remote add prod-sources user@my.server.edu:mc-sources
git remote add prod-explorer user@my.server.edu:mc-explorer
```

Building and Purshing a Release
-------------------------------

1. Test the changes locally to make sure they worked
2. Update the version number in the appropriate `src/[tool]Index.js` file.
3. Build the release version of the JS and CSS: `npm run topics-release`, or `npm run sources-release`, etc.
4. Tag it with the appropriate release label (ie. "sources-v2.7.3" or "topics-v2.4.3") - see `version-control.md` for more details
5. Push the tagged release to the appropriate production Dokku server with git: `git push prod-explorer explorer-v3.1.2:master`
