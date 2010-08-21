# Github Finder
GithubFinder is a fast Github repository browser.  The browser is inspired after Mac OSX Finder.  
[<img src="http://cl.ly/71ed9c832a74fa7ebb56/content" alt="Github File Finder" />](http://cl.ly/71ed9c832a74fa7ebb56)

To see the finder in action, go to  <http://sr3d.github.com/GithubFinder>


## Features

- Switch between repos and branches with ease.
- Keyboard navigation support with arrow keys.
- Text files can be previewed inline with syntax highlighting (support Ruby, JavaScript, CSS, and HTML) with Textmate-like Twilight theme.
- Files can be diff-ed directly between commits.
- 100% JS with full cross-domain support.  The provided proxy.php can proxy any requests to Github and return either JSONP callback, or raw contents.
- flexible framework to customize and extend the existing functionalities
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
- CH (Code Highlighter):  currently supports Ruby, JavaScript, CSS, and HTML.
- Keyboard navigation:  user can use the a,s,d,f to navigate.
- ResizablePanel, which enable the panels to be resizeable.

Combined with the build script, this architecture is flexible enough to enable or disable certain components to achieve the right size/features.

The Application also relies on JSONP to grab the data from Github.  The provided proxy.php script can handle both normal Ajax Requests and JSONP requests.  Currently this script is hosted on my own shared hosting account at 1and1, and limited to just process requests for Github.com domain.


# Credits

Github Finder is possible by leveraging these tools:

- string2png is inspired by NIHILOGIC.  <http://blog.nihilogic.dk/2008/05/compression-using-canvas-and-png.html>
- The javascript implementation of difflib by Snowtide.com.  <http://snowtide.com/jsdifflib>
- Dandean JSONP implementation for Prototype.  Code is patched to support onSuccess() event, and to also hook into Ajax.Responders live-cycle (useful for indicator).  <http://github.com/dandean/Ajax.JSONRequest>
- Github API.


# About

- My name is Alex Le.  I'm an entrepreneur and I build web applications.  I'm a single founder bootstrapping Marrily (<http://marrily.com>), an online wedding planner.  Come check it out!  My blog is at <http://alexle.net>
