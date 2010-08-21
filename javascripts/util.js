/* make sure we have console */
/*
;if( typeof(console) == 'undefined' ) 
  console = { log: function(){} };
  */
/* placeholder */
// var pH = function() { 
//   if( 'placeholder' in (document.createElement('input') ) )
//     return;
// 
//   $$('input[placeholder]').each(function(i) { 
//     var t = i.readAttribute('placeholder');
//     var f = function() { 
//       i.value.strip() == t ? i.value = '' : '';
//     };
//     i.on('focus', f);
//     
//     var b = function() { 
//       i.value.strip() == '' ? i.value = t : '';
//     };
//     i.on('blur', b);
//     b();
//   });
// };




/* Util stuff */

/* return a truncated sha  */
var s = function(h) { return h.substr(0,6); };

/* truncate text to a minimum length, similar to the way Finder does it  */
var t = function(s,l) { 
  var sl = s.length,
      d  = '...',  // delimiter
      dl = d.length,
      r  = (l - dl) / 2; // radius
  return  s.length < l ? s : s.substr(0, r) + d + s.substr( sl - r, sl);
  }

/* parse URL Params as a hash with key are lowered case.  (Doesn't handle duplicated key). */
var uP = function() { 
  var ps = [], pair, pairs,
      url = window.location.href.split('?');

  if( url.length == 1 ) return ps;

  url = url[1].split('#')[0];
  
  pairs = url.split('&');
  for( var i = 0; i < pairs.length; i++ ) {
    pair = pairs[i].split('=');
    ps[ pair[0].toLowerCase() ] = pair[1];
  }
  return ps;
};
