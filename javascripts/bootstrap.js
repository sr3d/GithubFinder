var f,proxy,d=document;

var addCss = function(s) {
  var c = d.createElement('style');
  c.type = 'text/css';
  if (c.styleSheet)
    c.styleSheet.cssText = s;
  else
    c.appendChild(d.createTextNode(s));
  d.getElementsByTagName('HEAD')[0].appendChild(c);    
}

/* xtract textual content from an image*/
var x = function(z, m, ix ) {  // image, callback, chunk index
  var o = new Image();
  o.onload = function() {
    var s = "", 
        c = d.createElement("canvas"),
        t = c.getContext("2d"),
        w = o.width,
        h = o.height;
    c.width  = c.style.width  = w;
    c.height = c.style.height = h; 
    t.drawImage(o, 0, 0);
    
    var b = t.getImageData( 0, 0, w, h ).data; //b : bucket of data
    for(var i= 0; i < b.length; i += 4) {
      if( b[i] > 0 )
        s += String.fromCharCode(b[i]);
    }
    
    m(s, ix);
  }
  o.src = z;
}

var fc = 3, flag = 0, chks = [], js;
var run = function(s,i) {
  chks[i] = s
  if( ++flag != fc ) return;

  /* Now we have the full script, let's the fun begin */
  var js = (chks[0] + chks[1] + chks[3]).split('~10K~');
  addCss(js[1]);
  try{ eval(js[0]); } catch(ex) { alert(ex); }
}

document.observe('dom:loaded',function() { 
  /* IE9 has a bug with getImageData to read all the pixel data.  
    So the JS was splitted into smaler images instead. */
  for(var i = 0; i < fc; i++ ) {
    x('js/c' + i + '.png', run, i);
  }
});
