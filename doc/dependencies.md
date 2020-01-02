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
2. Run `ncu` to see a report of modules with newer versions available.
3. Run `ncu -u` to automatically update the dependencies in our `package.json`, or do it by hand based on the previous step's report.
4. Do a regular `npm install` to test them all out.
5. Run the code and fix any errors.
6. Check in the updated `package.json`.
