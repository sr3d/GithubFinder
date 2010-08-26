/* Add a button to the github repo listing page */
(function($) { 
  var ghf   = 'http://sr3d.github.com/GithubFinder?utm_source=userscript'
      li    = $('ul.actions li:first')[0],
      html  = '<li><a href="' + ghf +'" target=_blank class="minibutton"><span>Browse in GHFinder</span></a></li>';
  if(li) {
    $(li).before(html);
  }

  
  /* for userlisting page */
  var repoInfo;
  $('.profilecols .repositories h3 a').each(function(index,a) {
    repoInfo = $(a).attr('href').split('/');
    html = '<a href="' + ghf + '&utm_media=profile_column' + 
            '&user_id=' + repoInfo[1] +
            '&repo=' + repoInfo[2] + 
            '" target=_blank> ' + 
              '<img src="http://github.com/sr3d/GithubFinder/raw/master/img/folder_explore.png"/>'
            '</a>';
    $(a).after(html);
  });
  
})(jQuery);