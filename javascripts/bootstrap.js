var f,d=document;
d.on('dom:loaded', function() { 
  var x = function(z, m ) {  /// image, callback
    var o = new Image();
    o.onload=function() {
      var s = "", 
          c = d.createElement("canvas"),
          t = c.getContext("2d"),
          w = img.width,
          h = img.height

      debugger
      c.width  = c.style.width  = w;
      c.height = c.style.height = h; 
      t.drawImage(o, 0, 0);
      
      var b = t.getImageData( 0, 0, w, h ).data; //b : bucket of data
      for(var i= 0, l = b.length; i < l; i += 4){
        if( b[i] > 0 )
         s += String.fromCharCode(b[i]);
      }
      m(s);
    }
    img.src = z;
  }

  /* execute */
  x(codePng, function(s){
    console.log(s);
    eval(s); 
    f = new F();
  });
  
  x('css.png', function(s) { 
    console.log("s %o",s);
  });
})
