OpenShift Management Console
=========================
The management console for [OpenShift Origin](https://github.com/openshift/origin).

[![Build Status](https://travis-ci.org/openshift/origin-web-console.svg?branch=master)](https://travis-ci.org/openshift/origin-web-console)

Contributing
------------

#### Getting started

1. Be sure to have a development environment running for OpenShift. See [the contributing doc](https://github.com/openshift/origin/blob/master/CONTRIBUTING.adoc#develop-locally-on-your-host), we recommend the use of `oc cluster up`.
1. Install [Nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/)
1. Install [grunt-cli](http://gruntjs.com/installing-grunt) and [bower](http://bower.io/) by running `npm install -g grunt-cli bower` (may need to be run with sudo)
1. Install dev dependencies by running `hack/install-deps.sh`
1. Launch the console and start watching for asset changes by running `grunt serve`. This should open <https://localhost:9000/> in your default browser.

    Note: If you see an ENOSPC error, you may need to increase the number of files your user can watch by running this command:

    ```
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    ```
1. Accept the self-signed certificate for the web console. (For Chrome on OS X, import `server.crt` into Keychain Access or accept the web console certificate in Safari.)

#### Enable / disable console log output

Debug logging can be enabled by opening your browser's JavaScript console, running the commands below, and then refreshing the page.

```
localStorage["OpenShiftLogLevel.main"] = "<log level>";
localStorage["OpenShiftLogLevel.auth"] = "<log level>";
```

Loggers:
* `OpenShiftLogLevel.main` - default logger for OpenShift
* `OpenShiftLogLevel.auth` - auth specific logger, this includes login, logout, and oauth

The supported log levels are:
* OFF (default for all loggers except main)
* INFO
* DEBUG
* WARN
* ERROR (default for main)

Note: currently most of our logging either goes to INFO or ERROR

#### Local configuration

`app/config.js` is the default configuration file for web console
development. If you need to change the configuration, for example, to point to
a different API server, copy `app/config.js` to
`app/config.local.js` and edit the copy. `app/config.local.js` is
not tracked and will be used instead if it exists.

#### Before opening a pull request

Please configure your editor to use the
following settings to avoid common code inconsistencies and dirty
diffs:

* Use soft-tabs set to two spaces.
* Trim trailing white space on save.
* Set encoding to UTF-8.
* Add new line at end of files.

Or [configure your editor](http://editorconfig.org/#download) to
utilize [`.editorconfig`](https://github.com/openshift/origin-web-console/blob/master/.editorconfig),
which will apply these settings automatically.

Then:

1. If needed, run `grunt build` to update the files under the dist directory
2. Run the spec tests with `grunt test`
3. Run the integrations tests (your api server must be running) `grunt test-integration`
4. Rebase and squash changes to a single commit

Note: in order to run the end to end tests you must have [Chrome](http://www.google.com/chrome/) and [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/) installed.  The script below will set this up for you on linux systems.

```
# Add signing key for Chrome repo
wget https://dl.google.com/linux/linux_signing_key.pub
rpm --import linux_signing_key.pub

# Add Chrome yum repo
yum-config-manager --add-repo=http://dl.google.com/linux/chrome/rpm/stable/x86_64

# Install chrome
yum install -y google-chrome-stable

# Install chromedriver
wget https://chromedriver.storage.googleapis.com/2.16/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
mv chromedriver /usr/bin/chromedriver
chown root /usr/bin/chromedriver
chmod 755 /usr/bin/chromedriver
```

#### Production builds
1. Make sure all dev dependencies are up to date by running `hack/install-deps.sh`
2. Run `grunt build`
3. TODO - run script to build bindata.go from the dist in this repo
4. In your origin repo run `hack/build-go.sh`

The assets served by the OpenShift all-in-one server will now be up to date. By default the assets are served from [http://localhost:8091](http://localhost:8091)

#### Debugging dist diff failures
If Jenkins complains that the built dist files are different than the committed version, ensure the committed version is correct:

1. Run `hack/clean-deps.sh`
2. Run `hack/install-deps.sh`
3. Run `grunt build`
4. If anything under dist or dist.java has changed, add it to your commit and re-push

Architecture
------------

The OpenShift v3 web console is based on AngularJS and [Hawt.io](https://github.com/hawtio/hawtio-core)

#### Navigation

The v3 console supports a custom context root.  When running as part of the `openshift start` command the console's context root is injected into the `<base>` tag of the index.html file.  In order to support custom context roots, all console URLs must be relative, so they should not contain a leading "/" character.

For example if you want to specify a URL directly in an HTML template to go to the project overview it would look like

```
<a href="project/foo/overview">
```

and would actually resolve to be `/contextroot/project/foo/overview` by the browser.  Similarly, if you want to use JavaScript to change the current page location, you should use the $location service from angular like

```
$location.url("project/foo/overview")
```

Finally, if you want to reference the root of the web console use the path `./`

#### Extension points

There are two main ways to extend the v3 OpenShift console.

##### Add primary / secondary navigation tabs to the project nav

We rely on [hawtio-core-navigation](https://github.com/hawtio/hawtio-core-navigation) to build the primary/secondary nav that appears once you are in a project.  We have customized the rendering of the tabs, so refer to [app/scripts/app.js](app/scripts/app.js) to see how we register our out of the box tabs.

##### Inject additional content into the page

We include the [hawtio-extension-service](https://github.com/hawtio/hawtio-extension-service).  Currently we do not render any extension points, but if there are any locations where you would like to see customizable content, this is how we will add a hook to do that.  As hooks are added we will provide a list of them here.
