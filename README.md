# Github Finder
GithubFinder is a fast Github repository browser.  The browser is inspired after Mac OSX Finder.  
[<img src="http://cl.ly/71ed9c832a74fa7ebb56/content" alt="Github File Finder" />](http://cl.ly/71ed9c832a74fa7ebb56)

To see the finder in action, go to  <http://sr3d.github.com/GithubFinder>


## Features

- Support Greasemonkey/Greaskit script:  <http://github.com/sr3d/raw/master/javascripts/userscript.js>.  After installing this script, a new button will appear on your Github repo page to let you quickly open the currently view repository in Github Finder.
[<img src="http://cl.ly/5452119dcf43ad5bfc31/content" alt="Github File Greasemonkey Button" />](http://github.com/sr3d/raw/master/javascripts/userscript.js).  
- Bookmarklet:  If you don't have GreaseMonkey/Greasekit installed, you can drag the bookmarklet to your address bar.  The bookmarklet will open a new GHFinder window of the currently viewed repository.
- Switch between repos and branches with ease.
- Keyboard navigation support with arrow keys.
- Text files can be previewed inline with syntax highlighting (support Ruby, JavaScript, CSS, and HTML) with Textmate-like Twilight theme.
- Files can be diff-ed directly between commits (diff is done by difflib).
- 100% javascript with full cross-domain support.  For functionalities that Github API, the app relies on a proxy running on Heroku (<http://ghfinder-proxy.heroku.com>) to get the data.
- flexible framework to customize and extend the existing functionalities.
- GitHub JS API wrapper (/javascripts/gh.js).


# 10K App

Github Finder is built as a contest entry into the 10K Apart contest (http://10k.aneventapart.com/)..  I wanted to develop a real useful app instead of a mindless canvas drawing (which is cool, but not that useful), and I always wanted to browse Github repositories easier and faster.

## Build

Since the app needs to be under 10,240 bytes, it needs special optimization to achieve this size.  The unminifed, uncompressed JS is about 30+ KB, all compressed down to 8.5KB or so.  

To build the app, run the provided ./build script to automatically bundle up everything into the ./app folder

For an IE9 build, run ./ie9build

## App Bootstrap

The minified app is working as follow:

- bootstrap.js loads code from png and eval
- javascripts/app.js file is executed (this file is appended at the end of the files list)


# Architecture

The code is somewhat modularized with a main class (F, defined in /javascripts/f.js) for the Finder itself.  This class can be extended to add more functionalities through various plugins.  Currently the plugins are 

- Diff:  allowing user to diff 2 different files from Github.
- Code Highlighter:  currently supports Ruby, JavaScript, CSS, and HTML.
- Keyboard navigation:  user can use the arrow keys to navigate.
- ResizablePanel: enable the panels to be resizeable.
- GithubReadme: automatically grab the Readme files from github.  Currently supported Markdown (.md, .markdown), Textile (.textile) readme files (Github only renders these files automatically)
- Bookmarklet:  lets user create a bookmark to quickly access GithubFinder
- Greasemonk/Greasekit userscript:  extend Github's interface with a button linking to Github Finder to allow quick access. 

Combined with the build script, this architecture is flexible enough to enable or disable certain components to achieve the right size/features.

The Application also relies on JSONP to grab the data from Github.  The provided proxy.php script can handle both normal Ajax Requests and JSONP requests.  However, the proxy now is done by a small Sinatra app running on Heroku at <http://ghfinder-proxy.heroku.com>.  The source for this app is at <http://github.com/sr3d/http://github.com/sr3d/GHFinder-Proxy>


# Credits

Github Finder is possible by leveraging these tools:

- string2png is inspired by NIHILOGIC.  <http://blog.nihilogic.dk/2008/05/compression-using-canvas-and-png.html>
- The javascript implementation of difflib by Snowtide.com.  <http://snowtide.com/jsdifflib>
- Dandean JSONP implementation for Prototype.  Code is patched to support onSuccess() event, and to also hook into Ajax.Responders live-cycle (useful for indicator).  <http://github.com/dandean/Ajax.JSONRequest>
- Github API.


# About

- My name is Alex Le.  I'm an entrepreneur and I build web applications.  I'm a single founder bootstrapping Marrily (<http://marrily.com>), an online wedding planner.  Come check it out!  My blog is at <http://alexle.net>
