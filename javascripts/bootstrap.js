var f,proxy,d=document;
/* xtract textual content from an image*/
var x = function(z, m ) {  // image, callback
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
      else
        console.log('b[i] == 0 at ' + i);
    }
    m(s);
  }
  o.src = z;
}

d.on('dom:loaded', function() { 
  /* execute */
  x('c.png', function(s){
    $('log').value = s;
    
    /* both CSS and JS are bundled up into 1 file*/
    s = s.split('~10K~');
    

    /* init CSS */
    var c = d.createElement('style');
    c.innerHTML = s[1]; //.replace('$', 'background-color:');
    d.body.appendChild(c);    

    // console.log(s[1]);
    /* run the JS */
    eval(s[0]);    
  });
})
