/* Add a button to the github repo listing page */
(function($) { 
  var li    = $('ul.actions li:first')[0],
      html  = '<li><a href="http://sr3d.github.com/GithubFinder?utm_source=userscript" target=_blank class="minibutton"><span>Browse in GHFinder</span></a></li>';
  if(!li) return;
  $(li).before(html);  
})(jQuery);