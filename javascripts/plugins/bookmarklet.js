/* Book marklet */
var BML = Class.create( PluginBase, { 
  initialize: function(f) {
    var e = $('url_w'),
        h = [
          '<span id=bml_w>Drag <a class=bml href=\'javascript:',
            '(function(){var a=(new RegExp("github.com/(.+)","i")).exec(window.location.href);var f=a?a[1].split("/"):[];var b=f[0];var d=f[1];var e=f[3];var c="http://sr3d.github.com/GithubFinder/?utm_source=bml"+(a?"&user_id="+b+"&repo="+d+(e?"&branch="+e:""):"");if(!c){alert("Invalid Github URL");return}window.open(c)})()'
            ,'\'>Open in GHFinder</a> to your bookmark bar<br/>(To open any Github repo in GHFinder)',
          '</span>'
        ];
    e.insert(h.join(''));
  }
});

FP.push(BML);
  
// Original function
// YUI Online compressor:  http://refresh-sf.com/yui/#output
//
// (function(){
//   var m         = (new RegExp("github.com\/(.+)","i")).exec(window.location.href);
//   var path      = m ? m[1].split('/') : [];
//   var user      = path[0];
//   var repo      = path[1];
//   var branch    = path[3];
//   var url       = 'http://sr3d.github.com/GithubFinder/?utm_source=bml' + (m ? '&user_id=' + user + '&repo=' + repo + (branch ? '&branch=' + branch : '' ) : '');
// 
//   if(!url) { 
//     alert('Invalid Github URL');
//     return;
//   }
// 
//   window.open(url);
// })()