// ==UserScript==
// @name        Github Finder Greasemonkey Script
// @description Add an easy "Browse" button of current repository linking to GHFinder.
// @include     https://github.com/*
// @include     http://github.com/*
// @author      GithubFinder by Alex Le (http://sr3d.github.com/GithubFinder)
// ==/UserScript==

(function() {
  var script = document.createElement('script');
  // script.src = 'http://localhost/misc/githubfinder/javascripts/userscript.js';
  script.src = 'http://github.com/sr3d/GithubFinder/raw/master/javascripts/userscript.js';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
})();