Deploying Your Own Instance of the Media Cloud Web Apps
=======================================================

Our web tools are built to be deployed to a container based system with environment variables for system configuration. 
Right now we use [Dokku](http://dokku.viewdocs.io/dokku/) to orchestrate this, but you can use anything.

## Build Files

As you'll note from the developer instructions on building a release, we pre-compile our JS. If you are just deploying our
existing code you don't need to do this, you can just [use the latest tags](https://github.com/mitmedialab/MediaCloud-Web-Tools/tags).

## Configuration

For development, the [configuration file](https://github.com/mitmedialab/MediaCloud-Web-Tools/blob/main/config/app.config.template)
is where to put system variables. When deploying what you need to do is create one environment variable for each entry in the config file.
The names are the system (ie. you should have a `CACHE_REDIS_URL` environment variable that contains the connection string for a Redis store.

## Architecture

We have 4 front-end apps, which rely on a shared codebase (they are split up for historical reasons). You can run as many, or as few, of
these as you might wish to (but various things rely on each other). They are:
* Explorer: allows users to quickly analyze content in the database with visualizations & download options
* Source Manager: allows users with the `media-edit` role to manage collection and sources, and everyone with an account can browse the same
* Topic Mapper: allows for more in-depth analysis by ingesting more content from various platfroms
* Tools: A place-holder landing page for emails and such

See the [system diagram](https://github.com/mitmedialab/MediaCloud-Web-Tools/blob/main/doc/MC%20Front-End%20Systems%20Diagram.pdf)
to understand the different pieces of our front-end web system. This all communicates to the back-end system via the API.

## Notes

Since we built this to run on our servers, and don't have many other people running their own copies, you will need to make some tweaks to get
the system working. [Post an issue](https://github.com/mitmedialab/MediaCloud-Web-Tools/issues) here when you run into roadbloacks that we've
left out. Here are a few things to tweak:

#### API Base URL
The Media Cloud API Client library *assumes* you want to talk to `https://api.mediacloud.org`. You will need to change this because your instance will
be running at a different URL. See [#1958](https://github.com/mitmedialab/MediaCloud-Web-Tools/issues/1958) for the current workaround.

#### URL for Emails
For things like password reset emails, we include links to https://tools.mediacloud.org, because we don't necessarily know which tool the user was using 
when they requested it. See [#1959](https://github.com/mitmedialab/MediaCloud-Web-Tools/issues/1959) for the current workaround.

#### Navigation and Help Links
A whole bunch of navigation and help links refer to `https://mediacloud.org`. It will make sense to customize some of these (ie. nav links), but others
might not make sense to change.
