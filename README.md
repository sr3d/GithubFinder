# Github Finder
GithubFinder is a fast Github repository browser.  The browser is inspired after Mac OSX Finder.  
[<img src="http://cl.ly/71ed9c832a74fa7ebb56/content" alt="Github File Finder" />](http://cl.ly/71ed9c832a74fa7ebb56)

To see the finder in action, go to  http://sr3d.github.com/GithubFinder 


## Features

- Can quickly switch between repos and branches.
- Keyboard navigation support with arrow keys.
- Text files can be preview
- Files can be diff-ed directly between revisions.
- 100% JS with full cross-domain support.  


# 10K App

## Contest Entry
This is a contest entry into the 10K Apart contest developing a meaningful app for the 10K Apart contest (http://10k.aneventapart.com/).


## Build

Since the app needs to be under 10,240 bytes, it needs special optimization to achieve this size.  The unminifed, uncompressed JS is about 30+ KB, all compressed down to 8.5KB or so.  

To build the app, run the provided ./build script to automatically bundle up everything into the ./app folder

## App Bootstrap

The minified app is working as follow:

- bootstrap.js loads code from png and eval
- javascripts/app.js file is executed (this file is appended at the end of the files list)



# Architect 

Code are somewhat modularized with a main class (F) that can be extended through various plugins.


# Credits

Github Finder is possible by leveraging these tools:

- string2png is inspired by NIHILOGIC.  http://blog.nihilogic.dk/2008/05/compression-using-canvas-and-png.html
- The javascript implementation of difflib by Snowtide.com.  http://snowtide.com/jsdifflib
- Dandean JSONP implementation for Prototype.  Code is patched to support onSuccess() event, and to also hook into Ajax.Responders live-cycle (useful for indicator).  http://github.com/dandean/Ajax.JSONRequest
- Github API.

# About

- My name is Alex Le.  I'm an entrepreneur and I build web applications.  I'm a single founder bootstrapping Marrily (http://marrily.com), an online wedding planner.  Come check it out!  My blog is at http://alexle.net.
