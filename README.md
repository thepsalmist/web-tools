Media Cloud Web Tools
=====================

This is a shared repository for all the front-facing [Media Cloud](https://mediacloud.org) web tools.
This includes:
 * [Explorer](https://explorer.mediacloud.org)
 * [Source Manager](https://sources.mediacloud.org)
 * [Topic Mapper](https://topics.mediacloud.org)
 
Check out the `doc` folder for more documentation.

Dev Installation
----------------

Git:
 * `git submodule update --init --recursive`

Python 2.7:
 * python 2.7 https://www.python.org/download/releases/2.7/
 * `pip install virtualenv` (if necessary) [also install/link pip if you don't have it (if on Mac OS, use sudo easy_install pip)]
 * [`virtualenv venv`](https://virtualenv.pypa.io/en/stable/)
 * activate your virtualenv (OSX: `source venv/bin/activate`, Windows: `call venv\Scripts\activate`) to activate your virtual environment (and not run any global python installations)
 * On Windows, make sure to create an environment variable: `set NODE_ENV=dev`
 * Install the requirements `pip install -r requirements.txt`

Node and npm:  
 * make sure your node installation is up-to-date (we work with v8.2.1 right now)
 * `npm install` to install all the package dependencies (as specified in the `package.json`)
 * install watchman for the testing (`brew install --HEAD watchman`)

MongoDB:
[Install MongoDb](https://docs.mongodb.com/manual/installation/).  We develop on OS X and install via the [HomeBrew package manager](http://brew.sh): `brew install mongodb`

Redis:
[Install Redis](http://redis.io/)  We develop on OS X and install via the [HomeBrew package manager](http://brew.sh): `brew install redis`

MemCache:
On OSX, make sure to run `brew install libmemcached` otherwise you'll get an error about pylibmc failing to install (http://brew.sh)
 

Configuration
------------- 

Copy `config/server.config.template` to `config/server.config` and fill in the required info there.

Developing
----------

You will make your life easier by installing these tools to help you develop better:
 * [Redux DevTools Chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
 * [React Developer Tools Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi).
 * Set up your environment with [SublimeText](https://www.sublimetext.com) and linting following [these instructions](https://medium.com/planet-arkency/catch-mistakes-before-you-run-you-javascript-code-6e524c36f0c8#.1mela5864).
 * Essentially, you need to tell Sublime to install the Sublime package control manager and then you need to install the necessary packages using Sublime's command line. That's all there in the link, just make sure you follow the prompts explicity.
 * To browse your local DB on a Mac use [MongoHub](https://github.com/bububa/MongoHub-Mac), or [MongoExpress for a web-based UI](https://github.com/mongo-express/mongo-express)

Running
-------

You need to open two terminal windows and run one thing in each (so the hot-reloading can work):
 * `npm run topics-dev` or `npm run sources-dev`
 * `python run.py`
    - if you get flask errors, run the `pip install -r requirements.txt` line again. On Mac Osx, you may need to run with --ignore-installed

Releasing
---------

1. Update the version number in the appropriate `src/[tool]Index.js` file.
2. Change the server mode in `config/server.config` to `PROD`.
3. Change the app you want to build in `config/app.config` (set the server/app variable).
4. Build the release version of the JS and CSS: `npm run topics-release` or `npm run sources-release`.
5. Test the changes to make sure they worked
6. Tag it with the appropriate release label (ie. "sources-v2.7.3" or "topics-v2.4.3")
7. SSH to civicdev and pull the latest from that branch (ie `git checkout v2.7.x; git pull`) into the approriate app dir (`/var/www/MediaCloud-SourceManager`)
8. restart apache to test it: `sudo service apache2 restart`
9. test it on the dev server: http://sources.dev.mediacloud.org
10. if it all looks good, do the same on the civicprod server, except, checkout the exact tag: `git fetch; git checkout sources-v2.7.3`)
11. check the prod server and make sure it worked

Updating npm Depedencies
------------------------ 

It is important to occasionally we upgrade to the latest version of the npm libraries we use.
This is something to do every month or so, to make sure we don't fall behind the rapid development 
in this libraries.  

To do this:
1. First make sure you have npm-check-updates installed: `npm install -g npm-check-updates`.
2. Run `npm-check-updates -u` to update the dependencies in our `package.json`,.
3. Do a regular `npm install` to test them all out.
4. Run the code and fix any errors.
5. Check in the updated `package.json`.
