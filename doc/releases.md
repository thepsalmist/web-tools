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
