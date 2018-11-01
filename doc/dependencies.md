Dependencies
============

We rely on other people's Python packages (via `requirements.txt`) and Node modules (via `packages.json`).

Updating Python Depedencies
---------------------------

These don't change that often, so we don't automatically upgrade.  Good to check every few months.

Updating npm Depedencies
------------------------ 

It is important to occasionally we upgrade to the latest version of the npm libraries we use. This is something to do every month or so, to make sure we don't fall behind the rapid development  in this libraries.  

To do this:
1. First make sure you have npm-check-updates installed: `npm install -g npm-check-updates`.
2. Run `npm-check-updates -u` to update the dependencies in our `package.json`,.
3. Do a regular `npm install` to test them all out.
4. Run the code and fix any errors.
5. Check in the updated `package.json`.
