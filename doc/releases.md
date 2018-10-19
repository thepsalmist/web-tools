Releases
========

Our release process relies on git branches.  Some notes:
* each *major* or *minor* release gets a new branch;
* *patch* releases are done on the minor release branch;
* each release gets tagged before it is pushed to the servers.

Examples
--------

This is easier to understand with some exmaples.

Say your current release is `v2.0.0`. That should be on a `v2.0.x` branch. The topic mapper release should be tagged on there as `topics-v2.0.0`. A minor bug happens that you need to fix quickly, so you fix it on that branch and tag it `topics-v2.0.1`.

In the meantime, development on master has moved along and you're ready to prep a `v2.1.0` release.  For that you should make a new branch off of master called `v2.1.x`.  Build the files and bump version numbers in there, and then tag it as `topics-v2.1.0`, `sources-v2.1.0`, etc. and push those to the server.

Process
-------

When you're ready to make a release, first follow the intructions in `version-control.md` to set the version numbers correcty.  At the end of that process you should have a tag that you can deploy.

We manage our web apps with container on a [Dokku server](http://dokku.viewdocs.io/dokku/) (on Ubuntu). To push new releases, you first have to have a key set up on our production server (see [the dokku instructions for adding keys](http://dokku.viewdocs.io/dokku/deployment/user-management/#adding-ssh-keys)).

Once you have key set up, you need to make new origins in your local git repo for each app:
```
git remote add prod-topics dokku@prod-host.media.mit.edu:mc-topics
git remote add prod-explorer dokku@prod-host.media.mit.edu:mc-explorer
git remote add prod-sources dokku@prod-host.media.mit.edu:mc-sources
git remote add prod-tools dokku@prod-host.media.mit.edu:mc-tools
```

The idea here is that all you have to do when you're ready to release is push to the correct app and it will install and update everything for you! For instance, this will push your `v3.2.1` release tag to the production topics server.

```
git push prod-topics v3.2.1:master
```